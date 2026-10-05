import { LitElement, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { markOwnedSize, prefersZh } from "../internal/field.js";
import { inputNumberStyles } from "./gk-input-number.styles.js";
import { clampNumber, parseLoose, stepPrecision } from "./number-utils.js";

export type GkInputNumberSize = "sm" | "md" | "lg";
export type GkInputNumberStatus = "success" | "warning" | "error" | "";
export type GkInputNumberPlacement = "right" | "both";

const nullableNumber = {
  fromAttribute(value: string | null) {
    if (value == null || value.trim() === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  },
  toAttribute(value: number | null) {
    return value == null ? null : String(value);
  },
};

@customElement("gk-input-number")
export class GkInputNumber extends LitElement {
  static styles = inputNumberStyles;
  static formAssociated = true;

  @property({ reflect: true, converter: nullableNumber })
  value: number | null = null;

  @property({ converter: nullableNumber })
  min: number | null = null;

  @property({ converter: nullableNumber })
  max: number | null = null;

  @property({ type: Number })
  step = 1;

  @property({ converter: nullableNumber })
  precision: number | null = null;

  @property({ reflect: true })
  size: GkInputNumberSize = "md";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  readonly = false;

  @property()
  placeholder = "";

  @property({ reflect: true })
  status: GkInputNumberStatus = "";

  @property({ type: Boolean, reflect: true, attribute: "show-button" })
  showButton = true;

  @property({ reflect: true, attribute: "button-placement" })
  buttonPlacement: GkInputNumberPlacement = "right";

  @property({ reflect: true })
  name = "";

  @state()
  private hasPrefix = false;

  @state()
  private hasSuffix = false;

  @state()
  private suffixText = "";

  @state()
  private focused = false;

  private draft: string | null = null;
  private readonly internals =
    typeof ElementInternals === "undefined"
      ? undefined
      : (this as unknown as { attachInternals?: () => ElementInternals }).attachInternals?.();

  override attributeChangedCallback(
    name: string,
    old: string | null,
    value: string | null,
  ) {
    super.attributeChangedCallback(name, old, value);
    markOwnedSize(this, name);
  }

  protected override firstUpdated() {
    this.syncSlots();
  }

  protected override updated() {
    this.syncFormState();
  }

  private resolvedPrecision() {
    return this.precision == null ? stepPrecision(this.step) : this.precision;
  }

  private normalizeNumber(value: number) {
    return clampNumber(value, this.min, this.max, this.resolvedPrecision());
  }

  private format(value: number | null) {
    if (value == null) return "";
    return this.normalizeNumber(value).toFixed(this.resolvedPrecision());
  }

  private displayValue() {
    if (this.focused && this.draft != null) return this.draft;
    return this.format(this.value);
  }

  private atBound(which: "min" | "max") {
    const limit = which === "min" ? this.min : this.max;
    if (limit == null || this.value == null) return false;
    return which === "min" ? this.value <= limit : this.value >= limit;
  }

  private emit(name: "input" | "change" | "update:value", value: number | null) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private commit(next: number | null, stream: boolean) {
    const previous = this.value;
    this.draft = null;
    this.value = next;
    if (stream) this.emit("input", next);
    if (previous !== next) {
      this.emit("change", next);
      this.emit("update:value", next);
    }
  }

  private stepBy(direction: 1 | -1) {
    if (this.disabled || this.readonly) return;
    if (direction > 0 && this.atBound("max")) return;
    if (direction < 0 && this.atBound("min")) return;
    const parsed =
      this.focused && this.draft != null ? parseLoose(this.draft) : this.value;
    const base = typeof parsed === "number" ? parsed : (this.value ?? 0);
    this.commit(this.normalizeNumber(base + direction * this.step), true);
  }

  private commitDraft() {
    const text = this.draft ?? this.format(this.value);
    const parsed = parseLoose(text);
    const input = this.renderRoot.querySelector<HTMLInputElement>("[part='input']");
    if (parsed === "partial" || parsed === "invalid") {
      this.draft = null;
      if (input) input.value = this.format(this.value);
      this.requestUpdate();
      return;
    }
    const next = parsed == null ? null : this.normalizeNumber(parsed);
    this.commit(next, previousDiffers(this.value, next));
    if (input) input.value = this.format(this.value);
  }

  private onInput = (event: Event) => {
    event.stopPropagation();
    const input = event.target as HTMLInputElement;
    this.draft = input.value;
    const parsed = parseLoose(input.value);
    if (typeof parsed === "number") this.emit("input", parsed);
    else if (parsed === null) this.emit("input", null);
  };

  private onKeyDown = (event: KeyboardEvent) => {
    if (this.disabled || this.readonly) return;
    if (event.key === "ArrowUp") {
      event.preventDefault();
      this.stepBy(1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      this.stepBy(-1);
    } else if (event.key === "Enter") {
      this.commitDraft();
    }
  };

  private onFocus = () => {
    this.focused = true;
    this.draft = this.format(this.value);
    this.dispatchEvent(new CustomEvent("focus", { bubbles: true, composed: true }));
  };

  private onBlur = () => {
    this.focused = false;
    this.commitDraft();
    this.dispatchEvent(new CustomEvent("blur", { bubbles: true, composed: true }));
  };

  private onStepMouseDown = (event: Event) => {
    event.preventDefault();
  };

  private onPrefixSlot = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    this.hasPrefix = slot.assignedNodes({ flatten: true }).length > 0;
  };

  private onSuffixSlot = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    const nodes = slot.assignedNodes({ flatten: true });
    this.hasSuffix = nodes.length > 0;
    this.suffixText = nodes
      .map((node) => node.textContent ?? "")
      .join("")
      .trim();
  };

  private syncSlots() {
    this.renderRoot.querySelector<HTMLSlotElement>("slot[name='prefix']")?.dispatchEvent(
      new Event("slotchange"),
    );
    this.renderRoot.querySelector<HTMLSlotElement>("slot[name='suffix']")?.dispatchEvent(
      new Event("slotchange"),
    );
  }

  private syncFormState() {
    if (!this.internals) return;
    const formValue =
      this.disabled || !this.name || this.value == null ? null : String(this.value);
    this.internals.setFormValue(formValue);
  }

  private labels() {
    const zh = prefersZh(this);
    return {
      increase: zh ? "增加" : "Increase",
      decrease: zh ? "減少" : "Decrease",
    };
  }

  private chevron(direction: "up" | "down") {
    const path =
      direction === "up"
        ? "M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z"
        : "M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z";
    return svg`
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d=${path}></path>
      </svg>
    `;
  }

  private stepperButtons() {
    const labels = this.labels();
    const atMax = this.atBound("max");
    const atMin = this.atBound("min");
    const increment = html`<button
      type="button"
      part="increment"
      aria-label=${labels.increase}
      aria-disabled=${this.disabled || atMax ? "true" : "false"}
      ?disabled=${this.disabled || atMax}
      @mousedown=${this.onStepMouseDown}
      @click=${() => this.stepBy(1)}
    >
      ${this.buttonPlacement === "both" ? "+" : this.chevron("up")}
    </button>`;
    const decrement = html`<button
      type="button"
      part="decrement"
      aria-label=${labels.decrease}
      aria-disabled=${this.disabled || atMin ? "true" : "false"}
      ?disabled=${this.disabled || atMin}
      @mousedown=${this.onStepMouseDown}
      @click=${() => this.stepBy(-1)}
    >
      ${this.buttonPlacement === "both" ? "−" : this.chevron("down")}
    </button>`;
    return { increment, decrement };
  }

  override render() {
    const showSteppers = this.showButton && !this.readonly;
    const steppers = showSteppers ? this.stepperButtons() : null;
    const text = this.displayValue();
    const labelledBy = this.getAttribute("aria-labelledby");
    const describedBy = this.getAttribute("aria-describedby");
    return html`
      <div class="field" part=${this.buttonPlacement === "both" ? "controls" : nothing}>
        ${this.buttonPlacement === "both" && steppers ? steppers.decrement : nothing}
        <div part="base">
          <div part="input-wrap">
            <span part="prefix" ?hidden=${!this.hasPrefix}>
              <slot name="prefix" @slotchange=${this.onPrefixSlot}></slot>
            </span>
            <input
              part="input"
              type="text"
              inputmode="decimal"
              role="spinbutton"
              .value=${text}
              placeholder=${this.placeholder}
              name=${this.name || nothing}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              aria-valuemin=${this.min ?? nothing}
              aria-valuemax=${this.max ?? nothing}
              aria-valuenow=${this.value ?? nothing}
              aria-valuetext=${
                this.suffixText && text !== "" ? `${text} ${this.suffixText}` : nothing
              }
              aria-labelledby=${labelledBy || nothing}
              aria-describedby=${describedBy || nothing}
              aria-required=${this.getAttribute("aria-required") === "true" ? "true" : nothing}
              aria-invalid=${this.getAttribute("aria-invalid") === "true" ? "true" : nothing}
              @input=${this.onInput}
              @change=${(event: Event) => event.stopPropagation()}
              @keydown=${this.onKeyDown}
              @focus=${this.onFocus}
              @blur=${this.onBlur}
            />
            <span part="suffix" ?hidden=${!this.hasSuffix}>
              <slot name="suffix" @slotchange=${this.onSuffixSlot}></slot>
            </span>
          </div>
          ${this.buttonPlacement !== "both" && steppers
            ? html`<div part="controls">${steppers.increment}${steppers.decrement}</div>`
            : nothing}
        </div>
        ${this.buttonPlacement === "both" && steppers ? steppers.increment : nothing}
      </div>
    `;
  }
}

function previousDiffers(previous: number | null, next: number | null) {
  return previous !== next;
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-input-number": GkInputNumber;
  }
}
