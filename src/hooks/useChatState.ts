import { useChatBox } from "@context/chat-box-context";
import { useConversation } from "@context/conversation-context";
import { getStoredValue, storeValue } from "@lib/storage";
import { debug } from "@lib/utils";
import { useEffect } from "preact/hooks";

export const useChatState = () => {
    const { state, chat } = useChatBox();
    const { setState: setConversationState } = useConversation();

    useEffect(() => {
        chat?.chatId && storeValue("CHAT_ID", chat.chatId);
        chat?.chatSessionId && storeValue("CHAT_SESSION_ID", chat.chatSessionId);
        chat?.userId && storeValue("USER_ID", chat.userId);
    }, [chat?.chatId, chat?.chatSessionId, chat?.userId]);

    useEffect(() => {
        storeValue("LAST_BOX_STATE", state);
    }, [state]);

    useEffect(() => {
        if (getStoredValue("IS_CHAT_ENDED") === "1") {
            return;
        }

        storeValue("IS_CHAT_ENDED", chat?.ended ? "1" : "0");

        if (chat?.ended) {
            debug("Chat ended, setting conversation state to survey-form");
            setConversationState("survey-form");
        }
    }, [chat?.ended]);
};
