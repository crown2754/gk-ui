import { LitElement, html, nothing, svg, render } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import {
  datePickerStyles,
  datePickerPanelCssText,
} from "./gk-date-picker.styles.js";
import {
  addMonths,
  buildMonthGrid,
  buildYearPage,
  compareDateTime,
  compareIso,
  computeFixedPanelPosition,
  datePart,
  formatDisplay,
  formatTime,
  isIsoInRange,
  isValidDateTime,
  isValidIsoDate,
  isValidYear,
  isValidYearMonth,
  parseDateTime,
  parseIsoDate,
  parseTime,
  todayDateTime,
  todayIso,
  todayYear,
  todayYearMonth,
  toDateTime,
} from "./date-utils.js";

export type GkDatePickerType =
  | "date"
  | "daterange"
  | "datetime"
  | "datetimerange"
  | "month"
  | "year";
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

const MONTH_NAMES: Record<GkDatePickerLocale, string[]> = {
  en: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  "zh-TW": [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ],
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
      typeof v[1] === "string"
    ) {
      if (isValidDateTime(v[0]) && isValidDateTime(v[1])) {
        return [v[0], v[1]];
      }
      if (isValidIsoDate(v[0]) && isValidIsoDate(v[1])) {
        return [v[0], v[1]];
      }
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

function isDateTimeRangePair(value: DatePickerValue): value is [string, string] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "string" &&
    typeof value[1] === "string" &&
    isValidDateTime(value[0]) &&
    isValidDateTime(value[1])
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
  separator = " → ";

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

  /** Property-only: return true to disable a value (`YYYY-MM-DD` | `YYYY-MM` | `YYYY` by type). */
  @property({ attribute: false })
  isDateDisabled?: (iso: string) => boolean;

  @state()
  private viewYear = new Date().getFullYear();

  @state()
  private viewMonth = new Date().getMonth();

  @state()
  private yearPageStart = Math.floor(new Date().getFullYear() / 12) * 12;

  @state()
  private rangeDraftStart: string | null = null;

  @state()
  private rangeDraftEnd: string | null = null;

  @state()
  private rangeDraftStartDt: string | null = null;

  @state()
  private rangeDraftEndDt: string | null = null;

  @state()
  private draftDate: string | null = null;

  @state()
  private draftH = 0;

  @state()
  private draftM = 0;

  @state()
  private draftS = 0;

  @state()
  private isCompact = false;

  /** Previous complete pair while picking a replacement; restored on dismiss. */
  private rangeStash: [string, string] | null = null;

  private panel: HTMLDivElement | null = null;
  private backdrop: HTMLDivElement | null = null;
  private listenersBound = false;
  private positionListenersBound = false;
  private compactMql: MediaQueryList | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.syncDefaultFormat();
    this.coerceValueForType();
    this.syncViewFromValue();
    this.bindCompactMedia();
    if (this.open) {
      this.ensurePanel();
      this.bindDismissListeners();
    }
  }

  disconnectedCallback() {
    this.unbindCompactMedia();
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
        } else if (this.type === "datetimerange") {
          this.initDateTimeRangeDraft();
        } else if (this.type === "daterange") {
          this.initDateRangeDraft();
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
        changed.has("rangeDraftEnd") ||
        changed.has("rangeDraftStartDt") ||
        changed.has("rangeDraftEndDt") ||
        changed.has("draftDate") ||
        changed.has("draftH") ||
        changed.has("draftM") ||
        changed.has("draftS") ||
        changed.has("locale") ||
        changed.has("isDateDisabled") ||
        changed.has("viewYear") ||
        changed.has("viewMonth") ||
        changed.has("yearPageStart") ||
        changed.has("isCompact") ||
        changed.has("open"))
    ) {
      this.renderPanel();
    }
  }

  private syncDefaultFormat() {
    if (this.type === "month") {
      if (this.format === "yyyy-MM-dd") {
        this.format = "yyyy-MM";
      }
    } else if (this.type === "year") {
      if (this.format === "yyyy-MM-dd") {
        this.format = "yyyy";
      }
    } else if (this.type === "datetime" || this.type === "datetimerange") {
      if (this.format === "yyyy-MM-dd") {
        this.format = "yyyy-MM-dd HH:mm:ss";
      }
    }
  }

  private coerceValueForType() {
    if (this.type === "daterange") {
      if (!isRangePair(this.value)) {
        this.value = null;
      }
    } else if (this.type === "datetimerange") {
      if (!isDateTimeRangePair(this.value)) {
        this.value = null;
      }
    } else if (this.type === "datetime") {
      if (
        typeof this.value !== "string" ||
        (this.value !== "" && !isValidDateTime(this.value))
      ) {
        this.value = "";
      }
    } else if (this.type === "month") {
      if (
        typeof this.value !== "string" ||
        (this.value !== "" && !isValidYearMonth(this.value))
      ) {
        this.value = "";
      }
    } else if (this.type === "year") {
      if (
        typeof this.value !== "string" ||
        (this.value !== "" && !isValidYear(this.value))
      ) {
        this.value = "";
      }
    } else if (this.value === null || Array.isArray(this.value)) {
      this.value = "";
    }
  }

  /** Clear in-progress range pick; restore stashed pair if restart was cancelled. */
  private dismissRangeDraft() {
    const hadDraft =
      this.rangeDraftStart ||
      this.rangeDraftEnd ||
      this.rangeDraftStartDt ||
      this.rangeDraftEndDt ||
      this.rangeStash;
    if (!hadDraft) return;
    this.rangeDraftStart = null;
    this.rangeDraftEnd = null;
    this.rangeDraftStartDt = null;
    this.rangeDraftEndDt = null;
    if (this.rangeStash) {
      this.value = this.rangeStash;
      this.rangeStash = null;
    }
  }

  private initDateRangeDraft() {
    if (isRangePair(this.value)) {
      this.rangeDraftStart = this.value[0];
      this.rangeDraftEnd = this.value[1];
    } else {
      this.rangeDraftStart = null;
      this.rangeDraftEnd = null;
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

  private initDateTimeRangeDraft() {
    if (isDateTimeRangePair(this.value)) {
      this.rangeDraftStartDt = this.value[0];
      this.rangeDraftEndDt = this.value[1];
    } else {
      this.rangeDraftStartDt = null;
      this.rangeDraftEndDt = null;
      this.draftH = 0;
      this.draftM = 0;
      this.draftS = 0;
    }
  }

  private alignYearPageStart(year: number): number {
    return Math.floor(year / 12) * 12;
  }

  private syncViewFromValue() {
    if (this.type === "month") {
      if (typeof this.value === "string" && isValidYearMonth(this.value)) {
        this.viewYear = Number(this.value.slice(0, 4));
      }
      return;
    }
    if (this.type === "year") {
      const fallback = new Date().getFullYear();
      const y =
        typeof this.value === "string" && isValidYear(this.value)
          ? Number(this.value)
          : fallback;
      this.viewYear = y;
      this.yearPageStart = this.alignYearPageStart(y);
      return;
    }
    let iso = "";
    if (this.type === "daterange" && isRangePair(this.value)) {
      iso = this.value[0];
    } else if (this.type === "datetimerange" && isDateTimeRangePair(this.value)) {
      iso = datePart(this.value[0]);
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
    this.rangeDraftEnd = null;
    this.rangeDraftStartDt = null;
    this.rangeDraftEndDt = null;
    this.rangeStash = null;
    this.draftDate = null;
    this.draftH = 0;
    this.draftM = 0;
    this.draftS = 0;
    this.emitValue(
      this.type === "daterange" || this.type === "datetimerange" ? null : "",
    );
    this.setOpen(false);
  };

  private onDayClick = (iso: string) => {
    if (this.isDateDisabled?.(iso)) return;
    if (this.type === "daterange") {
      if (this.rangeDraftStart && this.rangeDraftEnd) {
        if (isRangePair(this.value)) {
          this.rangeStash = this.value;
          this.value = null;
        }
        this.rangeDraftEnd = null;
        this.rangeDraftStart = iso;
        return;
      }
      if (!this.rangeDraftStart) {
        if (isRangePair(this.value)) {
          this.rangeStash = this.value;
          this.value = null;
        }
        this.rangeDraftStart = iso;
        this.rangeDraftEnd = null;
        return;
      }
      const draft = this.rangeDraftStart;
      if (compareIso(draft, iso) <= 0) {
        this.rangeDraftStart = draft;
        this.rangeDraftEnd = iso;
      } else {
        this.rangeDraftStart = iso;
        this.rangeDraftEnd = draft;
      }
      return;
    }
    if (this.type === "datetimerange") {
      if (this.rangeDraftStartDt && this.rangeDraftEndDt) {
        if (isDateTimeRangePair(this.value)) {
          this.rangeStash = this.value;
          this.value = null;
        }
        this.rangeDraftEndDt = null;
        this.rangeDraftStartDt = toDateTime(iso, 0, 0, 0);
        return;
      }
      if (!this.rangeDraftStartDt) {
        if (isDateTimeRangePair(this.value)) {
          this.rangeStash = this.value;
          this.value = null;
        }
        this.rangeDraftStartDt = toDateTime(iso, 0, 0, 0);
        return;
      }
      let startDt = this.rangeDraftStartDt;
      let endDt = toDateTime(iso, 0, 0, 0);
      if (compareDateTime(startDt, endDt) > 0) {
        [startDt, endDt] = [endDt, startDt];
      }
      this.rangeDraftStartDt = startDt;
      this.rangeDraftEndDt = endDt;
      return;
    }
    if (this.type === "datetime") {
      this.draftDate = iso;
      return;
    }
    this.emitValue(iso);
    this.setOpen(false);
  };

  private onPanelConfirm = () => {
    if (this.type === "daterange") {
      if (!this.rangeDraftStart || !this.rangeDraftEnd) return;
      let start = this.rangeDraftStart;
      let end = this.rangeDraftEnd;
      if (compareIso(start, end) > 0) {
        [start, end] = [end, start];
      }
      this.rangeStash = null;
      this.emitValue([start, end]);
      this.rangeDraftStart = null;
      this.rangeDraftEnd = null;
      this.setOpen(false);
      return;
    }
    if (this.type === "datetimerange") {
      if (!this.rangeDraftStartDt || !this.rangeDraftEndDt) return;
      let start = this.rangeDraftStartDt;
      let end = this.rangeDraftEndDt;
      if (compareDateTime(start, end) > 0) {
        [start, end] = [end, start];
      }
      this.rangeStash = null;
      this.emitValue([start, end]);
      this.rangeDraftStartDt = null;
      this.rangeDraftEndDt = null;
      this.setOpen(false);
      return;
    }
    if (this.type !== "datetime" || !this.draftDate) return;
    this.emitValue(
      toDateTime(this.draftDate, this.draftH, this.draftM, this.draftS),
    );
    this.setOpen(false);
  };

  private onPanelClear = () => {
    this.rangeDraftStart = null;
    this.rangeDraftEnd = null;
    this.rangeDraftStartDt = null;
    this.rangeDraftEndDt = null;
    this.rangeStash = null;
    this.draftDate = null;
    this.draftH = 0;
    this.draftM = 0;
    this.draftS = 0;
    this.emitValue(
      this.type === "daterange" || this.type === "datetimerange" ? null : "",
    );
    this.setOpen(false);
  };

  private onPanelNow = () => {
    if (this.type === "month") {
      const ym = todayYearMonth();
      if (this.isDateDisabled?.(ym)) return;
      this.emitValue(ym);
      this.setOpen(false);
      return;
    }
    if (this.type === "year") {
      const y = todayYear();
      if (this.isDateDisabled?.(y)) return;
      this.emitValue(y);
      this.setOpen(false);
      return;
    }
    const iso = todayIso();
    if (this.isDateDisabled?.(iso)) return;
    if (this.type === "datetime") {
      this.emitValue(todayDateTime());
    } else {
      this.emitValue(iso);
    }
    this.setOpen(false);
  };

  private onMonthClick = (ym: string) => {
    if (this.isDateDisabled?.(ym)) return;
    this.emitValue(ym);
    this.setOpen(false);
  };

  private onYearClick = (year: string) => {
    if (this.isDateDisabled?.(year)) return;
    this.emitValue(year);
    this.setOpen(false);
  };

  private shiftViewYear(delta: number) {
    this.viewYear += delta;
  }

  private shiftViewYears(deltaYears: number) {
    this.viewYear += deltaYears;
  }

  private shiftYearPage(delta: number) {
    this.yearPageStart += delta * 12;
  }

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

  private shiftView(deltaMonths: number) {
    this.shiftMonth(deltaMonths);
  }

  private panelDateFieldValue(
    field: "date" | "start-date" | "end-date",
  ): string {
    if (field === "date") {
      if (this.type === "datetime") {
        return this.draftDate ?? "";
      }
      if (typeof this.value === "string" && isValidIsoDate(this.value)) {
        return this.value;
      }
      return "";
    }
    if (this.type === "datetimerange") {
      if (field === "start-date") {
        return this.rangeDraftStartDt ? datePart(this.rangeDraftStartDt) : "";
      }
      return this.rangeDraftEndDt ? datePart(this.rangeDraftEndDt) : "";
    }
    if (field === "start-date") {
      return this.rangeDraftStart ?? "";
    }
    return this.rangeDraftEnd ?? "";
  }

  private panelTimeFieldValue(
    field: "time" | "start-time" | "end-time",
  ): string {
    if (field === "time") {
      if (this.type !== "datetime") return "";
      return formatTime(this.draftH, this.draftM, this.draftS);
    }
    if (this.type !== "datetimerange") return "";
    const dt =
      field === "start-time" ? this.rangeDraftStartDt : this.rangeDraftEndDt;
    if (!dt) return formatTime(0, 0, 0);
    const parsed = parseDateTime(dt);
    return parsed
      ? formatTime(parsed.h, parsed.m, parsed.s)
      : formatTime(0, 0, 0);
  }

  private applyPanelDateField(
    field: "date" | "start-date" | "end-date",
    raw: string,
  ) {
    const trimmed = raw.trim();
    if (field === "date") {
      if (!isValidIsoDate(trimmed) || this.isDateDisabled?.(trimmed)) {
        this.renderPanel();
        return;
      }
      if (this.type === "datetime") {
        this.draftDate = trimmed;
        return;
      }
      this.emitValue(trimmed);
      return;
    }
    if (!isValidIsoDate(trimmed) || this.isDateDisabled?.(trimmed)) {
      this.renderPanel();
      return;
    }
    if (this.type === "datetimerange") {
      if (field === "start-date") {
        const time = this.rangeDraftStartDt
          ? parseDateTime(this.rangeDraftStartDt)
          : { h: 0, m: 0, s: 0 };
        this.rangeDraftStartDt = toDateTime(
          trimmed,
          time?.h ?? 0,
          time?.m ?? 0,
          time?.s ?? 0,
        );
        if (isDateTimeRangePair(this.value)) {
          this.rangeStash = this.value;
          this.value = null;
        }
      } else {
        const time = this.rangeDraftEndDt
          ? parseDateTime(this.rangeDraftEndDt)
          : { h: 0, m: 0, s: 0 };
        this.rangeDraftEndDt = toDateTime(
          trimmed,
          time?.h ?? 0,
          time?.m ?? 0,
          time?.s ?? 0,
        );
        if (isDateTimeRangePair(this.value)) {
          this.rangeStash = this.value;
          this.value = null;
        }
      }
      if (
        this.rangeDraftStartDt &&
        this.rangeDraftEndDt &&
        compareDateTime(this.rangeDraftStartDt, this.rangeDraftEndDt) > 0
      ) {
        const tmp = this.rangeDraftStartDt;
        this.rangeDraftStartDt = this.rangeDraftEndDt;
        this.rangeDraftEndDt = tmp;
      }
      return;
    }
    if (field === "start-date") {
      this.rangeDraftStart = trimmed;
      if (isRangePair(this.value)) {
        this.rangeStash = this.value;
        this.value = null;
      }
    } else {
      this.rangeDraftEnd = trimmed;
      if (isRangePair(this.value)) {
        this.rangeStash = this.value;
        this.value = null;
      }
    }
    if (
      this.rangeDraftStart &&
      this.rangeDraftEnd &&
      compareIso(this.rangeDraftStart, this.rangeDraftEnd) > 0
    ) {
      const tmp = this.rangeDraftStart;
      this.rangeDraftStart = this.rangeDraftEnd;
      this.rangeDraftEnd = tmp;
    }
  }

  private applyPanelTimeField(
    field: "time" | "start-time" | "end-time",
    raw: string,
  ) {
    const trimmed = raw.trim();
    const parsed = parseTime(trimmed);
    if (!parsed) {
      this.renderPanel();
      return;
    }
    if (field === "time") {
      if (this.type !== "datetime") return;
      this.draftH = parsed.h;
      this.draftM = parsed.m;
      this.draftS = parsed.s;
      return;
    }
    if (this.type !== "datetimerange") return;
    if (field === "start-time") {
      const date = this.rangeDraftStartDt
        ? datePart(this.rangeDraftStartDt)
        : "";
      if (!date) {
        this.renderPanel();
        return;
      }
      this.rangeDraftStartDt = toDateTime(date, parsed.h, parsed.m, parsed.s);
      if (isDateTimeRangePair(this.value)) {
        this.rangeStash = this.value;
        this.value = null;
      }
    } else {
      const date = this.rangeDraftEndDt ? datePart(this.rangeDraftEndDt) : "";
      if (!date) {
        this.renderPanel();
        return;
      }
      this.rangeDraftEndDt = toDateTime(date, parsed.h, parsed.m, parsed.s);
      if (isDateTimeRangePair(this.value)) {
        this.rangeStash = this.value;
        this.value = null;
      }
    }
    if (
      this.rangeDraftStartDt &&
      this.rangeDraftEndDt &&
      compareDateTime(this.rangeDraftStartDt, this.rangeDraftEndDt) > 0
    ) {
      const tmp = this.rangeDraftStartDt;
      this.rangeDraftStartDt = this.rangeDraftEndDt;
      this.rangeDraftEndDt = tmp;
    }
  }

  private onPanelDateFieldCommit = (
    field: "date" | "start-date" | "end-date",
    e: Event,
  ) => {
    const input = e.target as HTMLInputElement;
    this.applyPanelDateField(field, input.value);
  };

  private onPanelDateFieldKeydown = (
    field: "date" | "start-date" | "end-date",
    e: KeyboardEvent,
  ) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const input = e.target as HTMLInputElement;
    this.applyPanelDateField(field, input.value);
  };

  private onPanelTimeFieldCommit = (
    field: "time" | "start-time" | "end-time",
    e: Event,
  ) => {
    const input = e.target as HTMLInputElement;
    this.applyPanelTimeField(field, input.value);
  };

  private onPanelTimeFieldKeydown = (
    field: "time" | "start-time" | "end-time",
    e: KeyboardEvent,
  ) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const input = e.target as HTMLInputElement;
    this.applyPanelTimeField(field, input.value);
  };

  private onDateFieldChange = (e: Event) =>
    this.onPanelDateFieldCommit("date", e);
  private onDateFieldKeydown = (e: KeyboardEvent) =>
    this.onPanelDateFieldKeydown("date", e);
  private onStartDateFieldChange = (e: Event) =>
    this.onPanelDateFieldCommit("start-date", e);
  private onStartDateFieldKeydown = (e: KeyboardEvent) =>
    this.onPanelDateFieldKeydown("start-date", e);
  private onEndDateFieldChange = (e: Event) =>
    this.onPanelDateFieldCommit("end-date", e);
  private onEndDateFieldKeydown = (e: KeyboardEvent) =>
    this.onPanelDateFieldKeydown("end-date", e);
  private onTimeFieldChange = (e: Event) =>
    this.onPanelTimeFieldCommit("time", e);
  private onTimeFieldKeydown = (e: KeyboardEvent) =>
    this.onPanelTimeFieldKeydown("time", e);
  private onStartTimeFieldChange = (e: Event) =>
    this.onPanelTimeFieldCommit("start-time", e);
  private onStartTimeFieldKeydown = (e: KeyboardEvent) =>
    this.onPanelTimeFieldKeydown("start-time", e);
  private onEndTimeFieldChange = (e: Event) =>
    this.onPanelTimeFieldCommit("end-time", e);
  private onEndTimeFieldKeydown = (e: KeyboardEvent) =>
    this.onPanelTimeFieldKeydown("end-time", e);

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

  private onViewportChange = () => {
    if (this.open) this.positionPanel();
  };

  private onCompactMediaChange = () => {
    this.syncCompactFromMedia();
  };

  private syncCompactFromMedia() {
    const next = !!this.compactMql?.matches;
    if (this.isCompact === next) return;
    this.isCompact = next;
  }

  private bindCompactMedia() {
    if (this.compactMql || typeof window.matchMedia !== "function") return;
    this.compactMql = window.matchMedia("(max-width: 640px)");
    this.isCompact = this.compactMql.matches;
    if (typeof this.compactMql.addEventListener === "function") {
      this.compactMql.addEventListener("change", this.onCompactMediaChange);
    } else {
      this.compactMql.addListener(this.onCompactMediaChange);
    }
  }

  private unbindCompactMedia() {
    if (!this.compactMql) return;
    if (typeof this.compactMql.removeEventListener === "function") {
      this.compactMql.removeEventListener("change", this.onCompactMediaChange);
    } else {
      this.compactMql.removeListener(this.onCompactMediaChange);
    }
    this.compactMql = null;
  }

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

  private bindPositionListeners() {
    if (this.positionListenersBound) return;
    window.addEventListener("scroll", this.onViewportChange, true);
    window.addEventListener("resize", this.onViewportChange);
    this.positionListenersBound = true;
  }

  private unbindPositionListeners() {
    if (!this.positionListenersBound) return;
    window.removeEventListener("scroll", this.onViewportChange, true);
    window.removeEventListener("resize", this.onViewportChange);
    this.positionListenersBound = false;
  }

  private ensureBackdrop() {
    if (this.backdrop) return;
    this.backdrop = document.createElement("div");
    this.backdrop.className = "gk-date-picker-backdrop";
    this.backdrop.addEventListener("click", this.onBackdropClick);
    document.body.appendChild(this.backdrop);
  }

  private teardownBackdrop() {
    if (!this.backdrop) return;
    this.backdrop.removeEventListener("click", this.onBackdropClick);
    this.backdrop.remove();
    this.backdrop = null;
  }

  private onBackdropClick = () => {
    this.setOpen(false);
  };

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
    this.renderPanel();
    this.positionPanel();
    this.bindPositionListeners();
  }

  private teardownPanel() {
    this.unbindPositionListeners();
    this.teardownBackdrop();
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
    if (this.isCompact) {
      this.panel.classList.add("is-sheet");
      this.panel.style.top = "";
      this.panel.style.left = "";
      delete this.panel.dataset.placement;
      this.ensureBackdrop();
      return;
    }
    this.panel.classList.remove("is-sheet");
    this.teardownBackdrop();
    const base = this.shadowRoot?.querySelector(
      "[part='base']",
    ) as HTMLElement | null;
    const trigger = (base ?? this).getBoundingClientRect();
    const panelRect = this.panel.getBoundingClientRect();
    const { top, left, placement } = computeFixedPanelPosition({
      trigger,
      panelWidth: panelRect.width || this.panel.offsetWidth,
      panelHeight: panelRect.height || this.panel.offsetHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    });
    this.panel.style.top = `${top}px`;
    this.panel.style.left = `${left}px`;
    this.panel.dataset.placement = placement;
  }

  private daySelectionState(iso: string): {
    selected: boolean;
    inRange: boolean;
  } {
    if (this.type === "daterange") {
      if (this.rangeDraftStart) {
        if (this.rangeDraftEnd) {
          const start = this.rangeDraftStart;
          const end = this.rangeDraftEnd;
          const selected = iso === start || iso === end;
          const inRange = !selected && isIsoInRange(iso, start, end);
          return { selected, inRange };
        }
        return {
          selected: iso === this.rangeDraftStart,
          inRange: false,
        };
      }
      if (isRangePair(this.value)) {
        const [start, end] = this.value;
        const selected = iso === start || iso === end;
        const inRange = !selected && isIsoInRange(iso, start, end);
        return { selected, inRange };
      }
      return { selected: false, inRange: false };
    }
    if (this.type === "datetimerange") {
      let startIso = "";
      let endIso = "";
      if (this.rangeDraftStartDt) {
        startIso = datePart(this.rangeDraftStartDt);
        if (this.rangeDraftEndDt) {
          endIso = datePart(this.rangeDraftEndDt);
        } else {
          return { selected: iso === startIso, inRange: false };
        }
      } else if (isDateTimeRangePair(this.value)) {
        startIso = datePart(this.value[0]);
        endIso = datePart(this.value[1]);
      } else {
        return { selected: false, inRange: false };
      }
      const selected = iso === startIso || iso === endIso;
      const inRange =
        !selected && isIsoInRange(iso, startIso, endIso);
      return { selected, inRange };
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
    const today = todayIso();
    const nowDisabled = !!this.isDateDisabled?.(today);

    const renderMonthCalendar = (year: number, month: number) => {
      const cells = buildMonthGrid(year, month);
      const title = `${year}-${String(month + 1).padStart(2, "0")}`;
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
      return html`
        <div class="gk-dp-cal" part="calendar">
          <div class="gk-date-picker-panel__nav">
            <button
              type="button"
              data-nav="prev-year"
              aria-label="Previous year"
              @click=${() => this.shiftViewYears(-1)}
            >
              «
            </button>
            <button
              type="button"
              data-nav="prev-month"
              aria-label="Previous month"
              @click=${() => this.shiftView(-1)}
            >
              ‹
            </button>
            <div class="gk-date-picker-panel__nav-title">${title}</div>
            <button
              type="button"
              data-nav="next-month"
              aria-label="Next month"
              @click=${() => this.shiftView(1)}
            >
              ›
            </button>
            <button
              type="button"
              data-nav="next-year"
              aria-label="Next year"
              @click=${() => this.shiftViewYears(1)}
            >
              »
            </button>
          </div>
          <div class="gk-date-picker-panel__weekdays">
            ${weekdays.map((d) => html`<span>${d}</span>`)}
          </div>
          <div class="gk-date-picker-panel__days">${dayButtons}</div>
        </div>
      `;
    };

    const leftDate = new Date(this.viewYear, this.viewMonth, 1, 12, 0, 0, 0);
    const rightDate = addMonths(leftDate, 1);
    const dualCalendars = html`
      <div class="gk-dp-calendars">
        ${renderMonthCalendar(this.viewYear, this.viewMonth)}
        ${!this.isCompact
          ? renderMonthCalendar(rightDate.getFullYear(), rightDate.getMonth())
          : nothing}
      </div>
    `;

    const singleCalendar = renderMonthCalendar(this.viewYear, this.viewMonth);

    if (this.type === "month") {
      const monthLabels = MONTH_NAMES[locale];
      const todayYm = todayYearMonth();
      const nowDisabledMonth = !!this.isDateDisabled?.(todayYm);
      const monthButtons = Array.from({ length: 12 }, (_, i) => {
        const mo = String(i + 1).padStart(2, "0");
        const ym = `${this.viewYear}-${mo}`;
        const disabled = !!this.isDateDisabled?.(ym);
        const selected =
          typeof this.value === "string" && this.value === ym;
        return html`
          <button
            type="button"
            data-month=${ym}
            class=${classMap({ "is-selected": selected })}
            ?disabled=${disabled}
            ?data-today=${ym === todayYm}
            ?data-selected=${selected}
            @click=${() => this.onMonthClick(ym)}
          >
            ${monthLabels[i]}
          </button>
        `;
      });
      render(
        html`
          <div part="calendar">
            <div class="gk-date-picker-panel__nav">
              <button
                type="button"
                aria-label="Previous year"
                @click=${() => this.shiftViewYear(-1)}
              >
                ‹
              </button>
              <div class="gk-date-picker-panel__nav-title">${this.viewYear}</div>
              <button
                type="button"
                aria-label="Next year"
                @click=${() => this.shiftViewYear(1)}
              >
                ›
              </button>
            </div>
            <div class="gk-dp-month-grid">${monthButtons}</div>
          </div>
          <div part="actions">
            <button type="button" data-action="clear" @click=${this.onPanelClear}>
              ${labels.clear}
            </button>
            <button
              type="button"
              data-action="now"
              ?disabled=${nowDisabledMonth}
              @click=${this.onPanelNow}
            >
              ${labels.now}
            </button>
          </div>
        `,
        this.panel,
      );
      this.positionPanel();
      return;
    }

    if (this.type === "year") {
      const todayY = todayYear();
      const nowDisabledYear = !!this.isDateDisabled?.(todayY);
      const years = buildYearPage(this.yearPageStart);
      const yearEnd = this.yearPageStart + years.length - 1;
      const yearButtons = years.map((y) => {
        const ys = String(y);
        const disabled = !!this.isDateDisabled?.(ys);
        const selected = typeof this.value === "string" && this.value === ys;
        return html`
          <button
            type="button"
            data-year=${ys}
            class=${classMap({ "is-selected": selected })}
            ?disabled=${disabled}
            ?data-today=${ys === todayY}
            ?data-selected=${selected}
            @click=${() => this.onYearClick(ys)}
          >
            ${ys}
          </button>
        `;
      });
      render(
        html`
          <div part="calendar">
            <div class="gk-date-picker-panel__nav">
              <button
                type="button"
                aria-label="Previous years"
                @click=${() => this.shiftYearPage(-1)}
              >
                ‹
              </button>
              <div class="gk-date-picker-panel__nav-title">
                ${this.yearPageStart} – ${yearEnd}
              </div>
              <button
                type="button"
                aria-label="Next years"
                @click=${() => this.shiftYearPage(1)}
              >
                ›
              </button>
            </div>
            <div class="gk-dp-year-grid">${yearButtons}</div>
          </div>
          <div part="actions">
            <button type="button" data-action="clear" @click=${this.onPanelClear}>
              ${labels.clear}
            </button>
            <button
              type="button"
              data-action="now"
              ?disabled=${nowDisabledYear}
              @click=${this.onPanelNow}
            >
              ${labels.now}
            </button>
          </div>
        `,
        this.panel,
      );
      this.positionPanel();
      return;
    }

    if (this.type === "datetime") {
      const fields = html`
        <div class="gk-dp-fields" part="panel-fields">
          <input
            type="text"
            data-field="date"
            .value=${this.panelDateFieldValue("date")}
            @change=${this.onDateFieldChange}
            @keydown=${this.onDateFieldKeydown}
          />
          <input
            type="text"
            data-field="time"
            .value=${this.panelTimeFieldValue("time")}
            @change=${this.onTimeFieldChange}
            @keydown=${this.onTimeFieldKeydown}
          />
        </div>
      `;
      const actions = html`
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
      `;
      render([fields, singleCalendar, actions], this.panel);
      this.positionPanel();
      return;
    }

    if (this.type === "datetimerange") {
      const fields = html`
        <div class="gk-dp-fields" part="panel-fields">
          <input
            type="text"
            data-field="start-date"
            .value=${this.panelDateFieldValue("start-date")}
            @change=${this.onStartDateFieldChange}
            @keydown=${this.onStartDateFieldKeydown}
          />
          <input
            type="text"
            data-field="start-time"
            .value=${this.panelTimeFieldValue("start-time")}
            @change=${this.onStartTimeFieldChange}
            @keydown=${this.onStartTimeFieldKeydown}
          />
          <span class="gk-dp-fields__sep">${this.separator}</span>
          <input
            type="text"
            data-field="end-date"
            .value=${this.panelDateFieldValue("end-date")}
            @change=${this.onEndDateFieldChange}
            @keydown=${this.onEndDateFieldKeydown}
          />
          <input
            type="text"
            data-field="end-time"
            .value=${this.panelTimeFieldValue("end-time")}
            @change=${this.onEndTimeFieldChange}
            @keydown=${this.onEndTimeFieldKeydown}
          />
        </div>
      `;
      const actions = html`
        <div part="actions">
          <button type="button" data-action="clear" @click=${this.onPanelClear}>
            ${labels.clear}
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
      `;
      render([fields, dualCalendars, actions], this.panel);
      this.positionPanel();
      return;
    }

    if (this.type === "daterange") {
      const fields = html`
        <div class="gk-dp-fields" part="panel-fields">
          <input
            type="text"
            data-field="start-date"
            .value=${this.panelDateFieldValue("start-date")}
            @change=${this.onStartDateFieldChange}
            @keydown=${this.onStartDateFieldKeydown}
          />
          <span class="gk-dp-fields__sep">${this.separator}</span>
          <input
            type="text"
            data-field="end-date"
            .value=${this.panelDateFieldValue("end-date")}
            @change=${this.onEndDateFieldChange}
            @keydown=${this.onEndDateFieldKeydown}
          />
        </div>
      `;
      const actions = html`
        <div part="actions">
          <button type="button" data-action="clear" @click=${this.onPanelClear}>
            ${labels.clear}
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
      `;
      render([fields, dualCalendars, actions], this.panel);
      this.positionPanel();
      return;
    }

    {
      const fields = html`
        <div class="gk-dp-fields" part="panel-fields">
          <input
            type="text"
            data-field="date"
            .value=${this.panelDateFieldValue("date")}
            @change=${this.onDateFieldChange}
            @keydown=${this.onDateFieldKeydown}
          />
        </div>
      `;
      const actions = html`
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
      `;
      render([fields, singleCalendar, actions], this.panel);
      this.positionPanel();
    }
  }

  private get showClearButton() {
    if (!this.clearable || this.disabled) return false;
    if (this.type === "daterange") {
      return isRangePair(this.value);
    }
    if (this.type === "datetimerange") {
      return isDateTimeRangePair(this.value);
    }
    return typeof this.value === "string" && this.value.length > 0;
  }

  private displayText() {
    if (this.type === "datetimerange") {
      if (isDateTimeRangePair(this.value)) {
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
    if (this.type === "month") {
      if (typeof this.value === "string" && isValidYearMonth(this.value)) {
        return formatDisplay(this.value, this.format);
      }
      return this.placeholder;
    }
    if (this.type === "year") {
      if (typeof this.value === "string" && isValidYear(this.value)) {
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
    if (this.type === "datetimerange") {
      return !isDateTimeRangePair(this.value);
    }
    if (this.type === "datetime") {
      return !(typeof this.value === "string" && isValidDateTime(this.value));
    }
    if (this.type === "month") {
      return !(typeof this.value === "string" && isValidYearMonth(this.value));
    }
    if (this.type === "year") {
      return !(typeof this.value === "string" && isValidYear(this.value));
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
