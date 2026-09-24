import { afterEach, describe, expect, it, vi } from "vitest";
import { fixture, fixtureCleanup, html } from "@open-wc/testing";
import "../button/gk-button.js";
import "./gk-dropdown-item.js";
import "./gk-dropdown.js";
import type { GkDropdown } from "./gk-dropdown.js";
import type { GkDropdownItem } from "./gk-dropdown-item.js";

function menu(el: GkDropdown) {
  return el.shadowRoot?.querySelector("[part='menu']") as HTMLElement | null;
}

function trigger(el: GkDropdown) {
  const slotted = el.querySelector("[slot='trigger']") as HTMLElement | null;
  return (
    slotted ??
    (el.shadowRoot?.querySelector("[part='trigger'] button") as HTMLElement)
  );
}

describe("gk-dropdown", () => {
  afterEach(() => {
    fixtureCleanup();
  });

  it("defaults closed, size md, placement bottom-start, click trigger", async () => {
    const el = await fixture<GkDropdown>(html`
      <gk-dropdown label="More">
        <gk-dropdown-item key="edit">Edit</gk-dropdown-item>
      </gk-dropdown>
    `);
    expect(el.open).toBe(false);
    expect(el.size).toBe("md");
    expect(el.placement).toBe("bottom-start");
    expect(el.trigger).toBe("click");
    expect(menu(el)?.hidden).not.toBe(false);
    const btn = trigger(el);
    expect(btn.getAttribute("aria-haspopup")).toBe("menu");
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    expect(btn.textContent).toContain("More");
  });

  it("toggles the menu on trigger click and marks items as menuitems", async () => {
    const el = await fixture<GkDropdown>(html`
      <gk-dropdown label="More">
        <gk-dropdown-item key="edit">Edit</gk-dropdown-item>
        <gk-dropdown-item key="copy" shortcut="⌘C">Copy</gk-dropdown-item>
      </gk-dropdown>
    `);
    const spy = vi.fn();
    el.addEventListener("update:open", spy);
    el.addEventListener("open", spy);
    trigger(el).click();
    await el.updateComplete;
    expect(el.open).toBe(true);
    const list = menu(el)!;
    expect(list.getAttribute("role")).toBe("menu");
    expect(list.hidden).toBe(false);
    const items = el.querySelectorAll("gk-dropdown-item");
    expect(items[0].shadowRoot?.querySelector("[role='menuitem']")).toBeTruthy();
    expect(items[1].shadowRoot?.textContent).toContain("⌘C");
    expect(trigger(el).getAttribute("aria-expanded")).toBe("true");
    expect(spy).toHaveBeenCalled();
  });

  it("selects an item, emits select, and closes", async () => {
    const el = await fixture<GkDropdown>(html`
      <gk-dropdown label="More" open>
        <gk-dropdown-item key="edit">Edit</gk-dropdown-item>
        <gk-dropdown-item key="copy">Copy link</gk-dropdown-item>
      </gk-dropdown>
    `);
    await el.updateComplete;
    const spy = vi.fn();
    el.addEventListener("select", spy);
    const item = el.querySelector("gk-dropdown-item[key='copy']") as GkDropdownItem;
    item.click();
    await el.updateComplete;
    expect(el.open).toBe(false);
    const ev = spy.mock.calls[0][0] as CustomEvent<{
      key: string;
      item: GkDropdownItem;
    }>;
    expect(ev.bubbles).toBe(true);
    expect(ev.composed).toBe(true);
    expect(ev.detail.key).toBe("copy");
    expect(ev.detail.item).toBe(item);
  });

  it("does not select a disabled item and renders a divider separator", async () => {
    const el = await fixture<GkDropdown>(html`
      <gk-dropdown label="More" open>
        <gk-dropdown-item key="archive" disabled>Archive</gk-dropdown-item>
        <gk-dropdown-item type="divider"></gk-dropdown-item>
        <gk-dropdown-item key="delete" danger>Delete</gk-dropdown-item>
      </gk-dropdown>
    `);
    await el.updateComplete;
    const spy = vi.fn();
    el.addEventListener("select", spy);
    const disabled = el.querySelector("[disabled]") as GkDropdownItem;
    disabled.click();
    await el.updateComplete;
    expect(spy).not.toHaveBeenCalled();
    expect(el.open).toBe(true);
    const divider = el.querySelector("[type='divider']")!;
    expect(divider.shadowRoot?.querySelector("[role='separator']")).toBeTruthy();
    const danger = el.querySelector("[danger]")!;
    expect(danger.hasAttribute("danger")).toBe(true);
  });

  it("moves the active item with arrows and selects with Enter", async () => {
    const el = await fixture<GkDropdown>(html`
      <gk-dropdown label="More" open>
        <gk-dropdown-item key="edit">Edit</gk-dropdown-item>
        <gk-dropdown-item key="copy">Copy</gk-dropdown-item>
        <gk-dropdown-item key="skip" disabled>Skip</gk-dropdown-item>
        <gk-dropdown-item key="download">Download</gk-dropdown-item>
      </gk-dropdown>
    `);
    await el.updateComplete;
    const spy = vi.fn();
    el.addEventListener("select", spy);
    trigger(el).dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    await el.updateComplete;
    trigger(el).dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    await el.updateComplete;
    expect((spy.mock.calls[0][0] as CustomEvent).detail.key).toBe("copy");
    expect(el.open).toBe(false);
  });

  it("closes on Escape and outside click", async () => {
    const el = await fixture<GkDropdown>(html`
      <gk-dropdown label="More" open>
        <gk-dropdown-item key="edit">Edit</gk-dropdown-item>
      </gk-dropdown>
    `);
    await el.updateComplete;
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await el.updateComplete;
    expect(el.open).toBe(false);

    el.open = true;
    await el.updateComplete;
    document.body.dispatchEvent(
      new MouseEvent("click", { bubbles: true }),
    );
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it("does not open when disabled", async () => {
    const el = await fixture<GkDropdown>(html`
      <gk-dropdown disabled label="More">
        <gk-dropdown-item key="edit">Edit</gk-dropdown-item>
      </gk-dropdown>
    `);
    trigger(el).click();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it("paints the built-in text trigger with the brand fill when variant is primary", async () => {
    const el = await fixture<GkDropdown>(html`
      <gk-dropdown label="More actions" variant="primary">
        <gk-dropdown-item key="edit">Edit</gk-dropdown-item>
      </gk-dropdown>
    `);
    expect(el.variant).toBe("primary");
    expect(el.getAttribute("variant")).toBe("primary");
    expect(trigger(el).textContent).toContain("More actions");
    expect(el.shadowRoot?.querySelector(".gk-dropdown__chevron")).toBeTruthy();
  });

  it("accepts a slotted quaternary button trigger", async () => {
    const el = await fixture<GkDropdown>(html`
      <gk-dropdown>
        <gk-button slot="trigger" quaternary aria-label="More actions">⋯</gk-button>
        <gk-dropdown-item key="edit">Edit</gk-dropdown-item>
      </gk-dropdown>
    `);
    const button = el.querySelector("gk-button")!;
    expect(button.hasAttribute("quaternary")).toBe(true);
    button.click();
    await el.updateComplete;
    expect(el.open).toBe(true);
    expect(button.getAttribute("aria-haspopup")).toBe("menu");
    expect(button.getAttribute("aria-expanded")).toBe("true");
  });
});
