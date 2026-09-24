import { LitElement, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { checkboxStyles } from "./gk-checkbox.styles.js";

export type GkCheckboxSize = "sm" | "md" | "lg";

@customElement("gk-checkbox")
export class GkCheckbox extends LitElement {
  static styles = checkboxStyles;

  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ type: Boolean, reflect: true })
  indeterminate = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ reflect: true })
  size: GkCheckboxSize = "md";

  @property()
  value = "";

  @state()
  private hasLabel = false;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this.onHostClick, true);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.onHostClick, true);
    super.disconnectedCallback();
  }

  private onHostClick = (event: Event) => {
    if (this.disabled || this.groupDisabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    this.toggle();
  };

  private groupDisabled() {
    return Boolean(this.closest("gk-checkbox-group")?.hasAttribute("disabled"));
  }

  private toggle() {
    if (this.disabled || this.groupDisabled()) return;
    if (this.indeterminate) {
      this.indeterminate = false;
      this.checked = true;
    } else {
      this.checked = !this.checked;
    }
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected firstUpdated() {
    const slot = this.shadowRoot?.querySelector("slot") as HTMLSlotElement | null;
    if (slot) {
      this.hasLabel = slot.assignedNodes({ flatten: true }).some((node) => {
        if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
        return node.nodeType === Node.ELEMENT_NODE;
      });
    }
  }

  private onSlotChange = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    this.hasLabel = slot.assignedNodes({ flatten: true }).some((node) => {
      if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
      return node.nodeType === Node.ELEMENT_NODE;
    });
  };

  private getAriaChecked(): "true" | "false" | "mixed" {
    if (this.indeterminate) return "mixed";
    return this.checked ? "true" : "false";
  }

  private indicator() {
    if (this.indeterminate) {
      return svg`
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <rect x="3" y="7" width="10" height="2" rx="0.5"></rect>
        </svg>
      `;
    }
    if (this.checked) {
      return svg`
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M6.2 11.1 3.1 8l1.15-1.15L6.2 8.8l5.55-5.55L12.9 4.4 6.2 11.1z"></path>
        </svg>
      `;
    }
    return nothing;
  }

  render() {
    const hostLabel = this.getAttribute("aria-label");
    return html`
      <button
        type="button"
        part="box"
        role="checkbox"
        aria-checked=${this.getAriaChecked()}
        aria-label=${hostLabel || nothing}
        ?disabled=${this.disabled}
      >
        <span part="indicator">${this.indicator()}</span>
      </button>
      <span part="label" ?hidden=${!this.hasLabel}>
        <slot @slotchange=${this.onSlotChange}></slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-checkbox": GkCheckbox;
  }
}
