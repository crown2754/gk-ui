import { afterEach, describe, expect, it, vi } from "vitest";
import { fixture, fixtureCleanup, html } from "@open-wc/testing";
import "./gk-drawer.js";
import type { GkDrawer } from "./gk-drawer.js";

function panel(el: GkDrawer) {
  return el.shadowRoot?.querySelector("[part='panel']") as HTMLElement;
}

describe("gk-drawer", () => {
  afterEach(() => {
    fixtureCleanup();
    document.body.style.overflow = "";
  });

  it("defaults to a closed right drawer", async () => {
    const el = await fixture<GkDrawer>(html`<gk-drawer title="Filters"></gk-drawer>`);
    expect(el.open).toBe(false);
    expect(el.placement).toBe("right");
    expect(el.closable).toBe(true);
    expect(el.maskClosable).toBe(true);
    expect(el.showMask).toBe(true);
    expect(el.width).toBe("400");
    expect(el.height).toBe("40vh");
    expect(el.shadowRoot?.querySelector("[role='dialog']")).toBeNull();
  });

  it("opens a dialog with mask, title, and base z-index", async () => {
    const el = await fixture<GkDrawer>(html`
      <gk-drawer open title="Filters" placement="left" width="360">
        <p>Status</p>
      </gk-drawer>
    `);
    await el.updateComplete;
    const dialog = panel(el);
    expect(dialog.getAttribute("role")).toBe("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.getAttribute("data-placement")).toBe("left");
    expect(el.shadowRoot?.querySelector("[part='title']")?.textContent).toContain(
      "Filters",
    );
    expect(el.shadowRoot?.querySelector("[part='body'] slot")).toBeTruthy();
    expect(el.textContent).toContain("Status");
    const mask = el.shadowRoot?.querySelector("[part='mask']") as HTMLElement;
    expect(mask.style.zIndex).toBe("3990");
    expect(dialog.style.zIndex).toBe("4000");
    expect(dialog.style.getPropertyValue("--gk-drawer-width").trim()).toBe("360px");
  });

  it("closes on Escape, mask, and the close button", async () => {
    const el = await fixture<GkDrawer>(html`
      <gk-drawer open title="Details"></gk-drawer>
    `);
    const spy = vi.fn();
    el.addEventListener("close", spy);
    el.addEventListener("update:open", spy);
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(
      (spy.mock.calls.find((c) => (c[0] as Event).type === "update:open")?.[0] as CustomEvent)
        .detail,
    ).toBe(false);

    el.open = true;
    await el.updateComplete;
    (el.shadowRoot?.querySelector("[part='mask']") as HTMLElement).click();
    await el.updateComplete;
    expect(el.open).toBe(false);

    el.open = true;
    await el.updateComplete;
    (el.shadowRoot?.querySelector("[part='close']") as HTMLElement).click();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it("omits the mask and aria-modal when show-mask is false", async () => {
    const el = await fixture<GkDrawer>(html`
      <gk-drawer open show-mask="false" title="Peek"></gk-drawer>
    `);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("[part='mask']")).toBeNull();
    expect(panel(el).getAttribute("aria-modal")).toBe("false");
    expect(panel(el).getAttribute("role")).toBe("dialog");
  });

  it("uses height for top and bottom placements and renders a footer slot", async () => {
    const el = await fixture<GkDrawer>(html`
      <gk-drawer open placement="bottom" height="50vh" title="Sheet">
        <span slot="footer">Apply</span>
      </gk-drawer>
    `);
    await el.updateComplete;
    expect(panel(el).getAttribute("data-placement")).toBe("bottom");
    expect(panel(el).style.getPropertyValue("--gk-drawer-height").trim()).toBe(
      "50vh",
    );
    const footer = el.shadowRoot?.querySelector("[part='footer']") as HTMLElement;
    expect(footer).toBeTruthy();
    expect(footer.hidden).toBe(false);
    expect(el.querySelector("[slot='footer']")?.textContent).toContain("Apply");
  });

  it("locks body scroll while open and traps focus inside", async () => {
    document.body.style.overflow = "";
    const el = await fixture<GkDrawer>(html`
      <gk-drawer open title="Focus">
        <button id="one">One</button>
        <button id="two">Two</button>
      </gk-drawer>
    `);
    await el.updateComplete;
    expect(document.body.style.overflow).toBe("hidden");
    const close = el.shadowRoot?.querySelector("[part='close']") as HTMLElement;
    expect(el.shadowRoot?.activeElement).toBe(close);
    el.open = false;
    await el.updateComplete;
    expect(document.body.style.overflow).toBe("");
  });
});
