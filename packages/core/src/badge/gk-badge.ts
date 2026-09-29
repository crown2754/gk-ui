import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { PropertyValues } from "lit";
import { falseableBoolean } from "../overlay/boolean.js";
import { badgeStyles } from "./gk-badge.styles.js";

export type GkBadgeType =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info";

function english(el: HTMLElement) {
  return (el.ownerDocument?.documentElement?.lang || "").toLowerCase().startsWith("en");
}

function parseBadgeValue(value: string | null): number | string | undefined {
  if (value == null) return undefined;
  const raw = value.trim();
  if (!raw) return undefined;
  if (/^-?\d+(\.\d+)?$/.test(raw)) return Number(raw);
  return raw;
}

function parseOffset(value: string | null): [number, number] | undefined {
  if (value == null || value.trim() === "") return undefined;
  const raw = value.trim();
  try {
    if (raw.startsWith("[")) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed) && parsed.length >= 2) {
        const x = Number(parsed[0]);
        const y = Number(parsed[1]);
        if (Number.isFinite(x) && Number.isFinite(y)) return [x, y];
      }
    }
  } catch {
    /* fall through to comma form */
  }
  const parts = raw.split(/[,\s]+/).map((part) => Number(part));
  if (parts.length >= 2 && Number.isFinite(parts[0]) && Number.isFinite(parts[1])) {
    return [parts[0], parts[1]];
  }
  return undefined;
}

@customElement("gk-badge")
export class GkBadge extends LitElement {
  static styles = badgeStyles;

  /** Count or short label. Empty, and not `dot`, hides the badge. */
  @property({
    converter: {
      fromAttribute: parseBadgeValue,
      toAttribute(value: number | string | undefined | null): string | null {
        if (value == null || value === "") return null;
        return String(value);
      },
    },
  })
  value?: number | string;

  @property({ type: Number })
  max = 99;

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  dot = false;

  @property({ reflect: true })
  type: GkBadgeType = "default";

  @property({
    type: Boolean,
    reflect: true,
    attribute: "show-zero",
    converter: falseableBoolean,
  })
  showZero = false;

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  processing = false;

  /** `[x, y]` pixel nudge. Apps can also set `--gk-badge-offset-x/y`. */
  @property({
    converter: {
      fromAttribute: parseOffset,
      toAttribute(value: [number, number] | undefined): string | null {
        if (!value) return null;
        return `${value[0]},${value[1]}`;
      },
    },
  })
  offset?: [number, number];

  private overlayChild() {
    return [...this.childNodes].some((node) => {
      if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
      if (node.nodeType !== Node.ELEMENT_NODE) return false;
      const slot = (node as Element).getAttribute("slot");
      return slot == null || slot === "";
    });
  }

  /** Visible label after max / show-zero rules. Undefined hides the chrome. */
  displayText(): string | undefined {
    if (this.dot) return undefined;
    const value = this.value;
    if (value == null || value === "") return undefined;
    if (typeof value === "number") {
      if (!Number.isFinite(value)) return undefined;
      const n = Math.floor(value);
      if (n === 0 && !this.showZero) return undefined;
      const max = Number.isFinite(this.max) ? Math.floor(this.max) : 99;
      if (n > max) return `${max}+`;
      return String(n);
    }
    const text = String(value).trim();
    return text || undefined;
  }

  private get shown() {
    return this.dot || this.displayText() != null;
  }

  protected override willUpdate(changed: PropertyValues) {
    this.toggleAttribute("standalone", !this.overlayChild());
    if (this.offset && this.offset.length === 2) {
      this.style.setProperty("--gk-badge-offset-x", `${Number(this.offset[0]) || 0}px`);
      this.style.setProperty("--gk-badge-offset-y", `${Number(this.offset[1]) || 0}px`);
    } else if (changed.has("offset")) {
      this.style.removeProperty("--gk-badge-offset-x");
      this.style.removeProperty("--gk-badge-offset-y");
    }
  }

  private badgeName(): string | undefined {
    if (this.hasAttribute("aria-label") || this.hasAttribute("aria-labelledby")) return undefined;
    const text = this.displayText();
    if (this.dot) return english(this) ? "Status" : "狀態";
    if (typeof this.value === "number" && text != null) {
      return english(this) ? `${text} unread` : `${text} 則未讀`;
    }
    return undefined;
  }

  private onSlot = () => {
    this.requestUpdate();
  };

  override render() {
    const text = this.displayText();
    const name = this.shown ? this.badgeName() : undefined;
    const hostNamed =
      this.hasAttribute("aria-label") || this.hasAttribute("aria-labelledby");
    const parts = this.dot ? "badge sup dot" : "badge sup";
    return html`
      <div part="root">
        <div part="wrapper">
          <slot @slotchange=${this.onSlot}></slot>
          ${this.shown
            ? html`<span
                part=${parts}
                ?data-wide=${Boolean(text && text.length > 1)}
                aria-label=${name ?? nothing}
                aria-hidden=${hostNamed ? "true" : nothing}
              >
                ${text != null ? html`<span part="value">${text}</span>` : nothing}
              </span>`
            : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-badge": GkBadge;
  }
}
