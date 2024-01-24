import { api } from "@lib/api";

export const chatStatus = async () => {
  return await api("/chat/status");
};

export const chatPreferences = async () => {
  return await api("/chat/preferences");
};
