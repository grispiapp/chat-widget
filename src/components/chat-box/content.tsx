import { SurveyForm } from "@components/survey-form";
import { UserForm } from "@components/user-form";
import { useChatBox } from "@context/chat-box-context";
import { useConversation } from "@context/conversation-context";
import { useChatScroll } from "@hooks/useChatScroll";
import { LoadingSpinner } from "@ui/loading-spinner";
import { useRef } from "preact/hooks";
import { MessageBox } from "../message-box";

export const ChatBoxContent = () => {
    const contentScrollRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const { messages, state: conversationState } = useConversation();
    const { status: boxStatus } = useChatBox();

    useChatScroll(
        {
            contentScrollRef,
            contentRef,
        },
        [messages.length, conversationState]
    );

    return (
        <div
            ref={contentScrollRef}
            className="cb-relative cb-min-h-[400px] cb-flex-1 cb-overflow-auto"
        >
            <div ref={contentRef} className="cb-space-y-3 cb-p-3">
                <div className="cb-grid cb-grid-cols-3 cb-items-start cb-gap-3">
                    {messages.map((message) => (
                        <MessageBox key={message.id} message={message} />
                    ))}
                </div>
                {conversationState === "user-form" && <UserForm />}
                {conversationState === "survey-form" && <SurveyForm />}
            </div>
            {boxStatus === "loading" && <LoadingSpinner />}
        </div>
    );
};
