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

  render() {
    return html`<button part="base" type=${this.type} ?disabled=${this.disabled || this.loading}>
      <slot></slot>
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-button": GkButton;
  }
}
