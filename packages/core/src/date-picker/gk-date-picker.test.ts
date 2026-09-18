import { describe, it, expect, vi, afterEach } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-date-picker.js";
import type { GkDatePicker } from "./gk-date-picker.js";
import {
  datePart,
  todayIso,
  todayYear,
  todayYearMonth,
} from "./date-utils.js";

const originalMatchMedia = window.matchMedia;

type MockMqlState = {
  matches: boolean;
  listeners: Array<(e: Event) => void>;
};

let mockMqlState: MockMqlState = { matches: false, listeners: [] };

function mockMatchMedia(matches: boolean) {
  mockMqlState = { matches, listeners: [] };
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      get matches() {
        return mockMqlState.matches;
      },
      media: query,
      addEventListener(_type: string, fn: (e: Event) => void) {
        mockMqlState.listeners.push(fn);
      },
      removeEventListener(_type: string, fn: (e: Event) => void) {
        mockMqlState.listeners = mockMqlState.listeners.filter((l) => l !== fn);
      },
      addListener(fn: (e: Event) => void) {
        mockMqlState.listeners.push(fn);
      },
      removeListener(fn: (e: Event) => void) {
        mockMqlState.listeners = mockMqlState.listeners.filter((l) => l !== fn);
      },
      dispatchEvent: () => false,
      onchange: null,
    }),
  });
}

function emitMatchMediaChange(matches: boolean) {
  mockMqlState.matches = matches;
  const e = new Event("change");
  mockMqlState.listeners.forEach((fn) => fn(e));
}

function restoreMatchMedia() {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: originalMatchMedia,
  });
}

function cleanupPortals() {
  document.querySelectorAll(".gk-date-picker-panel").forEach((n) => n.remove());
  document.querySelectorAll(".gk-date-picker-backdrop").forEach((n) => n.remove());
}

describe("gk-date-picker", () => {
  afterEach(() => {
    restoreMatchMedia();
    cleanupPortals();
  });

  it("defaults type date, empty value, size md, locale en", async () => {
    const el = await fixture<GkDatePicker>(html`<gk-date-picker></gk-date-picker>`);
    expect(el.type).toBe("date");
    expect(el.value).toBe("");
    expect(el.size).toBe("md");
    expect(el.format).toBe("yyyy-MM-dd");
    expect(el.locale).toBe("en");
    expect(el.open).toBe(false);
  });

  it("opens panel on trigger click and emits gk-open-change", async () => {
    const el = await fixture<GkDatePicker>(html`<gk-date-picker></gk-date-picker>`);
    const spy = vi.fn();
    el.addEventListener("gk-open-change", spy);
    (el.shadowRoot?.querySelector("[part='base']") as HTMLElement).click();
    await el.updateComplete;
    expect(el.open).toBe(true);
    expect(document.querySelector(".gk-date-picker-panel")).not.toBeNull();
    expect(spy).toHaveBeenCalled();
    expect((spy.mock.calls[0][0] as CustomEvent).detail).toEqual({ open: true });
  });

  it("selecting a day sets ISO value and emits input+change", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker value="2026-09-01"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const onInput = vi.fn();
    const onChange = vi.fn();
    el.addEventListener("input", onInput);
    el.addEventListener("change", onChange);
    const dayBtn = document.querySelector(
      '.gk-date-picker-panel button[data-iso="2026-09-17"]',
    ) as HTMLButtonElement;
    dayBtn.click();
    await el.updateComplete;
    expect(el.value).toBe("2026-09-17");
    expect(el.open).toBe(false);
    expect((onInput.mock.calls[0][0] as CustomEvent).detail).toEqual({
      value: "2026-09-17",
    });
    expect(onChange).toHaveBeenCalled();
  });

  it("clear empties value", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker value="2026-09-17" clearable></gk-date-picker>`,
    );
    const spy = vi.fn();
    el.addEventListener("input", spy);
    (el.shadowRoot?.querySelector("button[part='clear']") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.value).toBe("");
    expect((spy.mock.calls[0][0] as CustomEvent).detail).toEqual({ value: "" });
  });

  it("panel Clear and Now actions work", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker value="2026-01-01"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    (document.querySelector(
      ".gk-date-picker-panel [data-action='clear']",
    ) as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.value).toBe("");

    el.open = true;
    await el.updateComplete;
    (document.querySelector(
      ".gk-date-picker-panel [data-action='now']",
    ) as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(el.open).toBe(false);
  });

  it("isDateDisabled blocks selection and Now", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker value="2026-09-01"></gk-date-picker>`,
    );
    const today = todayIso();
    el.isDateDisabled = (iso) => iso === "2026-09-17" || iso === today;
    el.open = true;
    await el.updateComplete;
    const btn = document.querySelector(
      '.gk-date-picker-panel button[data-iso="2026-09-17"]',
    ) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    const nowBtn = document.querySelector(
      ".gk-date-picker-panel [data-action='now']",
    ) as HTMLButtonElement;
    expect(nowBtn.disabled).toBe(true);
  });

  it("Escape closes panel without changing value", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker value="2026-09-17"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const spy = vi.fn();
    el.addEventListener("input", spy);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(el.value).toBe("2026-09-17");
    expect(spy).not.toHaveBeenCalled();
  });

  it("outside click closes panel without changing value", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker value="2026-09-17"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const spy = vi.fn();
    el.addEventListener("input", spy);
    const outside = document.createElement("div");
    document.body.appendChild(outside);
    outside.click();
    outside.remove();
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(el.value).toBe("2026-09-17");
    expect(spy).not.toHaveBeenCalled();
  });
});

