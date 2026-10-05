/** Decimal places implied by a step such as 0.5 → 1. */
export function stepPrecision(step: number) {
  if (!Number.isFinite(step)) return 0;
  const text = String(step);
  const index = text.indexOf(".");
  return index < 0 ? 0 : text.length - index - 1;
}

export function applyPrecision(value: number, precision: number) {
  const factor = 10 ** Math.max(0, precision);
  return Math.round(value * factor) / factor;
}

export function clampNumber(
  value: number,
  min: number | null,
  max: number | null,
  precision: number,
) {
  let next = value;
  if (min != null) next = Math.max(min, next);
  if (max != null) next = Math.min(max, next);
  return applyPrecision(next, precision);
}

/** Allow intermediate keystrokes such as "-", ".", "-.", and "1.". */
export function parseLoose(
  text: string,
): number | null | "partial" | "invalid" {
  const value = text.trim();
  if (value === "") return null;
  if (value === "-" || value === "." || value === "-.") return "partial";
  if (/^-?(?:\d+\.?\d*|\.\d+)$/.test(value)) {
    if (value.endsWith(".")) return "partial";
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : "invalid";
  }
  return "invalid";
}
