import { Typing } from "@components/common/typing";
import { FileUpload } from "@components/file-upload";
import { SendIcon } from "@components/icons";
import { PoweredBy } from "@components/powered-by";
import { useChatBox } from "@context/chat-box-context";
import { useConversation } from "@context/conversation-context";
import { useTranslation } from "@hooks/useTranslation";
import { cn } from "@lib/utils";
import { VisitorIdle } from "@lib/visitor-idle";
import { CURRENT_USER_TEMP_MESSAGE_ID } from "@lib/websocket";
import { Button } from "@ui/button";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { type JSX } from "preact/jsx-runtime";

export const ChatBoxFooter = () => {
    const { t } = useTranslation();
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = useState<string>("");
    const { options, state: boxState, status: boxStatus } = useChatBox();
    const { state: conversationState, addMessage, replies, selectReply } = useConversation();

    const isInputDisabled =
        ["survey-form", "user-form"].includes(conversationState) || boxStatus === "loading";

    useEffect(() => {
        if (boxState === "open" && conversationState === "idle" && !isInputDisabled) {
            inputRef.current?.focus();
        }
    }, [boxState, conversationState, isInputDisabled]);

    const handleSubmit = useCallback(
        async (e: JSX.TargetedSubmitEvent<HTMLFormElement> | KeyboardEvent, value: string) => {
            e.preventDefault();

            if (isInputDisabled || !value?.trim()) {
                inputRef.current?.focus();
                return;
            }

            setValue("");

            try {
                await addMessage({
                    id: CURRENT_USER_TEMP_MESSAGE_ID,
                    text: value,
                    sender: "user",
                });

                inputRef.current?.focus();
            } catch (_) {
                setValue(value);
            }
        },
        [isInputDisabled, addMessage]
    );

    useEffect(() => {
        const onKeydown = (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();

                handleSubmit(e, inputRef.current?.value);
            }
        };

        inputRef.current?.addEventListener("keydown", onKeydown);
        const inputEl = inputRef.current;

        return () => {
            inputEl?.removeEventListener("keydown", onKeydown);
        };
    }, [handleSubmit]);

    const rows = value.split("\n").length;

    return (
        <div className="cb-relative">
            {(conversationState === "typing" || replies.length > 0 || true) && (
                <div className="cb-absolute cb-bottom-0 cb-left-0 cb-right-0 cb-z-50">
                    {conversationState === "typing" ? (
                        <div className="cb-px-3">
                            <Typing />
                        </div>
                    ) : (
                        <div className="cb-relative cb-flex">
                            {/* <div className="cb-absolute cb-left-0 cb-top-0 cb-bottom-0 cb-w-12 cb-bg-gradient-to-r cb-from-gray-200/90 cb-to-transparent cb-pointer-events-none cb-select-none"></div> */}
                            <div className="cb-flex cb-flex-wrap cb-items-center cb-gap-2 cb-px-3">
                                {replies.map((reply) => (
                                    <Button
                                        onClick={() => selectReply(reply)}
                                        variant="suggest"
                                        size="sm"
                                        rounded="full"
                                        key={reply.label}
                                    >
                                        {reply.label}
                                    </Button>
                                ))}
                            </div>
                            {/* <div className="cb-absolute cb-right-0 cb-top-0 cb-bottom-0 cb-w-12 cb-bg-gradient-to-l cb-from-gray-200/90 cb-to-transparent cb-pointer-events-none cb-select-none"></div> */}
                        </div>
                    )}
                </div>
            )}
            <div className="cb-rounded-b-xl cb-bg-background/50 cb-backdrop-blur-lg">
                <form
                    onSubmit={(e) => handleSubmit(e, value)}
                    className={cn("cb-flex cb-gap-3 cb-p-3", {
                        "cb-items-end": rows > 1,
                        "cb-items-center": rows === 1,
                    })}
                >
                    <FileUpload disabled={isInputDisabled} />
                    <textarea
                        ref={inputRef}
                        type="text"
                        placeholder={t("footer.input.placeholder")}
                        className="cb-max-h-20 cb-w-full cb-resize-none cb-rounded-2xl cb-border cb-bg-white cb-p-3 cb-text-sm focus:cb-outline-none disabled:cb-opacity-75"
                        rows={rows}
                        disabled={isInputDisabled}
                        value={value}
                        onChange={(e) => setValue(e.currentTarget.value)}
                        onFocus={VisitorIdle.callback}
                    />
                    <div className="cb-flex cb-items-center cb-justify-center">
                        <Button size="sm" icon={SendIcon} disabled={isInputDisabled} />
                    </div>
                </form>
                {options.poweredBy && (
                    <div className="-cb-mt-1">
                        <PoweredBy />
                    </div>
                )}
            </div>
        </div>
    );
};
