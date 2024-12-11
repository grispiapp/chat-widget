import { useTranslation } from "@hooks/useTranslation";
import { getStoredValue } from "@lib/storage";
import { detectConversationState, filled, getFirst, tryParseJsonString, uuidv4 } from "@lib/utils";
import { sendMediaMessage, sendMessage } from "@lib/websocket";
import { createContext } from "preact";
import { type SetStateAction } from "preact/compat";
import { useCallback, useContext, useEffect, useState, type Dispatch } from "preact/hooks";
import { type UploadFilesResponse, type WsMessage } from "../types/backend";
import { useChatBox } from "./chat-box-context";
import { useNotification } from "./notification-context";

export type ConversationState = "idle" | "typing" | "survey-form" | "user-form" | "ended";
export type Sender = "ai" | "user";
export type MessageStatus = "sending" | "sent" | "seen";

export interface Conversation {
    id: string;
}

export type TextMessage = {
    id: string;
    text: string;
    formattedText: string;
    sender: Sender;
    createdAt: string | number;
    shouldSendToApi?: boolean;
    status: MessageStatus;
};

export type MediaMessage = {
    id: string;
    sender: Sender;
    createdAt: string | number;
    shouldSendToApi?: boolean;
    status: MessageStatus;
    media: UploadFilesResponse;
};

export type Message = TextMessage | MediaMessage;

export type AddMessage = Omit<Message, "id" | "formattedText" | "createdAt" | "status"> & {
    id?: string;
    createdAt?: string | number;
    status?: MessageStatus;
    media?: UploadFilesResponse;
    text?: string;
    formattedText?: string;
};

export interface Reply {
    label: string;
    text?: string;
}

interface ConversationContextType {
    state: ConversationState;
    messages: Message[];
    replies: Reply[];
    setState: Dispatch<SetStateAction<ConversationState>>;
    setReplies: Dispatch<SetStateAction<Reply[]>>;
    selectReply: (reply: Reply) => void;
    addMessage: (
        message: AddMessage | WsMessage,
        withPrevious?: boolean
    ) => Promise<Message | void>;
    updateMessage: (id: Message["id"], message: Partial<AddMessage>) => void;
    deleteMessage: (id: Message["id"]) => void;
    reset: () => void;
}

const ConversationContext = createContext<ConversationContextType>({
    state: "idle",
    messages: [],
    replies: [],
    setState: () => {},
    setReplies: () => {},
    selectReply: () => {},
    addMessage: async () => {},
    updateMessage: () => {},
    deleteMessage: () => {},
    reset: () => {},
});

const setDefaultsForMessage = (message: AddMessage | WsMessage): Message => {
    const createdAt: string = isWsMessage(message)
        ? getFirst(message.sentAt, () => new Date().toISOString())
        : getFirst(message.createdAt, () => new Date().toISOString());

    const finalMessage: Partial<Message> = {
        id: getFirst(message.id, uuidv4),
        createdAt,
        shouldSendToApi: getFirst(message.shouldSendToApi, true),
        status: getFirst(message.status, "sending"),
        sender: message.sender as Sender,
    };

    const parsedText = tryParseJsonString(message.text);

    if (parsedText) {
        parsedText.publicUrl = parsedText.url;
        (finalMessage as MediaMessage).media = parsedText;
    } else if (isMediaMessage(message) && filled(message.media)) {
        (finalMessage as MediaMessage).media = message.media;
    } else if (isTextMessage(message)) {
        (finalMessage as TextMessage).text = message.text;
        (finalMessage as TextMessage).formattedText = getFirst(
            (finalMessage as TextMessage).formattedText,
            (finalMessage as TextMessage).text
        );
    }

    return finalMessage as Message;
};

export const isWsMessage = (message: AddMessage | WsMessage): message is WsMessage => {
    return "senderId" in message;
};

export const isMediaMessage = (
    message: Message | AddMessage | WsMessage
): message is MediaMessage => {
    return "media" in message;
};

export const isTextMessage = (
    message: Message | AddMessage | WsMessage
): message is TextMessage => {
    return "text" in message;
};

