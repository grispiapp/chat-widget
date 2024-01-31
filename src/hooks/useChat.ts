import { useChatBox, type ChatBoxContextType } from "@context/chat-box-context";
import { useConversation, type AddMessage } from "@context/conversation-context";
import { useNotification } from "@context/notification-context";
import { InternalEventTypeMap } from "@lib/config";
import { getChatIdFromStorage } from "@lib/storage";
import { debug, tryParseJsonString } from "@lib/utils";
import { subscribeChat } from "@lib/websocket";
import { useCallback } from "preact/hooks";
import { chatHistory, chatPreferences, createChat, resumeChat } from "../api/chat";
import { t } from "../lang";

export const useChat = () => {
    const { setStatus: setChatBoxStatus, user, setChat, setUser, updateOptions } = useChatBox();
    const { addMessage, setState: setConversationState } = useConversation();
    const { notify } = useNotification();

    const mergeLocalPreferencesWithGrispi = useCallback(async () => {
        updateOptions(await chatPreferences());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadChatHistory = useCallback(
        async (chat: ChatBoxContextType["chat"]) => {
            debug("Fetching chat history...", { chat });

            try {
                const history = await chatHistory(chat.chatId);
                debug("Chat history", { history });

                if (!Array.isArray(history)) {
                    throw new Error("Chat history is not an array.");
                }

                history.forEach((message) => {
                    const messageInput = {
                        sender: chat.userId === message.senderId.toString() ? "user" : "ai",
                        shouldSendToApi: false,
                    } as AddMessage;

                    const parsedText = tryParseJsonString(message.text);

                    if (parsedText) {
                        parsedText.publicUrl = parsedText.url;
                        messageInput.media = parsedText;
                    } else {
                        messageInput.text = message.text;
                    }

                    addMessage(messageInput);
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
                    type: InternalEventTypeMap.NEW_CHAT_CREATED,
                },
                resume: {
                    fn: () => resumeChat(options?.chatId),
                    type: InternalEventTypeMap.RESUME_CHAT,
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
                fullName: newChatState.name,
                email: newChatState.email,
            };

            debug("setChat", newChatState);
            setChat(newChatState);
            setUser(newUserState);
            setConversationState("idle");

            if (mode === "resume") {
                await loadChatHistory(newChatState);
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
