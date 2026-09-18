import { describe, it, expect, vi } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-checkbox.js";
import "./gk-checkbox-group.js";
import type { GkCheckbox } from "./gk-checkbox.js";
import type { GkCheckboxGroup } from "./gk-checkbox-group.js";

function box(el: GkCheckbox) {
  return el.shadowRoot?.querySelector(
    '[role="checkbox"]',
  ) as HTMLButtonElement | null;
}

describe("gk-checkbox", () => {
  it("defaults checked false, size md, not indeterminate", async () => {
    const el = await fixture<GkCheckbox>(html`<gk-checkbox></gk-checkbox>`);
    expect(el.checked).toBe(false);
    expect(el.indeterminate).toBe(false);
    expect(el.size).toBe("md");
    expect(el.disabled).toBe(false);
  });

  it("toggle sets checked and emits change", async () => {
    const el = await fixture<GkCheckbox>(html`<gk-checkbox>Agree</gk-checkbox>`);
    const spy = vi.fn();
    el.addEventListener("change", spy);
    el.click();
    await el.updateComplete;
    expect(el.checked).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
    const ev = spy.mock.calls[0][0] as CustomEvent<{ checked: boolean }>;
    expect(ev).toBeInstanceOf(CustomEvent);
    expect(ev.bubbles).toBe(true);
    expect(ev.composed).toBe(true);
    expect(ev.detail).toEqual({ checked: true });
  });

  it("disabled blocks toggle", async () => {
    const el = await fixture<GkCheckbox>(
      html`<gk-checkbox disabled></gk-checkbox>`,
    );
    const spy = vi.fn();
    el.addEventListener("change", spy);
    el.click();
    await el.updateComplete;
    expect(el.checked).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it("reflects size", async () => {
    const el = await fixture<GkCheckbox>(
      html`<gk-checkbox size="lg"></gk-checkbox>`,
    );
    expect(el.size).toBe("lg");
    expect(el.getAttribute("size")).toBe("lg");
  });

  it("exposes role=checkbox and aria-checked", async () => {
    const el = await fixture<GkCheckbox>(html`<gk-checkbox></gk-checkbox>`);
    expect(box(el)?.getAttribute("role")).toBe("checkbox");
    expect(box(el)?.getAttribute("aria-checked")).toBe("false");
    el.click();
    await el.updateComplete;
    expect(box(el)?.getAttribute("aria-checked")).toBe("true");
  });

  it("indeterminate uses aria-checked mixed; click checks and clears mixed", async () => {
    const el = await fixture<GkCheckbox>(html`<gk-checkbox></gk-checkbox>`);
    el.indeterminate = true;
    await el.updateComplete;
    expect(box(el)?.getAttribute("aria-checked")).toBe("mixed");
    el.click();
    await el.updateComplete;
    expect(el.indeterminate).toBe(false);
    expect(el.checked).toBe(true);
    expect(box(el)?.getAttribute("aria-checked")).toBe("true");
  });
});

describe("gk-checkbox-group", () => {
  it("defaults value to empty array", async () => {
    const el = await fixture<GkCheckboxGroup>(
      html`<gk-checkbox-group></gk-checkbox-group>`,
    );
    expect(el.value).toEqual([]);
  });

  it("toggles child values and emits string[] on the group only", async () => {
    const el = await fixture<GkCheckboxGroup>(html`
      <gk-checkbox-group>
        <gk-checkbox value="a">A</gk-checkbox>
        <gk-checkbox value="b">B</gk-checkbox>
      </gk-checkbox-group>
    `);
    const spy = vi.fn();
    el.addEventListener("change", spy);
    const a = el.querySelector('gk-checkbox[value="a"]') as GkCheckbox;
    a.click();
    await el.updateComplete;
    expect(el.value).toEqual(["a"]);
    expect(spy).toHaveBeenCalledTimes(1);
    const ev = spy.mock.calls[0][0] as CustomEvent<{ value: string[] }>;
    expect(ev).toBeInstanceOf(CustomEvent);
    expect(ev.bubbles).toBe(true);
    expect(ev.composed).toBe(true);
    expect(ev.detail).toEqual({ value: ["a"] });
    const b = el.querySelector('gk-checkbox[value="b"]') as GkCheckbox;
    b.click();
    await el.updateComplete;
    expect(el.value).toEqual(["a", "b"]);
    expect((spy.mock.calls[1][0] as CustomEvent).detail).toEqual({
      value: ["a", "b"],
    });
  });

  it("syncs child checked from value", async () => {
    const el = await fixture<GkCheckboxGroup>(html`
      <gk-checkbox-group>
        <gk-checkbox value="a">A</gk-checkbox>
        <gk-checkbox value="b">B</gk-checkbox>
      </gk-checkbox-group>
    `);
    el.value = ["b"];
    await el.updateComplete;
    const a = el.querySelector('gk-checkbox[value="a"]') as GkCheckbox;
    const b = el.querySelector('gk-checkbox[value="b"]') as GkCheckbox;
    expect(a.checked).toBe(false);
    expect(b.checked).toBe(true);
  });

  it("disabled group blocks child toggles", async () => {
    const el = await fixture<GkCheckboxGroup>(html`
      <gk-checkbox-group disabled>
        <gk-checkbox value="a">A</gk-checkbox>
      </gk-checkbox-group>
    `);
    const spy = vi.fn();
    el.addEventListener("change", spy);
    (el.querySelector("gk-checkbox") as GkCheckbox).click();
    await el.updateComplete;
    expect(el.value).toEqual([]);
    expect(spy).not.toHaveBeenCalled();
  });
});
