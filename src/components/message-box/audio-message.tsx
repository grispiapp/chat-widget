import { type MediaMessage as MediaMessageType } from "@context/conversation-context";
import { type FC } from "preact/compat";
import { MessageBoxCard } from "./message-box-card";

interface AudioMessageProps {
    message: MediaMessageType;
}

export const AudioMessage: FC<AudioMessageProps> = ({ message }) => {
    return (
        <MessageBoxCard color="light">
            <audio controls>
                <source src={message.media.publicUrl} type={message.media.mimeType} />
                <span>Your browser does not support the audio element.</span>
            </audio>
        </MessageBoxCard>
    );
};
