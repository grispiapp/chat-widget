import { isMediaAudio, isMediaFile, isMediaImage, isMediaVideo } from "@/types/file";
import { AgentAvatar } from "@components/common/agent-avatar";
import { CheckAllIcon, CheckIcon, HourglassBottomIcon } from "@components/icons";
import { isMediaMessage, isTextMessage, type Message } from "@context/conversation-context";
import { cn, getLocalizedTime } from "@lib/utils";
import { type FC } from "preact/compat";
import type { JSX } from "preact/jsx-runtime";
import { AudioMessage } from "./audio-message";
import { FileMessage } from "./file-message";
import { ImageMessage } from "./image-message";
import { TextMessage } from "./text-message";
import { VideoMessage } from "./video-message";

interface MessageBoxProps extends JSX.HTMLAttributes<HTMLDivElement> {
    message: Message;
}

export const MessageBox: FC<MessageBoxProps> = ({ message }) => {
    return (
        <>
            {/* This is a hack to make the grid work properly */}
            {message.sender === "user" && <div />}
            <div
                className={cn("cb-col-span-2 cb-flex cb-items-start", {
                    "cb-justify-end": message.sender === "user",
                })}
            >
                {message.sender === "ai" && (
                    <AgentAvatar
                        className={
                            "cb-z-10 -cb-me-2 cb-mt-1 cb-border-2 cb-border-background cb-shadow-sm"
                        }
                    />
                )}
                <div className="cb-space-y-1">
                    {isTextMessage(message) && <TextMessage message={message} />}
                    {isMediaMessage(message) && isMediaImage(message.media) && (
                        <ImageMessage message={message} />
                    )}
                    {isMediaMessage(message) && isMediaAudio(message.media) && (
                        <AudioMessage message={message} />
                    )}
                    {isMediaMessage(message) && isMediaVideo(message.media) && (
                        <VideoMessage message={message} />
                    )}
                    {isMediaMessage(message) && isMediaFile(message.media) && (
                        <FileMessage message={message} />
                    )}
                    <div className="cb-flex cb-items-center cb-justify-end cb-text-xs cb-text-gray-400">
                        <span>{getLocalizedTime(message.createdAt)}</span>
                        {message.sender === "user" &&
                            {
                                sending: <HourglassBottomIcon className="cb-ms-1 cb-h-3 cb-w-3" />,
                                sent: <CheckIcon className="cb-h-5 cb-w-5" />,
                                seen: (
                                    <CheckAllIcon className="cb-ms-1 cb-h-5 cb-w-5 cb-text-primary" />
                                ),
                            }[message.status]}
                    </div>
                </div>
            </div>
            {/* This is a hack to make the grid work properly */}
            {message.sender === "ai" && <div />}
        </>
    );
};
