import { afterEach, describe, expect, it, vi } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "../modal/gk-modal.js";
import "./gk-cascader.js";
import type { CascaderOption, GkCascader } from "./gk-cascader.js";

function panel() {
  return document.querySelector(".gk-cascader-panel");
}

function panelOptions() {
  return [...(panel()?.querySelectorAll("[part='option']") ?? [])];
}

afterEach(() => {
  document.querySelectorAll(".gk-cascader-panel").forEach((node) => node.remove());
  document.getElementById("gk-cascader-panel-style")?.remove();
});

const options: CascaderOption[] = [
  {
    label: "台灣",
    value: "tw",
    children: [
      {
        label: "台北市",
        value: "tpe",
        children: [
          { label: "大安區", value: "daan" },
          { label: "中正區", value: "zhongzheng" },
        ],
      },
    ],
  },
  { label: "日本", value: "jp", disabled: true },
];

describe("gk-cascader", () => {
  it("shows a placeholder and opens columns without committing a branch", async () => {
    const el = await fixture<GkCascader>(html`<gk-cascader placeholder="請選擇地區"></gk-cascader>`);
    el.options = options;
    await el.updateComplete;
    expect(el.value).toBeNull();
    expect(el.shadowRoot?.textContent).toContain("請選擇地區");
    (el.shadowRoot?.querySelector("[part='trigger']") as HTMLElement).click();
    await el.updateComplete;
    expect(panel()?.parentElement).toBe(document.body);
    const taiwan = panelOptions().find((node) => node.textContent?.includes("台灣")) as HTMLElement;
    taiwan.click();
    await el.updateComplete;
    expect(el.value).toBeNull();
    expect(el.open).toBe(true);
    expect(panel()?.querySelectorAll("[part='column']").length).toBe(2);
  });

  it("commits only when a leaf is clicked and clears", async () => {
    const el = await fixture<GkCascader>(html`<gk-cascader clearable></gk-cascader>`);
    el.options = options;
    el.value = ["tw", "tpe", "daan"];
    await el.updateComplete;
    expect(el.shadowRoot?.textContent).toContain("台灣 / 台北市 / 大安區");
    const onChange = vi.fn();
    el.addEventListener("change", onChange);
    (el.shadowRoot?.querySelector("[part='trigger']") as HTMLElement).click();
    await el.updateComplete;
    const city = panelOptions().find((node) => node.textContent?.includes("台北市")) as HTMLElement;
    city.click();
    await el.updateComplete;
    const leaf = panelOptions().find((node) => node.textContent?.includes("中正區")) as HTMLElement;
    leaf.click();
    await el.updateComplete;
    expect(el.value).toEqual(["tw", "tpe", "zhongzheng"]);
    expect(el.open).toBe(false);
    expect(onChange.mock.calls.at(-1)?.[0].detail.value).toEqual(["tw", "tpe", "zhongzheng"]);
    (el.shadowRoot?.querySelector("[part='clear']") as HTMLButtonElement).click();
    expect(el.value).toBeNull();
  });

  it("uses a 4000 panel z-index and skips disabled options", async () => {
    const el = await fixture<GkCascader>(html`<gk-cascader open></gk-cascader>`);
    el.options = options;
    await el.updateComplete;
    const openPanel = panel() as HTMLElement;
    expect(openPanel.parentElement).toBe(document.body);
    expect(Number(openPanel.style.zIndex)).toBe(4000);
    const root = el.shadowRoot?.querySelector("[part='trigger']") as HTMLElement;
    root.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await el.updateComplete;
    const japan = panel()?.querySelector("[aria-disabled='true']");
    expect(japan?.textContent).toContain("日本");
  });

  it("raises the portaled panel z-index inside a modal", async () => {
    const modal = await fixture(html`
      <gk-modal open>
        <gk-cascader open></gk-cascader>
      </gk-modal>
    `);
    const el = modal.querySelector("gk-cascader") as GkCascader;
    el.options = options;
    await el.updateComplete;
    const openPanel = panel() as HTMLElement;
    expect(openPanel.parentElement).toBe(document.body);
    expect(Number(openPanel.style.zIndex)).toBe(4010);
  });

  it("shows the empty slot when there are no options", async () => {
    const el = await fixture<GkCascader>(html`<gk-cascader open lang="zh-Hant"></gk-cascader>`);
    await el.updateComplete;
    expect(panel()?.textContent).toContain("沒有資料");
    expect(el.shadowRoot?.querySelector("[part='panel']")).toBeNull();
  });
});
