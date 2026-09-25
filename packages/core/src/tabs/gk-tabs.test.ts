import { describe, it, expect, vi } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-tabs.js";
import "./gk-tab-pane.js";
import type { GkTabs } from "./gk-tabs.js";
import { tabsStyles } from "./gk-tabs.styles.js";

function tabsOf(el: GkTabs) {
  return [...(el.shadowRoot?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [])];
}

function panelsOf(el: GkTabs) {
  return [...(el.shadowRoot?.querySelectorAll<HTMLElement>('[role="tabpanel"]') ?? [])];
}

async function settle(el: GkTabs) {
  await el.updateComplete;
  await el.updateComplete;
}

describe("gk-tabs", () => {
  it("selects the first enabled pane and renders line tabs", async () => {
    const el = await fixture<GkTabs>(html`
      <gk-tabs aria-label="課程內容">
        <gk-tab-pane name="overview" tab="總覽">Overview body</gk-tab-pane>
        <gk-tab-pane name="syllabus" tab="大綱">Syllabus body</gk-tab-pane>
        <gk-tab-pane name="files" tab="附件" disabled>Files body</gk-tab-pane>
      </gk-tabs>
    `);
    await settle(el);
    expect(el.type).toBe("line");
    expect(el.size).toBe("md");
    expect(el.animated).toBe(true);
    expect(el.placement).toBe("top");
    expect(el.value).toBe("overview");
    const tabs = tabsOf(el);
    expect(tabs.map((tab) => tab.textContent?.trim())).toEqual(["總覽", "大綱", "附件"]);
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    expect(tabs[0].tabIndex).toBe(0);
    expect(tabs[1].tabIndex).toBe(-1);
    expect(tabs[2].getAttribute("aria-disabled")).toBe("true");
    expect(tabs[0].getAttribute("aria-controls")).toBe(panelsOf(el)[0].id);
    expect(panelsOf(el)[0].hidden).toBe(false);
    expect(panelsOf(el)[1].hidden).toBe(true);
    expect(panelsOf(el)[0].getAttribute("aria-labelledby")).toBe(tabs[0].id);
    expect(el.shadowRoot?.querySelector("[part='indicator']")).not.toBeNull();
    expect(el.querySelector("gk-tab-pane")?.textContent).toContain("Overview body");
  });

  it("uses default-value when value is empty", async () => {
    const el = await fixture<GkTabs>(html`
      <gk-tabs default-value="b">
        <gk-tab-pane name="a" tab="A">A</gk-tab-pane>
        <gk-tab-pane name="b" label="B">B</gk-tab-pane>
      </gk-tabs>
    `);
    await settle(el);
    expect(el.value).toBe("b");
    expect(tabsOf(el)[1].getAttribute("aria-selected")).toBe("true");
  });

  it("emits update:value and change when an enabled tab is clicked", async () => {
    const el = await fixture<GkTabs>(html`
      <gk-tabs value="a">
        <gk-tab-pane name="a" tab="A">A</gk-tab-pane>
        <gk-tab-pane name="b" tab="B">B</gk-tab-pane>
      </gk-tabs>
    `);
    await settle(el);
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    el.addEventListener("update:value", onUpdate);
    el.addEventListener("change", onChange);
    tabsOf(el)[1].click();
    await settle(el);
    expect(el.value).toBe("b");
    expect(panelsOf(el)[0].hidden).toBe(true);
    expect(panelsOf(el)[1].hidden).toBe(false);
    const ev = onUpdate.mock.calls[0][0] as CustomEvent<{ value: string }>;
    expect(ev.detail).toEqual({ value: "b" });
    expect(ev.bubbles).toBe(true);
    expect(ev.composed).toBe(true);
    expect((onChange.mock.calls[0][0] as CustomEvent).detail).toEqual({ value: "b" });
  });

  it("skips disabled tabs for clicks and arrow / home / end keys", async () => {
    const el = await fixture<GkTabs>(html`
      <gk-tabs>
        <gk-tab-pane name="a" tab="A">A</gk-tab-pane>
        <gk-tab-pane name="b" tab="B" disabled>B</gk-tab-pane>
        <gk-tab-pane name="c" tab="C">C</gk-tab-pane>
      </gk-tabs>
    `);
    await settle(el);
    tabsOf(el)[1].click();
    await settle(el);
    expect(el.value).toBe("a");
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await settle(el);
    expect(el.value).toBe("c");
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    await settle(el);
    expect(el.value).toBe("a");
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    await settle(el);
    expect(el.value).toBe("c");
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
    await settle(el);
    expect(el.value).toBe("a");
  });

  it("projects a tab slot into the tab button", async () => {
    const el = await fixture<GkTabs>(html`
      <gk-tabs>
        <gk-tab-pane name="overview" tab="Ignored">
          <span slot="tab">★ Overview</span>
          Body
        </gk-tab-pane>
      </gk-tabs>
    `);
    await settle(el);
    const tab = tabsOf(el)[0];
    const assigned = tab.querySelector("slot")?.assignedNodes({ flatten: true }) ?? [];
    const label = assigned.map((node) => node.textContent ?? "").join("");
    expect(label).toContain("★ Overview");
    expect(label).not.toContain("Ignored");
    expect(tab.textContent).not.toContain("Ignored");
  });

  it("reflects segment and can turn animation off", async () => {
    const el = await fixture<GkTabs>(html`
      <gk-tabs type="segment" size="sm" animated="false">
        <gk-tab-pane name="list" tab="列表">List</gk-tab-pane>
      </gk-tabs>
    `);
    await settle(el);
    expect(el.type).toBe("segment");
    expect(el.size).toBe("sm");
    expect(el.animated).toBe(false);
    expect(el.getAttribute("animated")).toBeNull();
  });

  it("locks line heights, segment wash, and the indicator", () => {
    const css = tabsStyles.cssText;
    expect(css).toMatch(/:host\(\[size="sm"\]\) \[part="tab"\]\s*\{[^}]*height:\s*28px/);
    expect(css).toMatch(/height:\s*34px/);
    expect(css).toMatch(/:host\(\[size="lg"\]\) \[part="tab"\]\s*\{[^}]*height:\s*40px/);
    expect(css).toMatch(/\[part="indicator"\]\s*\{[^}]*height:\s*2px/);
    expect(css).toMatch(/\[part="indicator"\]\s*\{[^}]*--gk-color-brand/);
    expect(css).toMatch(/type="segment"\]\) \[part="tab"\]\[aria-selected="true"\][\s\S]*22%/);
    expect(css).toMatch(/flex-wrap:\s*nowrap/);
    expect(css).toMatch(/gk-tabs-fade 180ms/);
    expect(css).not.toMatch(/type="card"/);
  });
});
