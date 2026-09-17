import { LitElement, html, nothing, svg, render } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  datePickerStyles,
  datePickerPanelCssText,
} from "./gk-date-picker.styles.js";
import {
  buildMonthGrid,
  formatDisplay,
  isValidIsoDate,
  parseIsoDate,
  todayIso,
} from "./date-utils.js";

export type GkDatePickerType = "date";
export type GkDatePickerSize = "sm" | "md" | "lg";
export type GkDatePickerStatus = "success" | "warning" | "error" | "";
export type GkDatePickerLocale = "en" | "zh-TW";

const WEEKDAYS: Record<GkDatePickerLocale, string[]> = {
  en: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  "zh-TW": ["日", "一", "二", "三", "四", "五", "六"],
};

const LABELS: Record<GkDatePickerLocale, { clear: string; now: string }> = {
  en: { clear: "Clear", now: "Now" },
  "zh-TW": { clear: "清除", now: "現在" },
};

const PANEL_STYLE_ID = "gk-date-picker-panel-style";

@customElement("gk-date-picker")
export class GkDatePicker extends LitElement {
  static styles = datePickerStyles;

  @property({ reflect: true })
  type: GkDatePickerType = "date";

  @property()
  value = "";

  @property()
  format = "yyyy-MM-dd";

  @property({ reflect: true })
  size: GkDatePickerSize = "md";

  @property()
  placeholder = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  clearable = false;

  @property({ type: Boolean, reflect: true })
  round = false;

