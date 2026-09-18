import { describe, it, expect, vi } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-switch.js";
import type { GkSwitch } from "./gk-switch.js";

function track(el: GkSwitch) {
  return el.shadowRoot?.querySelector(
    '[role="switch"]',
  ) as HTMLButtonElement | null;
}

describe("gk-switch", () => {
  it("defaults checked to false", async () => {
    const el = await fixture<GkSwitch>(html`<gk-switch></gk-switch>`);
    expect(el.checked).toBe(false);
    expect(el.hasAttribute("checked")).toBe(false);
  });

  it("defaults size md, disabled false, round true", async () => {
    const el = await fixture<GkSwitch>(html`<gk-switch></gk-switch>`);
    expect(el.size).toBe("md");
    expect(el.disabled).toBe(false);
    expect(el.round).toBe(true);
  });

  it("toggle sets checked", async () => {
    const el = await fixture<GkSwitch>(html`<gk-switch></gk-switch>`);
    el.click();
    await el.updateComplete;
    expect(el.checked).toBe(true);
    expect(el.hasAttribute("checked")).toBe(true);
    el.click();
    await el.updateComplete;
    expect(el.checked).toBe(false);
  });

  it("disabled blocks toggle", async () => {
    const el = await fixture<GkSwitch>(
      html`<gk-switch disabled></gk-switch>`,
    );
    expect(el.disabled).toBe(true);
    el.click();
    await el.updateComplete;
    expect(el.checked).toBe(false);
    const spy = vi.fn();
    el.addEventListener("change", spy);
    track(el)?.click();
    await el.updateComplete;
    expect(el.checked).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it("reflects size attribute", async () => {
    const el = await fixture<GkSwitch>(
      html`<gk-switch size="lg"></gk-switch>`,
    );
    expect(el.size).toBe("lg");
    expect(el.getAttribute("size")).toBe("lg");
    el.size = "sm";
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("sm");
  });

  it("dispatches change with detail, bubbles, and composed", async () => {
    const el = await fixture<GkSwitch>(html`<gk-switch></gk-switch>`);
    const spy = vi.fn();
    el.addEventListener("change", spy);
    el.click();
    await el.updateComplete;
    expect(spy).toHaveBeenCalledTimes(1);
    const ev = spy.mock.calls[0][0] as CustomEvent<{ checked: boolean }>;
    expect(ev).toBeInstanceOf(CustomEvent);
    expect(ev.bubbles).toBe(true);
    expect(ev.composed).toBe(true);
    expect(ev.detail).toEqual({ checked: true });
    el.click();
    await el.updateComplete;
    const ev2 = spy.mock.calls[1][0] as CustomEvent<{ checked: boolean }>;
    expect(ev2.detail).toEqual({ checked: false });
  });

  it("exposes role=switch and aria-checked matching state", async () => {
    const el = await fixture<GkSwitch>(
      html`<gk-switch aria-label="Alerts"></gk-switch>`,
    );
    const btn = track(el);
    expect(btn).toBeTruthy();
    expect(btn?.getAttribute("role")).toBe("switch");
    expect(btn?.getAttribute("aria-checked")).toBe("false");
    el.click();
    await el.updateComplete;
    expect(track(el)?.getAttribute("aria-checked")).toBe("true");
  });

  it("inner button click toggles once and emits a single change", async () => {
    const el = await fixture<GkSwitch>(html`<gk-switch></gk-switch>`);
    const spy = vi.fn();
    el.addEventListener("change", spy);
    track(el)!.click();
    await el.updateComplete;
    expect(el.checked).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
    expect((spy.mock.calls[0][0] as CustomEvent).detail).toEqual({
      checked: true,
    });
  });

  it("round false drops the pill class", async () => {
    const el = await fixture<GkSwitch>(html`<gk-switch></gk-switch>`);
    expect(el.round).toBe(true);
    expect(track(el)?.classList.contains("round")).toBe(true);
    el.round = false;
    await el.updateComplete;
    expect(el.round).toBe(false);
    expect(el.hasAttribute("round")).toBe(false);
    expect(track(el)?.classList.contains("round")).toBe(false);
  });
});
