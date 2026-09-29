import { afterEach, describe, expect, it, vi } from "vitest";
import { fixture, fixtureCleanup, html } from "@open-wc/testing";
import "./gk-breadcrumb.js";
import type { GkBreadcrumb, GkBreadcrumbItemData } from "./gk-breadcrumb.js";
import type { GkBreadcrumbItem } from "./gk-breadcrumb-item.js";
import { breadcrumbItemStyles, breadcrumbStyles } from "./gk-breadcrumb.styles.js";

function item(el: ParentNode, label: string) {
  return [...el.querySelectorAll("gk-breadcrumb-item")].find(
    (node) => node.textContent?.trim() === label,
  ) as GkBreadcrumbItem;
}

describe("gk-breadcrumb", () => {
  afterEach(() => {
    document.documentElement.lang = "";
    fixtureCleanup();
  });

  it("renders a chevron trail whose last item is the current page", async () => {
    const el = await fixture<GkBreadcrumb>(html`
      <gk-breadcrumb>
        <gk-breadcrumb-item href="/">首頁</gk-breadcrumb-item>
        <gk-breadcrumb-item href="/products">產品</gk-breadcrumb-item>
        <gk-breadcrumb-item>Breadcrumb</gk-breadcrumb-item>
      </gk-breadcrumb>
    `);
    await Promise.all(el.itemElements().map((node) => node.updateComplete));
    expect(el.separator).toBe("chevron");
    expect(el.size).toBe("md");
    const nav = el.shadowRoot?.querySelector("[part='root']");
    expect(nav?.tagName).toBe("NAV");
    expect(nav?.getAttribute("aria-label")).toBe("麵包屑");
    expect(el.shadowRoot?.querySelector("[part='list']")?.getAttribute("role")).toBe("list");
    const current = item(el, "Breadcrumb");
    const link = item(el, "首頁");
    expect(current.current).toBe(true);
    expect(current.shadowRoot?.querySelector("[aria-current='page']")).toBeTruthy();
    expect(current.textContent?.trim()).toBe("Breadcrumb");
    expect(current.shadowRoot?.querySelector("[part='separator']")).toBeNull();
    expect(current.shadowRoot?.querySelector("a")).toBeNull();
    const sep = link.shadowRoot?.querySelector("[part='separator']");
    expect(sep?.getAttribute("aria-hidden")).toBe("true");
    expect(sep?.querySelector("path")?.getAttribute("d")).toBe("m9 6 6 6-6 6");
    expect(link.shadowRoot?.querySelector("a")?.getAttribute("href")).toBe("/");
    expect(link.shadowRoot?.textContent).not.toContain("/");
  });

  it("uses an English landmark when the document language is English", async () => {
    document.documentElement.lang = "en";
    const el = await fixture<GkBreadcrumb>(html`
      <gk-breadcrumb>
        <gk-breadcrumb-item>Now</gk-breadcrumb-item>
      </gk-breadcrumb>
    `);
    expect(el.shadowRoot?.querySelector("nav")?.getAttribute("aria-label")).toBe("Breadcrumb");
  });

  it("emits select for an item without href and leaves links to the browser", async () => {
    const el = await fixture<GkBreadcrumb>(html`
      <gk-breadcrumb>
        <gk-breadcrumb-item key="home" href="/home">Home</gk-breadcrumb-item>
        <gk-breadcrumb-item key="library">Library</gk-breadcrumb-item>
        <gk-breadcrumb-item>Current</gk-breadcrumb-item>
      </gk-breadcrumb>
    `);
    await Promise.all(el.itemElements().map((node) => node.updateComplete));
    const onSelect = vi.fn();
    el.addEventListener("select", onSelect);
    item(el, "Library").shadowRoot?.querySelector("button")?.click();
    expect(onSelect).toHaveBeenCalledOnce();
    expect((onSelect.mock.calls[0][0] as CustomEvent).detail.key).toBe("library");
    expect((onSelect.mock.calls[0][0] as CustomEvent).bubbles).toBe(true);
    onSelect.mockClear();
    item(el, "Home").shadowRoot?.querySelector("a")?.click();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("renders the items API with a text separator and ignores disabled clicks", async () => {
    const items: GkBreadcrumbItemData[] = [
      { label: "Home", key: "home" },
      { label: "Locked", key: "locked", disabled: true },
      { label: "Now" },
    ];
    const el = await fixture<GkBreadcrumb>(html`<gk-breadcrumb separator="/" .items=${items}></gk-breadcrumb>`);
    const list = el.shadowRoot?.querySelector("ol");
    expect(list?.getAttribute("part")).toBe("list");
    const current = el.shadowRoot?.querySelector("[aria-current='page']");
    expect(current?.textContent?.trim()).toBe("Now");
    expect(el.shadowRoot?.querySelectorAll("[part='separator']")).toHaveLength(2);
    expect(el.shadowRoot?.querySelector("[part='separator']")?.textContent).toBe("/");
    const onSelect = vi.fn();
    el.addEventListener("select", onSelect);
    (el.shadowRoot?.querySelectorAll("button")[0] as HTMLButtonElement).click();
    expect((onSelect.mock.calls[0][0] as CustomEvent).detail).toMatchObject({ key: "home" });
    onSelect.mockClear();
    const locked = el.shadowRoot?.querySelectorAll("button")[1] as HTMLButtonElement;
    expect(locked.disabled).toBe(true);
  });

  it("lets the separator slot replace the chevron", async () => {
    const el = await fixture<GkBreadcrumb>(html`
      <gk-breadcrumb>
        <span slot="separator">·</span>
        <gk-breadcrumb-item href="#a">A</gk-breadcrumb-item>
        <gk-breadcrumb-item>B</gk-breadcrumb-item>
      </gk-breadcrumb>
    `);
    await el.updateComplete;
    await Promise.all(el.itemElements().map((node) => node.updateComplete));
    const sep = item(el, "A").shadowRoot?.querySelector("[part='separator']");
    expect(sep?.textContent).toBe("·");
    expect(sep?.querySelector("svg")).toBeNull();
  });

  it("locks the soft underline, focus ring, and sm/md/lg type scale", () => {
    const css = `${breadcrumbStyles.cssText}\n${breadcrumbItemStyles.cssText}`;
    expect(css).toMatch(/text-decoration:\s*underline/);
    expect(css).toMatch(/--gk-color-brand[^;]*70%/);
    expect(css).toMatch(/--gk-color-focus-ring[^;]*70%/);
    expect(css).toMatch(/font-size:\s*0\.8125rem/);
    expect(css).toMatch(/font-size:\s*0\.875rem/);
    expect(css).toMatch(/font-size:\s*0\.9375rem/);
    expect(css).not.toMatch(/content:\s*["']\/["']/);
  });
});
