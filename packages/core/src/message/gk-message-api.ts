import {
  getTopMessageProvider,
  type GkMessageOptions,
  type GkMessageReactive,
} from "./gk-message-provider.js";
import type { GkMessageType } from "./gk-message.js";

function requireProvider() {
  const p = getTopMessageProvider();
  if (!p) {
    throw new Error(
      "gkMessage requires a connected <gk-message-provider> in the document.",
    );
  }
  return p;
}

function typed(
  type: GkMessageType,
  content: string,
  options?: GkMessageOptions,
): GkMessageReactive {
  return requireProvider().createMessage(content, { ...options, type });
}

export const gkMessage = {
  create(content: string, options?: GkMessageOptions) {
    return requireProvider().createMessage(content, options);
  },
  info(content: string, options?: GkMessageOptions) {
    return typed("info", content, options);
  },
  success(content: string, options?: GkMessageOptions) {
    return typed("success", content, options);
  },
  warning(content: string, options?: GkMessageOptions) {
    return typed("warning", content, options);
  },
  error(content: string, options?: GkMessageOptions) {
    return typed("error", content, options);
  },
  loading(content: string, options?: GkMessageOptions) {
    return typed("loading", content, options);
  },
  destroyAll() {
    requireProvider().destroyAll();
  },
};
