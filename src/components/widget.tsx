import { ChatBox } from "@components/chat-box";
import { StickyCta } from "@components/sticky-cta";
import { ChatBoxContextProvider } from "@context/chat-box-context";
import { ConversationContextProvider } from "@context/conversation-context";
import { LocalizationContextProvider } from "@context/localization-context";
import { ModalContextProvider } from "@context/modal-context";
import { NotificationContextProvider } from "@context/notification-context";
import { VisitorIdle } from "@lib/visitor-idle";
import { type FC } from "preact/compat";
import { type GrispiChatOptions } from "../types/chat-box";
import { Wrapper } from "./wrapper";

VisitorIdle.start();

export interface WidgetProps {
    options: GrispiChatOptions;
}

export const Widget: FC<WidgetProps> = ({ options }) => {
    return (
        <LocalizationContextProvider>
            <NotificationContextProvider>
                <ModalContextProvider>
                    <ChatBoxContextProvider options={options}>
                        <ConversationContextProvider>
                            <Wrapper>
                                <ChatBox />
                                <StickyCta />
                            </Wrapper>
                        </ConversationContextProvider>
                    </ChatBoxContextProvider>
                </ModalContextProvider>
            </NotificationContextProvider>
        </LocalizationContextProvider>
    );
};