describe("gk-date-picker daterange", () => {
  afterEach(() => {
    restoreMatchMedia();
    cleanupPortals();
  });

  it("defaults value null for daterange", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="daterange"></gk-date-picker>`,
    );
    expect(el.value).toBeNull();
  });

  it("two-click selection does not commit until Confirm", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="daterange"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const inMonth = [
      ...document.querySelectorAll(
        ".gk-date-picker-panel button[data-iso]:not(.is-outside):not([disabled])",
      ),
    ] as HTMLButtonElement[];
    const a = inMonth[5];
    const b = inMonth[10];
    const isoA = a.dataset.iso!;
    const isoB = b.dataset.iso!;
    const onInput = vi.fn();
    el.addEventListener("input", onInput);
    a.click();
    await el.updateComplete;
    b.click();
    await el.updateComplete;
    expect(el.value).toBeNull();
    expect(el.open).toBe(true);
    expect(onInput).not.toHaveBeenCalled();
    (
      document.querySelector(
        '.gk-date-picker-panel button[data-action="confirm"]',
      ) as HTMLButtonElement
    ).click();
    await el.updateComplete;
    expect(el.value).not.toBeNull();
    const [start, end] = el.value as [string, string];
    expect(start <= end).toBe(true);
    expect([start, end].sort().join()).toBe([isoA, isoB].sort().join());
    expect(el.open).toBe(false);
    expect((onInput.mock.calls[0][0] as CustomEvent).detail.value).toEqual([
      start,
      end,
    ]);
  });

  it("swaps when second click is before first", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="daterange"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const inMonth = [
      ...document.querySelectorAll(
        ".gk-date-picker-panel button[data-iso]:not(.is-outside):not([disabled])",
      ),
    ] as HTMLButtonElement[];
    const later = inMonth[12];
    const earlier = inMonth[3];
    later.click();
    await el.updateComplete;
    earlier.click();
    await el.updateComplete;
    expect(el.value).toBeNull();
    (
      document.querySelector(
        '.gk-date-picker-panel button[data-action="confirm"]',
      ) as HTMLButtonElement
    ).click();
    await el.updateComplete;
    const [start, end] = el.value as [string, string];
    expect(start).toBe(earlier.dataset.iso);
    expect(end).toBe(later.dataset.iso);
  });

  it("renders dual calendars for daterange", async () => {
    mockMatchMedia(false);
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="daterange"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    expect(
      document.querySelectorAll(".gk-date-picker-panel .gk-dp-cal").length,
    ).toBe(2);
  });

  it("uses sheet + backdrop when compact", async () => {
    mockMatchMedia(true);
    const el = await fixture<GkDatePicker>(html`<gk-date-picker></gk-date-picker>`);
    el.open = true;
    await el.updateComplete;
    const panel = document.querySelector(".gk-date-picker-panel")!;
    expect(panel.classList.contains("is-sheet")).toBe(true);
    expect(document.querySelector(".gk-date-picker-backdrop")).toBeTruthy();
  });

  it("syncs sheet when compact media changes while open", async () => {
    mockMatchMedia(false);
    const el = await fixture<GkDatePicker>(html`<gk-date-picker></gk-date-picker>`);
    el.open = true;
    await el.updateComplete;
    const panel = document.querySelector(".gk-date-picker-panel")!;
    expect(panel.classList.contains("is-sheet")).toBe(false);
    expect(document.querySelector(".gk-date-picker-backdrop")).toBeNull();

    emitMatchMediaChange(true);
    await el.updateComplete;

    expect(panel.classList.contains("is-sheet")).toBe(true);
    expect(document.querySelector(".gk-date-picker-backdrop")).toBeTruthy();
  });

  it("daterange shows one calendar when compact", async () => {
    mockMatchMedia(true);
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="daterange"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    expect(document.querySelectorAll(".gk-date-picker-panel .gk-dp-cal").length).toBe(1);
  });

  it("daterange shows two calendars when not compact", async () => {
    mockMatchMedia(false);
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="daterange"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    expect(document.querySelectorAll(".gk-date-picker-panel .gk-dp-cal").length).toBe(2);
  });

  it("default separator is arrow", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="daterange"></gk-date-picker>`,
    );
    expect(el.separator).toBe(" → ");
  });

  it("daterange panel has Confirm", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="daterange"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    expect(
      document.querySelector(
        '.gk-date-picker-panel button[data-action="confirm"]',
      ),
    ).toBeTruthy();
  });

  it("daterange panel has start and end date fields", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="daterange"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    expect(
      document.querySelector(
        '.gk-date-picker-panel input[data-field="start-date"]',
      ),
    ).toBeTruthy();
    expect(
      document.querySelector(
        '.gk-date-picker-panel input[data-field="end-date"]',
      ),
    ).toBeTruthy();
  });

  it("date panel has date field", async () => {
    const el = await fixture<GkDatePicker>(html`<gk-date-picker></gk-date-picker>`);
    el.open = true;
    await el.updateComplete;
    expect(
      document.querySelector('.gk-date-picker-panel input[data-field="date"]'),
    ).toBeTruthy();
  });

  it("renders dual calendars for datetimerange", async () => {
    mockMatchMedia(false);
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="datetimerange"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    expect(
      document.querySelectorAll(".gk-date-picker-panel .gk-dp-cal").length,
    ).toBe(2);
    expect(
      document.querySelector(
        '.gk-date-picker-panel input[data-field="start-date"]',
      ),
    ).toBeTruthy();
    expect(
      document.querySelector(
        '.gk-date-picker-panel input[data-field="end-date"]',
      ),
    ).toBeTruthy();
    expect(
      document.querySelector(
        '.gk-date-picker-panel input[data-field="start-time"]',
      ),
    ).toBeTruthy();
    expect(
      document.querySelector(
        '.gk-date-picker-panel input[data-field="end-time"]',
      ),
    ).toBeTruthy();
    expect(
      document.querySelector(".gk-date-picker-panel button[data-h]"),
    ).toBeNull();
  });

  it("clear sets null", async () => {
    const el = await fixture<GkDatePicker>(html`
      <gk-date-picker
        type="daterange"
        clearable
        .value=${["2026-09-01", "2026-09-10"]}
      ></gk-date-picker>
    `);
    const spy = vi.fn();
    el.addEventListener("input", spy);
    (el.shadowRoot?.querySelector("button[part='clear']") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.value).toBeNull();
    expect((spy.mock.calls[0][0] as CustomEvent).detail.value).toBeNull();
  });

  it("isDateDisabled blocks day as range end without setting value", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="daterange"></gk-date-picker>`,
    );
    el.isDateDisabled = (iso) => iso === "2026-09-17";
    el.open = true;
    await el.updateComplete;
    const onInput = vi.fn();
    el.addEventListener("input", onInput);
    (
      document.querySelector(
        '.gk-date-picker-panel button[data-iso="2026-09-10"]',
      ) as HTMLButtonElement
    ).click();
    await el.updateComplete;
    const blocked = document.querySelector(
      '.gk-date-picker-panel button[data-iso="2026-09-17"]',
    ) as HTMLButtonElement;
    expect(blocked.disabled).toBe(true);
    blocked.click();
    await el.updateComplete;
    expect(el.value).toBeNull();
    expect(el.open).toBe(true);
    expect(onInput).not.toHaveBeenCalled();
  });

  it("range panel has Clear but not Now", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="daterange"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    expect(
      document.querySelector(".gk-date-picker-panel [data-action='clear']"),
    ).not.toBeNull();
    expect(
      document.querySelector(".gk-date-picker-panel [data-action='now']"),
    ).toBeNull();
  });

  it("dismiss mid-draft clears draft and closes without stale open", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="daterange"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const inMonth = [
      ...document.querySelectorAll(
        ".gk-date-picker-panel button[data-iso]:not(.is-outside):not([disabled])",
      ),
    ] as HTMLButtonElement[];
    inMonth[5].click();
    await el.updateComplete;
    expect(el.open).toBe(true);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(el.value).toBeNull();
    expect(document.querySelector(".gk-date-picker-panel")).toBeNull();

    // Draft must be cleared: first click after reopen starts a new draft (stays open).
    el.open = true;
    await el.updateComplete;
    const again = [
      ...document.querySelectorAll(
        ".gk-date-picker-panel button[data-iso]:not(.is-outside):not([disabled])",
      ),
    ] as HTMLButtonElement[];
    again[8].click();
    await el.updateComplete;
    expect(el.open).toBe(true);
    expect(el.value).toBeNull();
  });

  it("restart then Escape restores previous pair without emit", async () => {
    const prev: [string, string] = ["2026-09-01", "2026-09-10"];
    const el = await fixture<GkDatePicker>(html`
      <gk-date-picker type="daterange" .value=${prev}></gk-date-picker>
    `);
    el.open = true;
    await el.updateComplete;
    const onInput = vi.fn();
    el.addEventListener("input", onInput);
    const inMonth = [
      ...document.querySelectorAll(
        ".gk-date-picker-panel button[data-iso]:not(.is-outside):not([disabled])",
      ),
    ] as HTMLButtonElement[];
    inMonth[5].click();
    await el.updateComplete;
    expect(el.value).toBeNull(); // local draft; no emit yet
    expect(onInput).not.toHaveBeenCalled();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(el.value).toEqual(prev);
    expect(onInput).not.toHaveBeenCalled();
  });

  it("coerceValueForType maps non-pair daterange values to null", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="daterange"></gk-date-picker>`,
    );
    el.value = "" as unknown as null;
    await el.updateComplete;
    expect(el.value).toBeNull();
    el.value = "2026-09-01" as unknown as null;
    await el.updateComplete;
    expect(el.value).toBeNull();
    el.value = ["2026-09-01"] as unknown as null;
    await el.updateComplete;
    expect(el.value).toBeNull();
  });
});

