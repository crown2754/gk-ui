import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { markOwnedSize, prefersZh } from "../internal/field.js";
import { rateStyles } from "./gk-rate.styles.js";

export type GkRateSize = "sm" | "md" | "lg";

const STAR =
  "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

@customElement("gk-rate")
export class GkRate extends LitElement {
  static styles = rateStyles;

  @property({ type: Number })
  value = 0;

  @property({ type: Number })
  count = 5;

  @property({ type: Boolean, reflect: true, attribute: "allow-half" })
  allowHalf = true;

  @property({ type: Boolean, reflect: true, attribute: "allow-clear" })
  allowClear = true;

  @property({ reflect: true })
  size: GkRateSize = "md";

  @property({ type: Boolean, reflect: true })
  readonly = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property()
  color = "";

  @property()
  name = "";

  @state()
  private preview: number | null = null;

  override attributeChangedCallback(
    name: string,
    old: string | null,
    value: string | null,
  ) {
    super.attributeChangedCallback(name, old, value);
    markOwnedSize(this, name);
  }

  protected override updated() {
    this.toggleAttribute("data-preview", this.preview != null);
    if (this.color) this.style.setProperty("--gk-rate-color", this.color);
    else this.style.removeProperty("--gk-rate-color");
  }

  private get step() {
    return this.allowHalf ? 0.5 : 1;
  }

  private get shown() {
    return this.preview ?? this.value;
  }

  private emit(value: number) {
    const detail = { value };
    this.dispatchEvent(
      new CustomEvent("change", { detail, bubbles: true, composed: true }),
    );
    this.dispatchEvent(
      new CustomEvent("update:value", { detail, bubbles: true, composed: true }),
    );
  }

  private pick(next: number) {
    if (this.disabled || this.readonly) return;
    const value = this.allowClear && next === this.value ? 0 : next;
    this.preview = null;
    this.value = value;
    this.emit(value);
    this.renderRoot.querySelector<HTMLElement>("[part='root']")?.focus();
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (this.disabled || this.readonly) return;
    const step = this.step;
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      next = Math.min(this.count, (this.value || 0) + step);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      next = Math.max(0, (this.value || 0) - step);
    } else if (event.key === "Home") {
      next = this.allowClear ? 0 : step;
    } else if (event.key === "End") {
      next = this.count;
    }
    if (next == null) return;
    event.preventDefault();
    if (next !== this.value) {
      this.value = next;
      this.emit(next);
    }
  };

  private onLeave = () => {
    this.preview = null;
  };

  private fraction(index: number) {
    const shown = this.shown;
    if (shown >= index) return 1;
    if (this.allowHalf && shown >= index - 0.5) return 0.5;
    return 0;
  }

  override render() {
    const zh = prefersZh(this);
    const label = this.getAttribute("aria-label") || (zh ? "評分" : "Rating");
    const labelledBy = this.getAttribute("aria-labelledby");
    const describedBy = this.getAttribute("aria-describedby");
    const indexes = Array.from({ length: Math.max(0, this.count) }, (_, i) => i + 1);
    return html`
      <div
        part="root"
        role="radiogroup"
        tabindex=${this.disabled || this.readonly ? -1 : 0}
        aria-label=${labelledBy ? nothing : label}
        aria-labelledby=${labelledBy || nothing}
        aria-describedby=${describedBy || nothing}
        aria-readonly=${this.readonly ? "true" : "false"}
        aria-disabled=${this.disabled ? "true" : "false"}
        aria-required=${this.getAttribute("aria-required") === "true" ? "true" : nothing}
        aria-invalid=${this.getAttribute("aria-invalid") === "true" ? "true" : nothing}
        @keydown=${this.onKeyDown}
        @pointerleave=${this.onLeave}
      >
        ${indexes.map((index) => this.renderStar(index))}
      </div>
    `;
  }

  private renderStar(index: number) {
    const fraction = this.fraction(index);
    const clip = fraction === 1 ? "inset(0 0 0 0)" : fraction === 0.5 ? "inset(0 50% 0 0)" : "inset(0 100% 0 0)";
    const text = `${this.allowHalf && fraction !== 1 && this.value === index - 0.5 ? index - 0.5 : index} / ${this.count}`;
    const halfValue = index - 0.5;
    return html`
      <span part="item">
        ${this.allowHalf
          ? html`<button
              type="button"
              part="half"
              role="radio"
              tabindex="-1"
              aria-checked=${this.value === halfValue ? "true" : "false"}
              aria-label=${`${halfValue} / ${this.count}`}
              @pointerenter=${() => {
                if (!this.disabled && !this.readonly) this.preview = halfValue;
              }}
              @click=${() => this.pick(halfValue)}
            ></button>`
          : nothing}
        <button
          type="button"
          part="full"
          role="radio"
          tabindex="-1"
          aria-checked=${this.value === index ? "true" : "false"}
          aria-label=${text}
          @pointerenter=${() => {
            if (!this.disabled && !this.readonly) this.preview = index;
          }}
          @click=${() => this.pick(index)}
        ></button>
        <span part="icon" aria-hidden="true">
          <svg part="empty" viewBox="0 0 24 24">
            <path d=${STAR}></path>
          </svg>
          <svg class="fill" viewBox="0 0 24 24" style=${`clip-path: ${clip}`}>
            <path d=${STAR}></path>
          </svg>
        </span>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-rate": GkRate;
  }
}
