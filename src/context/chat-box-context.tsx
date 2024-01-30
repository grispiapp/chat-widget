import { DEFAULT_WIDGET_OPTIONS } from "@lib/config";
import { getLastBoxStateFromStorage } from "@lib/storage";
import { deepMerge, mergeChatOptions } from "@lib/utils";
import { createContext } from "preact";
import { type SetStateAction } from "preact/compat";
import { useContext, useState } from "preact/hooks";
import { type SubscribeableChatResponseForEndUser } from "../types/backend";
import { type GrispiChatOptions } from "../types/chat-box";
import { type UserInput } from "../types/user";

export const chatBoxStateMap = {
    open: "open",
    closed: "closed",
    opening: "opening",
    closing: "closing",
};

export type ChatBoxState = keyof typeof chatBoxStateMap;
type ChatBoxStatus = "idle" | "loading";

export interface ChatBoxContextType {
    state: ChatBoxState;
    status: ChatBoxStatus;
    options: GrispiChatOptions;
    chat: SubscribeableChatResponseForEndUser & {
        subscribed: boolean;
    };
    user: UserInput;
    toggleState: () => void;
    setStatus: SetStateAction<ChatBoxContextType["status"]>;
    updateOptions: (newOptions: GrispiChatOptions) => void;
    setChat: SetStateAction<ChatBoxContextType["chat"]>;
    setUser: SetStateAction<ChatBoxContextType["user"]>;
}

const ChatBoxContext = createContext<ChatBoxContextType>({
    state: "closed",
    status: "loading",
    options: null,
    chat: null,
    user: null,
    toggleState: () => {},
    setStatus: () => {},
    updateOptions: () => {},
    setChat: () => {},
    setUser: () => {},
});

export const ChatBoxContextProvider = ({ options: optionsProp, children }) => {
    const CHAT_OPTIONS = mergeChatOptions(DEFAULT_WIDGET_OPTIONS, optionsProp);

    const [state, setState] = useState<ChatBoxContextType["state"]>(getLastBoxStateFromStorage());
    const [status, setStatus] = useState<ChatBoxContextType["status"]>("loading");
    const [options, setOptions] = useState<GrispiChatOptions>(CHAT_OPTIONS);
    const [chat, setChat] = useState<ChatBoxContextType["chat"]>(null);
    const [user, setUser] = useState<ChatBoxContextType["user"]>({
        fullName: "",
        email: "",
    });

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
        setOptions((prevState) => deepMerge(prevState, newOptions));
    };

    return (
        <ChatBoxContext.Provider
            value={{
                state,
                status,
                options,
                chat,
                user,
                updateOptions,
                toggleState,
                setStatus,
                setChat,
                setUser,
            }}
        >
            {children}
        </ChatBoxContext.Provider>
    );
};

export const useChatBox = () => {
    return useContext(ChatBoxContext);
};

export default ChatBoxContext;
