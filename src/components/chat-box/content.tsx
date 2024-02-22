import { ConfigurationStatusEnum } from "@/types/chat-box";
import { useChatBox } from "@context/chat-box-context";
import { useConversation } from "@context/conversation-context";
import { useChatScroll } from "@hooks/useChatScroll";
import { LoadingSpinner } from "@ui/loading-spinner";
import { useRef } from "preact/hooks";
import { ContentAuthorized } from "./content-authorized";
import { ContentCommonError } from "./content-common-error";
import { ContentForbidden } from "./content-forbidden";

export const ChatBoxContent = () => {
    const contentScrollRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const { messages, state: conversationState } = useConversation();
    const { status: boxStatus, configurationStatus } = useChatBox();

    useChatScroll(
        {
            contentScrollRef,
            contentRef,
        },
        [messages.length, conversationState]
    );

    return (
        <div ref={contentScrollRef} className="cb-relative cb-flex-1 cb-overflow-auto">
            <div ref={contentRef} className="cb-space-y-3 cb-p-3">
                {configurationStatus === ConfigurationStatusEnum.AUTHORIZED ? (
                    <ContentAuthorized />
                ) : configurationStatus === ConfigurationStatusEnum.FORBIDDEN ? (
                    <ContentForbidden />
                ) : (
                    <ContentCommonError />
                )}
            </div>
            {boxStatus === "loading" && <LoadingSpinner />}
        </div>
    );
};
