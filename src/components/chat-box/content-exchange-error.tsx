import { ErrorOutlineIcon } from "@components/icons";
import { useTranslation } from "@hooks/useTranslation";
import { sanitizeHtml } from "@lib/sanitized-html";
import { getOrigin } from "@lib/utils";

export const ContentExchangeError = () => {
    const { t } = useTranslation();

    return (
        <div className="cb-flex cb-h-48 cb-flex-col cb-items-center cb-justify-center cb-space-y-2 cb-p-4 cb-text-center">
            <ErrorOutlineIcon className="cb-h-16 cb-w-16 cb-text-danger" />
            <h3 className="cb-text-xl cb-font-bold">{t("errors.exchange.title")}</h3>
            <p
                className="cb-text-muted-foreground"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(
                        t("errors.exchange.text", {
                            host: getOrigin(),
                        })
                    ),
                }}
            />
        </div>
    );
};
