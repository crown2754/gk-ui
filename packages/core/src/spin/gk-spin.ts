import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { PropertyValues } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { falseableBoolean } from "../overlay/boolean.js";
import { spinStyles } from "./gk-spin.styles.js";

export type GkSpinSize = "sm" | "md" | "lg";

@customElement("gk-spin")
export class GkSpin extends LitElement {
  static styles = spinStyles;

  /** Prefer `show` in docs. Alias: `spinning`. */
  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  show = true;

  @property({ type: Boolean, attribute: "spinning", converter: falseableBoolean })
  get spinning(): boolean {
    return this.show;
  }

  set spinning(value: boolean) {
    const old = this.show;
    this.show = value;
    this.requestUpdate("spinning", old);
  }

  @property({ reflect: true })
  size: GkSpinSize = "md";

  /** Prefer `description` in docs. Alias: `tip`. */
  @property()
  description = "";

  @property({ attribute: "tip" })
  get tip(): string {
    return this.description;
  }

  set tip(value: string) {
    const old = this.description;
    this.description = value;
    this.requestUpdate("tip", old);
  }

  @property({ type: Number })
  delay = 0;

  @property({ type: Number, attribute: "stroke-width" })
  strokeWidth?: number;

  @state()
  private hasContent = false;

  @state()
  private activeTick = 0;

  private _active = false;
  private timer: ReturnType<typeof setTimeout> | undefined;

  get active(): boolean {
    return this._active;
  }

  override disconnectedCallback() {
    clearTimeout(this.timer);
    super.disconnectedCallback();
  }

  protected override willUpdate(changed: PropertyValues) {
    if (!this.hasUpdated || changed.has("show") || changed.has("delay")) {
      this.queueActive();
    }
    this.toggleAttribute("data-has-content", this.hasContent);
    this.toggleAttribute("data-spinning", this._active);
  }

  private queueActive() {
    clearTimeout(this.timer);
    if (!this.show) {
      this._active = false;
      return;
    }
    const delay = Number(this.delay) || 0;
    if (delay <= 0) {
      this._active = true;
      return;
    }
    this._active = false;
    this.timer = setTimeout(() => {
      if (!this.show) return;
      this._active = true;
      this.activeTick += 1;
    }, delay);
  }

  private statusText() {
    if (this.description) return this.description;
    const lang = (this.ownerDocument?.documentElement?.lang || "").toLowerCase();
    return lang.startsWith("zh") ? "載入中" : "Loading";
  }

  private onSlotChange = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    this.hasContent = slot.assignedNodes({ flatten: true }).some((node) => {
      if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
      return node.nodeType === Node.ELEMENT_NODE;
    });
  };

  protected override firstUpdated() {
    const slot = this.shadowRoot?.querySelector("slot") as HTMLSlotElement | null;
    if (!slot) return;
    this.hasContent = slot.assignedNodes({ flatten: true }).some((node) => {
      if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
      return node.nodeType === Node.ELEMENT_NODE;
    });
  }

  private spinner() {
    const visibleTip = this.description.trim().length > 0;
    const ringStyle =
      this.strokeWidth != null ? `border-width: ${this.strokeWidth}px` : nothing;
    return html`
      <div
        part="spinner"
        role=${this._active ? "status" : nothing}
        aria-live=${this._active ? "polite" : nothing}
        aria-hidden=${this._active ? "false" : "true"}
        ?hidden=${!this._active}
      >
        <span class="gk-spin__ring" aria-hidden="true" style=${ringStyle}></span>
        <span part="tip" class=${classMap({ sr: !visibleTip })}>${this.statusText()}</span>
      </div>
    `;
  }

  override render() {
    void this.activeTick;
    return html`
      <div part="container" aria-busy=${this._active ? "true" : nothing}>
        <div part="content">
          <slot @slotchange=${this.onSlotChange}></slot>
        </div>
        ${this.hasContent && this._active
          ? html`<div part="mask">${this.spinner()}</div>`
          : nothing}
        ${this.hasContent ? nothing : this.spinner()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-spin": GkSpin;
  }
}
