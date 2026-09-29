import { describe, it, expect, afterEach } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-skeleton.js";
import type { GkSkeleton } from "./gk-skeleton.js";
import { skeletonStyles } from "./gk-skeleton.styles.js";

function lines(el: GkSkeleton) {
  return el.shadowRoot?.querySelectorAll("[part~='line']") ?? [];
}

describe("gk-skeleton", () => {
  afterEach(() => {
    document.documentElement.lang = "";
  });

  it("shows three animated text rows and a polite loading name by default", async () => {
    const el = await fixture<GkSkeleton>(html`<gk-skeleton></gk-skeleton>`);
    expect(el.loading).toBe(true);
    expect(el.animated).toBe(true);
    expect(el.rows).toBe(3);
    expect(el.getAttribute("aria-busy")).toBe("true");
    expect(lines(el).length).toBe(3);
    expect(lines(el)[0].getAttribute("aria-hidden")).toBe("true");
    expect(lines(el)[0].classList.contains("is-animated")).toBe(true);
    expect(el.shadowRoot?.querySelector(".sr")?.textContent).toBe("載入中");
    expect(el.shadowRoot?.querySelector("[part='content']")?.hasAttribute("hidden")).toBe(true);
  });

  it("uses Loading when the document language is English", async () => {
    document.documentElement.lang = "en";
    const el = await fixture<GkSkeleton>(html`<gk-skeleton></gk-skeleton>`);
    expect(el.shadowRoot?.querySelector(".sr")?.textContent).toBe("Loading");
  });

  it("repeats text rows and shortens only the last line of each group", async () => {
    const el = await fixture<GkSkeleton>(html`<gk-skeleton text rows="4" repeat="2"></gk-skeleton>`);
    expect(lines(el).length).toBe(8);
    expect(el.shadowRoot?.querySelectorAll("[part='text']").length).toBe(2);
  });

  it("renders avatar, button, and image bones", async () => {
    const avatar = await fixture<GkSkeleton>(html`<gk-skeleton avatar text rows="2"></gk-skeleton>`);
    expect(avatar.shadowRoot?.querySelector("[part~='avatar']")).not.toBeNull();
    expect(lines(avatar).length).toBe(2);
    const button = await fixture<GkSkeleton>(
      html`<gk-skeleton button animated="false"></gk-skeleton>`,
    );
    const bone = button.shadowRoot?.querySelector("[part~='button']") as HTMLElement;
    expect(button.animated).toBe(false);
    expect(bone.classList.contains("is-animated")).toBe(false);
    const image = await fixture<GkSkeleton>(html`<gk-skeleton image height="100"></gk-skeleton>`);
    const rect = image.shadowRoot?.querySelector("[part~='image']") as HTMLElement;
    expect(rect.style.height).toBe("100px");
  });

  it("swaps placeholders for the default slot when loading is false", async () => {
    const el = await fixture<GkSkeleton>(html`<gk-skeleton loading="false"><p>Ready</p></gk-skeleton>`);
    expect(el.loading).toBe(false);
    expect(el.hasAttribute("aria-busy")).toBe(false);
    expect(lines(el).length).toBe(0);
    expect(el.shadowRoot?.querySelector(".sr")).toBeNull();
    const content = el.shadowRoot?.querySelector("[part='content']") as HTMLElement;
    expect(content.hidden).toBe(false);
    expect(el.querySelector("p")?.textContent).toBe("Ready");
  });

  it("uses the template slot instead of built-in bones while loading", async () => {
    const el = await fixture<GkSkeleton>(html`
      <gk-skeleton>
        <div slot="template" id="custom">Custom bones</div>
        <p id="real">Real</p>
      </gk-skeleton>
    `);
    await el.updateComplete;
    expect(lines(el).length).toBe(0);
    expect(el.querySelector("#custom")).not.toBeNull();
    expect(el.shadowRoot?.querySelector("slot[name='template']")).not.toBeNull();
    const content = el.shadowRoot?.querySelector("[part='content']") as HTMLElement;
    expect(content.hidden).toBe(true);
  });

  it("keeps the shimmer neutral and honors reduced motion", () => {
    const css = skeletonStyles.cssText;
    expect(css).toMatch(/rgba\(46,\s*51,\s*56,\s*0\.07\)/);
    expect(css).toContain("rgba(255, 255, 255, 0.55)");
    expect(css).toMatch(/gk-skeleton-shimmer 1\.5s linear infinite/);
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(css).toMatch(/\[part~="line"\]:last-child\s*\{[^}]*width:\s*62%/);
    expect(css).toMatch(/\[part~="avatar"\]\s*\{[^}]*width:\s*40px/);
    expect(css).toMatch(/\[part~="button"\]\s*\{[^}]*height:\s*34px/);
    expect(css).toMatch(/\[part~="image"\]\s*\{[^}]*height:\s*140px/);
    const shimmer = css.slice(css.indexOf("is-animated::after"));
    expect(shimmer).not.toMatch(/--gk-color-brand/);
  });
});
