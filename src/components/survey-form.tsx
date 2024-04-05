import { sendSurvey } from "@/api/chat";
import { useChatBox } from "@context/chat-box-context";
import { useConversation } from "@context/conversation-context";
import { useNotification } from "@context/notification-context";
import { useChat } from "@hooks/useChat";
import { useErrors } from "@hooks/useErrors";
import { useTranslation } from "@hooks/useTranslation";
import { STORAGE_KEYS } from "@lib/storage";
import { debug, filled } from "@lib/utils";
import { Button } from "@ui/button";
import { Card } from "@ui/card";
import { ErrorSpan } from "@ui/error-span";
import { Rating, type RatingValue } from "@ui/rating";
import { TextArea } from "@ui/textarea";
import { useCallback, useState } from "preact/hooks";
import { type JSX } from "preact/jsx-runtime";
import { ConnectionIcon } from "./icons";

export interface SurveyInput {
    rating: RatingValue;
    description: string;
}

export const SurveyForm = () => {
    const { notify } = useNotification();
    const { t } = useTranslation();
    const { chat, toggleState } = useChatBox();
    const { subscribeToExistingChatFromStorage } = useChat();
    const { setState: setConversationState } = useConversation();

    const [rating, setRating] = useState<SurveyInput["rating"]>(null);
    const [description, setDescription] = useState<SurveyInput["description"]>("");
    const [loading, setLoading] = useState<boolean>(false);
    const { errors, setError, resetErrors } = useErrors<SurveyInput>();

    const handleSubmit = useCallback(
        async (e: JSX.TargetedSubmitEvent<HTMLFormElement>, survey: SurveyInput) => {
            e.preventDefault();

            if (!chat) {
                return;
            }

            let hasError = false;

            resetErrors();

            if (survey.rating <= 0 || survey.rating > 5) {
                setError("rating", t("surveyForm.rating.invalid"));
                hasError = true;
            }

            if (survey.description.length > 300) {
                setError("description", t("surveyForm.description.max", { max: 300 }));
                hasError = true;
            }

            if (hasError) {
                return;
            }

            setLoading(true);

            try {
                debug("Sending survey...", { survey });

                await sendSurvey(survey, chat);
                setConversationState("idle");

                notify({
                    text: t("surveyForm.success.text"),
                    type: "success",
                });

                setTimeout(() => {
                    toggleState();
                }, 3000);

                debug("Survey sent.");
            } catch (err) {
                notify({
                    title: t("errors.common.title"),
                    text: t("errors.common.text"),
                    type: "error",
                });

                console.error(`Failed when sending survey...`, err);
            } finally {
                setLoading(false);
            }
        },
        [chat, t, resetErrors, toggleState, setConversationState, setError, setLoading, notify]
    );

    const handleReconnectChat = useCallback(async () => {
        setLoading(true);
        localStorage.removeItem(STORAGE_KEYS.IS_CHAT_ENDED);
        await subscribeToExistingChatFromStorage({
            loadChatHistory: false,
        });
        setLoading(false);
    }, [subscribeToExistingChatFromStorage]);

    return (
        <Card title={t("surveyForm.title")} description={t("surveyForm.text")} loading={loading}>
            <form
                onSubmit={(e) => handleSubmit(e, { rating, description })}
                className="cb-space-y-3"
            >
                <Rating value={rating} onChange={(value) => setRating(value)} />
                {filled(errors?.rating) && <ErrorSpan>{errors.rating}</ErrorSpan>}
                <TextArea
                    onChange={(e) => setDescription(e.currentTarget.value)}
                    value={description}
                    label={t("surveyForm.description.label")}
                    className="cb-resize-none"
                    rows={3}
                    error={errors?.description}
                />
                <div className="cb-flex cb-items-center cb-gap-2">
                    <Button size="sm">{t("surveyForm.submit")}</Button>
                    <Button
                        type="button"
                        onClick={handleReconnectChat}
                        size="sm"
                        icon={ConnectionIcon}
                        variant="secondary"
                    >
                        {t("surveyForm.connect")}
                    </Button>
                </div>
            </form>
        </Card>
    );
};
