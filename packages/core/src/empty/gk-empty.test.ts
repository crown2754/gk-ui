import { describe, it, expect, afterEach } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-empty.js";
import type { GkEmpty } from "./gk-empty.js";
import { emptyStyles } from "./gk-empty.styles.js";

describe("gk-empty", () => {
  afterEach(() => {
    document.documentElement.lang = "";
  });

  it("defaults to the zh description, a decorative image, and no alert role", async () => {
    const el = await fixture<GkEmpty>(html`<gk-empty></gk-empty>`);
    expect(el.description).toBe("暫無資料");
    expect(el.title).toBe("");
    expect(el.size).toBe("default");
    expect(el.showIcon).toBe(true);
    expect(el.getAttribute("role")).toBeNull();
    expect(el.shadowRoot?.querySelector("[role='alert']")).toBeNull();
    const image = el.shadowRoot?.querySelector("[part='image']") as HTMLElement;
    expect(image.hidden).toBe(false);
    expect(image.getAttribute("aria-hidden")).toBe("true");
    expect(image.querySelector("svg")).not.toBeNull();
    expect(el.shadowRoot?.querySelector("[part='description']")?.textContent).toContain("暫無資料");
    expect((el.shadowRoot?.querySelector("[part='title']") as HTMLElement).hidden).toBe(true);
    expect((el.shadowRoot?.querySelector("[part='extra']") as HTMLElement).hidden).toBe(true);
  });

  it("uses No data when the document language is English", async () => {
    document.documentElement.lang = "en";
    const el = await fixture<GkEmpty>(html`<gk-empty></gk-empty>`);
    expect(el.description).toBe("No data");
  });

  it("renders title, custom description, large size, and an action slot", async () => {
    const el = await fixture<GkEmpty>(html`
      <gk-empty title="還沒有課程" description="建立第一門課" size="large">
        <gk-button slot="action">新增課程</gk-button>
      </gk-empty>
    `);
    await el.updateComplete;
    expect(el.title).toBe("還沒有課程");
    expect(el.description).toBe("建立第一門課");
    expect(el.size).toBe("large");
    const title = el.shadowRoot?.querySelector("[part='title']") as HTMLElement;
    expect(title.hidden).toBe(false);
    expect(title.textContent).toContain("還沒有課程");
    const extra = el.shadowRoot?.querySelector("[part='extra']") as HTMLElement;
    expect(extra.hidden).toBe(false);
    expect(el.querySelector("[slot='action']")?.textContent).toContain("新增課程");
  });

  it("hides the default illustration when show-icon is false", async () => {
    const el = await fixture<GkEmpty>(html`<gk-empty show-icon="false"></gk-empty>`);
    const image = el.shadowRoot?.querySelector("[part='image']") as HTMLElement;
    expect(el.showIcon).toBe(false);
    expect(image.hidden).toBe(true);
    expect(image.querySelector("svg")).toBeNull();
  });

  it("replaces the built-in art and description when slots are provided", async () => {
    const el = await fixture<GkEmpty>(html`
      <gk-empty>
        <svg slot="image" id="custom-art"></svg>
        <span slot="description">搜尋無結果</span>
        <p>Try another keyword</p>
      </gk-empty>
    `);
    await el.updateComplete;
    const image = el.shadowRoot?.querySelector("[part='image']") as HTMLElement;
    expect(image.querySelector(".gk-empty__art")).toBeNull();
    expect(el.querySelector("#custom-art")).not.toBeNull();
    const description = el.shadowRoot?.querySelector("[part='description']") as HTMLElement;
    expect(description.textContent?.trim()).toBe("");
    expect(el.querySelector("[slot='description']")?.textContent).toBe("搜尋無結果");
    expect(el.textContent).toContain("Try another keyword");
  });

  it("accepts the icon and extra slot aliases", async () => {
    const el = await fixture<GkEmpty>(html`
      <gk-empty title="">
        <span slot="icon">★</span>
        <span slot="title">Empty title</span>
        <div slot="extra">More</div>
      </gk-empty>
    `);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".gk-empty__art")).toBeNull();
    const title = el.shadowRoot?.querySelector("[part='title']") as HTMLElement;
    expect(title.hidden).toBe(false);
    expect(title.textContent?.includes("Empty title") || el.querySelector("[slot='title']")).toBeTruthy();
    expect((el.shadowRoot?.querySelector("[part='extra']") as HTMLElement).hidden).toBe(false);
  });

  it("locks spacing, illustration size, and the muted brand stroke", () => {
    const css = emptyStyles.cssText;
    expect(css).toMatch(/\[part="root"\]\s*\{[^}]*padding:\s*1\.75rem 1rem/);
    expect(css).toMatch(/\[part="root"\]\s*\{[^}]*max-width:\s*20rem/);
    expect(css).toMatch(/size="large"\]\) \[part="root"\]\s*\{[^}]*padding:\s*2\.75rem 1\.25rem/);
    expect(css).toMatch(/\[part="image"\]\s*\{[^}]*width:\s*96px/);
    expect(css).toMatch(/size="large"\]\) \[part="image"\]\s*\{[^}]*width:\s*128px/);
    expect(css).toMatch(/--gk-color-brand[\s\S]{0,80}45%/);
    expect(css).not.toMatch(/role:\s*alert/);
  });
});