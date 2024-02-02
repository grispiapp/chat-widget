import { useChatBox } from "@context/chat-box-context";
import { useChat } from "@hooks/useChat";
import { useChatState } from "@hooks/useChatState";
import { useEffect } from "preact/hooks";

export const Wrapper = ({ children }) => {
    const { options } = useChatBox();
    const { subscribeToExistingChatFromStorage, mergeLocalPreferencesWithGrispi } = useChat();

    // Listen and store chat states.
    useChatState();

    useEffect(() => {
        // Merge local preferences with Grispi API.
        mergeLocalPreferencesWithGrispi();
        // Try to subscribe to the existing chat.
        subscribeToExistingChatFromStorage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div style={{ "--color-primary": options.colors.primary }}>{children}</div>;
};
