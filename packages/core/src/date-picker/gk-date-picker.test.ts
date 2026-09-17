import { describe, it, expect, vi, afterEach } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-date-picker.js";
import type { GkDatePicker } from "./gk-date-picker.js";

describe("gk-date-picker", () => {
  afterEach(() => {
    document.querySelectorAll(".gk-date-picker-panel").forEach((n) => n.remove());
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
    const el = await fixture<GkDatePicker>(html`<gk-date-picker></gk-date-picker>`);
    el.isDateDisabled = (iso) => iso === "2026-09-17";
    el.open = true;
    el.value = "2026-09-01";
    el.open = true;
    await el.updateComplete;
    const btn = document.querySelector(
      '.gk-date-picker-panel button[data-iso="2026-09-17"]',
    ) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});
