import { type TextMessage as TextMessageType } from "@context/conversation-context";
import { sanitizeHtml } from "@lib/sanitized-html";
import { cn } from "@lib/utils";
import { type FC } from "preact/compat";
import { MessageBoxCard } from "./message-box-card";

interface TextMessageProps {
    message: TextMessageType;
}

export const TextMessage: FC<TextMessageProps> = ({ message }) => {
    return (
        <MessageBoxCard color={message.sender === "ai" ? "light" : "primary"}>
            <div
                className={cn("cb-prose cb-prose-sm prose-p:cb-leading-snug", {
                    "cb-text-foreground": message.sender === "ai",
                    "cb-text-background": message.sender === "user",
                })}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(message.formattedText) }}
            />
        </MessageBoxCard>
    );
};
