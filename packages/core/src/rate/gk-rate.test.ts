import { describe, expect, it, vi } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-rate.js";
import type { GkRate } from "./gk-rate.js";

describe("gk-rate", () => {
  it("defaults to five stars with half and clear enabled", async () => {
    const el = await fixture<GkRate>(html`<gk-rate></gk-rate>`);
    expect(el.value).toBe(0);
    expect(el.count).toBe(5);
    expect(el.allowHalf).toBe(true);
    expect(el.allowClear).toBe(true);
    expect(el.shadowRoot?.querySelectorAll("[part='item']")).toHaveLength(5);
    expect(el.shadowRoot?.querySelector("[part='root']")?.getAttribute("role")).toBe("radiogroup");
  });

  it("sets a half star and clears when that stop is clicked again", async () => {
    const el = await fixture<GkRate>(html`<gk-rate value="3.5"></gk-rate>`);
    const onChange = vi.fn();
    el.addEventListener("change", onChange);
    const half = el.shadowRoot?.querySelector("[part='half']") as HTMLButtonElement;
    half.click();
    expect(el.value).toBe(0.5);
    half.click();
    expect(el.value).toBe(0);
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange.mock.calls[0][0].detail).toEqual({ value: 0.5 });
  });

  it("steps by 0.5 from the keyboard", async () => {
    const el = await fixture<GkRate>(html`<gk-rate value="1"></gk-rate>`);
    const root = el.shadowRoot?.querySelector("[part='root']") as HTMLElement;
    root.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(el.value).toBe(1.5);
    root.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    expect(el.value).toBe(5);
    root.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
    expect(el.value).toBe(0);
  });

  it("does not preview or change when readonly", async () => {
    const el = await fixture<GkRate>(html`<gk-rate readonly value="2"></gk-rate>`);
    const full = el.shadowRoot?.querySelector("[part='full']") as HTMLButtonElement;
    full.dispatchEvent(new Event("pointerenter"));
    full.click();
    expect(el.value).toBe(2);
    expect(el.hasAttribute("data-preview")).toBe(false);
    expect(el.shadowRoot?.querySelector("[part='root']")?.getAttribute("tabindex")).toBe("-1");
  });
});
