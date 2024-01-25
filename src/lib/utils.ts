import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { type GrispiChatOptions } from "../types/chat";
import {
  API_URLS,
  BACKEND_URLS,
  BROKER_URLS,
  DEFAULT_WIDGET_OPTIONS,
  ENVIRONMENTS,
} from "./config";

const HEX_REGEX = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

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
  var result = HEX_REGEX.exec(hex);
  if (!result) return hex;

  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ].join(", ");
};

export const getEnvironment = (): keyof typeof ENVIRONMENTS => {
  return window.GrispiChat.options.environment || "prod";
};

export const isDebugMode = () => {
  return window.GrispiChat.options.debug !== undefined
    ? window.GrispiChat.options.debug
    : DEFAULT_WIDGET_OPTIONS.debug;
};

export const getChatUrl = (
  environment?: GrispiChatOptions["environment"],
): string => {
  return API_URLS[environment || getEnvironment()];
};

export const getBrokerUrl = (
  environment?: GrispiChatOptions["environment"],
): string => {
  return BROKER_URLS[environment || getEnvironment()];
};

export const getBackendUrl = (
  environment?: GrispiChatOptions["environment"],
): string => {
  return BACKEND_URLS[environment || getEnvironment()];
};

export const getHostUrl = () => {
  return window.location.host;
};

export const uuidv4 = (): string => {
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16),
  );
};

export const debug = (...args) => {
  if (isDebugMode()) {
    console.debug("[grispi]", ...args);
  }
};

export const blank = (value: unknown): value is null | undefined | "" => {
  return value === null || value === undefined || value === "";
};

export const filled = <T = string>(
  value: unknown,
): value is Exclude<T, null | undefined> => {
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
