import { UserForm } from "@components/user-form";
import ChatBoxContext from "@context/chat-box-context";
import ConversationContext from "@context/conversation-context";
import { useChatScroll } from "@hooks/useChatScroll";
import { useContext, useRef } from "preact/hooks";
import { MessageBox } from "./message-box";

export const ChatBoxContent = () => {
    const contentScrollRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const { messages } = useContext(ConversationContext);
    const { isUserFormVisible } = useContext(ChatBoxContext);

    useChatScroll({
        contentScrollRef,
        contentRef,
    });

    return (
        <div ref={contentScrollRef} className="cb-min-h-[400px] cb-flex-1 cb-overflow-auto">
            <div ref={contentRef} className="cb-space-y-3 cb-p-3">
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
