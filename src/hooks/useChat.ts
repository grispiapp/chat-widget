import { useChatBox, type ChatBoxContextType } from "@context/chat-box-context";
import { useConversation } from "@context/conversation-context";
import { useNotification } from "@context/notification-context";
import { InternalEventTypeMap } from "@lib/config";
import { debug } from "@lib/utils";
import { subscribeChat } from "@lib/websocket";
import { useCallback } from "preact/hooks";
import { chatHistory, createChat, resumeChat } from "../api/chat";
import { t } from "../lang";

export const useChat = () => {
    const { user, setChat, setUser } = useChatBox();
    const { addMessage } = useConversation();
    const { notify } = useNotification();

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
                    addMessage({
                        sender: chat.userId === message.senderId.toString() ? "user" : "ai",
                        text: message.text,
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
            type: "create" | "resume",
            options?: {
                chatId: ChatBoxContextType["chat"]["chatId"];
            }
        ) => {
            const modes = {
                create: {
                    fn: createChat,
                    args: [user],
                    type: InternalEventTypeMap.NEW_CHAT_CREATED,
                },
                resume: {
                    fn: resumeChat,
                    args: [options?.chatId],
                    type: InternalEventTypeMap.RESUME_CHAT,
                },
            };

            const response = await modes[type].fn(...modes[type].args);
            window.dispatchEvent(new CustomEvent(modes[type].type, { detail: response }));
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

            if (type === "resume") {
                await loadChatHistory(newChatState);
            }

            return {
                chat: newChatState,
                user: newUserState,
            };
        },
        [user, setChat, setUser, loadChatHistory]
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

    return {
        subscribeToNewChat,
        subscribeToExistingChat,
        loadChatHistory,
    };
};
