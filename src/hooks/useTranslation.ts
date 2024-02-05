import { useChatBox } from "@context/chat-box-context";
import LocalizationContext from "@context/localization-context";
import { convertKeysToDotNotation, getPreferredLang } from "@lib/utils";
import { useCallback, useContext, useMemo } from "preact/hooks";

export const FALLBACK_LOCALE = "en";

export const useTranslation = () => {
    const { options } = useChatBox();
    const { locale, setLocale } = useContext(LocalizationContext);

    const dottedStrings = useMemo(() => convertKeysToDotNotation(options.texts), [options.texts]);

    const t = useCallback(
        (
            key: keyof typeof dottedStrings,
            params: Record<string, string | number> = {},
            lang: string = undefined
        ) => {
            const preferredLocale = getPreferredLang(lang || locale);

            let value =
                dottedStrings?.[`${preferredLocale}.${key}`] ??
                dottedStrings?.[`${FALLBACK_LOCALE}.${key}`];

            Object.keys(params).forEach((param) => {
                value = value.replace(new RegExp(`{${param}}`, "gi"), params[param].toString());
            });

            return value;
        },
        [dottedStrings, locale]
    );

    return { t, locale, setLocale };
};
