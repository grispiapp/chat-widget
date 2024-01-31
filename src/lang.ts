import { convertKeysToDotNotation, getPreferredLang } from "@lib/utils";

export const FALLBACK_LOCALE = "en";

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
                invalid: "Please enter a valid email.",
            },
            submit: "Connect",
        },
        surveyForm: {
            title: "Rate the chat",
            text: "Were we able to help you solve your problem?",
            rating: {
                invalid: "Please select a valid score.",
            },
            description: {
                label: "Description (optional)",
                max: "The description can be up to {max} characters long.",
            },
            submit: "Send",
            connect: "Connect again",
            success: {
                text: "We have got your response, thank you.",
            },
        },
        errors: {
            common: {
                title: "Something wen't wrong.",
                text: "Please refresh the page and try again.",
            },
        },
        modal: {
            buttons: {
                no: "No",
                yes: "Yes",
            },
        },
        endSessionModal: {
            title: "Ending chat session",
            text: "Are you sure you want to end the conversation?",
        },
        ratingStates: {
            1: "Very dissatisfied",
            2: "Dissatisfied",
            3: "OK",
            4: "Satisfied",
            5: "Very satisfied",
        },
        fileUpload: {
            validation: {
                required: "Please select a file.",
                invalid: "Please choose a valid file.",
                max: "File size exceeds the maximum allowed limit of {sizeInMb} MB.",
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
                invalid: "E-Posta adresi geçersiz.",
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

export const t = (
    key: keyof typeof dottedStrings,
    params: Record<string, string | number> = {},
    lang: string = undefined
) => {
    let value =
        dottedStrings?.[`${getPreferredLang(lang)}.${key}`] ??
        dottedStrings?.[`${FALLBACK_LOCALE}.${key}`];

    Object.keys(params).forEach((param) => {
        value = value.replace(new RegExp(`{${param}}`, "gi"), params[param].toString());
    });

    return value;
};

export default strings;
