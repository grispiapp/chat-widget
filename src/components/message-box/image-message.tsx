import { type MediaMessage as MediaMessageType } from "@context/conversation-context";
import { cn } from "@lib/utils";
import { type FC } from "preact/compat";

interface ImageMessageProps {
    message: MediaMessageType;
}

export const ImageMessage: FC<ImageMessageProps> = ({ message }) => {
    return (
        <img
            width={100}
            height={100}
            className={cn(
                "cb-h-36 cb-w-36 cb-rounded-lg cb-bg-background cb-object-contain cb-shadow-sm"
            )}
            src={message.media.publicUrl}
        />
    );
};
