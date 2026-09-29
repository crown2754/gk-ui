import { afterEach, describe, expect, it, vi } from "vitest";
import { fixture, fixtureCleanup, html } from "@open-wc/testing";
import "./gk-popconfirm.js";
import type { GkPopconfirm } from "./gk-popconfirm.js";
import { popconfirmStyles } from "./gk-popconfirm.styles.js";
import "../button/gk-button.js";

function panel(el: GkPopconfirm) {
  return el.shadowRoot?.querySelector("[part='panel']") as HTMLElement;
}

describe("gk-popconfirm", () => {
  afterEach(() => {
    document.documentElement.lang = "";
    document.body.style.overflow = "";
    fixtureCleanup();
  });

  it("stays closed without a mask and opens from the trigger", async () => {
    const el = await fixture<GkPopconfirm>(html`
      <gk-popconfirm title="儲存此草稿？" content="稍後可繼續編輯。">
        <button type="button">儲存草稿</button>
      </gk-popconfirm>
    `);
    expect(el.open).toBe(false);
    expect(el.show).toBe(false);
    expect(el.placement).toBe("top");
    expect(el.type).toBe("default");
    expect(el.mask).toBe(false);
    expect(el.showArrow).toBe(true);
    expect(panel(el).hidden).toBe(true);
    expect(el.shadowRoot?.querySelector("[part='mask']")).toBeNull();
    const trigger = el.querySelector("button") as HTMLButtonElement;
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    const onOpen = vi.fn();
    el.addEventListener("update:open", onOpen);
    el.addEventListener("open", onOpen);
    trigger.click();
    await el.updateComplete;
    expect(el.open).toBe(true);
    expect(el.show).toBe(true);
    expect(panel(el).hidden).toBe(false);
    expect(panel(el).getAttribute("role")).toBe("dialog");
    expect(panel(el).getAttribute("aria-modal")).toBe("false");
    expect(panel(el).style.zIndex).toBe("4000");
    expect(panel(el).querySelector("[part='arrow']")).toBeTruthy();
    expect(panel(el).textContent).toContain("儲存此草稿？");
    expect(panel(el).querySelector("[part='ok']")?.textContent?.trim()).toBe("確定");
    expect(panel(el).querySelector("[part='cancel']")?.textContent?.trim()).toBe("取消");
    expect(el.shadowRoot?.activeElement?.getAttribute("part")).toBe("ok");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(onOpen).toHaveBeenCalled();
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("confirms, then closes, and cancels from the cancel button", async () => {
    document.documentElement.lang = "en";
    const el = await fixture<GkPopconfirm>(html`
      <gk-popconfirm open title="Save this draft?" content="You can edit it later." ok-text="Save">
        <button type="button">Save</button>
      </gk-popconfirm>
    `);
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    el.addEventListener("confirm", onConfirm);
    el.addEventListener("close", onClose);
    (panel(el).querySelector("[part='ok']") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(el.open).toBe(false);
    expect(onClose).toHaveBeenCalled();
    expect(panel(el).hidden).toBe(true);

    el.open = true;
    await el.updateComplete;
    const onCancel = vi.fn();
    el.addEventListener("cancel", onCancel);
    (panel(el).querySelector("[part='cancel']") as HTMLButtonElement).click();
    await el.updateComplete;
    expect((onCancel.mock.calls[0][0] as CustomEvent).detail).toEqual({ reason: "cancel" });
    expect(el.open).toBe(false);
    expect(panel(el).querySelector("[part='ok']")?.textContent?.trim()).toBe("Save");
    expect(panel(el).querySelector("[part='cancel']")?.textContent?.trim()).toBe("Cancel");
  });

  it("uses an alertdialog, a danger icon, and focuses cancel for errors", async () => {
    const el = await fixture<GkPopconfirm>(html`
      <gk-popconfirm open type="error" title="確定刪除？" content="此操作無法復原。" ok-text="刪除">
        <button type="button">刪除項目</button>
      </gk-popconfirm>
    `);
    expect(panel(el).getAttribute("role")).toBe("alertdialog");
    expect(panel(el).querySelector("[part='icon'] svg")).toBeTruthy();
    expect(el.shadowRoot?.activeElement?.getAttribute("part")).toBe("cancel");
    expect(panel(el).querySelector("[part='ok']")?.textContent?.trim()).toBe("刪除");
  });

  it("closes from Escape and outside clicks, and stacks nested panels by 10", async () => {
    const el = await fixture<GkPopconfirm>(html`
      <gk-popconfirm open title="Leave?">
        <button type="button">Back</button>
      </gk-popconfirm>
    `);
    const nested = await fixture<GkPopconfirm>(html`
      <gk-popconfirm open title="Nested?">
        <button type="button">More</button>
      </gk-popconfirm>
    `);
    await el.updateComplete;
    await nested.updateComplete;
    expect(panel(el).style.zIndex).toBe("4000");
    expect(panel(nested).style.zIndex).toBe("4010");

    const onCancel = vi.fn();
    nested.addEventListener("cancel", onCancel);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nested.updateComplete;
    expect(nested.open).toBe(false);
    expect((onCancel.mock.calls[0][0] as CustomEvent).detail).toEqual({ reason: "escape" });

    el.open = true;
    await el.updateComplete;
    onCancel.mockClear();
    el.addEventListener("cancel", onCancel);
    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect((onCancel.mock.calls[0][0] as CustomEvent).detail).toEqual({ reason: "outside" });
  });

  it("supports show as an alias, hides cancel, and dims when mask is set", async () => {
    const el = await fixture<GkPopconfirm>(html`
      <gk-popconfirm show show-cancel="false" mask title="Publish?" message="This goes live.">
        <gk-button>Publish</gk-button>
      </gk-popconfirm>
    `);
    expect(el.open).toBe(true);
    expect(panel(el).hidden).toBe(false);
    expect(panel(el).querySelector("[part='cancel']")).toBeNull();
    expect(panel(el).textContent).toContain("This goes live.");
    expect(el.shadowRoot?.querySelector("[part='mask']")).toBeTruthy();
    expect(panel(el).getAttribute("aria-modal")).toBe("true");
    expect(document.body.style.overflow).toBe("hidden");
    const mask = el.shadowRoot?.querySelector("[part='mask']") as HTMLElement;
    expect(Number(mask.style.zIndex)).toBe(3990);
    el.show = false;
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("does not open when disabled and can hide the arrow", async () => {
    const el = await fixture<GkPopconfirm>(html`
      <gk-popconfirm disabled show-arrow="false" title="Nope">
        <button type="button">Trigger</button>
      </gk-popconfirm>
    `);
    (el.querySelector("button") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.open).toBe(false);
    el.open = true;
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(panel(el).querySelector("[part='arrow']")).toBeNull();
  });

  it("locks the light panel, z-index 4000, and the 34px actions", () => {
    const css = popconfirmStyles.cssText;
    expect(css).toMatch(/z-index:\s*4000/);
    expect(css).toMatch(/--gk-color-surface/);
    expect(css).toMatch(/--gk-radius-md/);
    expect(css).toMatch(/--gk-shadow-md/);
    expect(css).toMatch(/min-width:\s*200px/);
    expect(css).toMatch(/280px/);
    expect(css).toMatch(/height:\s*34px/);
    expect(css).toMatch(/--gk-color-brand/);
    expect(css).toMatch(/--gk-color-danger/);
    expect(css).toMatch(/--gk-color-focus-ring[^;]*70%/);
    expect(css).toMatch(/translateY\(8px\)/);
    expect(css).toMatch(/#000 40%/);
  });
});
