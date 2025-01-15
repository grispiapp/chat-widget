import { MessageBox } from "@components/message-box";
import { ReConnectCard } from "@components/re-connect-card";
import { SurveyForm } from "@components/survey-form";
import { UserForm } from "@components/user-form";
import { useConversation } from "@context/conversation-context";
import { useProcessSeenMessages } from "@hooks/useProcessSeenMessages";

export const ContentAuthorized = () => {
    const { messages, state: conversationState } = useConversation();

    useProcessSeenMessages();

    return (
        <>
            <div className="cb-grid cb-grid-cols-3 cb-items-start cb-gap-3">
                {messages.map(
                    (message) => message && <MessageBox key={message.id} message={message} />
                )}
            </div>
            {conversationState === "user-form" && <UserForm />}
            {conversationState === "survey-form" && <SurveyForm />}
            {conversationState === "ended" && <ReConnectCard />}
        </>
    );
};
