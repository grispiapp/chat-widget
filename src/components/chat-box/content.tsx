import { useContext, useLayoutEffect, useRef } from "preact/hooks";
import { MessageBox } from "./message-box";
import ConversationContext from "@context/conversation-context";
import ChatBoxContext from "@context/chat-box-context";
import { useChatScroll } from "@hooks/useChatScroll";
import { UserForm } from "@components/user-form";

export const ChatBoxContent = () => {
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { messages } = useContext(ConversationContext);
  const { isUserFormVisible } = useContext(ChatBoxContext);

  useChatScroll(
    {
      contentScrollRef,
      contentRef,
    },
    [messages.length]
  );

  return (
    <div
      ref={contentScrollRef}
      className="cb-min-h-[400px] cb-flex-1 cb-overflow-auto"
    >
      <div ref={contentRef} className="cb-p-3 cb-space-y-3">
        <div className="cb-grid cb-grid-cols-3 cb-items-start cb-gap-3">
          {messages.map((message) => (
            <MessageBox
              key={message.id}
              sender={message.sender}
              text={message.formattedText}
              createdAt={message.createdAt}
            />
          ))}
        </div>
        {isUserFormVisible && <UserForm />}
      </div>
    </div>
  );
};
