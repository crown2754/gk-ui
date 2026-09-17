import { LitElement, html, nothing, svg, render } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import {
  datePickerStyles,
  datePickerPanelCssText,
} from "./gk-date-picker.styles.js";
import {
  buildMonthGrid,
  compareIso,
  datePart,
  formatDisplay,
  isIsoInRange,
  isValidDateTime,
  isValidIsoDate,
  parseDateTime,
  parseIsoDate,
  todayDateTime,
  todayIso,
  toDateTime,
} from "./date-utils.js";

export type GkDatePickerType =
  | "date"
  | "daterange"
  | "datetime"
  | "datetimerange";
export type GkDatePickerSize = "sm" | "md" | "lg";
export type GkDatePickerStatus = "success" | "warning" | "error" | "";
export type GkDatePickerLocale = "en" | "zh-TW";

type DateValue = string;
type RangeValue = [string, string] | null;
type DatePickerValue = DateValue | RangeValue;

const WEEKDAYS: Record<GkDatePickerLocale, string[]> = {
  en: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  "zh-TW": ["日", "一", "二", "三", "四", "五", "六"],
};

const LABELS: Record<
  GkDatePickerLocale,
  { clear: string; now: string; confirm: string }
> = {
  en: { clear: "Clear", now: "Now", confirm: "Confirm" },
  "zh-TW": { clear: "清除", now: "現在", confirm: "確認" },
};

const PANEL_STYLE_ID = "gk-date-picker-panel-style";

function parseRangeAttr(raw: string | null): RangeValue {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw);
    if (
      Array.isArray(v) &&
      v.length === 2 &&
      typeof v[0] === "string" &&
      typeof v[1] === "string" &&
      isValidIsoDate(v[0]) &&
      isValidIsoDate(v[1])
    ) {
      return [v[0], v[1]];
    }
  } catch {
    /* ignore */
  }
  return null;
}

function isRangePair(value: DatePickerValue): value is [string, string] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "string" &&
    typeof value[1] === "string" &&
    isValidIsoDate(value[0]) &&
    isValidIsoDate(value[1])
  );
}

@customElement("gk-date-picker")
export class GkDatePicker extends LitElement {
  static styles = datePickerStyles;

  @property({ reflect: true })
  type: GkDatePickerType = "date";

  @property({
    converter: {
      fromAttribute(value: string | null): DatePickerValue {
        if (value == null || value === "") return "";
        if (value.trim().startsWith("[")) return parseRangeAttr(value);
        return value;
      },
      toAttribute(value: DatePickerValue): string | null {
        if (value == null) return null;
        if (Array.isArray(value)) return JSON.stringify(value);
        return value || null;
      },
    },
  })
  value: DatePickerValue = "";

  @property()
  format = "yyyy-MM-dd";

  @property()
  separator = " - ";

  @property({ attribute: "start-placeholder" })
  startPlaceholder = "";

  @property({ attribute: "end-placeholder" })
  endPlaceholder = "";

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

  @state()
  private rangeDraftStart: string | null = null;

  @state()
  private draftDate: string | null = null;

  @state()
  private draftH = 0;

  @state()
  private draftM = 0;

  @state()
  private draftS = 0;

  /** Previous complete pair while picking a replacement; restored on dismiss. */
  private rangeStash: [string, string] | null = null;

  private panel: HTMLDivElement | null = null;
  private listenersBound = false;

