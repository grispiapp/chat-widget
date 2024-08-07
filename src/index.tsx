import { Widget } from "@components/widget";
import { VERSION, type internalEventTypeMap } from "@lib/config";
import { debug } from "@lib/utils";
import { render } from "preact";
import styles from "./index.css?inline";
import {
    type GrispiChatOptions,
    type OptionalGrispiChatOptions,
    type WidgetEnvironment,
} from "./types/chat-box";

type GrispiChatType = {
    create: (options: OptionalGrispiChatOptions) => void;
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

        if (options.renderAsBlock && !options.element) {
            console.error(
                "GrispiChat Block Mode Error: When 'renderAsBlock' mode is enabled, the 'element' parameter must be specified. " +
                    "This parameter indicates the custom HTML element where the chat widget will be placed. " +
                    "For example: \n\n" +
                    "const options = {\n" +
                    "  renderAsBlock: true,\n" +
                    "  element: '#chat-container'\n" +
                    "};\n\n" +
                    "If you do not specify the 'element' parameter, the chat widget cannot be placed and you will receive this error."
            );

            throw new Error("Block mode works only in a custom element.");
        }

        GrispiChat.options = options;
        window.GrispiChat = GrispiChat;

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
            throw new Error(`Element (${options.element}) not found in the dom.`);
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

    const [_, encodedParameters] = script.getAttribute("src").split("?", 2);
    const params = Object.fromEntries(new URLSearchParams(encodedParameters).entries());

    if (!("tenantId" in params)) {
        return;
    }

    GrispiChat.create({
        tenantId: params.tenantId,
        debug: params.debug === "true" || params.debug === "1",
        environment: (params.environment ?? "prod") as WidgetEnvironment,
        renderAsBlock: params.block === "true" || params.block === "1",
        element: params.element,
    });
});

window.GrispiChat = GrispiChat;
