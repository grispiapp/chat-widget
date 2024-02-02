import { type ContentType } from "./file";

export enum SERVER_MESSAGE_CODE {
    CHAT_SESSION_CLOSED = "CHAT_SESSION_CLOSED",
    INVALID_CHAT_SESSION = "INVALID_CHAT_SESSION",
    INVALID_MESSAGE = "INVALID_MESSAGE",
    MESSAGE_RECEIVED = "MESSAGE_RECEIVED",
    MESSAGE_SEEN = "MESSAGE_SEEN",
    NOT_AUTHORIZED = "NOT_AUTHORIZED",
}

export interface SubscribeableChatResponseForEndUser {
    token: string;
    userId: string;
    chatId: string;
    chatSessionId: string;
    name: string;
    email: string;
}

export interface UploadFilesResponse {
    fileName: string;
    mimeType: string;
    publicUrl: string;
    size: number; // in bytes
}

export interface WsMessage {
    contentType: ContentType;
    id: string; // this is the msgGrispiId
    msgGrispiId?: string; // this exists in messages from history or websocket. we use this value as the id property in UI.
    receiptId?: string; // this is added to outgoing messages and also exists in incoming messages that come from ws subscription
    receivedAt?: number;
    seen: boolean;
    seenAt: number | undefined;
    sender: string;
    senderId: number;
    sentAt: number;
    status: string | undefined;
    text: string;
    shouldSendToApi?: boolean;
}