  connectedCallback() {
    super.connectedCallback();
    this.syncDefaultFormat();
    this.coerceValueForType();
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
    if (changed.has("type")) {
      this.syncDefaultFormat();
    }
    if (changed.has("type") || changed.has("value")) {
      this.coerceValueForType();
    }
    if (changed.has("value") || changed.has("type")) {
      this.syncViewFromValue();
    }
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has("open")) {
      if (this.open) {
        if (this.type === "datetime") {
          this.initDateTimeDraft();
        }
        this.ensurePanel();
        this.bindDismissListeners();
      } else {
        this.dismissRangeDraft();
        this.dismissDateTimeDraft();
        this.unbindDismissListeners();
        this.teardownPanel();
      }
    }
    if (
      this.open &&
      (changed.has("value") ||
        changed.has("type") ||
        changed.has("separator") ||
        changed.has("rangeDraftStart") ||
        changed.has("draftDate") ||
        changed.has("draftH") ||
        changed.has("draftM") ||
        changed.has("draftS") ||
        changed.has("locale") ||
        changed.has("isDateDisabled") ||
        changed.has("viewYear") ||
        changed.has("viewMonth") ||
        changed.has("open"))
    ) {
      this.renderPanel();
    }
  }

  private syncDefaultFormat() {
    if (this.type === "datetime" || this.type === "datetimerange") {
      if (this.format === "yyyy-MM-dd") {
        this.format = "yyyy-MM-dd HH:mm:ss";
      }
    }
  }

  private coerceValueForType() {
    if (this.type === "daterange" || this.type === "datetimerange") {
      if (!isRangePair(this.value)) {
        this.value = null;
      }
    } else if (this.type === "datetime") {
      if (
        typeof this.value !== "string" ||
        (this.value !== "" && !isValidDateTime(this.value))
      ) {
        this.value = "";
      }
    } else if (this.value === null || Array.isArray(this.value)) {
      this.value = "";
    }
  }

  /** Clear in-progress range pick; restore stashed pair if restart was cancelled. */
  private dismissRangeDraft() {
    if (!this.rangeDraftStart && !this.rangeStash) return;
    this.rangeDraftStart = null;
    if (this.rangeStash) {
      this.value = this.rangeStash;
      this.rangeStash = null;
    }
  }

  private dismissDateTimeDraft() {
    if (this.type !== "datetime") return;
    this.draftDate = null;
  }

  private initDateTimeDraft() {
    const parsed =
      typeof this.value === "string" && isValidDateTime(this.value)
        ? parseDateTime(this.value)
        : null;
    if (parsed) {
      this.draftDate = parsed.date;
      this.draftH = parsed.h;
      this.draftM = parsed.m;
      this.draftS = parsed.s;
    } else {
      this.draftDate = null;
      this.draftH = 0;
      this.draftM = 0;
      this.draftS = 0;
    }
  }

  private syncViewFromValue() {
    let iso = "";
    if (this.type === "daterange" && isRangePair(this.value)) {
      iso = this.value[0];
    } else if (typeof this.value === "string") {
      iso = this.type === "datetime" ? datePart(this.value) : this.value;
    }
    const d = parseIsoDate(iso);
    if (d) {
      this.viewYear = d.getFullYear();
      this.viewMonth = d.getMonth();
    }
  }

  private setOpen(next: boolean) {
    if (this.open === next) return;
    if (!next) {
      this.dismissRangeDraft();
      this.dismissDateTimeDraft();
    }
    this.open = next;
    this.dispatchEvent(
      new CustomEvent("gk-open-change", {
        detail: { open: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private emitValue(next: DatePickerValue) {
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
    this.rangeDraftStart = null;
    this.rangeStash = null;
    this.emitValue(this.type === "daterange" ? null : "");
  };

  private onDayClick = (iso: string) => {
    if (this.isDateDisabled?.(iso)) return;
    if (this.type === "daterange") {
      if (!this.rangeDraftStart) {
        // First click after a complete range starts a new draft (stash for cancel).
        if (isRangePair(this.value)) {
          this.rangeStash = this.value;
          this.value = null;
        }
        this.rangeDraftStart = iso;
        return;
      }
      const draft = this.rangeDraftStart;
      const pair: [string, string] =
        compareIso(draft, iso) <= 0 ? [draft, iso] : [iso, draft];
      this.rangeDraftStart = null;
      this.rangeStash = null;
      this.emitValue(pair);
      this.setOpen(false);
      return;
    }
    if (this.type === "datetime") {
      this.draftDate = iso;
      return;
    }
    this.emitValue(iso);
    this.setOpen(false);
  };

  private onTimePick = (kind: "h" | "m" | "s", n: number) => {
    if (this.type !== "datetime") return;
    if (kind === "h") this.draftH = n;
    else if (kind === "m") this.draftM = n;
    else this.draftS = n;
  };

  private onPanelConfirm = () => {
    if (this.type !== "datetime" || !this.draftDate) return;
    this.emitValue(
      toDateTime(this.draftDate, this.draftH, this.draftM, this.draftS),
    );
    this.setOpen(false);
  };

  private onPanelClear = () => {
    this.rangeDraftStart = null;
    this.rangeStash = null;
    this.emitValue(this.type === "daterange" ? null : "");
    this.setOpen(false);
  };

  private onPanelNow = () => {
    const iso = todayIso();
    if (this.isDateDisabled?.(iso)) return;
    if (this.type === "datetime") {
      this.emitValue(todayDateTime());
    } else {
      this.emitValue(iso);
    }
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

  private daySelectionState(iso: string): {
    selected: boolean;
    inRange: boolean;
  } {
    if (this.type === "daterange") {
      if (this.rangeDraftStart) {
        return {
          selected: iso === this.rangeDraftStart,
          inRange: false,
        };
      }
      if (isRangePair(this.value)) {
        const [start, end] = this.value;
        const selected = iso === start || iso === end;
        const inRange =
          !selected && isIsoInRange(iso, start, end);
        return { selected, inRange };
      }
      return { selected: false, inRange: false };
    }
    if (this.type === "datetime") {
      let activeDate = "";
      if (this.open && this.draftDate) {
        activeDate = this.draftDate;
      } else if (
        typeof this.value === "string" &&
        isValidDateTime(this.value)
      ) {
        activeDate = datePart(this.value);
      }
      return { selected: !!activeDate && iso === activeDate, inRange: false };
    }
    const selected =
      typeof this.value === "string" &&
      isValidIsoDate(this.value) &&
      iso === this.value;
    return { selected, inRange: false };
  }

  private renderPanel() {
    if (!this.panel) return;
    const locale = this.locale === "zh-TW" ? "zh-TW" : "en";
    const weekdays = WEEKDAYS[locale];
    const labels = LABELS[locale];
    const cells = buildMonthGrid(this.viewYear, this.viewMonth);
    const today = todayIso();
    const title = `${this.viewYear}-${String(this.viewMonth + 1).padStart(2, "0")}`;
    const nowDisabled = !!this.isDateDisabled?.(today);
    const isRange = this.type === "daterange";

    const dayButtons = cells.map((cell) => {
      const disabled = !!this.isDateDisabled?.(cell.iso);
      const { selected, inRange } = this.daySelectionState(cell.iso);
      return html`
        <button
          type="button"
          data-iso=${cell.iso}
          class=${classMap({
            "is-outside": !cell.inMonth,
            "is-selected": selected,
            "is-in-range": inRange,
          })}
          ?disabled=${disabled}
          ?data-outside=${!cell.inMonth}
          ?data-today=${cell.iso === today}
          ?data-selected=${selected}
          @click=${() => this.onDayClick(cell.iso)}
        >
          ${cell.day}
        </button>
      `;
    });

    const calendar = html`
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
        <div class="gk-date-picker-panel__days">${dayButtons}</div>
      </div>
    `;

    if (this.type === "datetime") {
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const mins = Array.from({ length: 60 }, (_, i) => i);
      const secs = Array.from({ length: 60 }, (_, i) => i);
      render(
        html`
          <div class="gk-dp-body">
            ${calendar}
            <div part="time" class="gk-dp-time">
              <div class="gk-dp-time-col">
                ${hours.map(
                  (h) => html`
                    <button
                      type="button"
                      data-h=${h}
                      class=${classMap({ "is-active": this.draftH === h })}
                      @click=${() => this.onTimePick("h", h)}
                    >
                      ${String(h).padStart(2, "0")}
                    </button>
                  `,
                )}
              </div>
              <div class="gk-dp-time-col">
                ${mins.map(
                  (m) => html`
                    <button
                      type="button"
                      data-m=${m}
                      class=${classMap({ "is-active": this.draftM === m })}
                      @click=${() => this.onTimePick("m", m)}
                    >
                      ${String(m).padStart(2, "0")}
                    </button>
                  `,
                )}
              </div>
              <div class="gk-dp-time-col">
                ${secs.map(
                  (s) => html`
                    <button
                      type="button"
                      data-s=${s}
                      class=${classMap({ "is-active": this.draftS === s })}
                      @click=${() => this.onTimePick("s", s)}
                    >
                      ${String(s).padStart(2, "0")}
                    </button>
                  `,
                )}
              </div>
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
            <button
              type="button"
              part="confirm"
              data-action="confirm"
              @click=${this.onPanelConfirm}
            >
              ${labels.confirm}
            </button>
          </div>
        `,
        this.panel,
      );
      return;
    }

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
          <div class="gk-date-picker-panel__days">${dayButtons}</div>
        </div>
        <div part="actions">
          <button type="button" data-action="clear" @click=${this.onPanelClear}>
            ${labels.clear}
          </button>
          ${isRange
            ? nothing
            : html`
                <button
                  type="button"
                  data-action="now"
                  ?disabled=${nowDisabled}
                  @click=${this.onPanelNow}
                >
                  ${labels.now}
                </button>
              `}
        </div>
      `,
      this.panel,
    );
  }

  private get showClearButton() {
    if (!this.clearable || this.disabled) return false;
    if (this.type === "daterange") {
      return isRangePair(this.value);
    }
    return typeof this.value === "string" && this.value.length > 0;
  }

  private displayText() {
    if (this.type === "daterange") {
      if (isRangePair(this.value)) {
        const [start, end] = this.value;
        return (
          formatDisplay(start, this.format) +
          this.separator +
          formatDisplay(end, this.format)
        );
      }
      const startHint = this.startPlaceholder || this.placeholder;
      const endHint = this.endPlaceholder || this.placeholder;
      if (startHint || endHint) {
        return `${startHint}${this.separator}${endHint}`;
      }
      return this.placeholder;
    }
    if (this.type === "datetime") {
      if (typeof this.value === "string" && isValidDateTime(this.value)) {
        return formatDisplay(this.value, this.format);
      }
      return this.placeholder;
    }
    if (typeof this.value === "string" && isValidIsoDate(this.value)) {
      return formatDisplay(this.value, this.format);
    }
    return this.placeholder;
  }

  private isEmptyDisplay() {
    if (this.type === "daterange") {
      return !isRangePair(this.value);
    }
    if (this.type === "datetime") {
      return !(typeof this.value === "string" && isValidDateTime(this.value));
    }
    return !(typeof this.value === "string" && isValidIsoDate(this.value));
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
    const empty = this.isEmptyDisplay();

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
