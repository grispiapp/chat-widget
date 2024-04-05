import { type ChatBoxState } from "@/types/chat-box";
import { chatBoxStateMap, type ChatBoxContextType } from "@context/chat-box-context";

export const STORAGE_KEYS = {
    DISMISS_PROMPT: "grispi.chat.dismissPrompt",
    CHAT_ID: "grispi.chat.chatId",
    LAST_MESSAGE_TIME: "grispi.chat.lastMessageTime",
    LAST_BOX_STATE: "grispi.chat.lastBoxState",
    IS_CHAT_ENDED: "grispi.chat.ended",
};

export const getLastBoxStateFromStorage = (): ChatBoxState => {
    const lastBoxState = localStorage.getItem(STORAGE_KEYS.LAST_BOX_STATE);

    return Object.values(chatBoxStateMap).includes(lastBoxState)
        ? (lastBoxState as ChatBoxState)
        : "closed";
};

export const getChatIdFromStorage = (): ChatBoxContextType["chat"]["chatId"] => {
    return localStorage.getItem(STORAGE_KEYS.CHAT_ID);
};

export const isPromptDismissed = (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.DISMISS_PROMPT) === "1";
};
