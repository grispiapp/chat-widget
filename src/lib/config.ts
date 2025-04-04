import DefaultAgentAvatarImage from "@resources/images/default-agent-avatar.png";
import { type GrispiChatOptions } from "../types/chat-box";

export const VERSION = "0.2.0";
window.GRISPI_CHAT_JS_VERSION = VERSION;

export const DEFAULT_WIDGET_OPTIONS: Omit<GrispiChatOptions, "tenantId"> = {
    account: {
        title: "Grispi",
        logo: import.meta.env.VITE_BASE_URL + DefaultAgentAvatarImage,
    },
    colors: {
        primary: "99 45 145",
    },
    texts: {
        en: {
            agent: {
                name: "Grispi",
                avatar: import.meta.env.VITE_BASE_URL + DefaultAgentAvatarImage,
            },
            popup_message: "Hey! Need some help?",
            welcome_message: "Hi! How can we help you today?",
            offline_message:
                "Hello, we are currently offline. You can still send us a message and we will get back to you as soon as possible.",
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
                errors: {
                    422: {
                        text: "Fullname or email address invalid.",
                    },
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
            reConnectCard: {
                title: "The conversation ended",
                text: "Is there anything else you want to ask?",
            },
            errors: {
                common: {
                    title: "Something wen't wrong.",
                    text: "Please refresh the page and try again.",
                },
                forbidden: {
                    title: "Authorisation failure.",
                    text: "<b>{host}</b> does not have permission to use this interface. Please consult your Grispi administrator.",
                },
                exchange: {
                    title: "Configuration error.",
                    text: "There was an issue with the tenant configuration. Please contact your Grispi representative to resolve this issue.",
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
            popup_message: "Hey! Yardım lazım mı?",
            welcome_message: "Selam! Bugün size nasıl yardımcı olabiliriz?",
            offline_message:
                "Merhaba, şu an çevrimdışıyız. Bize yine de mesaj gönderebilirsiniz, en kısa sürede size dönüş yapacağız.",
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
                errors: {
                    422: {
                        text: "Ad soyad veya e-posta adresi geçersiz.",
                    },
                },
                submit: "Bağlan",
            },
            surveyForm: {
                title: "Sohbeti puanlayın",
                text: "Probleminizi çözmenize yardımcı olabildik mi?",
                rating: {
                    invalid: "Lütfen geçerli bir puan seçin.",
                },
                description: {
                    label: "Açıklama (zorunlu değil)",
                    max: "Açıklama en fazla {maksimum} karakter uzunluğunda olabilir.",
                },
                submit: "Gönder",
                connect: "Tekrar bağlan",
                success: {
                    text: "Geri bildiriminiz için teşekkürler, hoça kalın.",
                },
            },
            reConnectCard: {
                title: "Sohbet sona erdi",
                text: "Sormak istediğiniz başka bir şey var mı?",
            },
            errors: {
                common: {
                    title: "Bir hata oldu.",
                    text: "Lütfen sayfayı yenileyip tekrar deneyin.",
                },
                forbidden: {
                    title: "Yetkilendirme hatası oldu.",
                    text: "<b>{host}</b> bu arayüzü kullanma iznine sahip değil. Lütfen Grispi yöneticinize danışın.",
                },
                exchange: {
                    title: "Yapılandırma hatası.",
                    text: "Tenant yapılandırmasında bir sorun oluştu. Bu sorunu çözmek için lütfen Grispi temsilcinizle iletişime geçin.",
                },
            },
            modal: {
                buttons: {
                    no: "Hayır",
                    yes: "Evet",
                },
            },
            endSessionModal: {
                title: "Oturum sonlandırılıyor",
                text: "Bu konuşmayı sonlandırmak istediğine emin misin?",
            },
            ratingStates: {
                1: "Hiç memnun kalmadım",
                2: "Memnun kalmadım",
                3: "İdare eder",
                4: "Memnun kaldım",
                5: "Çok memnun kaldım",
            },
            fileUpload: {
                validation: {
                    required: "Lütfen bir dosya seçin.",
                    invalid: "Lütfen geçerli bir dosya seçin.",
                    max: "Dosya boyutu izin verilen maksimum {sizeInMb} MB sınırını aşıyor.",
                },
            },
        },
    },
    forms: {
        userForm: {
            fields: [
                {
                    type: "text",
                    name: "fullName",
                    label: "userForm.fullName.label",
                    rules: ["required"],
                },
                {
                    type: "email",
                    name: "email",
                    label: "userForm.email.label",
                    rules: ["required", "email"],
                },
            ],
        },
    },
    environment: "prod",
    debug: false,
    poweredBy: true,
    renderAsBlock: false,
    icon: "grispi",
};

export const ENVIRONMENTS = {
    local: "local",
    staging: "staging",
    preprod: "preprod",
    prod: "prod",
    prodtr: "prodtr",
};

export const API_URLS = {
    [ENVIRONMENTS.local]: "http://localhost:8080",
    [ENVIRONMENTS.staging]: "https://api.grispi.dev",
    [ENVIRONMENTS.preprod]: "https://api.grispi.net",
    [ENVIRONMENTS.prod]: "https://api.grispi.com",
    [ENVIRONMENTS.prodtr]: "https://api.grispi.com.tr",
};

export const BROKER_URLS = {
    [ENVIRONMENTS.local]: "ws://localhost:8090/socket-registry",
    [ENVIRONMENTS.staging]: "wss://chat.grispi.dev/socket-registry",
    [ENVIRONMENTS.preprod]: "wss://chat.grispi.net/socket-registry",
    [ENVIRONMENTS.prod]: "wss://chat.grispi.com/socket-registry",
    [ENVIRONMENTS.prodtr]: "wss://chat.grispi.com.tr/socket-registry",
};

export const BACKEND_URLS = {
    [ENVIRONMENTS.local]: "http://localhost:8090",
    [ENVIRONMENTS.staging]: "https://chat.grispi.dev",
    [ENVIRONMENTS.preprod]: "https://chat.grispi.net",
    [ENVIRONMENTS.prod]: "https://chat.grispi.com",
    [ENVIRONMENTS.prodtr]: "https://chat.grispi.com.tr",
};

export const internalEventTypeMap = {
    CHAT_DISCONNECTED: "chat-disconnected",
    CHAT_HISTORY_READY: "CHAT_HISTORY_READY",
    CHAT_SESSION_CLOSED: "CHAT_SESSION_CLOSED",
    CONNECTION_READY: "CONNECTION_READY",
    CONNECTION_LOST: "CONNECTION_LOST",
    ENSURE_WS_SUBSCRIPTION: "ENSURE_WS_SUBSCRIPTION",
    GOT_INFO_MESSAGE: "GOT_INFO_MESSAGE",
    GOT_RECEIPT: "GOT_RECEIPT",
    MESSAGE_RECEIVED: "MESSAGE_RECEIVED",
    MESSAGE_SEEN: "MESSAGE_SEEN",
    MESSAGE_INVALID: "MESSAGE_INVALID",
    INCOMING_MESSAGE: "INCOMING_MESSAGE",
    NEED_SCROLL_TO_BOTTOM: "NEED_SCROLL_TO_BOTTOM",
    NEED_TO_FOCUS_INPUT: "NEED_TO_FOCUS_INPUT",
    NEW_CHAT_CREATED: "NEW_CHAT_CREATED",
    RESUME_CHAT: "RESUME_CHAT",
    /**
     * Dispatched when chat ws subscription is successful
     */
    SUBSCRIBED_TO_CHAT: "SUBSCRIBED_TO_CHAT",
    /**
     * This event is dispatched when a chatSessionId is become available which is either after create new chat or after resume chat.
     */
    SUBSCRIBE_TO_CHAT: "SUBSCRIBE_TO_CHAT",
    SURVEY_DONE: "SURVEY_DONE",
    WINDOW_BLURRED: "popup-blured",
    WINDOW_FOCUSED: "popup-focused",
} as const;
