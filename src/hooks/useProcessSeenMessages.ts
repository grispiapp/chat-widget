import { useChatBox } from "@context/chat-box-context";
import { useConversation } from "@context/conversation-context";
import { debug, isUuid } from "@lib/utils";
import { sendSeen } from "@lib/websocket";
import { useEffect } from "preact/hooks";

export const useProcessSeenMessages = () => {
    const { messages } = useConversation();
    const { chat } = useChatBox();

    useEffect(() => {
        if (!chat?.subscribed) {
            return;
        }

        const processUnseenMessages = () => {
            messages.forEach((message) => {
                if (
                    message &&
                    isUuid(message.id) &&
                    message.status !== "seen" &&
                    message.sender === "ai"
                ) {
                    debug("Sending seen status for message", { message, chat });
                    sendSeen(message.id, chat);
                }
            });
        };

        // Process new messages if the tab is visible
        if (document.visibilityState === "visible" && messages.length > 0) {
            processUnseenMessages();
        }

        // Listen for visibility changes
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                processUnseenMessages();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [messages, chat]);
};
