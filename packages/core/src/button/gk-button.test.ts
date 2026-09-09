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
});
