import { describe, it, expect } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-avatar.js";
import type { GkAvatar } from "./gk-avatar.js";

describe("gk-avatar", () => {
  it("defaults size to md and round to false", async () => {
    const el = await fixture<GkAvatar>(html`<gk-avatar>AB</gk-avatar>`);
    expect(el.size).toBe("md");
    expect(el.round).toBe(false);
  });

  it("reflects size, round, src, and alt", async () => {
    const el = await fixture<GkAvatar>(
      html`<gk-avatar size="lg" round src="/a.png" alt="Ada">A</gk-avatar>`,
    );
    expect(el.size).toBe("lg");
    expect(el.round).toBe(true);
    expect(el.src).toBe("/a.png");
    expect(el.alt).toBe("Ada");
    expect(el.hasAttribute("round")).toBe(true);
  });

  it("accepts numeric size string", async () => {
    const el = await fixture<GkAvatar>(html`<gk-avatar size="48">A</gk-avatar>`);
    expect(el.size).toBe("48");
  });

  it("hides image and keeps fallback content after image error", async () => {
    const el = await fixture<GkAvatar>(
      html`<gk-avatar src="/missing.png" alt="x">FB</gk-avatar>`,
    );
    await el.updateComplete;
    const img = el.shadowRoot?.querySelector("img[part='image']") as HTMLImageElement;
    expect(img).toBeTruthy();
    img.dispatchEvent(new Event("error"));
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("img[part='image']")).toBeNull();
    expect(el.textContent?.trim()).toBe("FB");
  });
});
