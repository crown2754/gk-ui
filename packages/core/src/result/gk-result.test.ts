import { describe, it, expect } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-result.js";
import "../button/gk-button.js";
import type { GkResult } from "./gk-result.js";
import { resultStyles } from "./gk-result.styles.js";

describe("gk-result", () => {
  it("defaults to info, an empty description, and no alert role", async () => {
    const el = await fixture<GkResult>(html`<gk-result></gk-result>`);
    expect(el.status).toBe("info");
    expect(el.title).toBe("");
    expect(el.description).toBe("");
    expect(el.getAttribute("role")).toBeNull();
    expect(el.shadowRoot?.querySelector("[role='alert']")).toBeNull();
    const icon = el.shadowRoot?.querySelector("[part='icon']") as HTMLElement;
    expect(icon.getAttribute("aria-hidden")).toBe("false");
    expect(icon.querySelector("svg")).not.toBeNull();
    expect((el.shadowRoot?.querySelector("[part='title']") as HTMLElement).hidden).toBe(true);
    expect((el.shadowRoot?.querySelector("[part='description']") as HTMLElement).hidden).toBe(true);
    expect((el.shadowRoot?.querySelector("[part='extra']") as HTMLElement).hidden).toBe(true);
  });

  it("renders a Fraunces title, description, and hides the icon from assistive tech", async () => {
    const el = await fixture<GkResult>(html`
      <gk-result status="success" title="提交成功" description="已送出審核。"></gk-result>
    `);
    expect(el.status).toBe("success");
    const title = el.shadowRoot?.querySelector("[part='title']") as HTMLElement;
    expect(title.tagName).toBe("H2");
    expect(title.hidden).toBe(false);
    expect(title.textContent).toBe("提交成功");
    const icon = el.shadowRoot?.querySelector("[part='icon']") as HTMLElement;
    expect(icon.getAttribute("aria-hidden")).toBe("true");
    expect(icon.querySelector("svg")).not.toBeNull();
    expect(el.shadowRoot?.querySelector("[part='description']")?.textContent).toBe("已送出審核。");
  });

  it("shows the 404 mark and accepts extra and action slots", async () => {
    const el = await fixture<GkResult>(html`
      <gk-result status="404" title="找不到頁面" description="這個網址可能已移動。">
        <gk-button slot="action">回到首頁</gk-button>
        <gk-button slot="extra" variant="ghost">聯絡支援</gk-button>
        <p>也可搜尋。</p>
      </gk-result>
    `);
    await el.updateComplete;
    const icon = el.shadowRoot?.querySelector("[part='icon']") as HTMLElement;
    expect(icon.textContent).toContain("404");
    expect(icon.querySelector("svg")).toBeNull();
    expect((el.shadowRoot?.querySelector("[part='extra']") as HTMLElement).hidden).toBe(false);
    expect(el.textContent).toContain("也可搜尋。");
  });

  it("replaces the built-in glyph when the icon slot is filled", async () => {
    const el = await fixture<GkResult>(html`
      <gk-result status="warning" title="請注意">
        <svg slot="icon" id="custom"></svg>
      </gk-result>
    `);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("[part='icon'] svg")).toBeNull();
    expect(el.querySelector("#custom")).not.toBeNull();
  });

  it("covers warning and error glyphs", async () => {
    const warning = await fixture<GkResult>(html`<gk-result status="warning" title="注意"></gk-result>`);
    const error = await fixture<GkResult>(html`<gk-result status="error" title="錯誤"></gk-result>`);
    expect(warning.shadowRoot?.querySelector("[part='icon'] svg")).not.toBeNull();
    expect(error.shadowRoot?.querySelector("[part='icon'] svg")).not.toBeNull();
  });

  it("locks Empty-large spacing, the 72px icon, and semantic washes", () => {
    const css = resultStyles.cssText;
    expect(css).toMatch(/\[part="root"\]\s*\{[^}]*padding:\s*2\.75rem 1\.25rem/);
    expect(css).toMatch(/\[part="root"\]\s*\{[^}]*max-width:\s*24rem/);
    expect(css).toMatch(/\[part="icon"\]\s*\{[^}]*width:\s*72px/);
    expect(css).toMatch(/\[part="title"\]\s*\{[^}]*Fraunces/);
    expect(css).toMatch(/\[part="title"\]\s*\{[^}]*font-size:\s*1\.4rem/);
    expect(css).toMatch(/--gk-color-success[\s\S]{0,40}16%/);
    expect(css).toMatch(/status="404"\]\) \[part="icon"\]\s*\{[^}]*18%/);
    expect(css).not.toMatch(/role:\s*alert/);
  });
});
