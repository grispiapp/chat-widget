import { render } from "preact";
import { Widget } from "@components/widget";
import { type GrispiChatOptions } from "./types/common";

const VERSION = "0.2.0";
console.log(`Grispi chat.js ${VERSION}`);
window.GRISPI_CHAT_JS_VERSION = VERSION;

export const GrispiChat = {
  create: async (options: GrispiChatOptions) => {
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

    const styles = await import("./index.css");

    const styleTag = document.createElement("style");
    styleTag.innerHTML = styles.default;
    widgetEl.shadowRoot.appendChild(styleTag);

    render(<Widget options={options} />, widgetEl.shadowRoot);
  },
};

window.GrispiChat = GrispiChat;
