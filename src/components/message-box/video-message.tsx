import { type MediaMessage as MediaMessageType } from "@context/conversation-context";
import { type FC } from "preact/compat";

interface VideoMessageProps {
    message: MediaMessageType;
}

export const VideoMessage: FC<VideoMessageProps> = ({ message }) => {
    return (
        <div className="cb-overflow-hidden cb-rounded-lg">
            <video controls>
                <source src={message.media.publicUrl} type={message.media.mimeType} />
                <span>Your browser does not support the audio element.</span>
            </video>
        </div>
    );
};
