import { createContext } from "preact";
import { useEffect, useState } from "preact/hooks";
import { type GrispiChatOptions } from "../types/chat-box";
import { deepMerge, mergeChatOptions } from "@lib/utils";
import { DEFAULT_WIDGET_OPTIONS, InternalEventTypeMap } from "@lib/config";
import { SubscribeableChatResponseForEndUser } from "../types/backend";
import { UserInput } from "../types/user";
import { SetStateAction } from "preact/compat";

type ChatBoxState = "open" | "closed" | "opening" | "closing";

export interface ChatBoxContextType {
  state: ChatBoxState;
  options: GrispiChatOptions;
  chat: SubscribeableChatResponseForEndUser & {
    subscribed: boolean;
  };
  user: UserInput;
  isUserFormVisible: boolean;
  toggleState: () => void;
  updateOptions: (newOptions: GrispiChatOptions) => void;
  setChat: SetStateAction<ChatBoxContextType["chat"]>;
  setUser: SetStateAction<ChatBoxContextType["user"]>;
  setUserFormVisibility: SetStateAction<
    ChatBoxContextType["isUserFormVisible"]
  >;
}

const ChatBoxContext = createContext<ChatBoxContextType>({
  state: "closed",
  options: null,
  chat: null,
  user: null,
  isUserFormVisible: false,
  toggleState: () => {},
  updateOptions: () => {},
  setChat: () => {},
  setUser: () => {},
  setUserFormVisibility: () => {},
});

export const ChatBoxContextProvider = ({ options, children }) => {
  const [state, setState] = useState<ChatBoxContextType["state"]>("closed");
  const [optionsState, setOptionsState] = useState<GrispiChatOptions>(
    mergeChatOptions(DEFAULT_WIDGET_OPTIONS, options)
  );
  const [chat, setChat] = useState<ChatBoxContextType["chat"]>(null);
  const [user, setUser] = useState<ChatBoxContextType["user"]>({
    fullName: "",
    email: "",
  });
  const [isUserFormVisible, setUserFormVisibility] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener("message", (event) => {
      const { auth, data, type } = event.data;

      if (type) {
        console.log({ type });
      }
    });
  }, []);

  const toggleState = () => {
    if (state === "open") {
      setState("closing");
      setTimeout(() => {
        setState("closed");
      }, 100);
    } else {
      setState("opening");
      setTimeout(() => {
        setState("open");
      }, 100);
    }
  };

  const updateOptions = (newOptions: GrispiChatOptions) => {
    setOptionsState((prevState) => deepMerge(prevState, newOptions));
  };

  return (
    <ChatBoxContext.Provider
      value={{
        state,
        options: optionsState,
        chat,
        user,
        isUserFormVisible,
        updateOptions,
        toggleState,
        setChat,
        setUser,
        setUserFormVisibility,
      }}
    >
      {children}
    </ChatBoxContext.Provider>
  );
};

export default ChatBoxContext;
