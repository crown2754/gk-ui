import { afterEach, describe, expect, it } from "vitest";
import { fixture, fixtureCleanup, html } from "@open-wc/testing";
import "./gk-progress.js";
import type { GkProgress } from "./gk-progress.js";
import { progressStyles } from "./gk-progress.styles.js";

describe("gk-progress", () => {
  afterEach(() => {
    fixtureCleanup();
  });

  it("clamps a brand line and exposes progressbar values", async () => {
    const el = await fixture<GkProgress>(html`
      <gk-progress percentage="130" label="上傳進度"></gk-progress>
    `);
    expect(el.type).toBe("line");
    expect(el.status).toBe("default");
    expect(el.size).toBe("md");
    expect(el.percentage).toBe(100);
    expect(el.getAttribute("role")).toBe("progressbar");
    expect(el.getAttribute("aria-valuemin")).toBe("0");
    expect(el.getAttribute("aria-valuemax")).toBe("100");
    expect(el.getAttribute("aria-valuenow")).toBe("100");
    expect(el.getAttribute("aria-label")).toBe("上傳進度");
    const fill = el.shadowRoot?.querySelector("[part='fill']") as HTMLElement;
    expect(fill.style.width).toBe("100%");
    const track = el.shadowRoot?.querySelector("[part='track']") as HTMLElement;
    expect(track.style.height).toBe("8px");
    expect(el.shadowRoot?.querySelector("[part='indicator']")?.textContent?.trim()).toBe("100%");
    expect(el.shadowRoot?.querySelector("[part='circle']")).toBeNull();
  });

  it("uses the 6/8/10 line scale and hides the indicator", async () => {
    const sm = await fixture<GkProgress>(html`<gk-progress size="sm" percentage="55"></gk-progress>`);
    const lg = await fixture<GkProgress>(html`<gk-progress size="lg" percentage="55"></gk-progress>`);
    const hidden = await fixture<GkProgress>(html`
      <gk-progress percentage="40" show-indicator="false"></gk-progress>
    `);
    expect((sm.shadowRoot?.querySelector("[part='track']") as HTMLElement).style.height).toBe("6px");
    expect((lg.shadowRoot?.querySelector("[part='track']") as HTMLElement).style.height).toBe("10px");
    expect(hidden.shadowRoot?.querySelector("[part='indicator']")).toBeNull();
  });

  it("places the label inside the line and colors semantic statuses", async () => {
    const el = await fixture<GkProgress>(html`
      <gk-progress percentage="80" indicator-placement="inside" status="success"></gk-progress>
    `);
    const indicator = el.shadowRoot?.querySelector("[part='indicator']") as HTMLElement;
    expect(indicator.dataset.placement).toBe("inside");
    expect(indicator.dataset.onFill).toBe("true");
    expect(el.getAttribute("status")).toBe("success");
    expect((el.shadowRoot?.querySelector("[part='track']") as HTMLElement).style.height).toBe("18px");
  });

  it("draws a circle with a custom indicator slot", async () => {
    const el = await fixture<GkProgress>(html`
      <gk-progress type="circle" size="lg" percentage="25" status="error">
        <span slot="indicator">失敗</span>
      </gk-progress>
    `);
    expect(el.getAttribute("aria-valuenow")).toBe("25");
    const svg = el.shadowRoot?.querySelector("[part='circle']") as SVGElement;
    expect(svg?.getAttribute("width")).toBe("120");
    const path = el.shadowRoot?.querySelector("[part='path']") as SVGCircleElement;
    expect(path?.getAttribute("stroke-linecap")).toBe("round");
    expect(Number(path?.getAttribute("stroke-dasharray"))).toBeGreaterThan(0);
    const slot = el.shadowRoot?.querySelector("slot[name='indicator']") as HTMLSlotElement;
    expect(slot.assignedElements()[0]?.textContent?.trim()).toBe("失敗");
    expect(el.shadowRoot?.querySelector("[part='trail']")).toBeTruthy();
  });

  it("turns on the processing shimmer without using info blue as the default fill", () => {
    const css = progressStyles.cssText;
    expect(css).toMatch(/\[part="fill"\]\s*\{[^}]*--gk-color-brand/);
    expect(css).toMatch(/\[part="path"\]\s*\{[^}]*--gk-color-brand/);
    expect(css).toMatch(/status="success"/);
    expect(css).toMatch(/--gk-color-success/);
    expect(css).toMatch(/--gk-color-danger/);
    expect(css).toMatch(/--gk-color-warning/);
    expect(css).toMatch(/gk-progress-shimmer/);
    expect(css).toMatch(/prefers-reduced-motion/);
    expect(css).not.toContain("--gk-color-info");
  });

  it("reflects processing and treats a bad percentage as zero", async () => {
    const el = await fixture<GkProgress>(html`<gk-progress processing percentage="nope"></gk-progress>`);
    expect(el.processing).toBe(true);
    expect(el.percentage).toBe(0);
    expect(el.getAttribute("aria-valuenow")).toBe("0");
    const pathCap = el.shadowRoot?.querySelector("[part='fill']");
    expect(pathCap).toBeTruthy();
  });
});
