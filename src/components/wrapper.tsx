import { useChatBox } from "@context/chat-box-context";
import { useChat } from "@hooks/useChat";
import { useChatState } from "@hooks/useChatState";
import { getChatIdFromStorage } from "@lib/storage";
import { useEffect } from "preact/hooks";

export const Wrapper = ({ children }) => {
    const { options, setStatus } = useChatBox();
    const { subscribeToExistingChat } = useChat();

    // listen and store chat states.
    useChatState();

    useEffect(() => {
        const chatId = getChatIdFromStorage();

        if (!chatId) {
            setStatus("idle");
            return;
        }

        const handleSubscription = async () => {
            try {
                await subscribeToExistingChat(chatId);
                setStatus("idle");
            } catch (err) {
                console.error("Error when subscribing to existing chat...");
                // TODO: We may want to create new chat session.
            }
        };

        handleSubscription();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div style={{ "--color-primary": options.colors.primary }}>{children}</div>;
};
