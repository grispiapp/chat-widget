import { useContext, useLayoutEffect, useRef } from "preact/hooks";
import { MessageBox } from "./message-box";
import ConversationContext from "@context/conversation-context";

export const ChatBoxContent = () => {
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { messages } = useContext(ConversationContext);

  useLayoutEffect(() => {
    const rect = contentRef.current?.getBoundingClientRect();
    if (!rect) return;

    const { height } = rect;

    contentScrollRef.current?.scrollTo({
      top: height,
      behavior: "smooth",
    });
  }, [messages.length]);

  return (
    <div
      ref={contentScrollRef}
      className="cb-min-h-[400px] cb-flex-1 cb-overflow-auto"
    >
      <div
        ref={contentRef}
        className="cb-grid cb-grid-cols-3 cb-items-start cb-gap-3 cb-p-3"
      >
        {messages.map((message) => (
          <MessageBox
            key={message.id}
            sender={message.sender}
            text={message.formattedText}
            createdAt={message.createdAt}
          />
        ))}
      </div>
    </div>
  );
};
