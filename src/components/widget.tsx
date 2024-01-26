import { ChatBox } from "@components/chat-box";
import { StickyCta } from "@components/sticky-cta";
import { ChatBoxContextProvider } from "@context/chat-box-context";
import { ConversationContextProvider } from "@context/conversation-context";
import { NotificationContextProvider } from "@context/notification-context";
import { type FC } from "preact/compat";
import { type GrispiChatOptions } from "../types/chat-box";
import { Wrapper } from "./wrapper";

export interface WidgetProps {
    options: GrispiChatOptions;
}

export const Widget: FC<WidgetProps> = ({ options }) => {
    return (
        <NotificationContextProvider>
            <ChatBoxContextProvider options={options}>
                <ConversationContextProvider>
                    <Wrapper>
                        <ChatBox />
                        <StickyCta />
                    </Wrapper>
                </ConversationContextProvider>
            </ChatBoxContextProvider>
        </NotificationContextProvider>
    );
};
