import { describe, it, expect, vi } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-radio.js";
import "./gk-radio-group.js";
import type { GkRadio } from "./gk-radio.js";
import type { GkRadioGroup } from "./gk-radio-group.js";
import { radioStyles } from "./gk-radio.styles.js";
import { radioGroupStyles } from "./gk-radio-group.styles.js";

function control(el: GkRadio) {
  return el.shadowRoot?.querySelector(
    '[role="radio"]',
  ) as HTMLButtonElement | null;
}

describe("gk-radio", () => {
  it("defaults checked false, size md", async () => {
    const el = await fixture<GkRadio>(html`<gk-radio value="a">A</gk-radio>`);
    expect(el.checked).toBe(false);
    expect(el.size).toBe("md");
    expect(el.value).toBe("a");
  });

  it("click selects and emits change with value", async () => {
    const el = await fixture<GkRadio>(html`<gk-radio value="a">A</gk-radio>`);
    const spy = vi.fn();
    el.addEventListener("change", spy);
    el.click();
    await el.updateComplete;
    expect(el.checked).toBe(true);
    const ev = spy.mock.calls[0][0] as CustomEvent<{ value: string }>;
    expect(ev).toBeInstanceOf(CustomEvent);
    expect(ev.bubbles).toBe(true);
    expect(ev.composed).toBe(true);
    expect(ev.detail).toEqual({ value: "a" });
  });

  it("clicking selected radio does not deselect", async () => {
    const el = await fixture<GkRadio>(
      html`<gk-radio value="a" checked>A</gk-radio>`,
    );
    el.click();
    await el.updateComplete;
    expect(el.checked).toBe(true);
  });

  it("keeps the selected mark and only fades an unchecked disabled radio", () => {
    const css = radioStyles.cssText;
    expect(css).toMatch(
      /:host\(\[checked\]\) \[part="control"\]\s*\{[^}]*background:\s*#fff/,
    );
    expect(css).toMatch(
      /:host\(\[checked\]\) \[part="control"\]\s*\{[^}]*--gk-color-brand-pressed/,
    );
    expect(css).toMatch(/\[part="dot"\]\s*\{[^}]*--gk-color-brand-pressed/);
    expect(css).toMatch(
      /:host\(\[disabled\]:not\(\[checked\]\)\)(?:\s*,[^{]*)?\s*\{[^}]*opacity:\s*0\.5/,
    );
    expect(css).toMatch(
      /:host\(\[data-gk-group-disabled\]:not\(\[checked\]\)\)(?:\s*,[^{]*)?\s*\{[^}]*opacity:\s*0\.5/,
    );
    expect(css).not.toMatch(/:host\(\[disabled\]\)\s*\{[^}]*opacity:/);
    expect(css).toMatch(
      /:host\(\[disabled\]\[checked\]\) \[part="label"\][\s\S]*--gk-color-text-muted/,
    );
  });

  it("disabled blocks select", async () => {
    const el = await fixture<GkRadio>(
      html`<gk-radio value="a" disabled>A</gk-radio>`,
    );
    const spy = vi.fn();
    el.addEventListener("change", spy);
    el.click();
    await el.updateComplete;
    expect(el.checked).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it("role=radio and aria-checked", async () => {
    const el = await fixture<GkRadio>(html`<gk-radio value="a">A</gk-radio>`);
    expect(control(el)?.getAttribute("role")).toBe("radio");
    expect(control(el)?.getAttribute("aria-checked")).toBe("false");
    el.click();
    await el.updateComplete;
    expect(control(el)?.getAttribute("aria-checked")).toBe("true");
  });
});

describe("gk-radio-group", () => {
  it("selects one value and emits on the group", async () => {
    const el = await fixture<GkRadioGroup>(html`
      <gk-radio-group>
        <gk-radio value="a">A</gk-radio>
        <gk-radio value="b">B</gk-radio>
      </gk-radio-group>
    `);
    expect(el.getAttribute("role")).toBe("radiogroup");
    const spy = vi.fn();
    el.addEventListener("change", spy);
    (el.querySelector('gk-radio[value="b"]') as GkRadio).click();
    await el.updateComplete;
    expect(el.value).toBe("b");
    const a = el.querySelector('gk-radio[value="a"]') as GkRadio;
    const b = el.querySelector('gk-radio[value="b"]') as GkRadio;
    expect(a.checked).toBe(false);
    expect(b.checked).toBe(true);
    const ev = spy.mock.calls[0][0] as CustomEvent<{ value: string }>;
    expect(ev.detail).toEqual({ value: "b" });
    expect(ev.bubbles).toBe(true);
    expect(ev.composed).toBe(true);
  });

  it("arrow keys move selection skipping disabled", async () => {
    const el = await fixture<GkRadioGroup>(html`
      <gk-radio-group>
        <gk-radio value="a">A</gk-radio>
        <gk-radio value="b" disabled>B</gk-radio>
        <gk-radio value="c">C</gk-radio>
      </gk-radio-group>
    `);
    el.value = "a";
    await el.updateComplete;
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe("c");
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe("a");
  });

  it("marks children while the group is disabled without fading the group host", async () => {
    const el = await fixture<GkRadioGroup>(html`
      <gk-radio-group disabled value="a">
        <gk-radio value="a">A</gk-radio>
        <gk-radio value="b">B</gk-radio>
      </gk-radio-group>
    `);
    const a = el.querySelector('gk-radio[value="a"]') as GkRadio;
    const b = el.querySelector('gk-radio[value="b"]') as GkRadio;
    expect(a.checked).toBe(true);
    expect(a.hasAttribute("data-gk-group-disabled")).toBe(true);
    expect(b.hasAttribute("data-gk-group-disabled")).toBe(true);
    expect(radioGroupStyles.cssText).not.toMatch(/opacity/);
    el.disabled = false;
    await el.updateComplete;
    expect(a.hasAttribute("data-gk-group-disabled")).toBe(false);
    expect(b.hasAttribute("data-gk-group-disabled")).toBe(false);
  });

  it("disabled group blocks child select", async () => {
    const el = await fixture<GkRadioGroup>(html`
      <gk-radio-group disabled>
        <gk-radio value="a">A</gk-radio>
      </gk-radio-group>
    `);
    const spy = vi.fn();
    el.addEventListener("change", spy);
    (el.querySelector("gk-radio") as GkRadio).click();
    await el.updateComplete;
    expect(el.value).toBe("");
    expect(spy).not.toHaveBeenCalled();
  });
});
