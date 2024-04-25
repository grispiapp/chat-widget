import { Widget } from "@components/widget";
import { VERSION, type internalEventTypeMap } from "@lib/config";
import { debug } from "@lib/utils";
import { render } from "preact";
import styles from "./index.css?inline";
import { type GrispiChatOptions } from "./types/chat-box";

type GrispiChatType = {
    create: (options: GrispiChatOptions) => void;
    options: GrispiChatOptions | undefined;
    listeners: Partial<Record<keyof typeof internalEventTypeMap, boolean>>;
};

export const GrispiChat: GrispiChatType = {
    options: undefined,
    listeners: {},

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

window.addEventListener("DOMContentLoaded", () => {
    const script = document.querySelector("[data-grispi-chat-widget]");

    if (!script) return;

    const url = new URLSearchParams(script.getAttribute("src"));
    const parameters = Object.fromEntries(url.entries());

    if (!parameters.tenantId) {
        return;
    }

    GrispiChat.create({
        tenantId: parameters.tenantId,
        debug: parameters.debug === "true" || parameters.debug === "1",
        environment: parameters.environment ?? "prod",
    });
});

window.GrispiChat = GrispiChat;
