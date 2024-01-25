import ChatBoxContext from "@context/chat-box-context";
import { cn } from "@lib/utils";
import { Button } from "@ui/button";
import { FC, useContext, useState } from "preact/compat";
import { AgentAvatar } from "./common/agent-avatar";
import { CloseIcon } from "./icons";

interface StickyCtaProps {}

export const StickyCta: FC<StickyCtaProps> = () => {
  const { state, toggleState, options } = useContext(ChatBoxContext);
  const [displayWelcomeMessage, setDisplayWelcomeMessage] =
    useState<boolean>(true);

  const handleCloseWelcomeMessage = (e: MouseEvent) => {
    e.stopPropagation();
    setDisplayWelcomeMessage(false);
  };

  if (state === "open") {
    return null;
  }

  return (
    <button
      onClick={toggleState}
      className={cn(
        "cb-fixed cb-right-6 cb-bottom-6 cb-z-[1000] cb-flex cb-items-end cb-gap-4 cb-text-start cb-transition-opacity",
        {
          "cb-opacity-100": state === "closed",
          "cb-opacity-0 cb-pointer-events-none cb-select-none":
            state === "opening" || state === "closing",
        },
      )}
    >
      {displayWelcomeMessage && (
        <div className="cb-message-box cb-max-w-64 md:cb-max-w-80 cb-bg-white cb-shadow cb-p-3 cb-rounded-xl cb-relative cb-mb-2 cb-text-sm cb-text-gray-700">
          {options.popup_message}
          <Button
            onClick={handleCloseWelcomeMessage}
            variant="secondary"
            icon={CloseIcon}
            size="sm"
            className="cb-absolute cb-right-0 cb-top-0 -cb-translate-y-1/2 cb-translate-x-1/2 cb-shadow"
          />
        </div>
      )}
      <div className="cb-shrink-0 cb-flex cb-items-center cb-justify-center cb-w-14 cb-h-14 cb-rounded-full cb-border-2 cb-border-primary">
        <AgentAvatar className="cb-w-auto cb-h-auto" />
      </div>
    </button>
  );
};
