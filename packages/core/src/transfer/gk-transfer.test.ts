import { describe, expect, it, vi } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-transfer.js";
import type { GkTransfer, TransferOption } from "./gk-transfer.js";

const options: TransferOption[] = [
  { label: "訂單編號", value: "id" },
  { label: "客戶名稱", value: "name" },
  { label: "內部備註", value: "note", disabled: true },
  { label: "物流單號", key: "ship" },
];

function item(el: GkTransfer, label: string) {
  return [...(el.shadowRoot?.querySelectorAll("[part='item']") ?? [])].find((node) =>
    node.textContent?.includes(label),
  ) as HTMLElement | undefined;
}

function buttons(el: GkTransfer) {
  return [...(el.shadowRoot?.querySelectorAll("[part='button']") ?? [])] as HTMLButtonElement[];
}

describe("gk-transfer", () => {
  it("searches by default and moves checked rows to the target", async () => {
    const el = await fixture<GkTransfer>(html`<gk-transfer lang="zh-Hant"></gk-transfer>`);
    el.options = options;
    await el.updateComplete;
    expect(el.showSearch).toBe(true);
    expect(el.shadowRoot?.querySelectorAll("[part='search']").length).toBe(2);
    expect(el.shadowRoot?.textContent).toContain("來源");
    expect(el.shadowRoot?.textContent).toContain("目標");
    expect(el.shadowRoot?.textContent).toContain("暫無資料");
    const onChange = vi.fn();
    el.addEventListener("change", onChange);
    item(el, "訂單編號")?.click();
    item(el, "客戶名稱")?.click();
    await el.updateComplete;
    const move = buttons(el).find((button) => button.getAttribute("aria-label") === "移至目標");
    expect(move?.getAttribute("data-variant")).toBe("primary");
    move?.click();
    await el.updateComplete;
    expect(el.value).toEqual(["id", "name"]);
    expect(el.targetKeys).toEqual(["id", "name"]);
    expect(onChange.mock.calls.at(-1)?.[0].detail).toMatchObject({
      direction: "target",
      movedKeys: ["id", "name"],
    });
    expect(item(el, "訂單編號")).toBeTruthy();
    expect(el.shadowRoot?.textContent).not.toContain("暫無資料");
  });

  it("moves every enabled source item and refuses disabled ones", async () => {
    const el = await fixture<GkTransfer>(html`<gk-transfer lang="zh-Hant"></gk-transfer>`);
    el.options = options;
    await el.updateComplete;
    item(el, "內部備註")?.click();
    await el.updateComplete;
    expect(item(el, "內部備註")?.getAttribute("aria-selected")).toBe("false");
    buttons(el).find((button) => button.getAttribute("aria-label") === "全部移至目標")?.click();
    await el.updateComplete;
    expect(el.value).toEqual(["id", "name", "ship"]);
    expect(item(el, "內部備註")?.getAttribute("aria-disabled")).toBe("true");
    expect(buttons(el).find((button) => button.getAttribute("aria-label") === "移回來源")?.getAttribute("data-variant")).toBe(
      "outline",
    );
    item(el, "物流單號")?.click();
    await el.updateComplete;
    buttons(el).find((button) => button.getAttribute("aria-label") === "移回來源")?.click();
    await el.updateComplete;
    expect(el.value).toEqual(["id", "name"]);
  });

  it("filters labels without dropping keys and supports select-all", async () => {
    const el = await fixture<GkTransfer>(html`<gk-transfer lang="zh-Hant"></gk-transfer>`);
    el.options = options;
    el.value = ["ship"];
    await el.updateComplete;
    const search = el.shadowRoot?.querySelector("[part='search']") as HTMLInputElement;
    const onSearch = vi.fn();
    el.addEventListener("search", onSearch);
    search.value = "客戶";
    search.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    expect(onSearch.mock.calls[0]?.[0].detail).toMatchObject({ direction: "source", value: "客戶" });
    expect(item(el, "客戶名稱")).toBeTruthy();
    expect(item(el, "訂單編號")).toBeUndefined();
    expect(el.value).toEqual(["ship"]);
    const selectAll = el.shadowRoot?.querySelector("[part='header'] [part='checkbox']") as HTMLButtonElement;
    expect(selectAll.getAttribute("aria-label")).toBe("全選來源");
    selectAll.click();
    await el.updateComplete;
    expect(item(el, "客戶名稱")?.getAttribute("aria-selected")).toBe("true");
    buttons(el).find((button) => button.textContent?.trim() === ">")?.click();
    await el.updateComplete;
    expect(el.value).toEqual(["ship", "name"]);
  });

  it("can hide search and ignores interaction while disabled", async () => {
    const hidden = await fixture<GkTransfer>(html`<gk-transfer show-search="false"></gk-transfer>`);
    hidden.options = options;
    await hidden.updateComplete;
    expect(hidden.shadowRoot?.querySelector("[part='search']")).toBeNull();
    const el = await fixture<GkTransfer>(html`<gk-transfer disabled lang="zh-Hant"></gk-transfer>`);
    el.options = options;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("[part='root']")?.getAttribute("aria-disabled")).toBe("true");
    item(el, "訂單編號")?.click();
    buttons(el)[0]?.click();
    expect(el.value).toEqual([]);
  });
});
