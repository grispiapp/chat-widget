import { type ChatBoxState } from "@/types/chat-box";
import { chatBoxStateMap, type ChatBoxContextType } from "@context/chat-box-context";
import { getTenantId } from "./utils";

export const STORAGE_KEYS = {
    DISMISS_PROMPT: "grispi.%tenant%.chat.dismissPrompt",
    USER_ID: "grispi.%tenant%.chat.userId",
    CHAT_ID: "grispi.%tenant%.chat.chatId",
    CHAT_SESSION_ID: "grispi.%tenant%.chat.chatSessionId",
    LAST_MESSAGE_TIME: "grispi.%tenant%.chat.lastMessageTime",
    LAST_BOX_STATE: "grispi.%tenant%.chat.lastBoxState",
    IS_CHAT_ENDED: "grispi.%tenant%.chat.ended",
    IS_SURVEY_SENT: "grispi.%tenant%.chat.survey_sent",
};

type StorageKey = keyof typeof STORAGE_KEYS;

export const getStorageKey = (key: StorageKey) => {
    return STORAGE_KEYS[key].replace("%tenant%", getTenantId());
};

export const getStoredValue = (key: StorageKey) => {
    return localStorage.getItem(getStorageKey(key));
};

export const storeValue = (key: StorageKey, value: string) => {
    return localStorage.setItem(getStorageKey(key), value);
};

export const removeStoredValue = (key: StorageKey) => {
    return localStorage.removeItem(getStorageKey(key));
};

export const getLastBoxStateFromStorage = (): ChatBoxState => {
    const lastBoxState = getStoredValue("LAST_BOX_STATE");

    return Object.values(chatBoxStateMap).includes(lastBoxState)
        ? (lastBoxState as ChatBoxState)
        : "closed";
};

export const getChatIdFromStorage = (): ChatBoxContextType["chat"]["chatId"] => {
    return getStoredValue("CHAT_ID");
};

export const isPromptDismissed = (): boolean => {
    return getStoredValue("DISMISS_PROMPT") === "1";
};
