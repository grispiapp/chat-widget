import { ConfigurationStatusEnum } from "@/types/chat-box";
import { useChatBox } from "@context/chat-box-context";
import { useChat } from "@hooks/useChat";
import { useChatState } from "@hooks/useChatState";
import { internalEventTypeMap } from "@lib/config";
import { cn, debug } from "@lib/utils";
import incomingMessageSfx from "@resources/incoming-message.mp3";
import { useEffect, useState } from "preact/hooks";

export const Wrapper = ({ children }) => {
    const { options, chat, configurationStatus, setConfigurationStatus, setStatus } = useChatBox();
    const {
        subscribeToExistingChatFromStorage,
        mergeLocalPreferencesWithGrispi,
        notificationAudioRef,
    } = useChat();
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

            if (chat?.subscribed === true) {
                debug("Already subscribed.");
                return;
            }

            if (chat?.ended) {
                debug("Chat has ended. No need to ensure websocket connection.");
                return;
            }

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
    }, [configurationStatus, chat?.subscribed, chat?.ended]);

    return display ? (
        <div
            className={cn({ "cb-h-full": options.renderAsBlock })}
            style={{ "--color-primary": options.colors.primary }}
        >
            <audio
                ref={notificationAudioRef}
                src={import.meta.env.VITE_BASE_URL + incomingMessageSfx}
                preload="auto"
            />
            {children}
        </div>
    ) : null;
};
