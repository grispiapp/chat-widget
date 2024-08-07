import { ConfigurationStatusEnum } from "@/types/chat-box";
import { useChatBox } from "@context/chat-box-context";
import { useTranslation } from "@hooks/useTranslation";
import { isPromptDismissed, storeValue } from "@lib/storage";
import { cn } from "@lib/utils";
import ChatLauncherPreviewImage from "@resources/images/chat-launcher-preview.png";
import { Button } from "@ui/button";
import { useState, type FC } from "preact/compat";
import { AnimatedGrispiIcon, CloseIcon, ErrorOutlineIcon } from "./icons";

interface StickyCtaProps {}

export const StickyCta: FC<StickyCtaProps> = () => {
    const { t } = useTranslation();
    const { state, toggleState, isOnline, configurationStatus } = useChatBox();
    const [displayPrompt, setDisplayPrompt] = useState<boolean>(!isPromptDismissed());

    const handleCloseWelcomeMessage = (e: MouseEvent) => {
        e.stopPropagation();
        setDisplayPrompt(false);
        storeValue("DISMISS_PROMPT", "1");
    };

    const isAuthorized = configurationStatus === ConfigurationStatusEnum.AUTHORIZED;

    if (state === "open") {
        return null;
    }

    return (
        <button
            onClick={toggleState}
            className={cn(
                "cb-group cb-fixed cb-bottom-6 cb-right-6 cb-z-[1000] cb-flex cb-items-end cb-gap-4 cb-text-start cb-transition-opacity",
                {
                    "cb-opacity-100": state === "closed",
                    "cb-pointer-events-none cb-select-none cb-opacity-0":
                        state === "opening" || state === "closing",
                }
            )}
        >
            {displayPrompt && isAuthorized && (
                <div
                    style={{ "--chat-launcher-preview": `url(${ChatLauncherPreviewImage})` }}
                    className="cb-message-box cb-relative cb-mb-2 cb-max-w-64 cb-rounded-xl cb-bg-white cb-p-3 cb-text-sm cb-text-gray-700 cb-shadow md:cb-max-w-80"
                >
                    {t("popup_message")}
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
                <AnimatedGrispiIcon className="cb-h-7 cb-w-7 cb-text-background" />
            </div>
            {isOnline && isAuthorized && (
                <div className="cb-absolute cb-right-0 cb-top-0">
                    <div className="cb-absolute cb-right-0 cb-top-0 cb-z-20 cb-h-3 cb-w-3 cb-animate-ping cb-rounded-full cb-bg-success" />
                    <div className="cb-absolute cb-right-0 cb-top-0 cb-z-10 cb-h-3 cb-w-3 cb-rounded-full cb-bg-success" />
                </div>
            )}
            {!isAuthorized && (
                <div className="cb-absolute cb-left-0 cb-top-0 cb-flex cb-h-6 cb-min-w-6 -cb-translate-x-1/2 cb-items-center cb-justify-center cb-rounded-full cb-bg-danger">
                    <ErrorOutlineIcon className="cb-h-6 cb-w-6 cb-text-background" />
                    {/* <span className="cb-px-1 cb-text-sm cb-text-background">256</span> */}
                </div>
            )}
        </button>
    );
};
