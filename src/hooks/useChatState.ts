import { useChatBox } from "@context/chat-box-context";
import { InternalEventTypeMap, STORAGE_KEYS } from "@lib/config";
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

        if (!window.GrispiChat.hasSubscribedToChatListener) {
            window.addEventListener(
                InternalEventTypeMap.SUBSCRIBED_TO_CHAT,
                subscribedToChatHandler
            );
            window.GrispiChat.hasSubscribedToChatListener = true;
        }

        if (!window.GrispiChat.hasChatDisconnectedListener) {
            window.addEventListener(InternalEventTypeMap.CHAT_DISCONNECTED, disconnectHandler);
            window.GrispiChat.hasChatDisconnectedListener = true;
        }

        return () => {
            window.removeEventListener(InternalEventTypeMap.CHAT_DISCONNECTED, disconnectHandler);
            window.removeEventListener(
                InternalEventTypeMap.SUBSCRIBED_TO_CHAT,
                subscribedToChatHandler
            );

            window.GrispiChat.hasSubscribedToChatListener = false;
            window.GrispiChat.hasChatDisconnectedListener = false;
        };
    }, [setChat]);
};
