import { LitElement, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { alertStyles } from "./gk-alert.styles.js";

export type GkAlertType =
  | "default"
  | "info"
  | "success"
  | "warning"
  | "error";

@customElement("gk-alert")
export class GkAlert extends LitElement {
  static styles = alertStyles;

  @property({ reflect: true })
  type: GkAlertType = "default";

  @property({ reflect: true })
  override title = "";

  @property({ type: Boolean, reflect: true })
  bordered = false;

  @property({ type: Boolean, reflect: true })
  closable = false;

  @property({ type: Boolean, reflect: true, attribute: "show-icon" })
  showIcon = true;

  @state()
  private hasIconSlot = false;

  private onIconSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    this.hasIconSlot = slot.assignedNodes({ flatten: true }).length > 0;
  };

  private syncIconSlotState() {
    const slot = this.shadowRoot?.querySelector(
      'slot[name="icon"]',
    ) as HTMLSlotElement | null;
    if (!slot) return;
    this.hasIconSlot = slot.assignedNodes({ flatten: true }).length > 0;
  }

  protected firstUpdated() {
    this.syncIconSlotState();
  }

  private onClose = () => {
    this.dispatchEvent(
      new CustomEvent("gk-close", { bubbles: true, composed: true }),
    );
  };

  private builtinIcon() {
    const iconType = this.type === "default" ? "info" : this.type;
    const paths: Record<string, string> = {
      info: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
      success:
        "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
      warning:
        "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
      error:
        "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z",
    };

    return svg`
      <svg
        class="gk-alert__builtin"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path d=${paths[iconType]} />
      </svg>
    `;
  }

  render() {
    return html`
      <div part="base" role="alert">
        <div part="icon" ?hidden=${!this.showIcon}>
          ${this.hasIconSlot ? nothing : this.builtinIcon()}
          <slot name="icon" @slotchange=${this.onIconSlotChange}></slot>
        </div>
        <div part="body">
          ${this.title
            ? html`<div part="title">${this.title}</div>`
            : nothing}
          <div part="content"><slot></slot></div>
        </div>
        ${this.closable
          ? html`<button
              type="button"
              part="close"
              aria-label="Close"
              @click=${this.onClose}
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
    "gk-alert": GkAlert;
  }
}
