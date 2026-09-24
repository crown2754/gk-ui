import { describe, it, expect, afterEach } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-spin.js";
import type { GkSpin } from "./gk-spin.js";
import { spinStyles } from "./gk-spin.styles.js";

function status(el: GkSpin) {
  return el.shadowRoot?.querySelector('[role="status"]') as HTMLElement | null;
}

describe("gk-spin", () => {
  afterEach(() => {
    document.documentElement.lang = "";
  });

  it("shows a medium brand spinner by default", async () => {
    const el = await fixture<GkSpin>(html`<gk-spin></gk-spin>`);
    expect(el.show).toBe(true);
    expect(el.spinning).toBe(true);
    expect(el.size).toBe("md");
    expect(el.delay).toBe(0);
    expect(el.shadowRoot?.querySelector("[part='container']")?.getAttribute("aria-busy")).toBe(
      "true",
    );
    expect(status(el)).not.toBeNull();
    expect(status(el)?.getAttribute("aria-live")).toBe("polite");
    expect(status(el)?.textContent).toContain("Loading");
    expect(el.shadowRoot?.querySelector("[part='mask']")).toBeNull();
  });

  it("accepts spinning and tip aliases", async () => {
    const el = await fixture<GkSpin>(html`
      <gk-spin spinning="false" tip="請稍候"></gk-spin>
    `);
    expect(el.show).toBe(false);
    expect(el.description).toBe("請稍候");
    expect(el.tip).toBe("請稍候");
    expect(status(el)).toBeNull();
    expect(el.shadowRoot?.querySelector("[part='spinner']")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
    expect(el.shadowRoot?.querySelector("[part='container']")?.hasAttribute("aria-busy")).toBe(
      false,
    );
  });

  it("uses the zh loading name when the document language is Chinese", async () => {
    document.documentElement.lang = "zh-Hant";
    const el = await fixture<GkSpin>(html`<gk-spin></gk-spin>`);
    expect(status(el)?.textContent).toContain("載入中");
  });

  it("shows a visible tip and wraps content with a mask", async () => {
    const el = await fixture<GkSpin>(html`
      <gk-spin description="載入中…">
        <p>課程詳情</p>
      </gk-spin>
    `);
    await el.updateComplete;
    expect(el.hasAttribute("data-has-content")).toBe(true);
    expect(el.hasAttribute("data-spinning")).toBe(true);
    expect(el.shadowRoot?.querySelector("[part='mask']")).not.toBeNull();
    const tip = el.shadowRoot?.querySelector("[part='tip']") as HTMLElement;
    expect(tip.textContent).toBe("載入中…");
    expect(tip.classList.contains("sr")).toBe(false);
    const slot = el.shadowRoot?.querySelector("[part='content'] slot") as HTMLSlotElement;
    const projected = slot.assignedNodes({ flatten: true }).map((node) => node.textContent ?? "").join("");
    expect(projected).toContain("課程詳情");
  });

  it("hides the mask when show is false so content can be used", async () => {
    const el = await fixture<GkSpin>(html`
      <gk-spin show="false"><button>Go</button></gk-spin>
    `);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("[part='mask']")).toBeNull();
    expect(el.hasAttribute("data-spinning")).toBe(false);
    expect(status(el)).toBeNull();
  });

  it("waits for delay and skips the spinner if show ends first", async () => {
    const el = await fixture<GkSpin>(html`<gk-spin delay="60"></gk-spin>`);
    expect(status(el)).toBeNull();
    el.show = false;
    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 90));
    await el.updateComplete;
    expect(status(el)).toBeNull();

    el.delay = 40;
    el.show = true;
    await el.updateComplete;
    expect(status(el)).toBeNull();
    await new Promise((resolve) => setTimeout(resolve, 70));
    await el.updateComplete;
    expect(status(el)).not.toBeNull();
  });

  it("applies stroke-width and size", async () => {
    const el = await fixture<GkSpin>(html`<gk-spin size="lg" stroke-width="4"></gk-spin>`);
    expect(el.size).toBe("lg");
    expect(el.strokeWidth).toBe(4);
    const ring = el.shadowRoot?.querySelector(".gk-spin__ring") as HTMLElement;
    expect(ring.style.borderWidth).toBe("4px");
  });

  it("locks spinner diameters, track mix, and the overlay", () => {
    const css = spinStyles.cssText;
    expect(css).toMatch(/:host\(\[size="sm"\]\) \.gk-spin__ring\s*\{[^}]*width:\s*18px/);
    expect(css).toMatch(/width:\s*28px/);
    expect(css).toMatch(/:host\(\[size="lg"\]\) \.gk-spin__ring\s*\{[^}]*width:\s*40px/);
    expect(css).toMatch(/border-width:\s*2px/);
    expect(css).toMatch(/border-width:\s*2\.5px/);
    expect(css).toMatch(/border-width:\s*3px/);
    expect(css).toMatch(/--gk-color-brand[\s\S]{0,80}25%/);
    expect(css).toMatch(/gk-spin 0\.75s linear/);
    expect(css).toMatch(/#fff 55%/);
    expect(css).toMatch(/data-spinning\]\) \[part="content"\]\s*\{[^}]*pointer-events:\s*none/);
  });
});
