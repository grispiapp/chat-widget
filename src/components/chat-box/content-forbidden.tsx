import { ErrorOutlineIcon } from "@components/icons";
import { useTranslation } from "@hooks/useTranslation";

export const ContentForbidden = () => {
    const { t } = useTranslation();

    return (
        <div className="cb-flex cb-h-48 cb-flex-col cb-items-center cb-justify-center cb-space-y-2 cb-p-4 cb-text-center">
            <ErrorOutlineIcon className="cb-h-16 cb-w-16 cb-text-danger" />
            <h3 className="cb-text-xl cb-font-bold">{t("errors.unauthorized.title")}</h3>
            <p className="cb-text-muted-foreground">{t("errors.unauthorized.text")}</p>
        </div>
    );
};