export const ConversationContextProvider = ({ children }) => {
    const { t } = useTranslation();
    const { notify } = useNotification();
    const { chat, options, user, isOnline } = useChatBox();
    const [state, setState] = useState<ConversationState>("idle");
    const [messages, setMessages] = useState<Message[]>([]);
    const [replies, setReplies] = useState<Reply[]>([]);

    const isFirstMessageFromEndUser = useCallback(
        (message: AddMessage) => {
            const endUserMessages = [...messages, message].filter(
                (message) => message?.sender === "user"
            );

            return endUserMessages.length === 1;
        },
        [messages]
    );

    const addMessage = useCallback<ConversationContextType["addMessage"]>(
        async (messageInput, withPrevious = true) => {
            const message = setDefaultsForMessage(messageInput);

            try {
                setMessages((prev) => (withPrevious ? [...prev, message] : [message]));

                if (message.sender === "user") {
                    const shouldDisplayUserForm =
                        message.shouldSendToApi &&
                        isFirstMessageFromEndUser(message) &&
                        !chat?.subscribed;

                    if (shouldDisplayUserForm) {
                        setState("user-form");
                        setReplies([]);
                        return;
                    }

                    if (message.shouldSendToApi && isMediaMessage(message)) {
                        try {
                            sendMediaMessage(message.media, chat);
                        } catch (err) {
                            console.error("Failed to sending media message", err);
                        }
                    } else if (message.shouldSendToApi && isTextMessage(message)) {
                        try {
                            sendMessage(
                                {
                                    id: message.id,
                                    sender: user.fullName,
                                    sentAt: Date.now(),
                                    text: message.text,
                                } as WsMessage,
                                chat
                            );
                        } catch (err) {
                            console.error("Failed to sending text message", err);
                        }
                    }

                    setReplies([]);
                }

                return message as Message;
            } catch (err) {
                notify({
                    title: t("errors.common.title"),
                    text: t("errors.common.text"),
                    type: "error",
                });

                setState("idle");

                console.error(err);

                throw err;
            }
        },
        [chat, user, notify, t, isFirstMessageFromEndUser, setState]
    );

    const updateMessage = useCallback((id: Message["id"], message: Partial<AddMessage>) => {
        /**
         * When the user sends consecutive messages, the message ID we defined
         * temporarily becomes duplicated and updates all associated messages.
         *
         * Just to update the first message it finds:
         */
        let isMessageUpdated = false;

        setMessages((prevMessages) => [
            ...prevMessages.map((item) => {
                if (isMessageUpdated) return;

                if (item?.id === id) {
                    item = { ...item, ...message };
                    isMessageUpdated = true;
                }

                return item;
            }),
        ]);
    }, []);

    const deleteMessage = useCallback((id: Message["id"]) => {
        /**
         * When the user sends consecutive messages, the message ID we defined
         * temporarily becomes duplicated and deletes all associated messages.
         *
         * Just to delete the first message it finds:
         */
        let isMessageDeleted = false;

        setMessages((prevMessages) => [
            ...prevMessages.filter((item) => {
                if (isMessageDeleted) return true;

                if (item.id === id) {
                    isMessageDeleted = true;
                    return false;
                }

                return true;
            }),
        ]);
    }, []);

    const selectReply = useCallback<ConversationContextType["selectReply"]>(
        (reply) => {
            addMessage({
                sender: "user",
                text: reply.text || reply.label,
                formattedText: reply.label,
            });

            setReplies([]);
        },
        [addMessage]
    );

    const reset = useCallback(() => {
        if (isOnline === null) return;

        const isChatEnded = getStoredValue("IS_CHAT_ENDED") === "1";
        const isSurveySent = getStoredValue("IS_SURVEY_SENT") === "1";
        const conversationState = detectConversationState({ isChatEnded, isSurveySent });

        setState(conversationState);

        addMessage(
            {
                id: "starter",
                sender: "ai",
                text: isOnline ? t("welcome_message") : t("offline_message"),
                shouldSendToApi: false,
            },
            false
        );
    }, [isOnline, t, addMessage]);

    useEffect(() => {
        reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOnline, options]);

    return (
        <ConversationContext.Provider
            value={{
                state,
                messages,
                replies,
                setReplies,
                selectReply,
                setState,
                addMessage,
                updateMessage,
                deleteMessage,
                reset,
            }}
        >
            {children}
        </ConversationContext.Provider>
    );
};

export const useConversation = () => {
    return useContext(ConversationContext);
};

export default ConversationContext;
