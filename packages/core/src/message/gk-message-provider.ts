import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  messageProviderStyles,
  messageContainerCssText,
} from "./gk-message-provider.styles.js";
import "./gk-message.js";
import type { GkMessageType } from "./gk-message.js";

export type GkMessagePlacement =
  | "top"
  | "top-left"
  | "top-right"
  | "bottom"
  | "bottom-left"
  | "bottom-right";

export interface GkMessageOptions {
  type?: GkMessageType;
  duration?: number;
  closable?: boolean;
  keepAliveOnHover?: boolean;
  showIcon?: boolean;
}

export interface GkMessageReactive {
  destroy: () => void;
}

type MessageRecord = {
  key: string;
  content: string;
  type: GkMessageType;
  duration: number;
  closable: boolean;
  keepAliveOnHover: boolean;
  showIcon: boolean;
};

const providerStack: GkMessageProvider[] = [];

export function registerMessageProvider(p: GkMessageProvider) {
  providerStack.push(p);
}

export function unregisterMessageProvider(p: GkMessageProvider) {
  const i = providerStack.lastIndexOf(p);
  if (i >= 0) providerStack.splice(i, 1);
}

export function getTopMessageProvider(): GkMessageProvider | undefined {
  return providerStack[providerStack.length - 1];
}

let keySeq = 0;

@customElement("gk-message-provider")
export class GkMessageProvider extends LitElement {
  static styles = messageProviderStyles;

  @property({ reflect: true })
  placement: GkMessagePlacement = "top";

  @property({ type: Number })
  duration = 3000;

  @property({ type: Boolean, reflect: true })
  closable = false;

  @property({ type: Boolean, reflect: true, attribute: "keep-alive-on-hover" })
  keepAliveOnHover = false;

  @property({ type: Number })
  max: number | undefined;

  @state()
  private messages: MessageRecord[] = [];

  private portal: HTMLDivElement | null = null;
  private timers = new Map<string, ReturnType<typeof setTimeout>>();
  private remaining = new Map<string, number>();
  private startedAt = new Map<string, number>();

  connectedCallback() {
    super.connectedCallback();
    registerMessageProvider(this);
    this.ensurePortal();
  }

  disconnectedCallback() {
    this.destroyAll();
    // Unregister before teardown so shared style cleanup sees an empty stack.
    unregisterMessageProvider(this);
    this.teardownPortal();
    super.disconnectedCallback();
  }

  protected updated() {
    this.syncPortalClass();
    this.renderPortalChildren();
  }

  createMessage(
    content: string,
    options: GkMessageOptions = {},
  ): GkMessageReactive {
    const type = options.type ?? "default";
    const duration =
      options.duration !== undefined
        ? options.duration
        : type === "loading"
          ? 0
          : this.duration;
    const record: MessageRecord = {
      key: `m-${++keySeq}`,
      content,
      type,
      duration,
      closable: options.closable ?? this.closable,
      keepAliveOnHover: options.keepAliveOnHover ?? this.keepAliveOnHover,
      showIcon: options.showIcon ?? true,
    };

    let next = [...this.messages, record];
    if (this.max != null && this.max > 0 && next.length > this.max) {
      const overflow = next.length - this.max;
      const dropped = next.slice(0, overflow);
      dropped.forEach((d) => this.clearTimer(d.key));
      next = next.slice(overflow);
    }
    this.messages = next;
    this.schedule(record);
    return { destroy: () => this.removeKey(record.key) };
  }

  destroyAll() {
    [...this.messages].forEach((m) => this.clearTimer(m.key));
    this.messages = [];
  }

  private removeKey(key: string) {
    this.clearTimer(key);
    this.messages = this.messages.filter((m) => m.key !== key);
  }

  private schedule(record: MessageRecord) {
    if (record.duration <= 0) return;
    this.remaining.set(record.key, record.duration);
    this.startTimer(record.key);
  }

  private startTimer(key: string) {
    const ms = this.remaining.get(key);
    if (ms == null || ms <= 0) return;
    this.clearTimer(key, false);
    this.startedAt.set(key, Date.now());
    this.timers.set(
      key,
      setTimeout(() => this.removeKey(key), ms),
    );
  }

  private clearTimer(key: string, clearRemaining = true) {
    const t = this.timers.get(key);
    if (t != null) clearTimeout(t);
    this.timers.delete(key);
    this.startedAt.delete(key);
    if (clearRemaining) this.remaining.delete(key);
  }

  private pauseTimer(key: string) {
    const started = this.startedAt.get(key);
    const rem = this.remaining.get(key);
    if (started == null || rem == null) return;
    const left = Math.max(0, rem - (Date.now() - started));
    this.remaining.set(key, left);
    this.clearTimer(key, false);
  }

  private ensurePortal() {
    if (this.portal) return;
    if (!document.getElementById("gk-message-container-style")) {
      const styleEl = document.createElement("style");
      styleEl.id = "gk-message-container-style";
      styleEl.textContent = messageContainerCssText;
      document.head.appendChild(styleEl);
    }
    this.portal = document.createElement("div");
    this.portal.className = `gk-message-container gk-message-container--${this.placement}`;
    document.body.appendChild(this.portal);
  }

  private teardownPortal() {
    this.portal?.remove();
    this.portal = null;
    // Keep shared style if other providers exist (checked after unregister).
    if (providerStack.length === 0) {
      document.getElementById("gk-message-container-style")?.remove();
    }
  }

  private syncPortalClass() {
    if (!this.portal) return;
    this.portal.className = `gk-message-container gk-message-container--${this.placement}`;
  }

  private renderPortalChildren() {
    if (!this.portal) return;
    // Resume timers paused by keepAliveOnHover before rebuild, otherwise
    // destroying hovered nodes can skip mouseleave and leave timers paused forever.
    for (const m of this.messages) {
      if (
        m.keepAliveOnHover &&
        m.duration > 0 &&
        this.remaining.has(m.key) &&
        !this.timers.has(m.key)
      ) {
        this.startTimer(m.key);
      }
    }
    this.portal.replaceChildren();
    for (const m of this.messages) {
      const node = document.createElement("gk-message") as HTMLElement & {
        type: string;
        content: string;
        closable: boolean;
        showIcon: boolean;
      };
      node.type = m.type;
      node.content = m.content;
      node.closable = m.closable;
      node.showIcon = m.showIcon;
      node.style.pointerEvents = "auto";
      node.addEventListener("gk-close", () => this.removeKey(m.key));
      if (m.keepAliveOnHover && m.duration > 0) {
        node.addEventListener("mouseenter", () => this.pauseTimer(m.key));
        node.addEventListener("mouseleave", () => this.startTimer(m.key));
      }
      this.portal.appendChild(node);
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-message-provider": GkMessageProvider;
  }
}
