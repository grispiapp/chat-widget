import ChatBoxContext from "@context/chat-box-context";
import { useContext } from "preact/hooks";

export const Wrapper = ({ children }) => {
    const { options } = useContext(ChatBoxContext);

    return <div style={{ "--color-primary": options.colors.primary }}>{children}</div>;
};
