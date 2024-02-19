import { type ENVIRONMENTS } from "@lib/config";

interface Form {
    fields: FormField[];
}

interface FormField {
    type: "text" | "email";
    name: string;
    label: string;
    rules?: string[];
}

interface LocalizableTexts extends Record<string, unknown> {
    /**
     * Configuration for the chat agent's details.
     */
    agent: {
        /**
         * Name of the chat agent.
         */
        name: string;

        /**
         * URL or path to the avatar image for the chat agent.
         */
        avatar: string;
    };

    /**
     * The welcome message is displayed when agents are `online` and the chat is initialized.
     */
    welcome_message: string;

    /**
     * The welcome message is displayed when agents are `offline` and the chat is initialized.
     */
    offline_message: string;

    /**
     * Popup message displayed on the first page load.
     */
    popup_message: string;
}

export interface GrispiChatOptions {
    /**
     * Unique identifier for the tenant on the {tenantId}.grispi.com domain.
     */
    tenantId: string;

    /**
     * Optional. Language code for the chat interface.
     *
     * Preferred language priority:
     *  1. window.GrispiChat.options.language,
     *  2. document.documentElement.lang,
     *  3. FALLBACK_LOCALE
     */
    language?: string;

    /**
     * Optional. Query selector for the HTML element where the chat will be mounted.
     * If not provided, it will be created automatically in the body.
     */
    element?: string;

    /**
     * Optional. Specifies the environment in which the chat is running.
     * Should be one of the values defined in the ENVIRONMENTS object.
     */
    environment?: keyof typeof ENVIRONMENTS;

    /**
     * Optional. If set to true, enables debug mode for additional logging and debugging information.
     */
    debug?: boolean;

    /**
     * Optional. When set to true, the chat interface is configured to appear
     * "always online" providing a continuous and responsive user experience.
     *
     * This setting ensures that the chat interface remains accessible to users at all times,
     * creating a perception of constant availability.
     */
    always_online?: boolean;

    /**
     * Optional. When set to true, displays a "Powered by" attribution in the chat interface.
     */
    powered_by?: boolean;

    /**
     * Contains configurations for different forms within the chat interface.
     */
    forms: Record<string, Form>;

    /**
     * Configuration for the colors used in the chat interface.
     */
    colors: {
        primary: string;
    };

    /**
     * Localizable texts.
     */
    texts: Record<string, Partial<LocalizableTexts>>;
}
