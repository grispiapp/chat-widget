import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { type GrispiChatOptions } from "../types/chat";
import { API_URLS } from "./config";

const HEX_REGEX = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

export const cn = (...args: ClassValue[]) =>
  extendTailwindMerge({
    prefix: "cb-",
  })(clsx(args));

export const deepMerge = (target, source) => {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }

  Object.assign(target || {}, source);

  return target;
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

  const { r, g, b } = {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };

  return `${r}, ${g}, ${b}`;
};

export const getChatUrl = (environment?: GrispiChatOptions["environment"]) => {
  return API_URLS[environment || "prod"];
};
