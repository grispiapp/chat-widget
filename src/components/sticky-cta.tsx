import { useChatBox } from "@context/chat-box-context";
import { isPromptDismissed, STORAGE_KEYS } from "@lib/storage";
import { cn } from "@lib/utils";
import { Button } from "@ui/button";
import { useState, type FC } from "preact/compat";
import { CloseIcon, GrispiIcon } from "./icons";

interface StickyCtaProps {}

export const StickyCta: FC<StickyCtaProps> = () => {
    const { state, toggleState, options, isOnline } = useChatBox();
    const [displayPrompt, setDisplayPrompt] = useState<boolean>(!isPromptDismissed());

    const handleCloseWelcomeMessage = (e: MouseEvent) => {
        e.stopPropagation();
        setDisplayPrompt(false);
        localStorage.setItem(STORAGE_KEYS.DISMISS_PROMPT, "1");
    };

    if (state === "open") {
        return null;
    }

    return (
        <button
            onClick={toggleState}
            className={cn(
                "cb-fixed cb-bottom-6 cb-right-6 cb-z-[1000] cb-flex cb-items-end cb-gap-4 cb-text-start cb-transition-opacity",
                {
                    "cb-opacity-100": state === "closed",
                    "cb-pointer-events-none cb-select-none cb-opacity-0":
                        state === "opening" || state === "closing",
                }
            )}
        >
            {displayPrompt && (
                <div className="cb-message-box cb-relative cb-mb-2 cb-max-w-64 cb-rounded-xl cb-bg-white cb-p-3 cb-text-sm cb-text-gray-700 cb-shadow md:cb-max-w-80">
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
            <div className="cb-flex cb-h-14 cb-w-14 cb-shrink-0 cb-items-center cb-justify-center cb-rounded-full cb-bg-primary cb-shadow-xl">
                {/* <ChatSmileFillIcon className="cb-h-7 cb-w-7 cb-text-background" /> */}
                <GrispiIcon className="cb-h-7 cb-w-7 cb-text-background" />
            </div>
            {isOnline && (
                <div className="cb-absolute cb-right-0 cb-top-0 cb-h-3 cb-w-3 cb-animate-pulse cb-rounded-full cb-bg-success" />
            )}
        </button>
    );
};
