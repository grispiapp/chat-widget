import { useChatBox } from "@context/chat-box-context";
import LocalizationContext from "@context/localization-context";
import { convertKeysToDotNotation, getPreferredLang } from "@lib/utils";
import { useCallback, useContext, useMemo } from "preact/hooks";

export const FALLBACK_LOCALE = "en";

export const useTranslation = () => {
    const { options } = useChatBox();
    const { locale, setLocale } = useContext(LocalizationContext);

    const dottedStrings = useMemo(() => convertKeysToDotNotation(options.texts), [options.texts]);

    const getPreferredLocales = useCallback(
        (lang: string = undefined) => {
            const preferredLocales = [
                getPreferredLang(lang),
                getPreferredLang(locale),
                FALLBACK_LOCALE,
            ];

            preferredLocales.forEach((locale, i) => {
                locale = locale.toLowerCase().replace("-", "_");
                preferredLocales[i] = locale;

                if (locale.includes("_")) {
                    const splitLocale = locale.split("_");
                    preferredLocales.splice(i + 1, 0, splitLocale[0]);
                }
            });

            return Array.from(new Set(preferredLocales));
        },
        [locale]
    );

    const t = useCallback(
        (
            key: keyof typeof dottedStrings,
            params: Record<string, string | number> = {},
            lang: string = undefined
        ) => {
            const preferredLocales = getPreferredLocales(lang);
            let value;

            for (let i = 0; i < preferredLocales.length; i++) {
                const foundValue = dottedStrings?.[`${preferredLocales[i]}.${key}`];

                if (foundValue) {
                    value = foundValue;
                    break;
                }
            }

            Object.keys(params).forEach((param) => {
                value = value.replace(new RegExp(`{${param}}`, "gi"), params[param].toString());
            });

            return value;
        },
        [dottedStrings, getPreferredLocales]
    );

    return { t, locale, setLocale };
};
