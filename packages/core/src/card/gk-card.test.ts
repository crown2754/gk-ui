import { describe, it, expect, vi } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-card.js";
import type { GkCard } from "./gk-card.js";

describe("gk-card", () => {
  it("defaults size to md, bordered true, others false", async () => {
    const el = await fixture<GkCard>(html`<gk-card>Body</gk-card>`);
    expect(el.size).toBe("md");
    expect(el.bordered).toBe(true);
    expect(el.hoverable).toBe(false);
    expect(el.segmented).toBe(false);
    expect(el.closable).toBe(false);
  });

  it("reflects title, cover, size, hoverable, segmented, closable", async () => {
    const el = await fixture<GkCard>(html`
      <gk-card
        title="Hello"
        cover="/c.png"
        size="lg"
        hoverable
        segmented
        closable
      >Body</gk-card>
    `);
    expect(el.title).toBe("Hello");
    expect(el.cover).toBe("/c.png");
    expect(el.size).toBe("lg");
    expect(el.hoverable).toBe(true);
    expect(el.segmented).toBe(true);
    expect(el.closable).toBe(true);
    expect(el.hasAttribute("bordered")).toBe(true);
  });

  it("renders built-in cover img when cover attr set and no cover slot", async () => {
    const el = await fixture<GkCard>(
      html`<gk-card cover="/c.png" title="T">Body</gk-card>`,
    );
    await el.updateComplete;
    const img = el.shadowRoot?.querySelector("[part='cover'] img");
    expect(img).toBeTruthy();
    expect(img?.getAttribute("src")).toBe("/c.png");
  });

  it("does not render built-in cover img when cover slot has content", async () => {
    const el = await fixture<GkCard>(html`
      <gk-card cover="/c.png">
        <div slot="cover">Custom</div>
        Body
      </gk-card>
    `);
    await el.updateComplete;
    await new Promise((r) => queueMicrotask(r));
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("[part='cover'] img")).toBeNull();
  });

  it("dispatches gk-close on close click without hiding the card", async () => {
    const el = await fixture<GkCard>(
      html`<gk-card title="T" closable>Body</gk-card>`,
    );
    await el.updateComplete;
    const spy = vi.fn();
    el.addEventListener("gk-close", spy);
    const btn = el.shadowRoot?.querySelector(
      "button[part='close']",
    ) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    btn.click();
    expect(spy).toHaveBeenCalledTimes(1);
    const ev = spy.mock.calls[0][0] as CustomEvent;
    expect(ev.bubbles).toBe(true);
    expect(ev.composed).toBe(true);
    expect(el.isConnected).toBe(true);
    expect(el.hidden).toBe(false);
  });
});