describe("gk-date-picker datetime", () => {
  afterEach(() => {
    restoreMatchMedia();
    cleanupPortals();
  });

  it("defaults empty string and format with time", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="datetime"></gk-date-picker>`,
    );
    expect(el.value).toBe("");
    expect(el.format).toBe("yyyy-MM-dd HH:mm:ss");
  });

  it("does not commit until Confirm", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="datetime"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const day = document.querySelector(
      ".gk-date-picker-panel button[data-iso]:not(.is-outside):not([disabled])",
    ) as HTMLButtonElement;
    const iso = day.dataset.iso!;
    day.click();
    await el.updateComplete;
    expect(el.value).toBe("");
    expect(el.open).toBe(true);
    const confirm = document.querySelector(
      '.gk-date-picker-panel button[data-action="confirm"]',
    ) as HTMLButtonElement;
    confirm.click();
    await el.updateComplete;
    expect(el.value).toBe(`${iso} 00:00:00`);
    expect(el.open).toBe(false);
  });

  it("Now commits immediately", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="datetime"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const onInput = vi.fn();
    el.addEventListener("input", onInput);
    (
      document.querySelector(
        '.gk-date-picker-panel button[data-action="now"]',
      ) as HTMLButtonElement
    ).click();
    await el.updateComplete;
    expect(typeof el.value).toBe("string");
    expect(el.value as string).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    expect(el.open).toBe(false);
    expect(onInput).toHaveBeenCalled();
  });

  it("Escape discards draft", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="datetime" value="2026-09-17 08:00:00"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const day = [
      ...document.querySelectorAll(
        ".gk-date-picker-panel button[data-iso]:not(.is-outside):not([disabled])",
      ),
    ].find((b) => (b as HTMLButtonElement).dataset.iso !== "2026-09-17") as
      | HTMLButtonElement
      | undefined;
    day?.click();
    await el.updateComplete;
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe("2026-09-17 08:00:00");
    expect(el.open).toBe(false);
  });

  it("panel has Clear, Now, Confirm", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="datetime"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const panel = document.querySelector(".gk-date-picker-panel")!;
    expect(panel.querySelector('[data-action="clear"]')).toBeTruthy();
    expect(panel.querySelector('[data-action="now"]')).toBeTruthy();
    expect(panel.querySelector('[data-action="confirm"]')).toBeTruthy();
  });

  it("panel Clear empties value, closes panel, and emits input", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="datetime" value="2026-09-17 08:00:00"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const onInput = vi.fn();
    el.addEventListener("input", onInput);
    (
      document.querySelector(
        '.gk-date-picker-panel button[data-action="clear"]',
      ) as HTMLButtonElement
    ).click();
    await el.updateComplete;
    expect(el.value).toBe("");
    expect(el.open).toBe(false);
    expect((onInput.mock.calls[0][0] as CustomEvent).detail).toEqual({ value: "" });
  });

  it("Confirm commits selected day and time draft", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="datetime"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    expect(
      document.querySelector(".gk-date-picker-panel button[data-h]"),
    ).toBeNull();
    const day = document.querySelector(
      ".gk-date-picker-panel button[data-iso]:not(.is-outside):not([disabled])",
    ) as HTMLButtonElement;
    const iso = day.dataset.iso!;
    day.click();
    await el.updateComplete;
    const timeInput = document.querySelector(
      '.gk-date-picker-panel input[data-field="time"]',
    ) as HTMLInputElement;
    expect(timeInput).toBeTruthy();
    timeInput.value = "14:00:00";
    timeInput.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    (
      document.querySelector(
        '.gk-date-picker-panel button[data-action="confirm"]',
      ) as HTMLButtonElement
    ).click();
    await el.updateComplete;
    expect(el.value).toBe(`${iso} 14:00:00`);
    expect(el.open).toBe(false);
  });

  it("datetime panel has date and time fields, no time columns", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="datetime"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    expect(
      document.querySelector('.gk-date-picker-panel input[data-field="date"]'),
    ).toBeTruthy();
    expect(
      document.querySelector('.gk-date-picker-panel input[data-field="time"]'),
    ).toBeTruthy();
    expect(
      document.querySelector(".gk-date-picker-panel button[data-h]"),
    ).toBeNull();
    expect(
      document.querySelector(".gk-date-picker-panel .gk-dp-time"),
    ).toBeNull();
  });

  it("trigger Clear wipes draft, closes panel, and Confirm cannot resurrect", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker
        type="datetime"
        clearable
        value="2026-09-17 08:00:00"
      ></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const onInput = vi.fn();
    el.addEventListener("input", onInput);
    (el.shadowRoot?.querySelector("button[part='clear']") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.value).toBe("");
    expect(el.open).toBe(false);
    expect((onInput.mock.calls[0][0] as CustomEvent).detail).toEqual({ value: "" });

    el.open = true;
    await el.updateComplete;
    (
      document.querySelector(
        '.gk-date-picker-panel button[data-action="confirm"]',
      ) as HTMLButtonElement
    ).click();
    await el.updateComplete;
    expect(el.value).toBe("");
    expect(el.open).toBe(true);
  });
});

describe("gk-date-picker datetimerange", () => {
  afterEach(() => {
    restoreMatchMedia();
    cleanupPortals();
  });

  it("defaults value null", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="datetimerange"></gk-date-picker>`,
    );
    expect(el.value).toBeNull();
  });

  it("two days + Confirm sets ordered pair", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="datetimerange"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const inMonth = [
      ...document.querySelectorAll(
        ".gk-date-picker-panel button[data-iso]:not(.is-outside):not([disabled])",
      ),
    ] as HTMLButtonElement[];
    const a = inMonth[5];
    const b = inMonth[10];
    const isoA = a.dataset.iso!;
    const isoB = b.dataset.iso!;
    a.click();
    await el.updateComplete;
    b.click();
    await el.updateComplete;
    expect(el.value).toBeNull();
    (
      document.querySelector(
        '.gk-date-picker-panel button[data-action="confirm"]',
      ) as HTMLButtonElement
    ).click();
    await el.updateComplete;
    const pair = el.value as [string, string];
    expect(pair[0] <= pair[1]).toBe(true);
    expect(datePart(pair[0])).toBe(isoA < isoB ? isoA : isoB);
    expect(datePart(pair[1])).toBe(isoA < isoB ? isoB : isoA);
    expect(el.open).toBe(false);
  });

  it("panel has Clear and Confirm but not Now", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="datetimerange"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const panel = document.querySelector(".gk-date-picker-panel")!;
    expect(panel.querySelector('[data-action="clear"]')).toBeTruthy();
    expect(panel.querySelector('[data-action="confirm"]')).toBeTruthy();
    expect(panel.querySelector('[data-action="now"]')).toBeFalsy();
  });

  it("Clear sets null", async () => {
    const el = await fixture<GkDatePicker>(html`
      <gk-date-picker
        type="datetimerange"
        .value=${["2026-09-01 00:00:00", "2026-09-10 12:00:00"]}
      ></gk-date-picker>
    `);
    el.open = true;
    await el.updateComplete;
    (
      document.querySelector(
        '.gk-date-picker-panel button[data-action="clear"]',
      ) as HTMLButtonElement
    ).click();
    await el.updateComplete;
    expect(el.value).toBeNull();
  });

  it("reverse day order + Confirm yields swapped ordered pair", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="datetimerange"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const inMonth = [
      ...document.querySelectorAll(
        ".gk-date-picker-panel button[data-iso]:not(.is-outside):not([disabled])",
      ),
    ] as HTMLButtonElement[];
    const later = inMonth[10];
    const earlier = inMonth[5];
    const isoLater = later.dataset.iso!;
    const isoEarlier = earlier.dataset.iso!;
    expect(isoLater > isoEarlier).toBe(true);
    later.click();
    await el.updateComplete;
    earlier.click();
    await el.updateComplete;
    expect(el.value).toBeNull();
    (
      document.querySelector(
        '.gk-date-picker-panel button[data-action="confirm"]',
      ) as HTMLButtonElement
    ).click();
    await el.updateComplete;
    const pair = el.value as [string, string];
    expect(datePart(pair[0])).toBe(isoEarlier);
    expect(datePart(pair[1])).toBe(isoLater);
    expect(pair[0] <= pair[1]).toBe(true);
    expect(el.open).toBe(false);
  });

  it("restart then Escape restores previous committed pair", async () => {
    const prev: [string, string] = ["2026-09-01 00:00:00", "2026-09-10 12:00:00"];
    const el = await fixture<GkDatePicker>(html`
      <gk-date-picker type="datetimerange" .value=${prev}></gk-date-picker>
    `);
    el.open = true;
    await el.updateComplete;
    const onInput = vi.fn();
    el.addEventListener("input", onInput);
    const inMonth = [
      ...document.querySelectorAll(
        ".gk-date-picker-panel button[data-iso]:not(.is-outside):not([disabled])",
      ),
    ] as HTMLButtonElement[];
    inMonth[5].click();
    await el.updateComplete;
    expect(el.value).toBeNull();
    expect(onInput).not.toHaveBeenCalled();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(el.value).toEqual(prev);
    expect(onInput).not.toHaveBeenCalled();
  });
});

