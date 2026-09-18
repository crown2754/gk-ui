import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("gk-option")
export class GkOption extends LitElement {
  @property()
  value = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-option": GkOption;
  }
}
