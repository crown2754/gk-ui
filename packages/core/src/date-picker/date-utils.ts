export type CalendarCell = {
  iso: string;
  day: number;
  inMonth: boolean;
};

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

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

export function formatDisplay(iso: string, format: string): string {
  if (!isValidIsoDate(iso)) return "";
  const [yyyy, MM, dd] = iso.split("-");
  return format.replace(/yyyy/g, yyyy).replace(/MM/g, MM).replace(/dd/g, dd);
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
