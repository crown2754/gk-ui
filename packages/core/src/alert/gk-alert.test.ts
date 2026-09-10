import { describe, it, expect, vi } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-alert.js";
import type { GkAlert } from "./gk-alert.js";

describe("gk-alert", () => {
  it("defaults type default, bordered false, showIcon true, closable false", async () => {
    const el = await fixture<GkAlert>(html`<gk-alert>Hi</gk-alert>`);
    expect(el.type).toBe("default");
    expect(el.bordered).toBe(false);
    expect(el.showIcon).toBe(true);
    expect(el.closable).toBe(false);
  });

  it("reflects type, title, bordered, closable, show-icon", async () => {
    const el = await fixture<GkAlert>(html`
      <gk-alert type="success" title="Done" bordered closable show-icon="false">
        Body
      </gk-alert>
    `);
    expect(el.type).toBe("success");
    expect(el.title).toBe("Done");
    expect(el.bordered).toBe(true);
    expect(el.closable).toBe(true);
    el.showIcon = false;
    await el.updateComplete;
    expect(el.showIcon).toBe(false);
  });

  it("dispatches gk-close without hiding", async () => {
    const el = await fixture<GkAlert>(
      html`<gk-alert title="T" closable>Body</gk-alert>`,
    );
    const spy = vi.fn();
    el.addEventListener("gk-close", spy);
    const btn = el.shadowRoot?.querySelector(
      "button[part='close']",
    ) as HTMLButtonElement;
    btn.click();
    expect(spy).toHaveBeenCalledTimes(1);
    const ev = spy.mock.calls[0][0] as CustomEvent;
    expect(ev.bubbles).toBe(true);
    expect(ev.composed).toBe(true);
    expect(el.hidden).toBe(false);
    expect(el.isConnected).toBe(true);
  });

  it("hides icon column when show-icon is false", async () => {
    const el = await fixture<GkAlert>(
      html`<gk-alert type="info">Body</gk-alert>`,
    );
    el.showIcon = false;
    await el.updateComplete;
    const icon = el.shadowRoot?.querySelector("[part='icon']") as HTMLElement;
    expect(
      icon?.hidden ||
        icon == null ||
        getComputedStyle(icon).display === "none",
    ).toBeTruthy();
  });

  it("does not render built-in svg when icon slot has content", async () => {
    const el = await fixture<GkAlert>(html`
      <gk-alert type="info">
        <span slot="icon" id="custom-icon">★</span>
        Body
      </gk-alert>
    `);
    await el.updateComplete;
    await new Promise((r) => queueMicrotask(r));
    await el.updateComplete;
    expect(
      el.shadowRoot?.querySelector("[part='icon'] svg.gk-alert__builtin"),
    ).toBeNull();
  });
});
