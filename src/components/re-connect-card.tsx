import { useChat } from "@hooks/useChat";
import { useTranslation } from "@hooks/useTranslation";
import { STORAGE_KEYS } from "@lib/storage";
import { Button } from "@ui/button";
import { Card } from "@ui/card";
import { useCallback, useState } from "preact/hooks";
import { ConnectionIcon } from "./icons";

export const ReConnectCard = () => {
    const { t } = useTranslation();
    const { subscribeToExistingChatFromStorage } = useChat();

    const [loading, setLoading] = useState<boolean>(false);

    const handleReconnectChat = useCallback(async () => {
        setLoading(true);

        localStorage.removeItem(STORAGE_KEYS.IS_CHAT_ENDED);
        localStorage.removeItem(STORAGE_KEYS.IS_SURVEY_SENT);

        await subscribeToExistingChatFromStorage({
            loadChatHistory: false,
        });

        setLoading(false);
    }, [subscribeToExistingChatFromStorage]);

    return (
        <Card
            title={t("reConnectCard.title")}
            description={t("reConnectCard.text")}
            loading={loading}
        >
            <Button type="button" onClick={handleReconnectChat} size="sm" icon={ConnectionIcon}>
                {t("surveyForm.connect")}
            </Button>
        </Card>
    );
};
