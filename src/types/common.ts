import { ENVIRONMENTS } from "@lib/config";
import { GrispiChat } from "..";

declare global {
  interface Window {
    GrispiChat: typeof GrispiChat;
    GRISPI_CHAT_JS_VERSION: string;
  }
}

export interface GrispiChatOptions {
  environment?: (typeof ENVIRONMENTS)[keyof typeof ENVIRONMENTS];
  debug?: boolean;
  element?: string;
  colors: {
    primary: string;
  };
  agent: {
    name: string;
    avatar: string;
  };
  welcome_message: string;
  popup_message: string;
}
