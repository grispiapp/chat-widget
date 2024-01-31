import { cn } from "@lib/utils";
import { type FC, type HTMLAttributes } from "preact/compat";

interface MessageBoxCardProps extends HTMLAttributes<HTMLDivElement> {
    color: "light" | "primary";
}

export const MessageBoxCard: FC<MessageBoxCardProps> = ({ color, children }) => {
    return (
        <div
            className={cn(
                "cb-space-y-2 cb-rounded-bl-xl cb-rounded-br cb-rounded-tl cb-rounded-tr-xl cb-p-3 cb-text-sm cb-shadow-sm",
                {
                    "cb-bg-background/50": color === "light",
                    "cb-bg-primary": color === "primary",
                }
            )}
        >
            {children}
        </div>
    );
};
