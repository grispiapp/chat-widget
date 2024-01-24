import { type GrispiChatOptions } from "../types/chat";

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
};

export const INCOMING_EVENTS = {
  READY: "grispi.chat.request.ready",
  NEW_CHAT_SESSION: "grispi.chat.request.newChatSession",
  LAST_MESSAGE_TIME: "grispi.chat.request.lastMessageTime",
  UNSEEN_MESSAGES_COUNT: "grispi.chat.request.unseenMessageCount",
  CLOSE_POPUP: "grispi.chat.request.closePopup",
  RESET_CHAT: "grispi.chat.request.resetChat",
};

export const OUTGOING_EVENTS = {
  INIT: "grispi.chat.response.init",
  POPUP_CLOSED: "grispi.chat.event.popupClosed",
  POPUP_OPENED: "grispi.chat.event.popupOpened",
  USER_WANTS_TO_END_CHAT: "grispi.chat.event.userWantsToEndChat",
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
  local: "http://localhost:8080",
  staging: "https://api.grispi.dev",
  preprod: "https://api.grispi.net",
  prod: "https://api.grispi.com",
};
