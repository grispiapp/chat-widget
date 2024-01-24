import { ChatBoxContextProvider } from "@context/chat-box-context";
import { ChatBox } from "@components/chat-box";
import { StickyCta } from "@components/sticky-cta";
import { ConversationContextProvider } from "@context/conversation-context";
import { type FC } from "preact/compat";
import { type GrispiChatOptions } from "../types/chat";
import { Wrapper } from "./wrapper";

export interface WidgetProps {
  options: GrispiChatOptions;
}

export const Widget: FC<WidgetProps> = ({ options }) => {
  return (
    <ChatBoxContextProvider options={options}>
      <ConversationContextProvider>
        <Wrapper>
          <ChatBox />
          <StickyCta />
        </Wrapper>
      </ConversationContextProvider>
    </ChatBoxContextProvider>
  );
};