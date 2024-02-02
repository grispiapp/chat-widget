import { useChatBox } from "@context/chat-box-context";
import { internalEventTypeMap } from "@lib/config";
import { STORAGE_KEYS } from "@lib/storage";
import { useEffect } from "preact/hooks";

export const useChatState = () => {
    const { state, chat, setChat } = useChatBox();

    useEffect(() => {
        chat?.chatId && localStorage.setItem(STORAGE_KEYS.CHAT_ID, chat.chatId);
    }, [chat?.chatId]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.LAST_BOX_STATE, state);
    }, [state]);

    useEffect(() => {
        const subscribedToChatHandler = () => {
            setChat((prev) => ({ ...prev, subscribed: true }));
        };

        const disconnectHandler = () => {
            setChat((prev) => ({ ...prev, subscribed: false }));
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

        return () => {
            window.removeEventListener(internalEventTypeMap.CHAT_DISCONNECTED, disconnectHandler);
            window.removeEventListener(
                internalEventTypeMap.SUBSCRIBED_TO_CHAT,
                subscribedToChatHandler
            );

            window.GrispiChat.listeners.SUBSCRIBED_TO_CHAT = false;
            window.GrispiChat.listeners.CHAT_DISCONNECTED = false;
        };
    }, [setChat]);
};
