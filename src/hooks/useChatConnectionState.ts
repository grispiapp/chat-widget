import { InternalEventTypeMap } from "@lib/config";
import { useEffect, useState } from "react";

export const useChatConnectionState = () => {
    const [subscribedToChat, setSubscribedToChat] = useState(false);

    useEffect(() => {
        const subscribedToChatHandler = (event: any) => {
            setSubscribedToChat(true);
        };

        const disconnectHandler = () => {
            setSubscribedToChat(false);
        };

        window.addEventListener(InternalEventTypeMap.SUBSCRIBED_TO_CHAT, subscribedToChatHandler);

        window.addEventListener(InternalEventTypeMap.CHAT_DISCONNECTED, disconnectHandler);

        return () => {
            window.removeEventListener(InternalEventTypeMap.CHAT_DISCONNECTED, disconnectHandler);
            window.removeEventListener(InternalEventTypeMap.SUBSCRIBED_TO_CHAT, subscribedToChatHandler);
        };
    }, []);
    return { subscribedToChat };
};
