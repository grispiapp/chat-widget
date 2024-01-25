import { AgentAvatar } from "@components/common/agent-avatar";
import { type Sender } from "@context/conversation-context";
import { cn } from "@lib/utils";
import { type FC } from "preact/compat";
import type { JSX } from "preact/jsx-runtime";

interface MessageBoxProps extends JSX.HTMLAttributes<HTMLDivElement> {
    sender: Sender;
    text: string;
    createdAt: string;
}

export const MessageBox: FC<MessageBoxProps> = ({ sender, text, createdAt }) => {
    return (
        <>
            {/* This is a hack to make the grid work properly */}
            {sender === "user" && <div />}
            <div
                className={cn("cb-col-span-2 cb-flex cb-items-start", {
                    "cb-justify-end": sender === "user",
                })}
            >
                {sender === "ai" && (
                    <AgentAvatar className={"cb-z-50 -cb-me-2 cb-mt-1 cb-border-2 cb-border-background cb-shadow-sm"} />
                )}
                <div
                    className={cn(
                        "cb-space-y-2 cb-rounded-bl-xl cb-rounded-br cb-rounded-tl cb-rounded-tr-xl cb-p-3 cb-text-sm cb-shadow-sm",
                        {
                            "cb-bg-background": sender === "ai",
                            "cb-bg-primary": sender === "user",
                        }
                    )}
                >
                    <div
                        className={cn("cb-prose cb-prose-sm prose-p:cb-leading-snug", {
                            "cb-text-foreground": sender === "ai",
                            "cb-text-background": sender === "user",
                        })}
                        dangerouslySetInnerHTML={{ __html: text }}
                    />
                    {/* <div
            className={cn("cb-flex cb-items-center cb-gap-1 cb-text-xs", {
              "cb-text-gray-500": sender === "ai",
              "cb-text-gray-100": sender === "user",
            })}
          >
            <span>{new Date(createdAt).toLocaleDateString()}</span>
            <span>{new Date(createdAt).toLocaleTimeString()}</span>
          </div> */}
                </div>
            </div>
            {/* This is a hack to make the grid work properly */}
            {sender === "ai" && <div />}
        </>
    );
};
