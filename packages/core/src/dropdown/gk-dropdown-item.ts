import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { falseableBoolean } from "../overlay/boolean.js";
import { dropdownItemStyles } from "./gk-dropdown.styles.js";

let uid = 0;

export type GkDropdownItemType = "item" | "divider";

@customElement("gk-dropdown-item")
export class GkDropdownItem extends LitElement {
  static styles = dropdownItemStyles;

  @property({ attribute: "key", reflect: true })
  itemKey = "";

  @property()
  label = "";

  @property()
  shortcut = "";

  @property({ reflect: true })
  type: GkDropdownItemType = "item";

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  disabled = false;

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  danger = false;

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  active = false;

  readonly itemId = `gk-dropdown-item-${++uid}`;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this.onClick);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.onClick);
    super.disconnectedCallback();
  }

  private onClick = (event: Event) => {
    if (this.disabled || this.type === "divider") {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.dispatchEvent(
      new CustomEvent("gk-item-select", {
        detail: { key: this.itemKey, item: this },
        bubbles: true,
        composed: true,
      }),
    );
  };

  render() {
    if (this.type === "divider") {
      return html`<div part="divider" role="separator"></div>`;
    }
    return html`
      <button
        type="button"
        part="item"
        id=${this.itemId}
        role="menuitem"
        tabindex=${this.active ? "0" : "-1"}
        aria-disabled=${this.disabled ? "true" : "false"}
        ?disabled=${this.disabled}
      >
        <span part="label"><slot>${this.label}</slot></span>
        ${this.shortcut
          ? html`<span part="shortcut">${this.shortcut}</span>`
          : nothing}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-dropdown-item": GkDropdownItem;
  }
}
