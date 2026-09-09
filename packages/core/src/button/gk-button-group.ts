import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { buttonGroupStyles } from "./gk-button-group.styles.js";

@customElement("gk-button-group")
export class GkButtonGroup extends LitElement {
  static styles = buttonGroupStyles;

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-button-group": GkButtonGroup;
  }
}
