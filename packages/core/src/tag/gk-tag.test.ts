import { describe, it, expect, vi, afterEach } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-tag.js";
import type { GkTag } from "./gk-tag.js";
import { tagStyles } from "./gk-tag.styles.js";

function base(el: GkTag) {
  return el.shadowRoot?.querySelector("[part='base']") as HTMLElement;
}

function closeButton(el: GkTag) {
  return el.shadowRoot?.querySelector("button[part='close']") as HTMLButtonElement | null;
}

describe("gk-tag", () => {
  afterEach(() => {
    document.documentElement.lang = "";
  });

  it("defaults to a non-interactive md chip", async () => {
    const el = await fixture<GkTag>(html`<gk-tag>Default</gk-tag>`);
    expect(el.type).toBe("default");
    expect(el.size).toBe("md");
    expect(el.bordered).toBe(false);
    expect(el.round).toBe(false);
    expect(el.closable).toBe(false);
    expect(el.checkable).toBe(false);
    expect(el.checked).toBe(false);
    expect(el.disabled).toBe(false);
    expect(base(el).getAttribute("role")).toBeNull();
    expect(base(el).hasAttribute("tabindex")).toBe(false);
    expect(closeButton(el)).toBeNull();
  });

  it("reflects type, size, bordered, round, and variant alias", async () => {
    const el = await fixture<GkTag>(html`
      <gk-tag variant="success" size="lg" bordered round>OK</gk-tag>
    `);
    expect(el.type).toBe("success");
    expect(el.variant).toBe("success");
    expect(el.getAttribute("type")).toBe("success");
    expect(el.size).toBe("lg");
    expect(el.bordered).toBe(true);
    expect(el.round).toBe(true);
  });

  it("prefers type when both type and variant are set", async () => {
    const el = await fixture<GkTag>(html`
      <gk-tag type="info" variant="error">Both</gk-tag>
    `);
    expect(el.type).toBe("info");
  });

  it("emits close from the × button without toggling checked", async () => {
    const el = await fixture<GkTag>(html`
      <gk-tag type="primary" closable checkable checked>好知識</gk-tag>
    `);
    const onClose = vi.fn();
    const onCheck = vi.fn();
    el.addEventListener("close", onClose);
    el.addEventListener("update:checked", onCheck);
    closeButton(el)?.click();
    await el.updateComplete;
    expect(onClose).toHaveBeenCalledTimes(1);
    const ev = onClose.mock.calls[0][0] as CustomEvent;
    expect(ev.bubbles).toBe(true);
    expect(ev.composed).toBe(true);
    expect(el.checked).toBe(true);
    expect(onCheck).not.toHaveBeenCalled();
  });

  it("toggles checkable chips and emits update:checked and check", async () => {
    const el = await fixture<GkTag>(html`<gk-tag checkable>設計</gk-tag>`);
    const onUpdate = vi.fn();
    const onCheck = vi.fn();
    el.addEventListener("update:checked", onUpdate);
    el.addEventListener("check", onCheck);
    expect(base(el).getAttribute("role")).toBe("checkbox");
    expect(base(el).getAttribute("aria-checked")).toBe("false");
    expect(base(el).getAttribute("tabindex")).toBe("0");
    el.click();
    await el.updateComplete;
    expect(el.checked).toBe(true);
    expect(base(el).getAttribute("aria-checked")).toBe("true");
    const ev = onUpdate.mock.calls[0][0] as CustomEvent<{ checked: boolean }>;
    expect(ev.detail).toEqual({ checked: true });
    expect(ev.bubbles).toBe(true);
    expect(ev.composed).toBe(true);
    expect((onCheck.mock.calls[0][0] as CustomEvent).detail).toEqual({ checked: true });
    el.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    await el.updateComplete;
    expect(el.checked).toBe(false);
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await el.updateComplete;
    expect(el.checked).toBe(true);
  });

  it("does not emit when a static tag is clicked", async () => {
    const el = await fixture<GkTag>(html`<gk-tag type="info">Info</gk-tag>`);
    const spy = vi.fn();
    el.addEventListener("check", spy);
    el.addEventListener("close", spy);
    el.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it("blocks close and check when disabled", async () => {
    const el = await fixture<GkTag>(html`
      <gk-tag disabled closable checkable>封存</gk-tag>
    `);
    const spy = vi.fn();
    el.addEventListener("close", spy);
    el.addEventListener("update:checked", spy);
    expect(el.getAttribute("aria-disabled")).toBe("true");
    expect(base(el).getAttribute("aria-disabled")).toBe("true");
    expect(base(el).hasAttribute("tabindex")).toBe(false);
    expect(closeButton(el)?.getAttribute("tabindex")).toBe("-1");
    el.click();
    closeButton(el)?.click();
    await el.updateComplete;
    expect(el.checked).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it("localizes the close button name", async () => {
    document.documentElement.lang = "en";
    const en = await fixture<GkTag>(html`<gk-tag closable>A</gk-tag>`);
    expect(closeButton(en)?.getAttribute("aria-label")).toBe("Close");
    expect(closeButton(en)?.getAttribute("type")).toBe("button");
    document.documentElement.lang = "zh-TW";
    en.requestUpdate();
    await en.updateComplete;
    expect(closeButton(en)?.getAttribute("aria-label")).toBe("關閉");
  });

  it("shows the icon part only when the icon slot has content", async () => {
    const el = await fixture<GkTag>(html`
      <gk-tag type="success"><svg slot="icon"></svg>已驗證</gk-tag>
    `);
    await el.updateComplete;
    const icon = el.shadowRoot?.querySelector("[part='icon']") as HTMLElement;
    expect(icon.hidden).toBe(false);
  });

  it("applies a custom color through --gk-tag-color", async () => {
    const el = await fixture<GkTag>(html`<gk-tag color="#336699">Custom</gk-tag>`);
    expect(el.style.getPropertyValue("--gk-tag-color")).toBe("#336699");
    el.color = "";
    await el.updateComplete;
    expect(el.style.getPropertyValue("--gk-tag-color")).toBe("");
  });

  it("locks chip heights and the checkable brand wash", () => {
    const css = tagStyles.cssText;
    expect(css).toMatch(/:host\(\[size="sm"\]\) \[part="base"\]\s*\{[^}]*height:\s*22px/);
    expect(css).toMatch(/:host\(\[size="md"\]\) \[part="base"\][\s\S]*?height:\s*24px/);
    expect(css).toMatch(/:host\(\[size="lg"\]\) \[part="base"\]\s*\{[^}]*height:\s*28px/);
    expect(css).toMatch(/--gk-color-success[^)]*\)\s*16%/);
    expect(css).toMatch(/checkable\]\[checked\]:not\(\[type="primary"\]\)[\s\S]*22%/);
    expect(css).toMatch(/checkable\]:not\(\[disabled\]\):not\(\[checked\]\):hover[\s\S]*18%/);
    expect(css).toMatch(/:host\(\[disabled\]\)\s*\{[^}]*opacity:\s*0\.5/);
    expect(css).toMatch(/focus-ring[\s\S]{0,80}70%/);
    expect(css).toMatch(/:host\(\[type="primary"\]\) \[part="base"\]\s*\{[^}]*--gk-color-brand/);
    expect(css).toMatch(/bordered\]\[type="primary"\][\s\S]*18%/);
  });
});
