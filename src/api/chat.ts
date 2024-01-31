import { type GrispiChatOptions } from "@/types/chat-box";
import { type SurveyInput } from "@components/survey-form";
import { api } from "@lib/api";
import { InternalEventTypeMap } from "@lib/config";
import { debug, getHostUrl } from "@lib/utils";
import {
    type SubscribeableChatResponseForEndUser,
    type UploadFilesResponse,
    type WsMessage,
} from "../types/backend";
import { type UserInput } from "../types/user";

export const chatStatus = async () => {
    debug("chatStatus", "Fetch chat status...");
    return await api<boolean>("/chat/status");
};

export const chatPreferences = async () => {
    debug("chatPreferences", "Fetching preferences...");
    return await api<GrispiChatOptions>("/chat/preferences");
};

export const resumeChat = async (chatId: string) => {
    debug("resumeChat", "Fetching existing chat...");
    return await api<SubscribeableChatResponseForEndUser>(`/chats/${chatId}`, "POST");
};

export const createChat = async (user: UserInput) => {
    const body = {
        ...user,
        url: getHostUrl(),
    };

    debug("createChat", "Creating new chat with", { body });

    return await api<SubscribeableChatResponseForEndUser>("/chats", "POST", { body });
};

export const chatHistory = async (chatId: string) => {
    return await api<WsMessage[]>(`/chats/${chatId}/history`);
};

export const sendSurvey = async (
    survey: SurveyInput,
    chat: SubscribeableChatResponseForEndUser
) => {
    return await api(`/chats/${chat.chatSessionId}/survey`, "POST", {
        body: survey,
        headers: {
            Authorization: `Bearer ${chat.token}`,
        },
    });
};

export const uploadAttachment = async (file: File, chat: SubscribeableChatResponseForEndUser) => {
    const formData = new FormData();
    formData.append("file", file);

    return await api<UploadFilesResponse>(`/chats/${chat.chatSessionId}/attachment`, "POST", {
        body: formData,
        headers: {
            Authorization: `Bearer ${chat.token}`,
            "Content-Type": "multipart/form-data",
        },
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
