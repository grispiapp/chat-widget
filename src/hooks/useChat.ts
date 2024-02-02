import { WsMessage } from "@/types/backend";
import { useChatBox, type ChatBoxContextType } from "@context/chat-box-context";
import { useConversation } from "@context/conversation-context";
import { useNotification } from "@context/notification-context";
import { internalEventTypeMap } from "@lib/config";
import { getChatIdFromStorage } from "@lib/storage";
import { debug } from "@lib/utils";
import { subscribeChat } from "@lib/websocket";
import { useCallback, useEffect } from "preact/hooks";
import { chatHistory, chatPreferences, createChat, resumeChat } from "../api/chat";
import { t } from "../lang";

export const useChat = () => {
    const { setStatus: setChatBoxStatus, user, setChat, setUser, updateOptions } = useChatBox();
    const { addMessage, setState: setConversationState } = useConversation();
    const { notify } = useNotification();

    useEffect(() => {
        const handleMessageReceived = (e: CustomEvent<WsMessage>) => {
            debug("Incoming message", { message: e.detail });

            const message = {
                id: e.detail.id,
                text: e.detail.text,
            };

            addMessage({
                ...message,
                sender: e.detail.senderId === user.id ? "user" : "ai",
                shouldSendToApi: false,
            });
        };

        if (!window.GrispiChat.listeners.INCOMING_MESSAGE) {
            window.addEventListener(internalEventTypeMap.INCOMING_MESSAGE, handleMessageReceived);
            window.GrispiChat.listeners.INCOMING_MESSAGE = true;
        }

        return () => {
            window.removeEventListener(
                internalEventTypeMap.INCOMING_MESSAGE,
                handleMessageReceived
            );

            window.GrispiChat.listeners.INCOMING_MESSAGE = false;
        };
    }, []);

    const mergeLocalPreferencesWithGrispi = useCallback(async () => {
        try {
            const preferences = await chatPreferences();
            updateOptions(preferences);
        } catch (err) {
            console.error("Failed to fetch chat preferences from Grispi.");
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

                history.forEach((message) => {
                    addMessage({
                        ...message,
                        sender: message.senderId === user.id ? "user" : "ai",
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
        [addMessage, notify]
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
