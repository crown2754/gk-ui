import { afterEach, describe, expect, it, vi } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "../modal/gk-modal.js";
import "./gk-tree-select.js";
import type { GkTreeSelect, TreeNode } from "./gk-tree-select.js";

function panel() {
  return document.querySelector(".gk-tree-select-panel");
}

function nodeByLabel(label: string) {
  return [...(panel()?.querySelectorAll("[part='node']") ?? [])].find((node) =>
    node.querySelector("[part='label']")?.textContent?.includes(label),
  ) as HTMLElement | undefined;
}

afterEach(() => {
  document.querySelectorAll(".gk-tree-select-panel").forEach((node) => node.remove());
  document.getElementById("gk-tree-select-panel-style")?.remove();
});

const options: TreeNode[] = [
  {
    label: "總公司",
    value: "hq",
    children: [
      {
        label: "產品部",
        value: "product",
        children: [
          { label: "設計組", value: "design" },
          { label: "實驗組", value: "lab", disabled: true },
        ],
      },
    ],
  },
];

describe("gk-tree-select", () => {
  it("shows the ancestor path and commits a node without a search field", async () => {
    const el = await fixture<GkTreeSelect>(
      html`<gk-tree-select clearable placeholder="請選擇部門" lang="zh-Hant"></gk-tree-select>`,
    );
    el.options = options;
    el.value = "design";
    await el.updateComplete;
    expect(el.separator).toBe(" / ");
    expect(el.shadowRoot?.textContent).toContain("總公司 / 產品部 / 設計組");
    expect(el.shadowRoot?.querySelector("[part='trigger']")?.getAttribute("aria-haspopup")).toBe("tree");
    expect(el.shadowRoot?.querySelector("input")).toBeNull();
    const onChange = vi.fn();
    el.addEventListener("change", onChange);
    (el.shadowRoot?.querySelector("[part='trigger']") as HTMLElement).click();
    await el.updateComplete;
    expect(panel()?.parentElement).toBe(document.body);
    expect(nodeByLabel("設計組")).toBeTruthy();
    nodeByLabel("設計組")?.querySelector("[part='label']")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe("design");
    expect(el.open).toBe(false);
    expect(onChange).toHaveBeenCalled();
    (el.shadowRoot?.querySelector("[part='clear']") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.value).toBeNull();
    expect(el.shadowRoot?.textContent).toContain("請選擇部門");
  });

  it("expands from the switcher and can show only the selected label", async () => {
    const el = await fixture<GkTreeSelect>(html`<gk-tree-select show-path="false"></gk-tree-select>`);
    el.options = options;
    el.value = "design";
    await el.updateComplete;
    expect(el.shadowRoot?.textContent).toContain("設計組");
    expect(el.shadowRoot?.textContent).not.toContain("總公司 /");
    el.value = null;
    el.showPath = true;
    (el.shadowRoot?.querySelector("[part='trigger']") as HTMLElement).click();
    await el.updateComplete;
    expect(nodeByLabel("產品部")).toBeUndefined();
    nodeByLabel("總公司")?.querySelector("button[part='switcher']")?.dispatchEvent(
      new MouseEvent("click", { bubbles: true }),
    );
    await el.updateComplete;
    expect(el.value).toBeNull();
    expect(nodeByLabel("產品部")).toBeTruthy();
  });

  it("uses panel z-index 4000 and 4010 inside a modal", async () => {
    const el = await fixture<GkTreeSelect>(html`<gk-tree-select open lang="zh-Hant"></gk-tree-select>`);
    await el.updateComplete;
    const openPanel = panel() as HTMLElement;
    expect(openPanel.parentElement).toBe(document.body);
    expect(openPanel.textContent).toContain("沒有資料");
    expect(Number(openPanel.style.zIndex)).toBe(4000);
    const modal = await fixture(html`
      <gk-modal open>
        <gk-tree-select open></gk-tree-select>
      </gk-modal>
    `);
    const nested = modal.querySelector("gk-tree-select") as GkTreeSelect;
    nested.options = options;
    await nested.updateComplete;
    const panels = [...document.querySelectorAll(".gk-tree-select-panel")] as HTMLElement[];
    expect(panels.some((node) => Number(node.style.zIndex) === 4010)).toBe(true);
  });

  it("skips disabled nodes and restricts selection with selectable", async () => {
    const el = await fixture<GkTreeSelect>(html`<gk-tree-select></gk-tree-select>`);
    el.options = options;
    el.defaultExpandedKeys = ["hq", "product"];
    el.selectable = (node) => !node.children?.length;
    await el.updateComplete;
    (el.shadowRoot?.querySelector("[part='trigger']") as HTMLElement).click();
    await el.updateComplete;
    nodeByLabel("實驗組")?.querySelector("[part='label']")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBeNull();
    expect(nodeByLabel("實驗組")?.getAttribute("aria-disabled")).toBe("true");
    nodeByLabel("設計組")?.querySelector("[part='label']")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe("design");
    expect(el.open).toBe(false);
    el.value = null;
    el.open = true;
    await el.updateComplete;
    nodeByLabel("產品部")?.querySelector("[part='label']")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBeNull();
    expect(el.open).toBe(true);
  });

  it("moves with the keyboard and closes on escape", async () => {
    const el = await fixture<GkTreeSelect>(html`<gk-tree-select></gk-tree-select>`);
    el.options = options;
    el.selectable = (node) => node.value === "hq";
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector("[part='trigger']") as HTMLElement;
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await el.updateComplete;
    expect(el.open).toBe(true);
    expect(panel()?.querySelector("[role='tree']")).toBeTruthy();
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe("hq");
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await el.updateComplete;
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(panel()).toBeNull();
  });
});
