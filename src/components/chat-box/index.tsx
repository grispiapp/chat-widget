import ChatBoxContext from "@context/chat-box-context";
import { cn } from "@lib/utils";
import { useContext, type FC } from "preact/compat";
import { ChatBoxContent } from "./content";
import { ChatBoxFooter } from "./footer";
import { ChatBoxHeader } from "./header";

interface ChatBoxProps {}

export const ChatBox: FC<ChatBoxProps> = () => {
  const { state } = useContext(ChatBoxContext);

  if (state === "closed") {
    return null;
  }

  return (
    <div
      className={cn(
        "md:cb-h-[35rem] md:cb-max-w-[25rem] cb-flex cb-flex-col cb-fixed cb-inset-0 md:cb-left-[unset] md:cb-right-6 md:cb-bottom-6 md:cb-top-[unset] cb-z-[1000] cb-bg-gray-100 cb-bg-opacity-90 cb-backdrop-filter cb-backdrop-blur-lg md:cb-rounded-xl cb-transition-all",
        {
          "cb-opacity-0 cb-translate-y-40 cb-pointer-events-none cb-select-none":
            state === "closing" || state === "opening",
          "cb-opacity-100 cb-translate-y-0": state === "open",
        },
      )}
      style={{
        boxShadow: "0 4px 30px #00000061",
      }}
    >
      <ChatBoxHeader />
      <ChatBoxContent />
      <ChatBoxFooter />
    </div>
  );
};