  @property({ reflect: true })
  status: GkDatePickerStatus = "";

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ reflect: true })
  locale: GkDatePickerLocale = "en";

  /** Property-only: return true to disable a calendar day (ISO `YYYY-MM-DD`). */
  @property({ attribute: false })
  isDateDisabled?: (iso: string) => boolean;

  @state()
  private viewYear = new Date().getFullYear();

  @state()
  private viewMonth = new Date().getMonth();

  private panel: HTMLDivElement | null = null;
  private listenersBound = false;

  connectedCallback() {
    super.connectedCallback();
    this.syncViewFromValue();
    if (this.open) {
      this.ensurePanel();
      this.bindDismissListeners();
    }
  }

  disconnectedCallback() {
    this.unbindDismissListeners();
    this.teardownPanel();
    super.disconnectedCallback();
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has("value")) {
      this.syncViewFromValue();
    }
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has("open")) {
      if (this.open) {
        this.ensurePanel();
        this.bindDismissListeners();
      } else {
        this.unbindDismissListeners();
        this.teardownPanel();
      }
    }
    if (
      this.open &&
      (changed.has("value") ||
        changed.has("locale") ||
        changed.has("isDateDisabled") ||
        changed.has("viewYear") ||
        changed.has("viewMonth") ||
        changed.has("open"))
    ) {
      this.renderPanel();
    }
  }

  private syncViewFromValue() {
    const d = parseIsoDate(this.value);
    if (d) {
      this.viewYear = d.getFullYear();
      this.viewMonth = d.getMonth();
    }
  }

  private setOpen(next: boolean) {
    if (this.open === next) return;
    this.open = next;
    this.dispatchEvent(
      new CustomEvent("gk-open-change", {
        detail: { open: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private emitValue(next: string) {
    this.value = next;
    this.dispatchEvent(
      new CustomEvent("input", {
        detail: { value: next },
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private onTriggerClick = (e: Event) => {
    if (this.disabled) return;
    const t = e.target as HTMLElement | null;
    if (t?.closest?.("[part='clear']")) return;
    this.setOpen(!this.open);
  };

  private onClearClick = (e: Event) => {
    e.stopPropagation();
    if (this.disabled) return;
    this.emitValue("");
  };

  private onDayClick = (iso: string) => {
    if (this.isDateDisabled?.(iso)) return;
    this.emitValue(iso);
    this.setOpen(false);
  };

  private onPanelClear = () => {
    this.emitValue("");
    this.setOpen(false);
  };

  private onPanelNow = () => {
    const iso = todayIso();
    if (this.isDateDisabled?.(iso)) return;
    this.emitValue(iso);
    this.setOpen(false);
  };

  private shiftMonth(delta: number) {
    let y = this.viewYear;
    let m = this.viewMonth + delta;
    while (m < 0) {
      m += 12;
      y -= 1;
    }
    while (m > 11) {
      m -= 12;
      y += 1;
    }
    this.viewYear = y;
    this.viewMonth = m;
  }

  private onDocumentClick = (e: MouseEvent) => {
    if (!this.open) return;
    const path = e.composedPath();
    if (path.includes(this) || (this.panel && path.includes(this.panel))) {
      return;
    }
    this.setOpen(false);
  };

  private onDocumentKeydown = (e: KeyboardEvent) => {
    if (!this.open) return;
    if (e.key === "Escape") {
      this.setOpen(false);
    }
  };

  private bindDismissListeners() {
    if (this.listenersBound) return;
    document.addEventListener("click", this.onDocumentClick, true);
    document.addEventListener("keydown", this.onDocumentKeydown, true);
    this.listenersBound = true;
  }

  private unbindDismissListeners() {
    if (!this.listenersBound) return;
    document.removeEventListener("click", this.onDocumentClick, true);
    document.removeEventListener("keydown", this.onDocumentKeydown, true);
    this.listenersBound = false;
  }

  private ensurePanel() {
    if (!document.getElementById(PANEL_STYLE_ID)) {
      const styleEl = document.createElement("style");
      styleEl.id = PANEL_STYLE_ID;
      styleEl.textContent = datePickerPanelCssText;
      document.head.appendChild(styleEl);
    }
    if (!this.panel) {
      this.panel = document.createElement("div");
      this.panel.className = "gk-date-picker-panel";
      this.panel.setAttribute("part", "panel");
      document.body.appendChild(this.panel);
    }
    this.positionPanel();
    this.renderPanel();
  }

  private teardownPanel() {
    if (this.panel) {
      render(nothing, this.panel);
      this.panel.remove();
      this.panel = null;
    }
    if (!document.querySelector(".gk-date-picker-panel")) {
      document.getElementById(PANEL_STYLE_ID)?.remove();
    }
  }

  private positionPanel() {
    if (!this.panel) return;
    const base = this.shadowRoot?.querySelector("[part='base']") as HTMLElement | null;
    const rect = (base ?? this).getBoundingClientRect();
    this.panel.style.top = `${rect.bottom + 4}px`;
    this.panel.style.left = `${rect.left}px`;
  }

  private renderPanel() {
    if (!this.panel) return;
    const locale = this.locale === "zh-TW" ? "zh-TW" : "en";
    const weekdays = WEEKDAYS[locale];
    const labels = LABELS[locale];
    const cells = buildMonthGrid(this.viewYear, this.viewMonth);
    const today = todayIso();
    const selected = isValidIsoDate(this.value) ? this.value : "";
    const title = `${this.viewYear}-${String(this.viewMonth + 1).padStart(2, "0")}`;
    const nowDisabled = !!this.isDateDisabled?.(today);

    render(
      html`
        <div part="calendar">
          <div class="gk-date-picker-panel__nav">
            <button type="button" aria-label="Previous month" @click=${() => this.shiftMonth(-1)}>
              ‹
            </button>
            <div class="gk-date-picker-panel__nav-title">${title}</div>
            <button type="button" aria-label="Next month" @click=${() => this.shiftMonth(1)}>
              ›
            </button>
          </div>
          <div class="gk-date-picker-panel__weekdays">
            ${weekdays.map((d) => html`<span>${d}</span>`)}
          </div>
          <div class="gk-date-picker-panel__days">
            ${cells.map((cell) => {
              const disabled = !!this.isDateDisabled?.(cell.iso);
              return html`
                <button
                  type="button"
                  data-iso=${cell.iso}
                  ?disabled=${disabled}
                  ?data-outside=${!cell.inMonth}
                  ?data-today=${cell.iso === today}
                  ?data-selected=${cell.iso === selected}
                  @click=${() => this.onDayClick(cell.iso)}
                >
                  ${cell.day}
                </button>
              `;
            })}
          </div>
        </div>
        <div part="actions">
          <button type="button" data-action="clear" @click=${this.onPanelClear}>
            ${labels.clear}
          </button>
          <button
            type="button"
            data-action="now"
            ?disabled=${nowDisabled}
            @click=${this.onPanelNow}
          >
            ${labels.now}
          </button>
        </div>
      `,
      this.panel,
    );
  }

  private get showClearButton() {
    return this.clearable && !this.disabled && this.value.length > 0;
  }

  private displayText() {
    if (this.value && isValidIsoDate(this.value)) {
      return formatDisplay(this.value, this.format);
    }
    return this.placeholder;
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

  private calendarIcon() {
    return svg`
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"
        />
      </svg>
    `;
  }

  render() {
    const text = this.displayText();
    const empty = !(this.value && isValidIsoDate(this.value));

    return html`
      <div
        part="base"
        role="combobox"
        tabindex=${this.disabled ? -1 : 0}
        aria-expanded=${this.open ? "true" : "false"}
        aria-haspopup="dialog"
        aria-disabled=${this.disabled ? "true" : "false"}
        @click=${this.onTriggerClick}
        @keydown=${(e: KeyboardEvent) => {
          if (this.disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.setOpen(!this.open);
          }
        }}
      >
        <span part="input" ?data-empty=${empty}>${text || "\u00a0"}</span>
        <span part="suffix">
          ${this.showClearButton
            ? html`<button
                type="button"
                part="clear"
                aria-label="Clear"
                @click=${this.onClearClick}
              >
                ${this.clearIcon()}
              </button>`
            : nothing}
          ${this.calendarIcon()}
        </span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-date-picker": GkDatePicker;
  }
}
