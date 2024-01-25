import { type GrispiChatOptions } from "../types/chat-box";

export const VERSION = "0.2.0";
window.GRISPI_CHAT_JS_VERSION = VERSION;

export const DEFAULT_WIDGET_OPTIONS: Omit<GrispiChatOptions, "tenantId"> = {
  colors: {
    primary: "99, 45, 145",
  },
  agent: {
    name: "Grispi",
    avatar: "https://i.ibb.co/7tGKGvb/grispi.png",
  },
  popup_message:
    "Hey! Ben Leyla, (tamamen ücretsiz) sanal düğün planlama asistanınız. Size yardımcı olmamı ister misiniz?",
  welcome_message:
    "Merhaba, ben Leyla. Sizin için en uygun mekanları bulmada yardımcı olabilirim. Nasıl bir etkinlik yapmak istiyorsunuz?",
  environment: "prod",
  debug: false,
};

export const STORAGE_KEYS = {
  DISMISS_PROMPT: "grispi.chat.dismissPrompt",
  CHAT_ID: "grispi.chat.chatId",
  LAST_MESSAGE_TIME: "grispi.chat.lastMessageTime",
};

export const ENVIRONMENTS = {
  local: "local",
  staging: "staging",
  preprod: "preprod",
  prod: "prod",
};

export const API_URLS = {
  [ENVIRONMENTS.local]: "http://localhost:8080",
  [ENVIRONMENTS.staging]: "https://api.grispi.dev",
  [ENVIRONMENTS.preprod]: "https://api.grispi.net",
  [ENVIRONMENTS.prod]: "https://api.grispi.com",
};

export const BROKER_URLS = {
  [ENVIRONMENTS.local]: "ws://localhost:8090/socket-registry",
  [ENVIRONMENTS.staging]: "wss://chat.grispi.dev/socket-registry",
  [ENVIRONMENTS.preprod]: "wss://chat.grispi.net/socket-registry",
  [ENVIRONMENTS.prod]: "wss://chat.grispi.com/socket-registry",
};

export const BACKEND_URLS = {
  [ENVIRONMENTS.local]: "http://localhost:8090",
  [ENVIRONMENTS.staging]: "https://chat.grispi.dev",
  [ENVIRONMENTS.preprod]: "https://chat.grispi.net",
  [ENVIRONMENTS.prod]: "https://chat.grispi.com",
};

export const InternalEventTypeMap = {
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
