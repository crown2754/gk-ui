export type CalendarCell = {
  iso: string;
  day: number;
  inMonth: boolean;
};

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const YM_RE = /^(\d{4})-(\d{2})$/;
const Y_RE = /^(\d{4})$/;

export function isValidYearMonth(value: string): boolean {
  const m = YM_RE.exec(value);
  if (!m) return false;
  const mo = Number(m[2]);
  return mo >= 1 && mo <= 12;
}

export function isValidYear(value: string): boolean {
  return Y_RE.test(value);
}

export function todayYearMonth(): string {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
}

export function todayYear(): string {
  return String(new Date().getFullYear());
}

export function buildYearPage(startYear: number, size = 12): number[] {
  return Array.from({ length: size }, (_, i) => startYear + i);
}

export function isValidIsoDate(value: string): boolean {
  const m = ISO_RE.exec(value);
  if (!m) return false;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(y, mo - 1, d);
  return (
    dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d
  );
}

/** Local calendar date at noon to avoid DST edge cases. */
export function parseIsoDate(value: string): Date | null {
  if (!isValidIsoDate(value)) return null;
  const [y, mo, d] = value.split("-").map(Number);
  return new Date(y, mo - 1, d, 12, 0, 0, 0);
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayIso(): string {
  return toIsoDate(new Date());
}

const DT_RE = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

export function isValidDateTime(value: string): boolean {
  const m = DT_RE.exec(value);
  if (!m) return false;
  if (!isValidIsoDate(`${m[1]}-${m[2]}-${m[3]}`)) return false;
  const h = Number(m[4]);
  const mi = Number(m[5]);
  const s = Number(m[6]);
  return h <= 23 && mi <= 59 && s <= 59;
}

export function parseDateTime(
  value: string,
): { date: string; h: number; m: number; s: number } | null {
  if (!isValidDateTime(value)) return null;
  const m = DT_RE.exec(value)!;
  return {
    date: `${m[1]}-${m[2]}-${m[3]}`,
    h: Number(m[4]),
    m: Number(m[5]),
    s: Number(m[6]),
  };
}

export function toDateTime(
  dateIso: string,
  h: number,
  m: number,
  s: number,
): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${dateIso} ${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function todayDateTime(): string {
  const n = new Date();
  return toDateTime(toIsoDate(n), n.getHours(), n.getMinutes(), n.getSeconds());
}

export function datePart(value: string): string {
  if (isValidIsoDate(value)) return value;
  const dt = parseDateTime(value);
  return dt ? dt.date : "";
}

export function compareDateTime(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function formatDisplay(value: string, format: string): string {
  if (isValidYearMonth(value)) {
    const [yyyy, MM] = value.split("-");
    return format.replace(/yyyy/g, yyyy).replace(/MM/g, MM);
  }
  if (isValidYear(value)) {
    return format.replace(/yyyy/g, value);
  }
  const dt = parseDateTime(value);
  if (dt) {
    const pad = (n: number) => String(n).padStart(2, "0");
    return format
      .replace(/yyyy/g, dt.date.slice(0, 4))
      .replace(/MM/g, dt.date.slice(5, 7))
      .replace(/dd/g, dt.date.slice(8, 10))
      .replace(/HH/g, pad(dt.h))
      .replace(/mm/g, pad(dt.m))
      .replace(/ss/g, pad(dt.s));
  }
  if (!isValidIsoDate(value)) return "";
  const [yyyy, MM, dd] = value.split("-");
  return format
    .replace(/yyyy/g, yyyy)
    .replace(/MM/g, MM)
    .replace(/dd/g, dd)
    .replace(/HH/g, "00")
    .replace(/mm/g, "00")
    .replace(/ss/g, "00");
}

export function compareIso(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function isIsoInRange(iso: string, start: string, end: string): boolean {
  const [s, e] = compareIso(start, end) <= 0 ? [start, end] : [end, start];
  return iso >= s && iso <= e;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0, 0);
}

export function addMonths(date: Date, delta: number): Date {
  const y = date.getFullYear();
  const m = date.getMonth() + delta;
  const day = date.getDate();
  const last = new Date(y, m + 1, 0).getDate();
  return new Date(y, m, Math.min(day, last), 12, 0, 0, 0);
}

/** month is 0-based. Grid is 6×7 = 42 cells, weeks start on Sunday. */
export function buildMonthGrid(year: number, month: number): CalendarCell[] {
  const first = new Date(year, month, 1, 12, 0, 0, 0);
  const startOffset = first.getDay(); // 0=Sun
  const gridStart = new Date(year, month, 1 - startOffset, 12, 0, 0, 0);
  const cells: CalendarCell[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + i,
      12,
      0,
      0,
      0,
    );
    cells.push({
      iso: toIsoDate(d),
      day: d.getDate(),
      inMonth: d.getMonth() === month,
    });
  }
  return cells;
}
