import { FileIcon } from "@components/icons";
import { type MediaMessage as MediaMessageType } from "@context/conversation-context";
import { cn, humanFileSize } from "@lib/utils";
import { type FC } from "preact/compat";

interface FileMessageProps {
    message: MediaMessageType;
}

export const FileMessage: FC<FileMessageProps> = ({ message }) => {
    return (
        <a
            href={message.media.publicUrl}
            className={cn(
                "cb-flex cb-items-center cb-justify-between cb-gap-3 cb-rounded-lg cb-bg-background cb-p-3 cb-text-muted-foreground cb-shadow-sm"
            )}
            download={true}
        >
            <div className="cb-flex cb-max-w-20 cb-flex-col cb-items-center cb-justify-center cb-space-y-1 cb-text-center cb-opacity-80">
                <FileIcon className="cb-h-6 cb-w-6" />
                <span className="cb-text-xs">{humanFileSize(message.media.size)}</span>
            </div>
            <div className="cb-max-w-36 cb-truncate">{message.media.fileName}</div>
        </a>
    );
};
