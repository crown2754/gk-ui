import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { PropertyValues } from "lit";
import { tagStyles } from "./gk-tag.styles.js";

export type GkTagType =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info";

export type GkTagSize = "sm" | "md" | "lg";

let uid = 0;

@customElement("gk-tag")
export class GkTag extends LitElement {
  static styles = tagStyles;

  @property({ reflect: true })
  type: GkTagType = "default";

  /**
   * Alias of `type`. Prefer `type` in docs.
   * When both attributes are present on the first render, `type` wins.
   */
  @property({ attribute: "variant" })
  variant: GkTagType | "" = "";

  @property({ reflect: true })
  size: GkTagSize = "md";

  @property({ type: Boolean, reflect: true })
  bordered = false;

  @property({ type: Boolean, reflect: true })
  round = false;

  @property({ type: Boolean, reflect: true })
  closable = false;

  @property({ type: Boolean, reflect: true })
  checkable = false;

  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Optional custom fill. Sets `--gk-tag-color` on the host. */
  @property({ reflect: true })
  color = "";

  @state()
  private hasIcon = false;

  private readonly labelId = `gk-tag-label-${++uid}`;

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this.onHostClick);
    this.addEventListener("keydown", this.onHostKeyDown);
  }

  override disconnectedCallback() {
    this.removeEventListener("click", this.onHostClick);
    this.removeEventListener("keydown", this.onHostKeyDown);
    super.disconnectedCallback();
  }

  protected override willUpdate(changed: PropertyValues) {
    const variantChanged = changed.has("variant") && this.variant;
    const typeJustSet = changed.has("type") && this.hasAttribute("type");
    if (variantChanged && !typeJustSet) this.type = this.variant as GkTagType;
    if (this.color) this.style.setProperty("--gk-tag-color", this.color);
    else this.style.removeProperty("--gk-tag-color");
    if (this.disabled) this.setAttribute("aria-disabled", "true");
    else this.removeAttribute("aria-disabled");
  }

  private fromClose(event: Event) {
    return event.composedPath().some(
      (node) => node instanceof Element && node.getAttribute("part") === "close",
    );
  }

  private onHostClick = (event: Event) => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (this.fromClose(event) || !this.checkable) return;
    this.toggle();
  };

  private onHostKeyDown = (event: KeyboardEvent) => {
    if (!this.checkable || this.disabled || event.repeat) return;
    if (this.fromClose(event)) return;
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    this.toggle();
  };

  private toggle() {
    if (!this.checkable || this.disabled) return;
    this.checked = !this.checked;
    const detail = { checked: this.checked };
    this.dispatchEvent(
      new CustomEvent("update:checked", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("check", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private onCloseClick = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent("close", { bubbles: true, composed: true }),
    );
  };

  private closeLabel() {
    const lang = (this.ownerDocument?.documentElement?.lang || "").toLowerCase();
    return lang.startsWith("zh") ? "關閉" : "Close";
  }

  private onIconSlot = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    this.hasIcon = slot.assignedNodes({ flatten: true }).some((node) => {
      if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
      return node.nodeType === Node.ELEMENT_NODE;
    });
  };

  protected override firstUpdated() {
    const slot = this.shadowRoot?.querySelector(
      'slot[name="icon"]',
    ) as HTMLSlotElement | null;
    if (!slot) return;
    this.hasIcon = slot.assignedNodes({ flatten: true }).length > 0;
  }

  override render() {
    const interactive = this.checkable && !this.disabled;
    return html`
      <div
        part="base"
        role=${this.checkable ? "checkbox" : nothing}
        aria-checked=${this.checkable ? (this.checked ? "true" : "false") : nothing}
        aria-disabled=${this.disabled ? "true" : nothing}
        aria-labelledby=${this.checkable ? this.labelId : nothing}
        tabindex=${interactive ? "0" : nothing}
      >
        <span part="icon" ?hidden=${!this.hasIcon}>
          <slot name="icon" @slotchange=${this.onIconSlot}></slot>
        </span>
        <span part="content" id=${this.labelId}><slot></slot></span>
        ${this.checkable
          ? html`<span
              part="check-indicator"
              ?hidden=${!this.checked}
              aria-hidden="true"
            ></span>`
          : nothing}
        ${this.closable
          ? html`<button
              type="button"
              part="close"
              aria-label=${this.closeLabel()}
              tabindex=${this.disabled ? "-1" : "0"}
              @click=${this.onCloseClick}
            >
              ×
            </button>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-tag": GkTag;
  }
}