describe("gk-date-picker month", () => {
  afterEach(() => {
    restoreMatchMedia();
    cleanupPortals();
  });

  it("defaults empty and format yyyy-MM", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="month"></gk-date-picker>`,
    );
    expect(el.value).toBe("");
    expect(el.format).toBe("yyyy-MM");
  });

  it("clicking a month commits and closes", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="month"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const btn = document.querySelector(
      ".gk-date-picker-panel button[data-month]",
    ) as HTMLButtonElement;
    const ym = btn.dataset.month!;
    const onInput = vi.fn();
    el.addEventListener("input", onInput);
    btn.click();
    await el.updateComplete;
    expect(el.value).toBe(ym);
    expect(el.open).toBe(false);
    expect((onInput.mock.calls[0][0] as CustomEvent).detail.value).toBe(ym);
  });

  it("panel has Clear and Now, not Confirm", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="month"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const panel = document.querySelector(".gk-date-picker-panel")!;
    expect(panel.querySelector('[data-action="clear"]')).toBeTruthy();
    expect(panel.querySelector('[data-action="now"]')).toBeTruthy();
    expect(panel.querySelector('[data-action="confirm"]')).toBeFalsy();
  });

  it("Now sets current month", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="month"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    (
      document.querySelector(
        '.gk-date-picker-panel button[data-action="now"]',
      ) as HTMLButtonElement
    ).click();
    await el.updateComplete;
    expect(el.value).toMatch(/^\d{4}-\d{2}$/);
    expect(el.open).toBe(false);
  });

  it("isDateDisabled blocks month cell", async () => {
    const el = await fixture<GkDatePicker>(html`
      <gk-date-picker
        type="month"
        value="2026-09"
        .isDateDisabled=${(v: string) => v === "2026-09"}
      ></gk-date-picker>
    `);
    el.open = true;
    await el.updateComplete;
    const btn = document.querySelector(
      '.gk-date-picker-panel button[data-month="2026-09"]',
    ) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.disabled).toBe(true);
  });

  it("Now respects isDateDisabled for month", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="month"></gk-date-picker>`,
    );
    const ym = todayYearMonth();
    el.isDateDisabled = (v) => v === ym;
    el.open = true;
    await el.updateComplete;
    const onInput = vi.fn();
    el.addEventListener("input", onInput);
    (
      document.querySelector(
        '.gk-date-picker-panel button[data-action="now"]',
      ) as HTMLButtonElement
    ).click();
    await el.updateComplete;
    expect(el.value).toBe("");
    expect(onInput).not.toHaveBeenCalled();
  });
});

