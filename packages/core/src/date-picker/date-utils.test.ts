import { describe, it, expect } from "vitest";
import {
  isValidIsoDate,
  parseIsoDate,
  toIsoDate,
  formatDisplay,
  addMonths,
  buildMonthGrid,
  todayIso,
  compareIso,
  isIsoInRange,
} from "./date-utils.js";

describe("date-utils", () => {
  it("validates ISO dates", () => {
    expect(isValidIsoDate("2026-09-17")).toBe(true);
    expect(isValidIsoDate("2026-9-17")).toBe(false);
    expect(isValidIsoDate("")).toBe(false);
    expect(isValidIsoDate("not-a-date")).toBe(false);
  });

  it("round-trips parse and toIsoDate", () => {
    const d = parseIsoDate("2026-02-01");
    expect(d).not.toBeNull();
    expect(toIsoDate(d!)).toBe("2026-02-01");
  });

  it("formatDisplay replaces yyyy MM dd", () => {
    expect(formatDisplay("2026-09-07", "yyyy-MM-dd")).toBe("2026-09-07");
    expect(formatDisplay("2026-09-07", "dd/MM/yyyy")).toBe("07/09/2026");
  });

  it("addMonths moves calendar month", () => {
    expect(toIsoDate(addMonths(parseIsoDate("2026-01-31")!, 1))).toBe(
      "2026-02-28",
    );
  });

  it("buildMonthGrid returns 6 weeks starting Sunday", () => {
    const grid = buildMonthGrid(2026, 8); // September 2026 (month 0-based 8)
    expect(grid).toHaveLength(42);
    expect(grid.filter((c) => c.inMonth).length).toBe(30);
    const firstInMonth = grid.find((c) => c.inMonth)!;
    expect(firstInMonth.iso).toBe("2026-09-01");
  });

  it("todayIso matches local Y-M-D", () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    expect(todayIso()).toBe(`${y}-${m}-${d}`);
  });

  it("compareIso orders ISO dates", () => {
    expect(compareIso("2026-09-01", "2026-09-10")).toBe(-1);
    expect(compareIso("2026-09-10", "2026-09-01")).toBe(1);
    expect(compareIso("2026-09-01", "2026-09-01")).toBe(0);
  });

  it("isIsoInRange includes endpoints and normalizes order", () => {
    expect(isIsoInRange("2026-09-05", "2026-09-01", "2026-09-10")).toBe(true);
    expect(isIsoInRange("2026-09-01", "2026-09-10", "2026-09-01")).toBe(true);
    expect(isIsoInRange("2026-09-11", "2026-09-01", "2026-09-10")).toBe(false);
  });
});