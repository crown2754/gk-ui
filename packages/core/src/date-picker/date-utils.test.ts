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
  isValidDateTime,
  parseDateTime,
  toDateTime,
  datePart,
  compareDateTime,
  isValidTime,
  parseTime,
  isValidYearMonth,
  isValidYear,
  todayYearMonth,
  todayYear,
  buildYearPage,
  computeFixedPanelPosition,
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

  it("todayYearMonth and todayYear match local calendar", () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    expect(todayYearMonth()).toBe(`${y}-${m}`);
    expect(todayYear()).toBe(String(y));
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

  it("validates HH:mm:ss", () => {
    expect(isValidTime("13:45:15")).toBe(true);
    expect(isValidTime("00:00:00")).toBe(true);
    expect(isValidTime("23:59:59")).toBe(true);
    expect(isValidTime("24:00:00")).toBe(false);
    expect(isValidTime("12:60:00")).toBe(false);
    expect(isValidTime("12:00:60")).toBe(false);
    expect(isValidTime("1:00:00")).toBe(false);
    expect(isValidTime("")).toBe(false);
  });

  it("parses HH:mm:ss into parts", () => {
    expect(parseTime("14:30:05")).toEqual({ h: 14, m: 30, s: 5 });
    expect(parseTime("24:00:00")).toBeNull();
  });

  it("validates and builds datetime strings", () => {
    expect(isValidDateTime("2026-09-17 14:30:00")).toBe(true);
    expect(isValidDateTime("2026-09-17")).toBe(false);
    expect(toDateTime("2026-09-17", 14, 30, 5)).toBe("2026-09-17 14:30:05");
    expect(parseDateTime("2026-09-17 14:30:05")).toEqual({
      date: "2026-09-17",
      h: 14,
      m: 30,
      s: 5,
    });
    expect(datePart("2026-09-17 14:30:00")).toBe("2026-09-17");
    expect(compareDateTime("2026-09-17 10:00:00", "2026-09-17 09:00:00")).toBe(1);
    expect(formatDisplay("2026-09-17 14:30:05", "yyyy-MM-dd HH:mm:ss")).toBe(
      "2026-09-17 14:30:05",
    );
  });

  it("validates month and year strings", () => {
    expect(isValidYearMonth("2026-09")).toBe(true);
    expect(isValidYearMonth("2026-13")).toBe(false);
    expect(isValidYear("2026")).toBe(true);
    expect(isValidYear("26")).toBe(false);
    expect(formatDisplay("2026-09", "yyyy-MM")).toBe("2026-09");
    expect(formatDisplay("2026", "yyyy")).toBe("2026");
    expect(buildYearPage(2020, 12)).toEqual([
      2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031,
    ]);
  });
  it("places panel below when there is room", () => {
    const pos = computeFixedPanelPosition({
      trigger: { top: 100, bottom: 140, left: 50, right: 250 },
      panelWidth: 280,
      panelHeight: 300,
      viewportWidth: 800,
      viewportHeight: 800,
    });
    expect(pos.placement).toBe("below");
    expect(pos.top).toBe(144);
    expect(pos.left).toBe(50);
  });

  it("flips panel above when space below is insufficient", () => {
    const pos = computeFixedPanelPosition({
      trigger: { top: 500, bottom: 540, left: 50, right: 250 },
      panelWidth: 280,
      panelHeight: 320,
      viewportWidth: 800,
      viewportHeight: 600,
    });
    expect(pos.placement).toBe("above");
    expect(pos.top).toBe(500 - 4 - 320);
  });

  it("clamps horizontal overflow", () => {
    const pos = computeFixedPanelPosition({
      trigger: { top: 40, bottom: 80, left: 700, right: 900 },
      panelWidth: 280,
      panelHeight: 200,
      viewportWidth: 800,
      viewportHeight: 800,
    });
    expect(pos.left).toBe(800 - 280 - 4);
  });
});