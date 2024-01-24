import { createContext } from "preact";
import { useState } from "preact/hooks";
import { type GrispiChatOptions } from "../types/chat";
import { deepMerge, mergeChatOptions } from "@lib/utils";
import { DEFAULT_WIDGET_OPTIONS } from "@lib/config";

type ChatBoxState = "open" | "closed" | "opening" | "closing";

interface ChatBoxContextType {
  state: ChatBoxState;
  options: GrispiChatOptions;
  toggleState: () => void;
  updateOptions: (newOptions: GrispiChatOptions) => void;
}

const ChatBoxContext = createContext<ChatBoxContextType>({
  state: "closed",
  options: null,
  toggleState: () => {},
  updateOptions: () => {},
});

export const ChatBoxContextProvider = ({ options, children }) => {
  const [state, setState] = useState<ChatBoxState>("closed");
  const [optionsState, setOptionsState] = useState<GrispiChatOptions>(
    mergeChatOptions(DEFAULT_WIDGET_OPTIONS, options)
  );

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
      value={{ state, options: optionsState, updateOptions, toggleState }}
    >
      {children}
    </ChatBoxContext.Provider>
  );
};

export default ChatBoxContext;
