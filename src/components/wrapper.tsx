import { ConfigurationStatusEnum } from "@/types/chat-box";
import { useChatBox } from "@context/chat-box-context";
import { useChat } from "@hooks/useChat";
import { useChatState } from "@hooks/useChatState";
import { internalEventTypeMap } from "@lib/config";
import { debug } from "@lib/utils";
import { useEffect, useState } from "preact/hooks";

export const Wrapper = ({ children }) => {
    const { options, chat, configurationStatus, setConfigurationStatus, setStatus } = useChatBox();
    const { subscribeToExistingChatFromStorage, mergeLocalPreferencesWithGrispi } = useChat();
    const [display, setDisplay] = useState<boolean>(false);

    // Listen and store chat states.
    useChatState();

    useEffect(() => {
        const handle = async () => {
            try {
                // Merge local preferences with Grispi API.
                await mergeLocalPreferencesWithGrispi();

                setDisplay(true);

                // Try to subscribe to the existing chat.
                await subscribeToExistingChatFromStorage();
            } catch (err) {
                if (err.response.status === 403) {
                    setConfigurationStatus(ConfigurationStatusEnum.FORBIDDEN);
                } else {
                    setConfigurationStatus(ConfigurationStatusEnum.COMMON_ERROR);
                }

                setStatus("idle");
            }
        };

        handle();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const ensureWsSubscription = async () => {
            if (configurationStatus !== ConfigurationStatusEnum.AUTHORIZED) return;
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
    }, [configurationStatus, chat?.subscribed]);

    console.log({ options });

    return display ? (
        <div style={{ "--color-primary": options.colors.primary }}>{children}</div>
    ) : null;
};
