import { filled, getFirst, tryParseJsonString, uuidv4 } from "@lib/utils";
import { sendMediaMessage, sendMessage } from "@lib/websocket";
import { createContext } from "preact";
import { type SetStateAction } from "preact/compat";
import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import { t } from "../lang";
import { type UploadFilesResponse, type WsMessage } from "../types/backend";
import { useChatBox } from "./chat-box-context";
import { useNotification } from "./notification-context";

export type ConversationState = "idle" | "typing" | "survey-form" | "user-form";
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
    setState: SetStateAction<ConversationState>;
    setReplies: SetStateAction<Reply[]>;
    selectReply: (reply: Reply) => void;
    addMessage: (
        message: AddMessage | WsMessage,
        withPrevious?: boolean
    ) => Promise<Message | void>;
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
    reset: () => {},
});

const setDefaultsForMessage = (message: AddMessage | WsMessage): Message => {
    const createdAt: string = isWsMessage(message)
        ? getFirst(message.receivedAt, () => new Date().toISOString())
        : getFirst(message.createdAt, () => new Date().toISOString());

    const finalMessage: Partial<Message> = {
        id: getFirst(message.id, uuidv4),
        createdAt,
        shouldSendToApi: getFirst(message.shouldSendToApi, true),
        status: getFirst(message.status, "sent"),
        sender: message.sender as Sender,
    };

    const parsedText = tryParseJsonString(message.text);

    if (parsedText) {
        parsedText.publicUrl = parsedText.url;
        (finalMessage as MediaMessage).media = parsedText;
    } else if (!isWsMessage(message) && isMediaMessage(message) && filled(message.media)) {
        (finalMessage as MediaMessage).media = message.media;
    } else if (!isWsMessage(message) && isTextMessage(message)) {
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

export const isMediaMessage = (message: Message | AddMessage): message is MediaMessage => {
    return "media" in message;
};

export const isTextMessage = (message: Message | AddMessage): message is TextMessage => {
    return "text" in message;
};

export const ConversationContextProvider = ({ children }) => {
    const { notify } = useNotification();
    const { options, chat, user } = useChatBox();
    const [state, setState] = useState<ConversationState>("idle");
    const [messages, setMessages] = useState<Message[]>([]);
    const [replies, setReplies] = useState<Reply[]>([]);

    const isFirstMessageFromEndUser = useCallback(
        (message: AddMessage) => {
            const mergedMessages = [...messages, message];

            const endUserMessages = mergedMessages.filter((message) => message.sender === "user");

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
                        sendMediaMessage(message.media, chat);
                    } else if (message.shouldSendToApi && isTextMessage(message)) {
                        sendMessage(
                            {
                                id: message.id,
                                sender: user.fullName,
                                sentAt: Date.now(),
                                text: message.text,
                            } as WsMessage,
                            chat
                        );
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
        [chat, user, notify, isFirstMessageFromEndUser, setState]
    );

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
        setState("idle");

        addMessage(
            {
                id: "starter",
                sender: "ai",
                text: options.welcome_message,
                shouldSendToApi: false,
            },
            false
        );

        // setReplies([
        //   { label: "Düğün yapmak istiyorum." },
        //   { label: "Nişan yapmak istiyorum." },
        //   { label: "Kına gecesi yapmak istiyorum." },
        // ]);
    }, [options, addMessage]);

    useEffect(() => {
        reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
