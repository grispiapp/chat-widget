import { Widget } from "@components/widget";
import { VERSION } from "@lib/config";
import { debug } from "@lib/utils";
import { render } from "preact";
import styles from "./index.css?inline";
import { type GrispiChatOptions } from "./types/chat-box";

type GrispiChat = {
  create: (options: GrispiChatOptions) => void;
  options: GrispiChatOptions | undefined;
};

export const GrispiChat: GrispiChat = {
  options: undefined,

  create: async (options: GrispiChatOptions) => {
    if (GrispiChat.options) {
      throw new Error("GrispiChat already initialized");
    }

    GrispiChat.options = options;

    debug("chat.js", VERSION);

    let widgetEl;

    if (options.element) {
      widgetEl = document.querySelector(options.element);
    } else {
      widgetEl = document.createElement("div");
      widgetEl.dataset.grispiChat = "true";
      document.body.appendChild(widgetEl);
    }

    if (!widgetEl) {
      throw new Error("No widget found");
    }

    widgetEl.attachShadow({
      mode: "open",
    });

    const styleTag = document.createElement("style");
    styleTag.innerHTML = styles;
    widgetEl.shadowRoot.appendChild(styleTag);

    render(<Widget options={options} />, widgetEl.shadowRoot);
  },
};

window.GrispiChat = GrispiChat;
