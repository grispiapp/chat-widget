import { type SurveyInput } from "@components/survey-form";
import { api } from "@lib/api";
import { InternalEventTypeMap } from "@lib/config";
import { debug, getHostUrl } from "@lib/utils";
import { type SubscribeableChatResponseForEndUser, type WsMessage } from "../types/backend";
import { type UserInput } from "../types/user";

export const chatStatus = async () => {
    debug("chatStatus", "Fetch chat status...");
    return await api<boolean>("/chat/status");
};

export const chatPreferences = async () => {
    debug("chatPreferences", "Fetching preferences...");
    return await api("/chat/preferences");
};

export const resumeChat = async (chatId: string) => {
    debug("resumeChat", "Fetching existing chat...");
    return await api<SubscribeableChatResponseForEndUser>(`/chats/${chatId}`, "POST");
};

export const createChat = async (user: UserInput) => {
    const data = {
        ...user,
        url: getHostUrl(),
    };

    debug("createChat", "Creating new chat with", { data });

    return await api<SubscribeableChatResponseForEndUser>("/chats", "POST", data);
};

export const chatHistory = async (chatId: string) => {
    return await api<WsMessage[]>(`/chats/${chatId}/history`);
};

export const sendSurvey = async (
    chatId: string,
    survey: SurveyInput,
    chat: SubscribeableChatResponseForEndUser
) => {
    return await api(`/chats/${chatId}/survey`, "POST", survey, {
        Authorization: `Bearer ${chat.token}`,
    });
};

export const windowFocusedEvent = () => {
    window.dispatchEvent(new CustomEvent(InternalEventTypeMap.WINDOW_FOCUSED));
};
export const windowBlurredEvent = () => {
    window.dispatchEvent(new CustomEvent(InternalEventTypeMap.WINDOW_BLURRED));
};

export const websocketConnectionReadyEvent = () =>
    window.dispatchEvent(new CustomEvent(InternalEventTypeMap.CONNECTION_READY));
