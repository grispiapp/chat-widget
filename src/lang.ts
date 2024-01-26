import { convertKeysToDotNotation, getFirst } from "@lib/utils";

const FALLBACK_LOCALE = "en";

const strings = {
    en: {
        footer: {
            input: {
                placeholder: "Type your message here...",
            },
        },
        userForm: {
            title: "Contact Informations",
            text: "Please provide your contact information below to establish a connection with an agent.",
            fullName: {
                label: "Fullname",
                required: "Please enter your name.",
            },
            email: {
                label: "Email",
                required: "Please enter your email.",
                notValid: "Please enter a valid email.",
            },
            submit: "Connect",
        },
        errors: {
            common: {
                title: "Something wen't wrong.",
                text: "Please refresh the page and try again.",
            },
        },
    },
    tr: {
        footer: {
            input: {
                placeholder: "Mesajınızı buraya yazın...",
            },
        },
        userForm: {
            title: "İletişim Bilgileri",
            text: "Bir temsilci ile bağlantı kurmak için lütfen iletişim bilgilerinizi ekleyin.",
            fullName: {
                label: "İsim & Soyisim",
                required: "Lütfen isim ve soyisminizi yazın.",
            },
            email: {
                label: "E-Posta Adresi",
                required: "Lütfen E-Posta adresinizi yazın.",
                notValid: "E-Posta adresi geçersiz.",
            },
            submit: "Bağlan",
        },
        errors: {
            common: {
                title: "Bir hata oldu.",
                text: "Lütfen sayfayı yenileyip tekrar deneyin.",
            },
        },
    },
};

const dottedStrings = convertKeysToDotNotation(strings);

export const t = (key: keyof typeof dottedStrings, lang: string = undefined) => {
    lang = getFirst(
        lang,
        window.GrispiChat.options.language,
        document.documentElement.lang,
        FALLBACK_LOCALE
    );

    return dottedStrings?.[`${lang}.${key}`] ?? dottedStrings?.[`${FALLBACK_LOCALE}.${key}`];
};

export default strings;
