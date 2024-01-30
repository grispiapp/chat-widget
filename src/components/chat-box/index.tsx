import { Notifications } from "@components/common/notifications";
import { useChatBox } from "@context/chat-box-context";
import { useModal } from "@context/modal-context";
import { cn } from "@lib/utils";
import { Modal } from "@ui/modal";
import { type FC } from "preact/compat";
import { ChatBoxContent } from "./content";
import { ChatBoxFooter } from "./footer";
import { ChatBoxHeader } from "./header";

interface ChatBoxProps {}

export const ChatBox: FC<ChatBoxProps> = () => {
    const { state } = useChatBox();
    const { modal } = useModal();

    if (state === "closed") {
        return null;
    }

    return (
        <div
            className={cn(
                "cb-fixed cb-inset-0 cb-z-[1000] cb-flex cb-flex-col cb-bg-muted-background cb-bg-opacity-90 cb-backdrop-blur-lg cb-backdrop-filter cb-transition-all md:cb-bottom-6 md:cb-left-[unset] md:cb-right-6 md:cb-top-[unset] md:cb-h-[35rem] md:cb-w-[25rem] md:cb-rounded-xl",
                {
                    "cb-pointer-events-none cb-translate-y-40 cb-select-none cb-opacity-0":
                        state === "closing" || state === "opening",
                    "cb-translate-y-0 cb-opacity-100": state === "open",
                }
            )}
            style={{
                boxShadow: "0 4px 30px #00000061",
            }}
        >
            <ChatBoxHeader />
            <ChatBoxContent />
            <ChatBoxFooter />
            <Notifications />
            {modal && <Modal modal={modal} />}
        </div>
    );
};
