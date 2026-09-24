import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { radioGroupStyles } from "./gk-radio-group.styles.js";
import type { GkRadio, GkRadioSize } from "./gk-radio.js";

@customElement("gk-radio-group")
export class GkRadioGroup extends LitElement {
  static styles = radioGroupStyles;

  @property()
  value = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ reflect: true })
  size: GkRadioSize = "md";

  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute("role")) this.setAttribute("role", "radiogroup");
    this.addEventListener("change", this.onInnerChange, true);
    this.addEventListener("keydown", this.onKeyDown);
  }

  disconnectedCallback() {
    this.removeEventListener("change", this.onInnerChange, true);
    this.removeEventListener("keydown", this.onKeyDown);
    super.disconnectedCallback();
  }

  private radios(): GkRadio[] {
    return [...this.querySelectorAll("gk-radio")] as GkRadio[];
  }

  private enabledRadios() {
    return this.radios().filter((r) => !r.disabled);
  }

  private onInnerChange = (event: Event) => {
    if (event.target === this) return;
    const child = event.composedPath().find(
      (n) => n instanceof HTMLElement && n.tagName === "GK-RADIO",
    ) as GkRadio | undefined;
    if (!child) return;
    event.stopImmediatePropagation();
    if (this.disabled) return;
    this.applyValue(child.value, true);
  };

  private applyValue(next: string, emit: boolean) {
    if (this.value !== next) {
      this.value = next;
    } else {
      this.syncChildren();
    }
    if (emit) {
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private syncChildren() {
    for (const radio of this.radios()) {
      radio.checked = radio.value === this.value;
      if (this.size) radio.size = this.size;
      radio.toggleAttribute("data-gk-group-disabled", this.disabled);
    }
    this.syncTabStops();
  }

  private onSlotChange = () => {
    this.syncChildren();
  };

  private syncTabStops() {
    const enabled = this.enabledRadios();
    const selected = enabled.find((r) => r.value === this.value) ?? enabled[0];
    for (const radio of this.radios()) {
      const btn = radio.shadowRoot?.querySelector(
        "[part='control']",
      ) as HTMLButtonElement | null;
      if (!btn) continue;
      btn.tabIndex = radio === selected ? 0 : -1;
    }
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) return;
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"];
    if (!keys.includes(event.key)) return;
    const enabled = this.enabledRadios();
    if (!enabled.length) return;
    event.preventDefault();
    const i = Math.max(
      0,
      enabled.findIndex((r) => r.value === this.value),
    );
    const dir =
      event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const next = enabled[(i + dir + enabled.length) % enabled.length];
    this.applyValue(next.value, true);
    next.focus();
  };

  protected updated(changed: Map<string, unknown>) {
    if (changed.has("value") || changed.has("size") || changed.has("disabled")) {
      this.syncChildren();
    }
  }

  render() {
    return html`<slot @slotchange=${this.onSlotChange}></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-radio-group": GkRadioGroup;
  }
}
