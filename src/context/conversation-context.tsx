import { createContext } from "preact";
import {
  type StateUpdater,
  useState,
  useCallback,
  useEffect,
  useContext,
} from "preact/hooks";
import showdown from "showdown";
import ChatBoxContext from "./chat-box-context";

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
}

export interface AddMessage
  extends Omit<Message, "id" | "formattedText" | "createdAt"> {
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
  addMessage: (
    message: AddMessage,
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

export const ConversationContextProvider = ({ children }) => {
  const { options } = useContext(ChatBoxContext);
  const [state, setState] = useState<ConversationState>("idle");
  const [conversation, setConversation] = useState<Conversation>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);

  const converter = new showdown.Converter();

  const addMessage = useCallback<ConversationContextType["addMessage"]>(
    async (message, withPrevious = true) => {
      try {
        if (!message.id) {
          message.id = Math.random().toString() + Date.now().toString();
        }

        if (!message.createdAt) {
          message.createdAt = new Date().toISOString();
        }

        if (!message.formattedText) {
          message.formattedText = message.text;
        }

        message.formattedText = converter.makeHtml(message.formattedText);

        setMessages((prev) =>
          withPrevious ? [...prev, message as Message] : [message as Message]
        );

        if (message.sender === "user") {
          setState("typing");

          // const response = await createMessage(message, conversation);

          const response = {
            run_id: message.createdAt,
            thread_id: "1",
            output: "Ne dedin?",
          };

          // addMessage({
          //   sender: "ai",
          //   id: response.run_id,
          //   text: response.output,
          // });

          if (conversation === undefined) {
            setConversation({
              id: response.thread_id,
            });
          }

          setState("idle");
          setReplies([]);
        }

        return message as Message;
      } catch (err) {
        alert("Bir sorun oluştu.");
        setState("idle");

        throw err;
      }
    },
    [conversation]
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
    []
  );

  const reset = useCallback(() => {
    setState("idle");
    setConversation(undefined);

    addMessage(
      {
        id: "starter",
        sender: "ai",
        text: options.welcome_message,
      },
      false
    );

    addMessage({
      id: "starter-2",
      sender: "user",
      text: "Düğün yapmak istiyorum.",
    });

    addMessage({
      id: "starter-3",
      sender: "ai",
      text: "Düğün yapmak istiyorsunuz. Peki kaç kişi olacak?",
    });

    addMessage({
      id: "starter-4",
      sender: "user",
      text: "100 kişi.",
    });

    setReplies([
      { label: "Düğün yapmak istiyorum." },
      { label: "Nişan yapmak istiyorum." },
      { label: "Kına gecesi yapmak istiyorum." },
    ]);
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

export default ConversationContext;
