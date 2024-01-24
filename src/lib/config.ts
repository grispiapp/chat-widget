import { type GrispiChatOptions } from "../types/common";

export const DEFAULT_WIDGET_OPTIONS: GrispiChatOptions = {
  colors: {
    primary: "99, 45, 145",
  },
  agent: {
    name: "Leyla",
    avatar: "https://i.ibb.co/7tGKGvb/leyla.png",
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
  PRODUCTION: "prod",
  STAGING: "staging",
  LOCAL: "local",
  PREPROD: "preprod",
};

export const DEBUG_MODE_URL_QUERY_PARAMETER = "debug";
export const ENVIRONMENT_URL_QUERY_PARAMETER = "env";

export function parseEnv(env) {
  if (!env || env.trim().length === 0) return ENVIRONMENTS.PRODUCTION;
  if (env.toLowerCase() === ENVIRONMENTS.PREPROD) ENVIRONMENTS.PREPROD;
  if (env.toLowerCase() === ENVIRONMENTS.STAGING) ENVIRONMENTS.STAGING;
  if (env.toLowerCase() === ENVIRONMENTS.LOCAL) ENVIRONMENTS.LOCAL;
}

function extractSearchParamsInSrc() {
  if (!document.currentScript || !document.currentScript.src) {
    console.error(`'document.currentScript' is not available!`);
    return {};
  }

  const searchParams = new URL(document.currentScript?.src).searchParams;

  const debugModeParam = searchParams.get(DEBUG_MODE_URL_QUERY_PARAMETER) || "";
  return {
    chatJsUrl: document.currentScript.src,
    environment: parseEnv(searchParams.get(ENVIRONMENT_URL_QUERY_PARAMETER)),
    inDebugMode: debugModeParam.toLowerCase() === "true",
    tenantId: searchParams.get("tenantId"),
    lang:
      searchParams.get("lang") ??
      (navigator.language.startsWith("tr") ? "tr" : "en"),
  };
}

const onlineStatus = async () => {
  const response = await fetch(`${GRISPI_API_URL}/chat/status`, {
    method: "GET",
    mode: "cors",
    headers: {
      tenantId: tenantId,
    },
  });
  return await response.json();
};

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

function grispiApiUrl(env) {
  switch (env) {
    case ENV_LOCAL:
      return "http://localhost:8080";
    case ENV_STAGING:
      return "https://api.grispi.dev";
    case ENV_PROD:
      return "https://api.grispi.com";
    case ENV_PREPROD:
      return "https://api.grispi.net";
  }
}
