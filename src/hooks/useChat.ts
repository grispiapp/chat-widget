import type { SubscribeableChatResponseForEndUser, WsMessage } from "@/types/backend";
import { useChatBox, type ChatBoxContextType } from "@context/chat-box-context";
import { useConversation } from "@context/conversation-context";
import { useNotification } from "@context/notification-context";
import { internalEventTypeMap } from "@lib/config";
import { getChatIdFromStorage, getStoredValue } from "@lib/storage";
import { blank, debug, detectConversationState } from "@lib/utils";
import { CURRENT_USER_TEMP_MESSAGE_ID, sendMessage, subscribeChat } from "@lib/websocket";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { chatHistory, chatPreferences, createChat, resumeChat } from "../api/chat";
import { useTranslation } from "./useTranslation";

interface SubscribeOptions {
    loadChatHistory: boolean;
}

export const useChat = () => {
    const notificationAudioRef = useRef<HTMLAudioElement>(null);
    const { t } = useTranslation();
    const { user, setStatus: setChatBoxStatus, setChat, setUser, updateOptions } = useChatBox();
    const {
        messages,
        addMessage,
        updateMessage,
        deleteMessage,
        setState: setConversationState,
    } = useConversation();
    const { notify } = useNotification();

    // Handle incoming messages
    useEffect(() => {
        if (blank(user) || user.id.toString() === CURRENT_USER_TEMP_MESSAGE_ID) {
            return;
        }

        const handleIncomingMessage = (e: CustomEvent<WsMessage>) => {
            debug("Incoming message", { message: e.detail });

            if (e.detail.senderId === user.id) {
                debug("Replacing existing message id with", e.detail.id);

                updateMessage(CURRENT_USER_TEMP_MESSAGE_ID, {
                    id: e.detail.id,
                    status: "sent",
                    shouldSendToApi: false,
                    createdAt: e.detail.sentAt,
                });

                return;
            }

            if (document.hidden) {
                notificationAudioRef.current.pause();
                notificationAudioRef.current.currentTime = 0; // to start over again
                notificationAudioRef.current.play();
            }

            addMessage({
                id: e.detail.id,
                text: e.detail.text,
                sender: e.detail.senderId === user.id ? "user" : "ai",
                shouldSendToApi: false,
                createdAt: e.detail.sentAt,
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
    }, [user]);

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

    // Handle invalid messages
    useEffect(() => {
        if (blank(user) || user.id.toString() === CURRENT_USER_TEMP_MESSAGE_ID) {
            return;
        }

        const handleInvalidMessage = (e: CustomEvent<string>) => {
            debug("Delete invalid message from client", e.detail);

            notify({
                text: t("fileUpload.validation.invalid"),
                type: "error",
            });

            deleteMessage(e.detail);
        };

        if (!window.GrispiChat.listeners.MESSAGE_INVALID) {
            window.addEventListener(internalEventTypeMap.MESSAGE_INVALID, handleInvalidMessage);
            window.GrispiChat.listeners.MESSAGE_INVALID = true;
        }

        return () => {
            window.removeEventListener(internalEventTypeMap.MESSAGE_INVALID, handleInvalidMessage);
            window.GrispiChat.listeners.MESSAGE_INVALID = false;
        };
    }, [user, deleteMessage]);

    // Send the first awaited user message
    useEffect(() => {
        const sendAwaitingMessages = async (
            e: CustomEvent<{ chat: SubscribeableChatResponseForEndUser }>
        ) => {
            const isChatEnded = getStoredValue("IS_CHAT_ENDED") === "1";

            if (isChatEnded) {
                return;
            }

            setConversationState("idle");

            const awaitingMessages = messages.filter(
                (message) =>
                    message.sender === "user" &&
                    message.shouldSendToApi === true &&
                    message.status === "sending"
            );

            debug("Try to send awaiting messages...", { awaitingMessages });

            awaitingMessages.forEach((message) => {
                if (blank(message) || !("text" in message)) return;

                const wsMessage = {
                    id: message.id,
                    sender: user.fullName,
                    sentAt: Date.now(),
                    text: message.text,
                } as WsMessage;

                debug("Sending awaiting message...", { wsMessage });
                sendMessage(wsMessage, e.detail.chat);
            });
        };

        if (!window.GrispiChat.listeners.SUBSCRIBED_TO_CHAT) {
            window.addEventListener(internalEventTypeMap.SUBSCRIBED_TO_CHAT, sendAwaitingMessages);
            window.GrispiChat.listeners.SUBSCRIBED_TO_CHAT = true;
        }

        return () => {
            window.removeEventListener(
                internalEventTypeMap.SUBSCRIBED_TO_CHAT,
                sendAwaitingMessages
            );

            window.GrispiChat.listeners.SUBSCRIBED_TO_CHAT = false;
        };
    }, [messages, user, setConversationState]);

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

                const formattedMessages = history
                    .sort((a, b) => (a.sentAt >= b.sentAt ? 1 : -1))
                    .map((message) => {
                        if (messages.find((m) => m.id === message.msgGrispiId)) {
                            return;
                        }

                        return addMessage({
                            ...message,
                            id: message.msgGrispiId,
                            sender: message.senderId === user.id ? "user" : "ai",
                            status: message.seenAt ? "seen" : "sent",
                            shouldSendToApi: false,
                        });
                    });

                Promise.all(formattedMessages).then((messages) => {
                    debug("The formatted messages loaded from history", { messages });
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
        [messages, addMessage, notify, t]
    );

    const subscribe = useCallback(
        async (
            mode: "create" | "resume",
            options?: SubscribeOptions & {
                chatId: ChatBoxContextType["chat"]["chatId"];
            }
        ) => {
            const modes = {
                create: {
                    fn: () => {
                        Object.keys(user).forEach((key) => {
                            if (typeof user[key] === "string") {
                                user[key] = user[key].toString().trim().replace(/\s\s+/g, " ");
                            }
                        });

                        return createChat(user);
                    },
                    type: internalEventTypeMap.NEW_CHAT_CREATED,
                },
                resume: {
                    fn: () => resumeChat(options?.chatId),
                    type: internalEventTypeMap.RESUME_CHAT,
                },
            };

            const isChatEnded = getStoredValue("IS_CHAT_ENDED") === "1";
            const isSurveySent = getStoredValue("IS_SURVEY_SENT") === "1";

            const response = await modes[mode].fn();
            window.dispatchEvent(new CustomEvent(modes[mode].type, { detail: response }));

            if (!isChatEnded) {
                await subscribeChat(response);
            }

            const newChatState: ChatBoxContextType["chat"] = {
                ...response,
                subscribed: !isChatEnded,
                ended: isChatEnded,
            };

            const newUserState = {
                id: Number(newChatState.userId),
                fullName: newChatState.name,
                email: newChatState.email,
            };

            debug("setChat", newChatState);
            setChat(newChatState);
            setUser(newUserState);
            setConversationState(detectConversationState({ isChatEnded, isSurveySent }));

            if (mode === "resume" && (options?.loadChatHistory ?? true)) {
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
        async (chatId: ChatBoxContextType["chat"]["chatId"], options?: SubscribeOptions) => {
            return await subscribe("resume", { chatId, ...options });
        },
        [subscribe]
    );

    const subscribeToExistingChatFromStorage = useCallback(
        async (options?: SubscribeOptions) => {
            const chatId = getChatIdFromStorage();

            if (!chatId) {
                setChatBoxStatus("idle");
                return;
            }

            try {
                await subscribeToExistingChat(chatId, options);
                setChatBoxStatus("idle");
            } catch (err) {
                console.error("Error when subscribing to existing chat...");
                // TODO: We may want to create new chat session.
            }
        },
        [subscribeToExistingChat, setChatBoxStatus]
    );

    return {
        notificationAudioRef,
        subscribeToNewChat,
        subscribeToExistingChat,
        loadChatHistory,
        mergeLocalPreferencesWithGrispi,
        subscribeToExistingChatFromStorage,
    };
};
