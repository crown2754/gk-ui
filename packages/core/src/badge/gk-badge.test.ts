import { describe, it, expect, afterEach } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-badge.js";
import type { GkBadge } from "./gk-badge.js";
import { badgeStyles } from "./gk-badge.styles.js";

function badgeOf(el: GkBadge) {
  return el.shadowRoot?.querySelector("[part~='badge']") as HTMLElement | null;
}

describe("gk-badge", () => {
  afterEach(() => {
    document.documentElement.lang = "";
  });

  it("hides chrome when value is empty and dot is off", async () => {
    const el = await fixture<GkBadge>(html`<gk-badge><span>U</span></gk-badge>`);
    expect(el.type).toBe("default");
    expect(el.max).toBe(99);
    expect(el.dot).toBe(false);
    expect(el.showZero).toBe(false);
    expect(el.processing).toBe(false);
    expect(el.getAttribute("role")).toBeNull();
    expect(badgeOf(el)).toBeNull();
    expect(el.hasAttribute("standalone")).toBe(false);
  });

  it("renders an overlay count with a localized name", async () => {
    const el = await fixture<GkBadge>(html`<gk-badge value="3"><span>U</span></gk-badge>`);
    const badge = badgeOf(el)!;
    expect(badge).not.toBeNull();
    expect(badge.textContent?.trim()).toBe("3");
    expect(badge.getAttribute("part")).toContain("sup");
    expect(badge.getAttribute("aria-label")).toBe("3 則未讀");
    expect(el.shadowRoot?.querySelector("[part='value']")?.textContent).toBe("3");
    expect(el.shadowRoot?.querySelector("[role='status']")).toBeNull();
  });

  it("uses an English unread label when the document is English", async () => {
    document.documentElement.lang = "en";
    const el = await fixture<GkBadge>(html`<gk-badge value="3"><span>U</span></gk-badge>`);
    expect(badgeOf(el)?.getAttribute("aria-label")).toBe("3 unread");
  });

  it("clamps numbers above max and leaves strings alone", async () => {
    const numeric = await fixture<GkBadge>(html`<gk-badge value="120" max="99"></gk-badge>`);
    expect(numeric.displayText()).toBe("99+");
    expect(badgeOf(numeric)?.textContent).toContain("99+");
    expect(numeric.hasAttribute("standalone")).toBe(true);
    const text = await fixture<GkBadge>(html`<gk-badge value="NEW" max="2"></gk-badge>`);
    expect(text.value).toBe("NEW");
    expect(text.displayText()).toBe("NEW");
    expect(badgeOf(text)?.getAttribute("aria-label")).toBeNull();
  });

  it("hides zero unless show-zero is set", async () => {
    const hidden = await fixture<GkBadge>(html`<gk-badge value="0"><span>H</span></gk-badge>`);
    expect(badgeOf(hidden)).toBeNull();
    const shown = await fixture<GkBadge>(
      html`<gk-badge value="0" show-zero><span>Z</span></gk-badge>`,
    );
    expect(shown.showZero).toBe(true);
    expect(badgeOf(shown)?.textContent?.trim()).toBe("0");
    const explicit = await fixture<GkBadge>(
      html`<gk-badge value="0" show-zero="false"></gk-badge>`,
    );
    expect(explicit.showZero).toBe(false);
    expect(badgeOf(explicit)).toBeNull();
  });

  it("renders a dot and ignores value", async () => {
    const el = await fixture<GkBadge>(html`<gk-badge dot value="4" type="success"></gk-badge>`);
    const badge = badgeOf(el)!;
    expect(el.dot).toBe(true);
    expect(badge.textContent?.trim()).toBe("");
    expect(badge.getAttribute("part")).toContain("dot");
    expect(badge.getAttribute("aria-label")).toBe("狀態");
    expect(el.shadowRoot?.querySelector("[part='value']")).toBeNull();
  });

  it("hides the badge from the accessibility tree when the host is named", async () => {
    const el = await fixture<GkBadge>(
      html`<gk-badge dot aria-label="有新動態"><button>通知</button></gk-badge>`,
    );
    expect(badgeOf(el)?.getAttribute("aria-hidden")).toBe("true");
    expect(badgeOf(el)?.hasAttribute("aria-label")).toBe(false);
  });

  it("applies offset as CSS variables and reflects processing", async () => {
    const el = await fixture<GkBadge>(
      html`<gk-badge value="12" type="primary" processing offset="4, -2"></gk-badge>`,
    );
    expect(el.type).toBe("primary");
    expect(el.processing).toBe(true);
    expect(el.offset).toEqual([4, -2]);
    expect(el.style.getPropertyValue("--gk-badge-offset-x")).toBe("4px");
    expect(el.style.getPropertyValue("--gk-badge-offset-y")).toBe("-2px");
    expect(badgeOf(el)?.hasAttribute("data-wide")).toBe(true);
  });

  it("floors fractional counts", async () => {
    const el = await fixture<GkBadge>(html`<gk-badge .value=${12.9}></gk-badge>`);
    expect(el.displayText()).toBe("12");
  });

  it("locks pill padding, danger default, and the neutral pulse", () => {
    const css = badgeStyles.cssText;
    expect(css).toMatch(/min-width:\s*20px/);
    expect(css).toMatch(/height:\s*18px/);
    expect(css).toMatch(/padding:\s*0 6px/);
    expect(css).toMatch(/padding:\s*0 7px/);
    expect(css).toMatch(/--gk-color-danger/);
    expect(css).toMatch(/--gk-color-brand-on/);
    expect(css).toMatch(/gk-badge-pulse 1\.4s/);
    expect(css).toMatch(/70%/);
    expect(css).toMatch(/width:\s*8px/);
  });
});
