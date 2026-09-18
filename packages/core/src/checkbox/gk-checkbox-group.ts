import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { checkboxGroupStyles } from "./gk-checkbox-group.styles.js";
import type { GkCheckbox, GkCheckboxSize } from "./gk-checkbox.js";

@customElement("gk-checkbox-group")
export class GkCheckboxGroup extends LitElement {
  static styles = checkboxGroupStyles;

  @property({ type: Array })
  value: string[] = [];

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ reflect: true })
  size: GkCheckboxSize = "md";

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("change", this.onInnerChange, true);
  }

  disconnectedCallback() {
    this.removeEventListener("change", this.onInnerChange, true);
    super.disconnectedCallback();
  }

  private checkboxes(): GkCheckbox[] {
    return [...this.querySelectorAll("gk-checkbox")] as GkCheckbox[];
  }

  private onInnerChange = (event: Event) => {
    if (event.target === this) return;
    const path = event.composedPath();
    const child = path.find(
      (n) => n instanceof HTMLElement && n.tagName === "GK-CHECKBOX",
    ) as GkCheckbox | undefined;
    if (!child) return;
    event.stopImmediatePropagation();
    if (this.disabled) return;
    const next = new Set(this.value);
    if (child.checked) next.add(child.value);
    else next.delete(child.value);
    this.value = [...next];
    this.syncChildren();
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private syncChildren() {
    const selected = new Set(this.value);
    for (const box of this.checkboxes()) {
      box.checked = selected.has(box.value);
      if (this.size) box.size = this.size;
    }
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has("value") || changed.has("size") || changed.has("disabled")) {
      this.syncChildren();
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-checkbox-group": GkCheckboxGroup;
  }
}
