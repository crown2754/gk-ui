import { describe, it, expect, vi, afterEach } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-option.js";
import "./gk-select.js";
import type { GkSelect } from "./gk-select.js";
import { selectListboxCssText, selectStyles } from "./gk-select.styles.js";

function cleanupPortals() {
  document.querySelectorAll(".gk-select-listbox").forEach((n) => n.remove());
}

function trigger(el: GkSelect) {
  return el.shadowRoot?.querySelector("[part='base']") as HTMLElement;
}

describe("gk-select", () => {
  afterEach(() => cleanupPortals());

  it("defaults empty value, size md, closed", async () => {
    const el = await fixture<GkSelect>(html`<gk-select></gk-select>`);
    expect(el.value).toBe("");
    expect(el.size).toBe("md");
    expect(el.open).toBe(false);
    expect(el.clearable).toBe(false);
    expect(el.disabled).toBe(false);
  });

  it("opens listbox on trigger click", async () => {
    const el = await fixture<GkSelect>(html`
      <gk-select>
        <gk-option value="a">Apple</gk-option>
      </gk-select>
    `);
    trigger(el).click();
    await el.updateComplete;
    expect(el.open).toBe(true);
    const list = document.querySelector(".gk-select-listbox");
    expect(list).toBeTruthy();
    expect(list?.getAttribute("role")).toBe("listbox");
  });

  it("selecting an option sets value, emits change, and closes", async () => {
    const el = await fixture<GkSelect>(html`
      <gk-select>
        <gk-option value="apple">Apple</gk-option>
        <gk-option value="pear">Pear</gk-option>
      </gk-select>
    `);
    el.open = true;
    await el.updateComplete;
    const spy = vi.fn();
    el.addEventListener("change", spy);
    const opt = document.querySelector(
      '.gk-select-listbox [role="option"][data-value="pear"]',
    ) as HTMLElement;
    opt.click();
    await el.updateComplete;
    expect(el.value).toBe("pear");
    expect(el.open).toBe(false);
    const ev = spy.mock.calls[0][0] as CustomEvent<{ value: string }>;
    expect(ev).toBeInstanceOf(CustomEvent);
    expect(ev.bubbles).toBe(true);
    expect(ev.composed).toBe(true);
    expect(ev.detail).toEqual({ value: "pear" });
  });

  it("clear empties value and emits change", async () => {
    const el = await fixture<GkSelect>(html`
      <gk-select clearable value="apple">
        <gk-option value="apple">Apple</gk-option>
      </gk-select>
    `);
    const spy = vi.fn();
    el.addEventListener("change", spy);
    const btn = el.shadowRoot?.querySelector(
      "button[part='clear']",
    ) as HTMLButtonElement;
    btn.click();
    await el.updateComplete;
    expect(el.value).toBe("");
    expect((spy.mock.calls[0][0] as CustomEvent).detail).toEqual({ value: "" });
  });

  it("disabled does not open", async () => {
    const el = await fixture<GkSelect>(html`
      <gk-select disabled>
        <gk-option value="a">A</gk-option>
      </gk-select>
    `);
    trigger(el).click();
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(document.querySelector(".gk-select-listbox")).toBeNull();
  });

  it("reflects size and status", async () => {
    const el = await fixture<GkSelect>(
      html`<gk-select size="lg" status="error"></gk-select>`,
    );
    expect(el.size).toBe("lg");
    expect(el.status).toBe("error");
    expect(el.getAttribute("size")).toBe("lg");
    expect(el.getAttribute("status")).toBe("error");
  });

  it("Escape closes an open listbox", async () => {
    const el = await fixture<GkSelect>(html`
      <gk-select>
        <gk-option value="a">A</gk-option>
      </gk-select>
    `);
    el.open = true;
    await el.updateComplete;
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it("uses a lighter single focus ring instead of a stacked yellow border", () => {
    const css = selectStyles.cssText;
    const focus = css.match(
      /\[part="base"\]:focus-visible,\s*:host\(\[open\]\) \[part="base"\]\s*\{([^}]+)\}/,
    );
    expect(focus).toBeTruthy();
    const body = focus![1];
    expect(body).toContain(
      "color-mix(in srgb, var(--gk-color-focus-ring, rgb(242, 206, 94)) 70%, transparent)",
    );
    expect(body).toContain("outline-offset: 2px");
    expect(body).not.toMatch(/border-color/);
    for (const [status, token] of [
      ["success", "--gk-color-success"],
      ["warning", "--gk-color-warning"],
      ["error", "--gk-color-danger"],
    ] as const) {
      expect(css).toMatch(
        new RegExp(
          `status="${status}"[\\s\\S]*color-mix\\(in srgb, var\\(${token}`,
        ),
      );
    }
    expect(selectListboxCssText).toContain(
      "color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 22%, transparent)",
    );
  });

  it("combobox trigger exposes aria-expanded", async () => {
    const el = await fixture<GkSelect>(html`<gk-select></gk-select>`);
    const base = trigger(el);
    expect(base.getAttribute("role")).toBe("combobox");
    expect(base.getAttribute("aria-expanded")).toBe("false");
    el.open = true;
    await el.updateComplete;
    expect(trigger(el).getAttribute("aria-expanded")).toBe("true");
  });
});
