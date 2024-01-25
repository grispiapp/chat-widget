import { api } from "@lib/api";
import { InternalEventTypeMap } from "@lib/config";
import { debug, getHostUrl } from "@lib/utils";
import { UserInput } from "../types/user";
import { SubscribeableChatResponseForEndUser } from "../types/backend";

export const chatStatus = async () => {
  debug("chatStatus", "Fetch chat status...");
  return await api("/chat/status");
};

export const chatPreferences = async () => {
  debug("chatPreferences", "Fetching preferences...");
  return await api("/chat/preferences");
};

export const resumeChat = async (chatId: string) => {
  debug("resumeChat", "Fetching existing chat...");
  return await api(`/chats/${chatId}`);
};

export const createChat = async (user: UserInput) => {
  const data = {
    ...user,
    url: getHostUrl(),
  };

  debug("createChat", "Creating new chat with", { data });

  return await api<SubscribeableChatResponseForEndUser>("/chats", "POST", data);
};

export const windowFocusedEvent = () => {
  window.dispatchEvent(new CustomEvent(InternalEventTypeMap.WINDOW_FOCUSED));
};
export const windowBlurredEvent = () => {
  window.dispatchEvent(new CustomEvent(InternalEventTypeMap.WINDOW_BLURRED));
};

export const websocketConnectionReadyEvent = () =>
  window.dispatchEvent(new CustomEvent(InternalEventTypeMap.CONNECTION_READY));
