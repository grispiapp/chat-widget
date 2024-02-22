import { chatStatus } from "@/api/chat";
import { DEFAULT_WIDGET_OPTIONS } from "@lib/config";
import { getLastBoxStateFromStorage } from "@lib/storage";
import { mergeChatOptions } from "@lib/utils";
import { createContext } from "preact";
import { type SetStateAction } from "preact/compat";
import { useContext, useEffect, useState } from "preact/hooks";
import { type SubscribeableChatResponseForEndUser } from "../types/backend";
import {
    ChatBoxState,
    ChatBoxStatus,
    ConfigurationStatusEnum,
    GrispiChatOptions,
} from "../types/chat-box";
import { type UserInput } from "../types/user";

export const chatBoxStateMap = {
    open: "open",
    closed: "closed",
    opening: "opening",
    closing: "closing",
};

export interface ChatBoxContextType {
    state: ChatBoxState;
    status: ChatBoxStatus;
    isOnline: boolean;
    configurationStatus: ConfigurationStatusEnum;
    options: GrispiChatOptions;
    chat: SubscribeableChatResponseForEndUser & {
        subscribed: boolean;
    };
    user: UserInput;
    toggleState: () => void;
    setStatus: SetStateAction<ChatBoxContextType["status"]>;
    setConfigurationStatus: SetStateAction<ChatBoxContextType["configurationStatus"]>;
    updateOptions: (newOptions: GrispiChatOptions) => void;
    setChat: SetStateAction<ChatBoxContextType["chat"]>;
    setUser: SetStateAction<ChatBoxContextType["user"]>;
}

const ChatBoxContext = createContext<ChatBoxContextType>({
    state: "closed",
    status: "loading",
    isOnline: null,
    configurationStatus: null,
    options: null,
    chat: null,
    user: null,
    toggleState: () => {},
    setStatus: () => {},
    setConfigurationStatus: () => {},
    updateOptions: () => {},
    setChat: () => {},
    setUser: () => {},
});

export const ChatBoxContextProvider = ({ options: optionsProp, children }) => {
    const CHAT_OPTIONS = mergeChatOptions(DEFAULT_WIDGET_OPTIONS, optionsProp);

    const [isOnline, setIsOnline] = useState<boolean>(null);
    const [configurationStatus, setConfigurationStatus] = useState<
        ChatBoxContextType["configurationStatus"]
    >(ConfigurationStatusEnum.AUTHORIZED);
    const [state, setState] = useState<ChatBoxContextType["state"]>(getLastBoxStateFromStorage());
    const [status, setStatus] = useState<ChatBoxContextType["status"]>("loading");
    const [options, setOptions] = useState<ChatBoxContextType["options"]>(CHAT_OPTIONS);
    const [chat, setChat] = useState<ChatBoxContextType["chat"]>(null);
    const [user, setUser] = useState<ChatBoxContextType["user"]>({
        id: -1,
        fullName: "",
        email: "",
    });

    useEffect(() => {
        if (options.always_online) {
            setIsOnline(true);
            return;
        }

        const checkChatIsOnline = async () => {
            const isOnline = await chatStatus();
            setIsOnline(isOnline);
        };

        checkChatIsOnline();
    }, [options.always_online]);

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
        setOptions((prevState) => mergeChatOptions(prevState, newOptions));
    };

    return (
        <ChatBoxContext.Provider
            value={{
                state,
                status,
                isOnline,
                configurationStatus,
                options,
                chat,
                user,
                updateOptions,
                toggleState,
                setStatus,
                setConfigurationStatus,
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
