import { afterEach, describe, expect, it, vi } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-tooltip.js";
import type { GkTooltip } from "./gk-tooltip.js";

function tip(el: GkTooltip) {
  return el.shadowRoot?.querySelector("[part='tip']") as HTMLElement | null;
}

describe("gk-tooltip", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("defaults to a hidden top tip with an arrow", async () => {
    const el = await fixture<GkTooltip>(html`
      <gk-tooltip content="Save">
        <button>Save</button>
      </gk-tooltip>
    `);
    expect(el.placement).toBe("top");
    expect(el.arrow).toBe(true);
    expect(el.disabled).toBe(false);
    expect(el.show).toBe(false);
    expect(tip(el)).toBeNull();
    expect(el.shadowRoot?.querySelector("[part='mask']")).toBeNull();
  });

  it("shows a tooltip role after the hover delay and links aria-describedby", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const el = await fixture<GkTooltip>(html`
      <gk-tooltip content="Save edits" delay="0">
        <button id="save">Save</button>
      </gk-tooltip>
    `);
    const spy = vi.fn();
    el.addEventListener("update:show", spy);
    el.dispatchEvent(new MouseEvent("mouseenter"));
    await vi.advanceTimersByTimeAsync(0);
    await el.updateComplete;
    const node = tip(el);
    expect(el.show).toBe(true);
    expect(node?.getAttribute("role")).toBe("tooltip");
    expect(node?.textContent).toContain("Save edits");
    expect(node?.querySelector("[part='arrow']")).toBeTruthy();
    const trigger = el.querySelector("button")!;
    expect(trigger.getAttribute("aria-describedby")).toBe(node?.id);
    const ev = spy.mock.calls[0][0] as CustomEvent<boolean>;
    expect(ev.detail).toBe(true);
    expect(ev.bubbles).toBe(true);
    expect(ev.composed).toBe(true);
  });

  it("shows on keyboard focus and hides on Escape without moving focus", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const el = await fixture<GkTooltip>(html`
      <gk-tooltip content="Hint" delay="0">
        <button>Hint</button>
      </gk-tooltip>
    `);
    const button = el.querySelector("button")!;
    button.focus();
    await vi.advanceTimersByTimeAsync(0);
    await el.updateComplete;
    expect(el.show).toBe(true);
    expect(document.activeElement).toBe(button);
    button.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await el.updateComplete;
    expect(el.show).toBe(false);
    expect(document.activeElement).toBe(button);
  });

  it("does not show when disabled", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const el = await fixture<GkTooltip>(html`
      <gk-tooltip disabled content="Nope" delay="0">
        <button>Nope</button>
      </gk-tooltip>
    `);
    el.dispatchEvent(new MouseEvent("mouseenter"));
    el.querySelector("button")!.focus();
    await vi.advanceTimersByTimeAsync(20);
    await el.updateComplete;
    expect(el.show).toBe(false);
    expect(tip(el)).toBeNull();
  });

  it("hides the arrow when arrow is false", async () => {
    const el = await fixture<GkTooltip>(html`
      <gk-tooltip content="Plain" arrow="false" show>
        <button>Plain</button>
      </gk-tooltip>
    `);
    await el.updateComplete;
    expect(tip(el)?.querySelector("[part='arrow']")).toBeNull();
  });

  it("respects focus-only trigger", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const el = await fixture<GkTooltip>(html`
      <gk-tooltip content="Focus" trigger="focus" delay="0">
        <button>Focus</button>
      </gk-tooltip>
    `);
    el.dispatchEvent(new MouseEvent("mouseenter"));
    await vi.advanceTimersByTimeAsync(20);
    await el.updateComplete;
    expect(el.show).toBe(false);
    el.querySelector("button")!.focus();
    await vi.advanceTimersByTimeAsync(0);
    await el.updateComplete;
    expect(el.show).toBe(true);
  });

  it("uses a show,hide delay tuple", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const el = await fixture<GkTooltip>(html`
      <gk-tooltip content="Wait" delay="200,100">
        <button>Wait</button>
      </gk-tooltip>
    `);
    el.dispatchEvent(new MouseEvent("mouseenter"));
    await vi.advanceTimersByTimeAsync(199);
    await el.updateComplete;
    expect(el.show).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    await el.updateComplete;
    expect(el.show).toBe(true);
    el.dispatchEvent(new MouseEvent("mouseleave"));
    await vi.advanceTimersByTimeAsync(99);
    await el.updateComplete;
    expect(el.show).toBe(true);
    await vi.advanceTimersByTimeAsync(1);
    await el.updateComplete;
    expect(el.show).toBe(false);
  });
});