describe("gk-date-picker year", () => {
  afterEach(() => {
    restoreMatchMedia();
    cleanupPortals();
  });

  it("defaults empty and format yyyy", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="year"></gk-date-picker>`,
    );
    expect(el.value).toBe("");
    expect(el.format).toBe("yyyy");
  });

  it("clicking a year commits and closes", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="year"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const btn = document.querySelector(
      ".gk-date-picker-panel button[data-year]",
    ) as HTMLButtonElement;
    const y = btn.dataset.year!;
    btn.click();
    await el.updateComplete;
    expect(el.value).toBe(y);
    expect(el.open).toBe(false);
  });

  it("isDateDisabled blocks year cell", async () => {
    const el = await fixture<GkDatePicker>(html`
      <gk-date-picker
        type="year"
        value="2026"
        .isDateDisabled=${(v: string) => v === "2026"}
      ></gk-date-picker>
    `);
    el.open = true;
    await el.updateComplete;
    const btn = document.querySelector(
      '.gk-date-picker-panel button[data-year="2026"]',
    ) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.disabled).toBe(true);
  });

  it("Now respects isDateDisabled for year", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="year"></gk-date-picker>`,
    );
    const y = todayYear();
    el.isDateDisabled = (v) => v === y;
    el.open = true;
    await el.updateComplete;
    const onInput = vi.fn();
    el.addEventListener("input", onInput);
    (
      document.querySelector(
        '.gk-date-picker-panel button[data-action="now"]',
      ) as HTMLButtonElement
    ).click();
    await el.updateComplete;
    expect(el.value).toBe("");
    expect(onInput).not.toHaveBeenCalled();
  });
});
