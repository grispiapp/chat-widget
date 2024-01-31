import { type TextMessage as TextMessageType } from "@context/conversation-context";
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
                dangerouslySetInnerHTML={{ __html: message.formattedText }}
            />
        </MessageBoxCard>
    );
};
