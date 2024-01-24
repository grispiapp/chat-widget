import { GrispiChat } from "..";

declare global {
  interface Window {
    GrispiChat: typeof GrispiChat;
    GRISPI_CHAT_JS_VERSION: string;
  }
}
