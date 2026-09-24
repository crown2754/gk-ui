import { afterEach, describe, expect, it, vi } from "vitest";
import { fixture, fixtureCleanup, html } from "@open-wc/testing";
import "./gk-modal.js";
import type { GkModal } from "./gk-modal.js";

function panel(el: GkModal) {
  return el.shadowRoot?.querySelector("[part='panel']") as HTMLElement;
}

function mask(el: GkModal) {
  return el.shadowRoot?.querySelector("[part='mask']") as HTMLElement;
}

describe("gk-modal", () => {
  afterEach(() => {
    fixtureCleanup();
    document.body.style.overflow = "";
  });

  it("stays closed with md width defaults", async () => {
    const el = await fixture<GkModal>(html`<gk-modal title="Hi"></gk-modal>`);
    expect(el.open).toBe(false);
    expect(el.closable).toBe(true);
    expect(el.maskClosable).toBe(true);
    expect(el.width).toBe("md");
    expect(el.shadowRoot?.querySelector("[role='dialog']")).toBeNull();
  });

  it("renders dialog semantics, parts, and title when open", async () => {
    const el = await fixture<GkModal>(html`
      <gk-modal open title="Save changes?">
        <p>Unsaved edits.</p>
      </gk-modal>
    `);
    await el.updateComplete;
    const dialog = panel(el);
    expect(dialog.getAttribute("role")).toBe("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    const title = el.shadowRoot?.querySelector("[part='title']");
    expect(title?.textContent).toContain("Save changes?");
    expect(dialog.getAttribute("aria-labelledby")).toBe(title?.id);
    expect(mask(el)).toBeTruthy();
    expect(el.shadowRoot?.querySelector("[part='header']")).toBeTruthy();
    expect(el.shadowRoot?.querySelector("[part='body'] slot")).toBeTruthy();
    expect(el.textContent).toContain("Unsaved edits.");
    expect(el.shadowRoot?.querySelector("[part='close']")).toBeTruthy();
    expect(el.shadowRoot?.querySelector("[part='footer']")).toBeTruthy();
    expect(dialog.style.zIndex).toBe("4000");
    expect(mask(el).style.zIndex).toBe("3990");
  });

  it("closes from the close button, mask, and Escape", async () => {
    const el = await fixture<GkModal>(html`
      <gk-modal open title="Hi"></gk-modal>
    `);
    const events = vi.fn();
    el.addEventListener("close", events);
    el.addEventListener("update:open", events);
    (el.shadowRoot?.querySelector("[part='close']") as HTMLElement).click();
    await el.updateComplete;
    expect(el.open).toBe(false);
    const update = events.mock.calls.find(
      (c) => (c[0] as Event).type === "update:open",
    )?.[0] as CustomEvent<boolean>;
    expect(update.detail).toBe(false);
    expect(update.bubbles).toBe(true);

    el.open = true;
    await el.updateComplete;
    mask(el).click();
    await el.updateComplete;
    expect(el.open).toBe(false);

    el.open = true;
    await el.updateComplete;
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it("ignores mask clicks and Escape when those dismissals are disabled", async () => {
    const el = await fixture<GkModal>(html`
      <gk-modal open closable="false" mask-closable="false" title="Locked">
        <p>Stay</p>
      </gk-modal>
    `);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("[part='close']")).toBeNull();
    mask(el).click();
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await el.updateComplete;
    expect(el.open).toBe(true);
  });

  it("maps width presets to pixels", async () => {
    const el = await fixture<GkModal>(html`<gk-modal open width="sm"></gk-modal>`);
    expect(panel(el).style.getPropertyValue("--gk-modal-width").trim()).toBe(
      "400px",
    );
    el.width = "lg";
    await el.updateComplete;
    expect(panel(el).style.getPropertyValue("--gk-modal-width").trim()).toBe(
      "720px",
    );
    el.width = "640";
    await el.updateComplete;
    expect(panel(el).style.getPropertyValue("--gk-modal-width").trim()).toBe(
      "640px",
    );
  });

  it("emits confirm from the dialog preset and ignores it while loading", async () => {
    const el = await fixture<GkModal>(html`
      <gk-modal open preset="dialog" title="Publish"></gk-modal>
    `);
    const spy = vi.fn();
    el.addEventListener("confirm", spy);
    (el.shadowRoot?.querySelector("[part='confirm']") as HTMLElement).click();
    await el.updateComplete;
    expect(spy).toHaveBeenCalledTimes(1);
    expect(el.open).toBe(true);

    el.loading = true;
    await el.updateComplete;
    (el.shadowRoot?.querySelector("[part='confirm']") as HTMLElement).click();
    await el.updateComplete;
    expect(spy).toHaveBeenCalledTimes(1);
    expect(
      el.shadowRoot?.querySelector("[part='confirm'] [part='spinner']"),
    ).toBeTruthy();
  });

  it("renders a danger confirm button for the dialog preset", async () => {
    const el = await fixture<GkModal>(html`
      <gk-modal
        open
        preset="dialog"
        title="Delete project?"
        confirm-variant="danger"
        confirm-text="Delete"
        cancel-text="Cancel"
      ></gk-modal>
    `);
    const confirm = el.shadowRoot?.querySelector("[part='confirm']");
    expect(confirm?.getAttribute("data-variant")).toBe("danger");
    expect(confirm?.textContent).toContain("Delete");
    expect(el.shadowRoot?.querySelector("[part='cancel']")?.textContent).toContain(
      "Cancel",
    );
  });

  it("locks body scroll and restores it when the last modal closes", async () => {
    document.body.style.overflow = "";
    const a = await fixture<GkModal>(html`<gk-modal open title="A"></gk-modal>`);
    expect(document.body.style.overflow).toBe("hidden");
    const b = await fixture<GkModal>(html`<gk-modal open title="B"></gk-modal>`);
    b.open = false;
    await b.updateComplete;
    expect(document.body.style.overflow).toBe("hidden");
    a.open = false;
    await a.updateComplete;
    expect(document.body.style.overflow).toBe("");
  });

  it("traps focus and focuses the dialog primary action", async () => {
    const el = await fixture<GkModal>(html`
      <gk-modal open preset="dialog" title="Confirm">
        <button id="inside">Inside</button>
      </gk-modal>
    `);
    await el.updateComplete;
    const confirm = el.shadowRoot?.querySelector(
      "[part='confirm']",
    ) as HTMLElement;
    expect(el.shadowRoot?.activeElement).toBe(confirm);
    confirm.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab", bubbles: true }),
    );
    const focusables = [
      el.shadowRoot?.querySelector("[part='close']"),
      el.querySelector("#inside"),
      el.shadowRoot?.querySelector("[part='cancel']"),
      confirm,
    ].filter(Boolean) as HTMLElement[];
    const active =
      (el.shadowRoot?.activeElement as HTMLElement | null) ??
      (document.activeElement as HTMLElement | null);
    expect(focusables.includes(active!) || active === el).toBe(true);
  });

  it("stacks a second modal above the first and keeps Esc on the topmost", async () => {
    const opener = document.createElement("button");
    opener.textContent = "open";
    document.body.appendChild(opener);
    opener.focus();

    const first = await fixture<GkModal>(html`
      <gk-modal open title="First"></gk-modal>
    `);
    const second = await fixture<GkModal>(html`
      <gk-modal open title="Second"></gk-modal>
    `);
    await first.updateComplete;
    await second.updateComplete;

    expect(mask(first).style.zIndex).toBe("3990");
    expect(panel(first).style.zIndex).toBe("4000");
    expect(mask(second).style.zIndex).toBe("4000");
    expect(panel(second).style.zIndex).toBe("4010");

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await first.updateComplete;
    await second.updateComplete;
    expect(second.open).toBe(false);
    expect(first.open).toBe(true);

    const firstPanel = panel(first);
    expect(first.shadowRoot?.activeElement).toBe(firstPanel);

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await first.updateComplete;
    expect(first.open).toBe(false);
    expect(document.activeElement).toBe(opener);
    opener.remove();
  });
});
