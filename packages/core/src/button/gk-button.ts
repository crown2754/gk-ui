import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { buttonStyles } from "./gk-button.styles.js";

export type GkButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type GkButtonSize = "sm" | "md" | "lg";
export type GkButtonType = "button" | "submit" | "reset";

@customElement("gk-button")
export class GkButton extends LitElement {
  static styles = buttonStyles;

  @property({ reflect: true })
  variant: GkButtonVariant = "primary";

  @property({ reflect: true })
  size: GkButtonSize = "md";

  @property({ reflect: true })
  type: GkButtonType = "button";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  loading = false;

  @property({ reflect: true })
  href?: string;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this.handleClick, true);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick, true);
    super.disconnectedCallback();
  }

  private handleClick = (event: Event) => {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  private renderContent() {
    return html`
      ${this.loading ? html`<span part="spinner" aria-hidden="true"></span>` : null}
      <span part="label"><slot></slot></span>
    `;
  }

  render() {
    const inactive = this.disabled || this.loading;
    if (this.href) {
      return html`
        <a
          part="base"
          href=${this.href}
          aria-disabled=${inactive ? "true" : "false"}
          tabindex=${inactive ? -1 : 0}
        >
          ${this.renderContent()}
        </a>
      `;
    }
    return html`
      <button
        part="base"
        type=${this.type}
        ?disabled=${inactive}
        aria-busy=${this.loading ? "true" : "false"}
      >
        ${this.renderContent()}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-button": GkButton;
  }
}
