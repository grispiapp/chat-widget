import { getFirst, uuidv4 } from "@lib/utils";
import { sendMessage } from "@lib/websocket";
import { createContext } from "preact";
import { type SetStateAction } from "preact/compat";
import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import { t } from "../lang";
import { type WsMessage } from "../types/backend";
import { useChatBox } from "./chat-box-context";
import { useNotification } from "./notification-context";

export type ConversationState = "idle" | "typing" | "survey-form" | "user-form";
export type Sender = "ai" | "user";

export interface Conversation {
    id: string;
}

export interface Message {
    id: string;
    text: string;
    formattedText: string;
    sender: Sender;
    createdAt: string;
    shouldSendToApi?: boolean;
}

export interface AddMessage extends Omit<Message, "id" | "formattedText" | "createdAt"> {
    id?: string;
    formattedText?: string;
    createdAt?: string;
}

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

const setDefaultsForMessage = (message) => {
    return {
        ...message,
        id: getFirst(message.id, uuidv4),
        createdAt: getFirst(message.createdAt, () => new Date().toISOString()),
        formattedText: getFirst(message.formattedText, message.text),
        shouldSendToApi: getFirst(message.shouldSendToApi, true),
    };
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
        async (message, withPrevious = true) => {
            message = setDefaultsForMessage(message);

            try {
                setMessages((prev) =>
                    withPrevious ? [...prev, message as Message] : [message as Message]
                );

                if (message.sender === "user") {
                    if (
                        message.shouldSendToApi &&
                        isFirstMessageFromEndUser(message) &&
                        !chat?.subscribed
                    ) {
                        setState("user-form");
                    } else if (message.shouldSendToApi) {
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
