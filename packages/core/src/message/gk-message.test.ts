import { describe, it, expect, vi } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-message.js";
import type { GkMessage } from "./gk-message.js";

describe("gk-message", () => {
  it("defaults type default, closable false, showIcon true", async () => {
    const el = await fixture<GkMessage>(html`<gk-message></gk-message>`);
    expect(el.type).toBe("default");
    expect(el.closable).toBe(false);
    expect(el.showIcon).toBe(true);
  });

  it("reflects type, content, closable; showIcon via property", async () => {
    const el = await fixture<GkMessage>(
      html`<gk-message type="success" content="Saved" closable></gk-message>`,
    );
    expect(el.type).toBe("success");
    expect(el.content).toBe("Saved");
    expect(el.closable).toBe(true);
    el.showIcon = false;
    await el.updateComplete;
    expect(el.showIcon).toBe(false);
  });

  it("renders content text in part=content", async () => {
    const el = await fixture<GkMessage>(
      html`<gk-message content="Hello"></gk-message>`,
    );
    const node = el.shadowRoot?.querySelector("[part='content']");
    expect(node?.textContent?.trim()).toBe("Hello");
  });

  it("dispatches gk-close when close clicked", async () => {
    const el = await fixture<GkMessage>(
      html`<gk-message content="X" closable></gk-message>`,
    );
    const spy = vi.fn();
    el.addEventListener("gk-close", spy);
    (
      el.shadowRoot?.querySelector("button[part='close']") as HTMLButtonElement
    ).click();
    expect(spy).toHaveBeenCalledTimes(1);
    const ev = spy.mock.calls[0][0] as CustomEvent;
    expect(ev.bubbles).toBe(true);
    expect(ev.composed).toBe(true);
  });

  it("shows spinner markup for loading type", async () => {
    const el = await fixture<GkMessage>(
      html`<gk-message type="loading" content="Wait"></gk-message>`,
    );
    expect(el.shadowRoot?.querySelector(".gk-message__spinner")).not.toBeNull();
  });
});
