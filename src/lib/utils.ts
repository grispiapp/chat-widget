import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { type SubscribeableChatResponseForEndUser } from "../types/backend";
import { type GrispiChatOptions } from "../types/chat-box";
import {
    API_URLS,
    BACKEND_URLS,
    BROKER_URLS,
    DEFAULT_WIDGET_OPTIONS,
    type ENVIRONMENTS,
} from "./config";

const HEX_REGEX = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const cn = (...args: ClassValue[]) =>
    extendTailwindMerge({
        prefix: "cb-",
    })(clsx(args));

export const deepMerge = (target, source) => {
    for (const key of Object.keys(source)) {
        if (source[key] instanceof Object) {
            source[key] = {
                ...source[key],
                ...deepMerge(target[key], source[key]),
            };
        }
    }

    return { ...(target || {}), ...source };
};

export const mergeChatOptions = (target, source) => {
    const options = deepMerge(target, source);

    if (options.colors.primary) {
        options.colors.primary = hexToRgb(options.colors.primary);
    }

    return options;
};

export const hexToRgb = (hex: string): string => {
    const result = HEX_REGEX.exec(hex);
    if (!result) return hex;

    return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)].join(" ");
};

export const getTenantId = () => {
    return window.GrispiChat.options.tenantId;
};

export const getEnvironment = (): keyof typeof ENVIRONMENTS => {
    return window.GrispiChat.options.environment || "prod";
};

export const destinationPaths = (
    chatSessionId: SubscribeableChatResponseForEndUser["chatSessionId"]
) => {
    const tenantId = getTenantId();

    return {
        exchange: () => `/exchange/${tenantId}/${tenantId}.${chatSessionId}`,
        chatMessage: () => `/app/chat/${tenantId}/${chatSessionId}`,
        endSession: () => `/app/chat/${tenantId}/${chatSessionId}/close`,
        chatMessageSeen: () => `/app/chat/${tenantId}/${chatSessionId}/seen`,
    };
};

export const isDebugMode = () => {
    return window.GrispiChat.options.debug !== undefined
        ? window.GrispiChat.options.debug
        : DEFAULT_WIDGET_OPTIONS.debug;
};

export const getChatUrl = (environment?: GrispiChatOptions["environment"]): string => {
    return API_URLS[environment || getEnvironment()];
};

export const getBrokerUrl = (environment?: GrispiChatOptions["environment"]): string => {
    return BROKER_URLS[environment || getEnvironment()];
};

export const getBackendUrl = (environment?: GrispiChatOptions["environment"]): string => {
    return BACKEND_URLS[environment || getEnvironment()];
};

export const getHostUrl = () => {
    return window.location.host;
};

export const uuidv4 = (): string => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );
};

export const debug = (...args) => {
    if (isDebugMode()) {
        console.groupCollapsed("[grispi]", ...args);
        console.trace();
        console.groupEnd();
    }
};

export const blank = (value: unknown): value is null | undefined | "" => {
    return value === null || value === undefined || value === "";
};

export const filled = <T = string>(value: unknown): value is Exclude<T, null | undefined> => {
    return !blank(value);
};

export const getFirst = <T>(...values: unknown[]): T => {
    for (let value of values) {
        if (typeof value === "function") {
            value = value();
        }

        if (filled<T>(value)) return value;
    }
};

export const inputId = (name?: string | undefined) => {
    return getFirst<string>(`${name}_${uuidv4()}`, uuidv4);
};

export const isEmail = (input: string): boolean => {
    return EMAIL_REGEX.test(input);
};

type EncapsulatedStringObject = Record<string, string | object>;
export function convertKeysToDotNotation(
    object: EncapsulatedStringObject,
    prefix: string = ""
): Record<string, string> {
    const result: Record<string, string> = {};
    Object.keys(object).forEach((key) => {
        const newPrefix = prefix ? `${prefix}.${key}` : key;
        const value = object[key];
        if (typeof value === "object") {
            Object.assign(
                result,
                convertKeysToDotNotation(object[key] as EncapsulatedStringObject, newPrefix)
            );
        } else {
            result[newPrefix] = value;
        }
    });
    return result;
}
