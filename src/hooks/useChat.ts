import { type WsMessage } from "@/types/backend";
import { useChatBox, type ChatBoxContextType } from "@context/chat-box-context";
import { useConversation } from "@context/conversation-context";
import { useNotification } from "@context/notification-context";
import { internalEventTypeMap } from "@lib/config";
import { getChatIdFromStorage } from "@lib/storage";
import { blank, debug } from "@lib/utils";
import { CURRENT_USER_TEMP_MESSAGE_ID, subscribeChat } from "@lib/websocket";
import { useCallback, useEffect } from "preact/hooks";
import { chatHistory, chatPreferences, createChat, resumeChat } from "../api/chat";
import { useTranslation } from "./useTranslation";

export const useChat = () => {
    const { t } = useTranslation();
    const { user, setStatus: setChatBoxStatus, setChat, setUser, updateOptions } = useChatBox();
    const { addMessage, updateMessage, setState: setConversationState } = useConversation();
    const { notify } = useNotification();

    // Handle incoming messages
    useEffect(() => {
        if (blank(user) || user.id.toString() === CURRENT_USER_TEMP_MESSAGE_ID) {
            return;
        }

        const handleIncomingMessage = (e: CustomEvent<WsMessage>) => {
            debug("Incoming message", { message: e.detail });

            const message = {
                id: e.detail.id,
                text: e.detail.text,
            };

            if (e.detail.senderId === user.id) {
                return;
            }

            addMessage({
                ...message,
                sender: e.detail.senderId === user.id ? "user" : "ai",
                shouldSendToApi: false,
            });
        };

        if (!window.GrispiChat.listeners.INCOMING_MESSAGE) {
            window.addEventListener(internalEventTypeMap.INCOMING_MESSAGE, handleIncomingMessage);
            window.GrispiChat.listeners.INCOMING_MESSAGE = true;
        }

        return () => {
            window.removeEventListener(
                internalEventTypeMap.INCOMING_MESSAGE,
                handleIncomingMessage
            );

            window.GrispiChat.listeners.INCOMING_MESSAGE = false;
        };
    }, [user, addMessage]);

    // Handle received messages
    useEffect(() => {
        if (blank(user) || user.id.toString() === CURRENT_USER_TEMP_MESSAGE_ID) {
            return;
        }

        const handleReceivedMessage = (e: CustomEvent<string>) => {
            debug("Replacing existing message id with", e.detail);

            updateMessage(CURRENT_USER_TEMP_MESSAGE_ID, {
                id: e.detail,
                status: "sent",
            });
        };

        if (!window.GrispiChat.listeners.MESSAGE_RECEIVED) {
            window.addEventListener(internalEventTypeMap.MESSAGE_RECEIVED, handleReceivedMessage);
            window.GrispiChat.listeners.MESSAGE_RECEIVED = true;
        }

        return () => {
            window.removeEventListener(
                internalEventTypeMap.MESSAGE_RECEIVED,
                handleReceivedMessage
            );

            window.GrispiChat.listeners.MESSAGE_RECEIVED = false;
        };
    }, [user, updateMessage]);

    // Handle seen messages
    useEffect(() => {
        if (blank(user) || user.id.toString() === CURRENT_USER_TEMP_MESSAGE_ID) {
            return;
        }

        const handleMessageSeen = (e: CustomEvent) => {
            debug("Update message status to seen", { message: e.detail });

            updateMessage(e.detail, {
                status: "seen",
            });
        };

        if (!window.GrispiChat.listeners.MESSAGE_SEEN) {
            window.addEventListener(internalEventTypeMap.MESSAGE_SEEN, handleMessageSeen);
            window.GrispiChat.listeners.MESSAGE_SEEN = true;
        }

        return () => {
            window.removeEventListener(internalEventTypeMap.MESSAGE_SEEN, handleMessageSeen);

            window.GrispiChat.listeners.MESSAGE_SEEN = false;
        };
    }, [user, updateMessage]);

    const mergeLocalPreferencesWithGrispi = useCallback(async () => {
        try {
            const preferences = await chatPreferences();
            updateOptions(preferences);
        } catch (err) {
            console.error("Failed to fetch chat preferences from Grispi.");

            throw err;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadChatHistory = useCallback(
        async (chat: ChatBoxContextType["chat"], user: ChatBoxContextType["user"]) => {
            debug("Fetching chat history...", { chat });

            try {
                const history = await chatHistory(chat.chatId);
                debug("Chat history", { history });

                if (!Array.isArray(history)) {
                    throw new Error("Chat history is not an array.");
                }

                history
                    .sort((a, b) => (a.sentAt >= b.sentAt ? 1 : -1))
                    .forEach((message) => {
                        addMessage({
                            ...message,
                            id: message.msgGrispiId,
                            sender: message.senderId === user.id ? "user" : "ai",
                            status: message.seenAt ? "seen" : "sent",
                            shouldSendToApi: false,
                        });
                    });
            } catch (err) {
                notify({
                    title: t("errors.common.title"),
                    text: t("errors.common.text"),
                    type: "error",
                });

                console.error("Error when fetching chat history...", err);
            }
        },
        [addMessage, notify, t]
    );

    const subscribe = useCallback(
        async (
            mode: "create" | "resume",
            options?: {
                chatId: ChatBoxContextType["chat"]["chatId"];
            }
        ) => {
            const modes = {
                create: {
                    fn: () => createChat(user),
                    type: internalEventTypeMap.NEW_CHAT_CREATED,
                },
                resume: {
                    fn: () => resumeChat(options?.chatId),
                    type: internalEventTypeMap.RESUME_CHAT,
                },
            };

            const response = await modes[mode].fn();
            window.dispatchEvent(new CustomEvent(modes[mode].type, { detail: response }));
            await subscribeChat(response);

            const newChatState: ChatBoxContextType["chat"] = {
                ...response,
                subscribed: true,
            };

            const newUserState = {
                id: Number(newChatState.userId),
                fullName: newChatState.name,
                email: newChatState.email,
            };

            debug("setChat", newChatState);
            setChat(newChatState);
            setUser(newUserState);
            setConversationState("idle");

            if (mode === "resume") {
                await loadChatHistory(newChatState, newUserState);
            }

            return {
                chat: newChatState,
                user: newUserState,
            };
        },
        [user, setChat, setUser, setConversationState, loadChatHistory]
    );

    const subscribeToNewChat = useCallback(async () => {
        return await subscribe("create");
    }, [subscribe]);

    const subscribeToExistingChat = useCallback(
        async (chatId: ChatBoxContextType["chat"]["chatId"]) => {
            return await subscribe("resume", { chatId });
        },
        [subscribe]
    );

    const subscribeToExistingChatFromStorage = useCallback(async () => {
        const chatId = getChatIdFromStorage();

        if (!chatId) {
            setChatBoxStatus("idle");
            return;
        }

        try {
            await subscribeToExistingChat(chatId);
            setChatBoxStatus("idle");
        } catch (err) {
            console.error("Error when subscribing to existing chat...");
            // TODO: We may want to create new chat session.
        }
    }, [subscribeToExistingChat, setChatBoxStatus]);

    return {
        subscribeToNewChat,
        subscribeToExistingChat,
        loadChatHistory,
        mergeLocalPreferencesWithGrispi,
        subscribeToExistingChatFromStorage,
    };
};
