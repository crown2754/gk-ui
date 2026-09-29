import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import type { StyleInfo } from "lit/directives/style-map.js";
import { falseableBoolean } from "../overlay/boolean.js";
import { skeletonStyles } from "./gk-skeleton.styles.js";

function english(el: HTMLElement) {
  return (el.ownerDocument?.documentElement?.lang || "").toLowerCase().startsWith("en");
}

function toCssSize(value: string | number | undefined | null): string | undefined {
  if (value == null || value === "") return undefined;
  if (typeof value === "number") {
    return Number.isFinite(value) ? `${value}px` : undefined;
  }
  const raw = String(value).trim();
  if (!raw) return undefined;
  return /^\d+(\.\d+)?$/.test(raw) ? `${raw}px` : raw;
}

function parseSize(value: string | null): string | number | undefined {
  if (value == null || value.trim() === "") return undefined;
  const raw = value.trim();
  if (/^\d+(\.\d+)?$/.test(raw)) return Number(raw);
  return raw;
}

@customElement("gk-skeleton")
export class GkSkeleton extends LitElement {
  static styles = skeletonStyles;

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  loading = true;

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  animated = true;

  @property({ type: Number })
  repeat = 1;

  /** Text-line placeholder. When no shape is chosen, text rows are the default. */
  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  text = false;

  @property({ type: Number })
  rows = 3;

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  avatar = false;

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  button = false;

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  image = false;

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  round = false;

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  sharp = false;

  @property({
    converter: {
      fromAttribute: parseSize,
      toAttribute(value: string | number | undefined): string | null {
        if (value == null || value === "") return null;
        return String(value);
      },
    },
  })
  width?: string | number;

  @property({
    converter: {
      fromAttribute: parseSize,
      toAttribute(value: string | number | undefined): string | null {
        if (value == null || value === "") return null;
        return String(value);
      },
    },
  })
  height?: string | number;

  private templateFilled() {
    return [...this.children].some((node) => {
      if (node.getAttribute("slot") !== "template") return false;
      return Boolean(node.textContent?.trim() || node.children.length > 0);
    });
  }

  private positive(value: number, fallback: number) {
    const n = Math.floor(Number(value));
    if (!Number.isFinite(n) || n < 1) return fallback;
    return n;
  }

  private sizeStyle(): StyleInfo {
    const width = toCssSize(this.width);
    const height = toCssSize(this.height);
    const style: StyleInfo = {};
    if (width) style.width = width;
    if (height) style.height = height;
    return style;
  }

  private bone(kind: "avatar" | "line" | "button" | "image", sized = false) {
    return html`<div
      part=${`bone ${kind}`}
      class=${this.animated ? "is-animated" : nothing}
      aria-hidden="true"
      style=${sized ? styleMap(this.sizeStyle()) : nothing}
    ></div>`;
  }

  private textLines() {
    const count = this.positive(this.rows, 3);
    return html`<div part="text">
      ${Array.from({ length: count }, () => this.bone("line"))}
    </div>`;
  }

  private avatarRow(withText: boolean, withAvatar: boolean) {
    return html`<div class="gk-skeleton__row">
      ${withAvatar ? this.bone("avatar") : nothing}
      ${withText ? html`<div class="gk-skeleton__text">${this.textLines()}</div>` : nothing}
    </div>`;
  }

  private renderBlock() {
    const template = this.templateFilled();
    const sized = Boolean(toCssSize(this.width) || toCssSize(this.height));
    const text =
      this.text || (!this.avatar && !this.button && !this.image && !sized && !template);
    if (this.image && (this.avatar || text)) {
      return html`<div class="gk-skeleton__block">
        ${this.bone("image", true)}
        ${this.avatarRow(text, this.avatar)}
      </div>`;
    }
    if (this.avatar && text) return this.avatarRow(true, true);
    if (this.avatar) return this.bone("avatar");
    if (this.button) return this.bone("button", true);
    if (this.image || (sized && !text)) return this.bone("image", true);
    return this.textLines();
  }

  private renderPreset() {
    const count = this.positive(this.repeat, 1);
    const buttonsOnly = this.button && !this.text && !this.avatar && !this.image;
    return html`<div class=${buttonsOnly ? "gk-skeleton__row" : "gk-skeleton__stack"}>
      ${Array.from({ length: count }, () => this.renderBlock())}
    </div>`;
  }

  private onTemplate = () => {
    this.requestUpdate();
  };

  protected override willUpdate() {
    if (this.loading) this.setAttribute("aria-busy", "true");
    else this.removeAttribute("aria-busy");
  }

  override render() {
    const loadingText = english(this) ? "Loading" : "載入中";
    const template = this.templateFilled();
    return html`
      <div part="root">
        <div part="placeholder" ?hidden=${!this.loading}>
          ${this.loading
            ? html`<span class="sr" aria-live="polite">${loadingText}</span>`
            : nothing}
          <slot name="template" @slotchange=${this.onTemplate}></slot>
          ${this.loading && !template ? this.renderPreset() : nothing}
        </div>
        <div part="content" ?hidden=${this.loading}>
          <slot @slotchange=${this.onTemplate}></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-skeleton": GkSkeleton;
  }
}
