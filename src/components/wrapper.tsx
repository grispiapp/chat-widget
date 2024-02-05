import { useChatBox } from "@context/chat-box-context";
import { useChat } from "@hooks/useChat";
import { useChatState } from "@hooks/useChatState";
import { internalEventTypeMap } from "@lib/config";
import { debug } from "@lib/utils";
import { useEffect } from "preact/hooks";

export const Wrapper = ({ children }) => {
    const { options, chat, isAuthorized, setIsAuthorized, setStatus } = useChatBox();
    const { subscribeToExistingChatFromStorage, mergeLocalPreferencesWithGrispi } = useChat();

    // Listen and store chat states.
    useChatState();

    useEffect(() => {
        const handle = async () => {
            try {
                // Merge local preferences with Grispi API.
                await mergeLocalPreferencesWithGrispi();

                // Try to subscribe to the existing chat.
                await subscribeToExistingChatFromStorage();
            } catch (err) {
                setIsAuthorized(false);
                setStatus("idle");
            }
        };

        handle();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const ensureWsSubscription = async () => {
            if (!isAuthorized) return;
            if (chat?.subscribed === true) return;

            await subscribeToExistingChatFromStorage();

            debug("Re-subscribed to websocket.");
        };

        window.addEventListener(internalEventTypeMap.ENSURE_WS_SUBSCRIPTION, ensureWsSubscription);

        return () => {
            window.removeEventListener(
                internalEventTypeMap.ENSURE_WS_SUBSCRIPTION,
                ensureWsSubscription
            );
        };
    }, [isAuthorized, chat?.subscribed]);

    return <div style={{ "--color-primary": options.colors.primary }}>{children}</div>;
};
