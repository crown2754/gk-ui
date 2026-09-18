import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { switchStyles } from "./gk-switch.styles.js";

export type GkSwitchSize = "sm" | "md" | "lg";

@customElement("gk-switch")
export class GkSwitch extends LitElement {
  static styles = switchStyles;

  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ reflect: true })
  size: GkSwitchSize = "md";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  round = true;

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
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    this.toggle();
  };

  private toggle() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private onSlotChange = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    this.hasLabel = this.slotHasLabel(slot);
  };

  private slotHasLabel(slot: HTMLSlotElement) {
    return slot.assignedNodes({ flatten: true }).some((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return Boolean(node.textContent?.trim());
      }
      return node.nodeType === Node.ELEMENT_NODE;
    });
  }

  protected firstUpdated() {
    const slot = this.shadowRoot?.querySelector("slot") as HTMLSlotElement | null;
    if (slot) this.hasLabel = this.slotHasLabel(slot);
  }

  render() {
    const hostLabel = this.getAttribute("aria-label");
    const labelledBy = !hostLabel && this.hasLabel ? "gk-switch-label" : nothing;

    return html`
      <button
        type="button"
        part="track"
        class=${classMap({ round: this.round })}
        role="switch"
        aria-checked=${this.checked ? "true" : "false"}
        aria-label=${hostLabel || nothing}
        aria-labelledby=${labelledBy}
        ?disabled=${this.disabled}
      >
        <span part="thumb"></span>
      </button>
      <span part="label" id="gk-switch-label" ?hidden=${!this.hasLabel}>
        <slot @slotchange=${this.onSlotChange}></slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-switch": GkSwitch;
  }
}
