import { getFirst, uuidv4 } from "@lib/utils";
import { sendMessage } from "@lib/websocket";
import { createContext } from "preact";
import { useCallback, useContext, useEffect, useState, type StateUpdater } from "preact/hooks";
import { t } from "../lang";
import { WsMessage } from "../types/backend";
import ChatBoxContext from "./chat-box-context";
import { useNotification } from "./notification-context";

export type ConversationState = "idle" | "typing";
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
    setState: StateUpdater<ConversationState>;
    setReplies: StateUpdater<Reply[]>;
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
    const { options, chat, user, setUserFormVisibility } = useContext(ChatBoxContext);
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
                        setUserFormVisibility(true);
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

                    setState("idle");
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
        [chat?.subscribed, isFirstMessageFromEndUser, setUserFormVisibility]
    );

    const selectReply = useCallback<ConversationContextType["selectReply"]>((reply) => {
        addMessage({
            sender: "user",
            text: reply.text || reply.label,
            formattedText: reply.label,
        });

        setReplies([]);
    }, []);

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
    }, []);

    useEffect(() => {
        reset();
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
