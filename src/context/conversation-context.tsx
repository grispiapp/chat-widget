import { getFirst, uuidv4 } from "@lib/utils";
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
    createdAt: string;
    shouldSendToApi?: boolean;
    status: MessageStatus;
};

export type MediaMessage = {
    id: string;
    sender: Sender;
    createdAt: string;
    shouldSendToApi?: boolean;
    status: MessageStatus;
    media: UploadFilesResponse;
};

export type Message = TextMessage | MediaMessage;

export type AddMessage = Omit<Message, "id" | "formattedText" | "createdAt" | "status"> & {
    id?: string;
    text?: string;
    formattedText?: string;
    createdAt?: string;
    status?: MessageStatus;
    media?: UploadFilesResponse;
};

export interface Reply {
    label: string;
    text?: string;
}

interface ConversationContextType {
    state: ConversationState;
    conversation?: Conversation;
    messages: Message[];
    replies: Reply[];
    setState: SetStateAction<ConversationState>;
    setReplies: SetStateAction<Reply[]>;
    selectReply: (reply: Reply) => void;
    addMessage: (message: AddMessage, withPrevious?: boolean) => Promise<Message | void>;
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

const setDefaultsForMessage = (message): Message => {
    return {
        ...message,
        id: getFirst(message.id, uuidv4),
        createdAt: getFirst(message.createdAt, () => new Date().toISOString()),
        formattedText: getFirst(message.formattedText, message.text),
        shouldSendToApi: getFirst(message.shouldSendToApi, true),
        status: getFirst(message.status, "sent"),
    };
};

export const isMediaMessage = (message: Message): message is MediaMessage => {
    return "media" in message;
};

export const isTextMessage = (message: Message): message is TextMessage => {
    return "text" in message;
};

export const ConversationContextProvider = ({ children }) => {
    const { notify } = useNotification();
    const { options, chat, user } = useChatBox();
    const [state, setState] = useState<ConversationState>("idle");
    const [conversation, setConversation] = useState<Conversation>();
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
        setConversation(undefined);

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
                conversation,
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
