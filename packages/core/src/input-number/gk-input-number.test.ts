import { describe, expect, it, vi } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-input-number.js";
import type { GkInputNumber } from "./gk-input-number.js";

function inputOf(el: GkInputNumber) {
  return el.shadowRoot?.querySelector("[part='input']") as HTMLInputElement;
}

describe("gk-input-number", () => {
  it("defaults to an empty md field with end steppers", async () => {
    const el = await fixture<GkInputNumber>(html`<gk-input-number></gk-input-number>`);
    expect(el.value).toBeNull();
    expect(el.step).toBe(1);
    expect(el.size).toBe("md");
    expect(el.showButton).toBe(true);
    expect(el.buttonPlacement).toBe("right");
    expect(el.shadowRoot?.querySelector("[part='controls']")).toBeTruthy();
    expect(inputOf(el).getAttribute("role")).toBe("spinbutton");
    expect(inputOf(el).type).toBe("text");
  });

  it("steps, clamps, and commits", async () => {
    const el = await fixture<GkInputNumber>(html`
      <gk-input-number value="1" min="1" max="3"></gk-input-number>
    `);
    const onChange = vi.fn();
    el.addEventListener("change", onChange);
    const decrement = el.shadowRoot?.querySelector("[part='decrement']") as HTMLButtonElement;
    expect(decrement.disabled).toBe(true);
    const increment = el.shadowRoot?.querySelector("[part='increment']") as HTMLButtonElement;
    increment.click();
    await el.updateComplete;
    expect(el.value).toBe(2);
    expect(onChange.mock.calls.at(-1)?.[0].detail).toEqual({ value: 2 });
    increment.click();
    await el.updateComplete;
    expect(
      (el.shadowRoot?.querySelector("[part='increment']") as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it("derives precision from step", async () => {
    const el = await fixture<GkInputNumber>(html`
      <gk-input-number value="1" step="0.5"></gk-input-number>
    `);
    (el.shadowRoot?.querySelector("[part='increment']") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.value).toBe(1.5);
    expect(inputOf(el).value).toBe("1.5");
  });

  it("reverts invalid text on blur and keeps native input inside", async () => {
    const el = await fixture<GkInputNumber>(html`<gk-input-number value="4"></gk-input-number>`);
    const seen: Event[] = [];
    el.addEventListener("input", (event) => seen.push(event));
    const input = inputOf(el);
    input.focus();
    input.value = "nope";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe(4);
    expect(input.value).toBe("4");
    expect(seen.every((event) => event instanceof CustomEvent)).toBe(true);
  });

  it("omits steppers when readonly and uses Chinese labels", async () => {
    const el = await fixture<GkInputNumber>(html`
      <div lang="zh-Hant"><gk-input-number readonly value="3"></gk-input-number></div>
    `);
    const field = el.querySelector("gk-input-number") as GkInputNumber;
    await field.updateComplete;
    expect(field.shadowRoot?.querySelector("[part='increment']")).toBeNull();

    const live = await fixture<GkInputNumber>(html`
      <gk-input-number lang="zh-Hant" value="2"><span slot="suffix">件</span></gk-input-number>
    `);
    await live.updateComplete;
    expect(
      live.shadowRoot?.querySelector("[part='increment']")?.getAttribute("aria-label"),
    ).toBe("增加");
    expect(inputOf(live).getAttribute("aria-valuetext")).toContain("件");
  });

  it("places minus and plus outside when button-placement is both", async () => {
    const el = await fixture<GkInputNumber>(html`
      <gk-input-number button-placement="both" value="3"></gk-input-number>
    `);
    expect(el.shadowRoot?.querySelector("[part='decrement']")?.textContent?.trim()).toBe("−");
    expect(el.shadowRoot?.querySelector("[part='increment']")?.textContent?.trim()).toBe("+");
  });
});
