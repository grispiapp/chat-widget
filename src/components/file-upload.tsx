import { uploadAttachment } from "@/api/chat";
import { t } from "@/lang";
import { MAX_FILE_SIZE, contentTypeMap } from "@/types/file";
import { useChatBox } from "@context/chat-box-context";
import { useConversation } from "@context/conversation-context";
import { useNotification } from "@context/notification-context";
import { Button } from "@ui/button";
import { useCallback, useRef, useState } from "preact/hooks";
import { type JSX } from "preact/jsx-runtime";
import { FileUploadIcon, LoadingIcon } from "./icons";

export const FileUpload = () => {
    const { notify } = useNotification();
    const { chat } = useChatBox();
    const { addMessage } = useConversation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleChange = useCallback(
        async (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
            if (loading) return;

            const file = e.currentTarget.files?.[0];

            if (!file) {
                notify({
                    text: t("fileUpload.validation.required"),
                    type: "error",
                });

                return;
            }

            if (!(file.type in contentTypeMap)) {
                notify({
                    text: t("fileUpload.validation.invalid"),
                    type: "error",
                });

                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                notify({
                    text: t("fileUpload.validation.max", { sizeInMb: MAX_FILE_SIZE }),
                    type: "error",
                });

                return;
            }

            setLoading(true);

            try {
                const media = await uploadAttachment(file, chat);

                await addMessage({
                    media,
                    sender: "user",
                });
            } catch (err) {
                notify({
                    title: t("errors.common.title"),
                    text: t("errors.common.text"),
                    type: "error",
                });
            } finally {
                setLoading(false);
            }
        },
        [chat, loading, notify, addMessage]
    );

    return (
        <>
            <Button
                onClick={handleClick}
                icon={loading ? LoadingIcon : FileUploadIcon}
                variant="link"
                size="sm"
                disabled={loading}
            />
            <input
                ref={fileInputRef}
                type="file"
                className="cb-hidden"
                onChange={handleChange}
                accept={Object.values(contentTypeMap).join(", ")}
            />
        </>
    );
};
