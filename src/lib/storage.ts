import {
    chatBoxStateMap,
    type ChatBoxContextType,
    type ChatBoxState,
} from "@context/chat-box-context";
import { STORAGE_KEYS } from "./config";

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
