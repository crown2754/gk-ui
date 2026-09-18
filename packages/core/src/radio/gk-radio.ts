import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { radioStyles } from "./gk-radio.styles.js";

export type GkRadioSize = "sm" | "md" | "lg";

@customElement("gk-radio")
export class GkRadio extends LitElement {
  static styles = radioStyles;

  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ reflect: true })
  size: GkRadioSize = "md";

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

  override focus(options?: FocusOptions) {
    const btn = this.shadowRoot?.querySelector(
      "[part='control']",
    ) as HTMLButtonElement | null;
    (btn ?? this).focus(options);
  }

  private groupDisabled() {
    return Boolean(this.closest("gk-radio-group")?.hasAttribute("disabled"));
  }

  private inGroup() {
    return Boolean(this.closest("gk-radio-group"));
  }

  private onHostClick = (event: Event) => {
    if (this.disabled || this.groupDisabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    this.select();
  };

  private select() {
    if (this.disabled || this.groupDisabled()) return;
    const was = this.checked;
    this.checked = true;
    if (was) return;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value },
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

  render() {
    const hostLabel = this.getAttribute("aria-label");
    return html`
      <button
        type="button"
        part="control"
        role="radio"
        aria-checked=${this.checked ? "true" : "false"}
        aria-label=${hostLabel || nothing}
        tabindex=${this.inGroup() ? (this.checked ? 0 : -1) : 0}
        ?disabled=${this.disabled}
      >
        <span part="dot"></span>
      </button>
      <span part="label" ?hidden=${!this.hasLabel}>
        <slot @slotchange=${this.onSlotChange}></slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-radio": GkRadio;
  }
}
