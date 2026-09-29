import { describe, it, expect, vi, afterEach } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-pagination.js";
import { buildPageList, type GkPagination } from "./gk-pagination.js";
import { paginationStyles } from "./gk-pagination.styles.js";

function tokens(el: GkPagination) {
  return [...(el.shadowRoot?.querySelectorAll("[part~='item'], [part='ellipsis']") ?? [])].map(
    (node) => (node.getAttribute("part") === "ellipsis" ? "…" : node.textContent?.trim()),
  );
}

describe("buildPageList", () => {
  it("shows every page when the count fits the slot", () => {
    expect(buildPageList(1, 5, 7)).toEqual([1, 2, 3, 4, 5]);
  });

  it("collapses the middle the way the mock does", () => {
    expect(buildPageList(5, 12, 7)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 12]);
    expect(buildPageList(1, 12, 7)).toEqual([1, 2, 3, 4, 5, "ellipsis", 12]);
    expect(buildPageList(12, 12, 7)).toEqual([1, "ellipsis", 8, 9, 10, 11, 12]);
  });
});

describe("gk-pagination", () => {
  afterEach(() => {
    document.documentElement.lang = "";
  });

  it("renders a 分頁器 landmark with a solid current page", async () => {
    const el = await fixture<GkPagination>(html`<gk-pagination page-count="5"></gk-pagination>`);
    expect(el.page).toBe(1);
    expect(el.pageSize).toBe(10);
    expect(el.size).toBe("md");
    expect(el.resolvedPageCount()).toBe(5);
    const nav = el.shadowRoot?.querySelector("nav") as HTMLElement;
    expect(nav.getAttribute("aria-label")).toBe("分頁器");
    expect(tokens(el)).toEqual(["1", "2", "3", "4", "5"]);
    const current = el.shadowRoot?.querySelector("[aria-current='page']") as HTMLButtonElement;
    expect(current.textContent?.trim()).toBe("1");
    expect(current.getAttribute("part")).toContain("item-active");
    const prev = el.shadowRoot?.querySelector("[part='prev']") as HTMLButtonElement;
    const next = el.shadowRoot?.querySelector("[part='next']") as HTMLButtonElement;
    expect(prev.disabled).toBe(true);
    expect(prev.getAttribute("aria-label")).toBe("上一頁");
    expect(next.disabled).toBe(false);
    expect(next.getAttribute("aria-label")).toBe("下一頁");
    expect(el.shadowRoot?.querySelector("[part='size-picker']")).toBeNull();
    expect(el.shadowRoot?.querySelector("[part='quick-jumper']")).toBeNull();
  });

  it("uses English names when the document language is English", async () => {
    document.documentElement.lang = "en";
    const el = await fixture<GkPagination>(html`<gk-pagination page-count="3" page="3"></gk-pagination>`);
    expect(el.shadowRoot?.querySelector("nav")?.getAttribute("aria-label")).toBe("Pagination");
    expect(el.shadowRoot?.querySelector("[part='next']")?.getAttribute("aria-label")).toBe("Next page");
    expect((el.shadowRoot?.querySelector("[part='next']") as HTMLButtonElement).disabled).toBe(true);
  });

  it("emits update:page and change when a page is chosen", async () => {
    const el = await fixture<GkPagination>(html`<gk-pagination page-count="5"></gk-pagination>`);
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    el.addEventListener("update:page", onUpdate);
    el.addEventListener("change", onChange);
    const page3 = [...(el.shadowRoot?.querySelectorAll("[part~='item']") ?? [])].find(
      (node) => node.textContent?.trim() === "3",
    ) as HTMLButtonElement;
    page3.click();
    await el.updateComplete;
    expect(el.page).toBe(3);
    expect((onUpdate.mock.calls[0][0] as CustomEvent).detail).toEqual({ page: 3 });
    expect((onChange.mock.calls[0][0] as CustomEvent).detail).toEqual({ page: 3 });
    expect((onUpdate.mock.calls[0][0] as CustomEvent).bubbles).toBe(true);
  });

  it("derives page count from item-count and collapses with ellipsis", async () => {
    const el = await fixture<GkPagination>(
      html`<gk-pagination page="5" item-count="128" page-size="10" show-total></gk-pagination>`,
    );
    expect(el.resolvedPageCount()).toBe(13);
    expect(tokens(el)).toEqual(["1", "…", "4", "5", "6", "…", "13"]);
    expect(el.shadowRoot?.querySelector("[part='total']")?.textContent).toBe("共 128 筆");
    expect(el.shadowRoot?.querySelector("[part='ellipsis']")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("resets to page 1 when the page size changes", async () => {
    const el = await fixture<GkPagination>(html`
      <gk-pagination page="4" item-count="128" page-size="10" show-size-picker></gk-pagination>
    `);
    const onSize = vi.fn();
    const onPage = vi.fn();
    el.addEventListener("update:page-size", onSize);
    el.addEventListener("update:page", onPage);
    const select = el.shadowRoot?.querySelector("[part='size-picker']") as HTMLSelectElement;
    expect(select.getAttribute("aria-label")).toBe("每頁筆數");
    expect(select.value).toBe("10");
    select.value = "20";
    select.dispatchEvent(new Event("change"));
    await el.updateComplete;
    expect(el.pageSize).toBe(20);
    expect(el.page).toBe(1);
    expect((onSize.mock.calls[0][0] as CustomEvent).detail).toEqual({ pageSize: 20 });
    expect((onPage.mock.calls[0][0] as CustomEvent).detail).toEqual({ page: 1 });
    expect(el.resolvedPageCount()).toBe(7);
  });

  it("jumps from the quick jumper on Enter", async () => {
    document.documentElement.lang = "en";
    const el = await fixture<GkPagination>(
      html`<gk-pagination page="2" page-count="12" show-quick-jumper></gk-pagination>`,
    );
    const label = el.shadowRoot?.querySelector("[part='quick-jumper']") as HTMLElement;
    expect(label.textContent).toContain("Go to");
    const input = label.querySelector("input") as HTMLInputElement;
    expect(input.getAttribute("aria-label")).toBe("Page number");
    input.value = "9";
    input.dispatchEvent(new Event("input"));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    await el.updateComplete;
    expect(el.page).toBe(9);
  });

  it("clamps the page and disables every control", async () => {
    const el = await fixture<GkPagination>(
      html`<gk-pagination page="40" page-count="5" disabled></gk-pagination>`,
    );
    expect(el.page).toBe(5);
    expect(el.getAttribute("aria-disabled")).toBe("true");
    const buttons = [...(el.shadowRoot?.querySelectorAll("button") ?? [])] as HTMLButtonElement[];
    expect(buttons.every((button) => button.disabled)).toBe(true);
    const onUpdate = vi.fn();
    el.addEventListener("update:page", onUpdate);
    buttons[1].click();
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("moves with arrow keys from the nav", async () => {
    const el = await fixture<GkPagination>(html`<gk-pagination page="2" page-count="5"></gk-pagination>`);
    const nav = el.shadowRoot?.querySelector("[part='nav']") as HTMLElement;
    nav.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await el.updateComplete;
    expect(el.page).toBe(3);
  });

  it("locks solid brand active, 18% hover, and the 28/34/40 scale", () => {
    const css = paginationStyles.cssText;
    expect(css).toMatch(/aria-current="page"\]\s*\{[^}]*--gk-color-brand/);
    expect(css).toMatch(/--gk-color-brand-on/);
    expect(css).toMatch(/18%/);
    expect(css).toMatch(/70%/);
    expect(css).toMatch(/height:\s*28px/);
    expect(css).toMatch(/height:\s*34px/);
    expect(css).toMatch(/height:\s*40px/);
    expect(css).toMatch(/--gk-radius-md/);
  });
});
