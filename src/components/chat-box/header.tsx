import { AccountLogo } from "@components/common/account-logo";
import { CloseIcon, MinimizeIcon } from "@components/icons";
import { useChatBox } from "@context/chat-box-context";
import { useConversation } from "@context/conversation-context";
import { useModal } from "@context/modal-context";
import { useTranslation } from "@hooks/useTranslation";
import { endChatSession } from "@lib/websocket";
import { Button } from "@ui/button";
import { useCallback } from "preact/hooks";

export const ChatBoxHeader = () => {
    const { t } = useTranslation();
    const { chat, options, toggleState } = useChatBox();
    const { state: conversationState, setState: setConversationState } = useConversation();
    const { setModal } = useModal();

    const handleClose = useCallback(() => {
        if (chat?.subscribed !== true || conversationState === "survey-form") {
            toggleState();
            return;
        }

        setModal({
            title: t("endSessionModal.title"),
            content: t("endSessionModal.text"),
            type: "confirm",
            confirmFn: () => {
                // terminate websocket
                endChatSession(chat);

                setModal(null);
                setConversationState("survey-form");
            },
        });
    }, [chat, conversationState, t, setModal, toggleState, setConversationState]);

    return (
        <div className="cb-flex cb-items-center cb-justify-between cb-border-b cb-border-opacity-25 cb-px-3 cb-py-2">
            <div className="cb-flex cb-items-center cb-gap-2">
                <AccountLogo />
                <span className="cb-text-sm cb-font-bold">{options.account.title}</span>
            </div>
            <div className="cb-flex cb-items-center cb-text-zinc-600">
                <Button onClick={toggleState} variant="link" icon={MinimizeIcon} />
                <Button onClick={handleClose} variant="link" icon={CloseIcon} />
            </div>
        </div>
    );
};
