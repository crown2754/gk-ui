import { describe, it, expect, vi } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-button.js";
import type { GkButton } from "./gk-button.js";

describe("gk-button", () => {
  it("defaults variant to primary", async () => {
    const el = await fixture<GkButton>(html`<gk-button>Save</gk-button>`);
    expect(el.variant).toBe("primary");
    expect(el.getAttribute("variant")).toBe("primary");
  });

  it("does not notify host click listeners when disabled", async () => {
    const el = await fixture<GkButton>(html`<gk-button disabled>Save</gk-button>`);
    const spy = vi.fn();
    el.addEventListener("click", spy);
    el.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it("does not notify host click listeners when loading", async () => {
    const el = await fixture<GkButton>(html`<gk-button loading>Save</gk-button>`);
    const spy = vi.fn();
    el.addEventListener("click", spy);
    el.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it("notifies host click listeners when enabled", async () => {
    const el = await fixture<GkButton>(html`<gk-button>Save</gk-button>`);
    const spy = vi.fn();
    el.addEventListener("click", spy);
    el.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("reflects size attribute", async () => {
    const el = await fixture<GkButton>(html`<gk-button size="lg">Go</gk-button>`);
    expect(el.size).toBe("lg");
    expect(el.getAttribute("size")).toBe("lg");
  });

  it("renders an anchor when href is set", async () => {
    const el = await fixture<GkButton>(html`<gk-button href="/docs">Docs</gk-button>`);
    await el.updateComplete;
    const anchor = el.shadowRoot?.querySelector("a[part='base']");
    expect(anchor).toBeTruthy();
    expect(anchor?.getAttribute("href")).toBe("/docs");
  });
});
