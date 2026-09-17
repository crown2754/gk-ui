import { LitElement, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { inputStyles } from "./gk-input.styles.js";

export type GkInputType = "text" | "password" | "textarea";
export type GkInputSize = "sm" | "md" | "lg";
export type GkInputStatus = "success" | "warning" | "error" | "";

@customElement("gk-input")
export class GkInput extends LitElement {
  static styles = inputStyles;

  @property({ reflect: true })
  type: GkInputType = "text";

  @property({ reflect: true })
  size: GkInputSize = "md";

  @property()
  value = "";

  @property()
  placeholder = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  readonly = false;

  @property({ type: Boolean, reflect: true })
  clearable = false;

  @property({ type: Boolean, reflect: true })
  round = false;

  @property({ reflect: true })
  status: GkInputStatus = "";

  @property({ type: Number })
  rows = 3;

  @property({ reflect: true })
  name = "";

  @state()
  private passwordVisible = false;

  @state()
  private hasPrefixSlot = false;

  @state()
  private hasSuffixSlot = false;

  private onPrefixSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    this.hasPrefixSlot = slot.assignedNodes({ flatten: true }).length > 0;
  };

  private onSuffixSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    this.hasSuffixSlot = slot.assignedNodes({ flatten: true }).length > 0;
  };

  private syncSlotState() {
    const prefixSlot = this.shadowRoot?.querySelector(
      'slot[name="prefix"]',
    ) as HTMLSlotElement | null;
    const suffixSlot = this.shadowRoot?.querySelector(
      'slot[name="suffix"]',
    ) as HTMLSlotElement | null;
    if (prefixSlot) {
      this.hasPrefixSlot =
        prefixSlot.assignedNodes({ flatten: true }).length > 0;
    }
    if (suffixSlot) {
      this.hasSuffixSlot =
        suffixSlot.assignedNodes({ flatten: true }).length > 0;
    }
  }

  protected firstUpdated() {
    this.syncSlotState();
  }

  private emit(name: "input" | "change") {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private onNativeInput = (e: Event) => {
    const t = e.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = t.value;
    this.emit("input");
  };

  private onNativeChange = () => {
    this.emit("change");
  };

  private onClear = () => {
    if (this.disabled || this.readonly) return;
    this.value = "";
    this.emit("input");
    this.emit("change");
  };

  private onTogglePassword = () => {
    this.passwordVisible = !this.passwordVisible;
  };

  /** Clear when clearable + non-empty + interactive (includes textarea). */
  private get showClearButton() {
    return (
      this.clearable &&
      !this.disabled &&
      !this.readonly &&
      this.value.length > 0
    );
  }

  private get showPasswordToggle() {
    return this.type === "password" && !this.disabled;
  }

  private get showSuffixWrapper() {
    return (
      this.hasSuffixSlot || this.showClearButton || this.showPasswordToggle
    );
  }

  private nativeType(): string {
    if (this.type === "password") {
      return this.passwordVisible ? "text" : "password";
    }
    return "text";
  }

  private clearIcon() {
    return svg`
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
        />
      </svg>
    `;
  }

  private eyeIcon() {
    return svg`
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
        />
      </svg>
    `;
  }

  private eyeOffIcon() {
    return svg`
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
        />
      </svg>
    `;
  }

  render() {
    const control =
      this.type === "textarea"
        ? html`<textarea
            part="input"
            .value=${this.value}
            placeholder=${this.placeholder}
            .rows=${this.rows}
            name=${this.name || nothing}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            @input=${this.onNativeInput}
            @change=${this.onNativeChange}
          ></textarea>`
        : html`<input
            part="input"
            type=${this.nativeType()}
            .value=${this.value}
            placeholder=${this.placeholder}
            name=${this.name || nothing}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            @input=${this.onNativeInput}
            @change=${this.onNativeChange}
          />`;

    return html`
      <div part="base">
        <span part="prefix" ?hidden=${!this.hasPrefixSlot}>
          <slot name="prefix" @slotchange=${this.onPrefixSlotChange}></slot>
        </span>
        ${control}
        <span part="suffix" ?hidden=${!this.showSuffixWrapper}>
          <slot name="suffix" @slotchange=${this.onSuffixSlotChange}></slot>
          ${this.showClearButton
            ? html`<button
                type="button"
                part="clear"
                aria-label="Clear"
                @click=${this.onClear}
              >
                ${this.clearIcon()}
              </button>`
            : nothing}
          ${this.showPasswordToggle
            ? html`<button
                type="button"
                part="password-toggle"
                aria-label=${this.passwordVisible
                  ? "Hide password"
                  : "Show password"}
                @click=${this.onTogglePassword}
              >
                ${this.passwordVisible ? this.eyeOffIcon() : this.eyeIcon()}
              </button>`
            : nothing}
        </span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-input": GkInput;
  }
}
