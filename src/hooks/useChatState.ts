import { type SubscribeableChatResponseForEndUser } from "@/types/backend";
import { useChatBox } from "@context/chat-box-context";
import { useConversation } from "@context/conversation-context";
import { internalEventTypeMap } from "@lib/config";
import { STORAGE_KEYS } from "@lib/storage";
import { useEffect } from "preact/hooks";

export const useChatState = () => {
    const { state, chat, setChat } = useChatBox();
    const { setState: setConversationState } = useConversation();

    useEffect(() => {
        chat?.chatId && localStorage.setItem(STORAGE_KEYS.CHAT_ID, chat.chatId);
    }, [chat?.chatId]);

    useEffect(() => {
        chat?.chatSessionId &&
            localStorage.setItem(STORAGE_KEYS.CHAT_SESSION_ID, chat.chatSessionId);
    }, [chat?.chatSessionId]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.LAST_BOX_STATE, state);
    }, [state]);

    useEffect(() => {
        if (localStorage.getItem(STORAGE_KEYS.IS_CHAT_ENDED) === "1") {
            return;
        }

        localStorage.setItem(STORAGE_KEYS.IS_CHAT_ENDED, chat?.ended ? "1" : "0");

        if (chat?.ended) {
            setConversationState("survey-form");
        }
    }, [chat?.ended]);

    useEffect(() => {
        const subscribedToChatHandler = () => {
            setChat((prev) => ({ ...prev, subscribed: true, ended: false }));
        };

        const disconnectHandler = () => {
            setChat((prev) => ({ ...prev, subscribed: false, ended: true }));
        };

        const resumeChatHandler = (e: CustomEvent<SubscribeableChatResponseForEndUser>) => {
            setChat((prev) => ({ ...prev, chatSessionId: e.detail.chatSessionId }));
        };

        if (!window.GrispiChat.listeners.SUBSCRIBED_TO_CHAT) {
            window.addEventListener(
                internalEventTypeMap.SUBSCRIBED_TO_CHAT,
                subscribedToChatHandler
            );
            window.GrispiChat.listeners.SUBSCRIBED_TO_CHAT = true;
        }

        if (!window.GrispiChat.listeners.CHAT_DISCONNECTED) {
            window.addEventListener(internalEventTypeMap.CHAT_DISCONNECTED, disconnectHandler);
            window.GrispiChat.listeners.CHAT_DISCONNECTED = true;
        }

        if (!window.GrispiChat.listeners.RESUME_CHAT) {
            window.addEventListener(internalEventTypeMap.RESUME_CHAT, resumeChatHandler);
            window.GrispiChat.listeners.RESUME_CHAT = true;
        }

        return () => {
            window.removeEventListener(internalEventTypeMap.CHAT_DISCONNECTED, disconnectHandler);
            window.removeEventListener(
                internalEventTypeMap.SUBSCRIBED_TO_CHAT,
                subscribedToChatHandler
            );
            window.removeEventListener(internalEventTypeMap.RESUME_CHAT, resumeChatHandler);

            window.GrispiChat.listeners.SUBSCRIBED_TO_CHAT = false;
            window.GrispiChat.listeners.CHAT_DISCONNECTED = false;
            window.GrispiChat.listeners.RESUME_CHAT = false;
        };
    }, [setChat]);
};
