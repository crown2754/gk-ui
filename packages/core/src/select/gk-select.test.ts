import { describe, it, expect, vi, afterEach } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-option.js";
import "./gk-select.js";
import type { GkSelect } from "./gk-select.js";

function cleanupPortals() {
  document.querySelectorAll(".gk-select-listbox").forEach((n) => n.remove());
}

function trigger(el: GkSelect) {
  return el.shadowRoot?.querySelector("[part='base']") as HTMLElement;
}

describe("gk-select", () => {
  afterEach(() => {
    vi.useRealTimers();
    cleanupPortals();
  });

  it("defaults empty value, size md, closed", async () => {
    const el = await fixture<GkSelect>(html`<gk-select></gk-select>`);
    expect(el.value).toBe("");
    expect(el.size).toBe("md");
    expect(el.open).toBe(false);
    expect(el.clearable).toBe(false);
    expect(el.disabled).toBe(false);
  });

  it("supports form name and required validation", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <gk-select name="fruit" required>
          <gk-option value="apple">Apple</gk-option>
        </gk-select>
      </form>
    `);
    const el = form.querySelector("gk-select") as GkSelect;
    await el.updateComplete;
    expect(el.name).toBe("fruit");
    expect(el.required).toBe(true);
    expect(el.checkValidity()).toBe(false);
    el.value = "apple";
    await el.updateComplete;
    expect(el.checkValidity()).toBe(true);
  });

  it("resets form value", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <gk-select value="apple">
          <gk-option value="apple">Apple</gk-option>
        </gk-select>
      </form>
    `);
    const el = form.querySelector("gk-select") as GkSelect;
    form.reset();
    await el.updateComplete;
    expect(el.value).toBe("");
  });

  it("opens listbox on trigger click", async () => {
    const el = await fixture<GkSelect>(html`
      <gk-select>
        <gk-option value="a">Apple</gk-option>
      </gk-select>
    `);
    trigger(el).click();
    await el.updateComplete;
    expect(el.open).toBe(true);
    const list = document.querySelector(".gk-select-listbox");
    expect(list).toBeTruthy();
    expect(list?.getAttribute("role")).toBe("listbox");
  });

  it("virtualizes large option lists when enabled", async () => {
    const options = Array.from(
      { length: 100 },
      (_, index) => html`<gk-option value=${`option-${index}`}>Option ${index}</gk-option>`,
    );
    const el = await fixture<GkSelect>(html`
      <gk-select virtual item-height="32" open>${options}</gk-select>
    `);
    await el.updateComplete;
    const rendered = document.querySelectorAll(
      '.gk-select-listbox [role="option"]',
    );
    expect(rendered.length).toBeLessThan(100);
    expect(
      document.querySelector(".gk-select-listbox__items")?.getAttribute("style"),
    ).toContain("height: 3200px");
  });

  it("selecting an option sets value, emits change, and closes", async () => {
    const el = await fixture<GkSelect>(html`
      <gk-select>
        <gk-option value="apple">Apple</gk-option>
        <gk-option value="pear">Pear</gk-option>
      </gk-select>
    `);
    el.open = true;
    await el.updateComplete;
    const spy = vi.fn();
    el.addEventListener("change", spy);
    const opt = document.querySelector(
      '.gk-select-listbox [role="option"][data-value="pear"]',
    ) as HTMLElement;
    opt.click();
    await el.updateComplete;
    expect(el.value).toBe("pear");
    expect(el.open).toBe(false);
    const ev = spy.mock.calls[0][0] as CustomEvent<{ value: string }>;
    expect(ev).toBeInstanceOf(CustomEvent);
    expect(ev.bubbles).toBe(true);
    expect(ev.composed).toBe(true);
    expect(ev.detail).toEqual({ value: "pear" });
  });

  it("clear empties value and emits change", async () => {
    const el = await fixture<GkSelect>(html`
      <gk-select clearable value="apple">
        <gk-option value="apple">Apple</gk-option>
      </gk-select>
    `);
    const spy = vi.fn();
    el.addEventListener("change", spy);
    const btn = el.shadowRoot?.querySelector(
      "button[part='clear']",
    ) as HTMLButtonElement;
    btn.click();
    await el.updateComplete;
    expect(el.value).toBe("");
    expect((spy.mock.calls[0][0] as CustomEvent).detail).toEqual({ value: "" });
  });

  it("disabled does not open", async () => {
    const el = await fixture<GkSelect>(html`
      <gk-select disabled>
        <gk-option value="a">A</gk-option>
      </gk-select>
    `);
    trigger(el).click();
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(document.querySelector(".gk-select-listbox")).toBeNull();
  });

  it("reflects size and status", async () => {
    const el = await fixture<GkSelect>(
      html`<gk-select size="lg" status="error"></gk-select>`,
    );
    expect(el.size).toBe("lg");
    expect(el.status).toBe("error");
    expect(el.getAttribute("size")).toBe("lg");
    expect(el.getAttribute("status")).toBe("error");
  });

  it("Escape closes an open listbox", async () => {
    const el = await fixture<GkSelect>(html`
      <gk-select>
        <gk-option value="a">A</gk-option>
      </gk-select>
    `);
    el.open = true;
    await el.updateComplete;
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it("combobox trigger exposes aria-expanded", async () => {
    const el = await fixture<GkSelect>(html`<gk-select></gk-select>`);
    const base = trigger(el);
    expect(base.getAttribute("role")).toBe("combobox");
    expect(base.getAttribute("aria-expanded")).toBe("false");
    el.open = true;
    await el.updateComplete;
    expect(trigger(el).getAttribute("aria-expanded")).toBe("true");
  });

  it("restores focus to the trigger after closing", async () => {
    const el = await fixture<GkSelect>(html`
      <gk-select>
        <gk-option value="a">A</gk-option>
      </gk-select>
    `);
    const focusSpy = vi.spyOn(trigger(el), "focus");
    el.open = true;
    await el.updateComplete;
    el.open = false;
    await el.updateComplete;
    expect(focusSpy).toHaveBeenCalled();
  });

  it("skips disabled options and supports Home and End", async () => {
    const el = await fixture<GkSelect>(html`
      <gk-select>
        <gk-option value="a" disabled>A</gk-option>
        <gk-option value="b">B</gk-option>
        <gk-option value="c">C</gk-option>
      </gk-select>
    `);
    trigger(el).focus();
    trigger(el).dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    await el.updateComplete;
    expect(
      document.querySelector('[role="option"].is-active')?.getAttribute("data-value"),
    ).toBe("b");
    trigger(el).dispatchEvent(
      new KeyboardEvent("keydown", { key: "End", bubbles: true }),
    );
    await el.updateComplete;
    expect(
      document.querySelector('[role="option"].is-active')?.getAttribute("data-value"),
    ).toBe("c");
  });

  it("renders option groups and an empty state", async () => {
    const grouped = await fixture<GkSelect>(html`
      <gk-select open>
        <gk-option-group label="Fruit">
          <gk-option value="apple">Apple</gk-option>
        </gk-option-group>
      </gk-select>
    `);
    await grouped.updateComplete;
    expect(document.querySelector(".gk-select-listbox__group")?.textContent).toBe(
      "Fruit",
    );
    expect(document.querySelector('[role="option"][data-value="apple"]')).toBeTruthy();

    const empty = await fixture<GkSelect>(html`<gk-select open></gk-select>`);
    await empty.updateComplete;
    expect(document.querySelector(".gk-select-listbox__empty")?.textContent).toContain(
      "No options",
    );
  });

  it("filters options by label and selects with Enter", async () => {
    const el = await fixture<GkSelect>(html`
      <gk-select filterable>
        <gk-option value="apple">Apple</gk-option>
        <gk-option value="pear">Pear</gk-option>
      </gk-select>
    `);
    trigger(el).click();
    await el.updateComplete;
    const input = document.querySelector(
      ".gk-select-listbox input[data-filter]",
    ) as HTMLInputElement;
    expect(input).toBeTruthy();
    input.value = "pea";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    expect(
      document.querySelectorAll('.gk-select-listbox [role="option"]'),
    ).toHaveLength(1);
    expect(
      document.querySelector('.gk-select-listbox [data-value="pear"]'),
    ).toBeTruthy();
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    await el.updateComplete;
    expect(el.value).toBe("pear");
    expect(el.open).toBe(false);
  });

  it("shows empty state when filtering has no match", async () => {
    const el = await fixture<GkSelect>(html`
      <gk-select filterable open>
        <gk-option value="apple">Apple</gk-option>
      </gk-select>
    `);
    await el.updateComplete;
    const input = document.querySelector(
      ".gk-select-listbox input[data-filter]",
    ) as HTMLInputElement;
    input.value = "zzz";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    expect(document.querySelector(".gk-select-listbox__empty")?.textContent).toContain(
      "No options",
    );
  });

  it("keeps the filter input focused while results update", async () => {
    const el = await fixture<GkSelect>(html`
      <gk-select filterable>
        <gk-option value="apple">Apple</gk-option>
        <gk-option value="pear">Pear</gk-option>
      </gk-select>
    `);
    trigger(el).click();
    await el.updateComplete;
    const input = document.querySelector(
      ".gk-select-listbox input[data-filter]",
    ) as HTMLInputElement;
    input.focus();
    input.value = "p";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    expect(
      document.querySelector(".gk-select-listbox input[data-filter]"),
    ).toBe(input);
    expect(document.activeElement).toBe(input);
  });

  it("toggles multiple values and keeps the listbox open", async () => {
    const el = await fixture<GkSelect>(html`
      <gk-select multiple .value=${["apple"]}>
        <gk-option value="apple">Apple</gk-option>
        <gk-option value="pear">Pear</gk-option>
      </gk-select>
    `);
    el.open = true;
    await el.updateComplete;
    const pear = document.querySelector(
      '.gk-select-listbox [data-value="pear"]',
    ) as HTMLElement;
    pear.click();
    await el.updateComplete;
    expect(el.value).toEqual(["apple", "pear"]);
    expect(el.open).toBe(true);
    expect(
      document.querySelector('[data-value="apple"]')?.getAttribute("aria-checked"),
    ).toBe("true");
    expect(
      document.querySelector('[data-value="apple"] .gk-select-listbox__checkbox')
        ?.textContent,
    ).toBe("✓");
    expect(
      el.shadowRoot?.querySelectorAll("[part='tag']"),
    ).toHaveLength(2);
    const apple = document.querySelector(
      '.gk-select-listbox [data-value="apple"]',
    ) as HTMLElement;
    apple.click();
    await el.updateComplete;
    expect(el.value).toEqual(["pear"]);
    expect(
      document.querySelector('[data-value="apple"]')?.getAttribute("aria-checked"),
    ).toBe("false");
  });

  it("clears multiple values with an empty array", async () => {
    const el = await fixture<GkSelect>(html`
      <gk-select multiple clearable .value=${["apple"]}>
        <gk-option value="apple">Apple</gk-option>
      </gk-select>
    `);
    const clear = el.shadowRoot?.querySelector(
      "button[part='clear']",
    ) as HTMLButtonElement;
    clear.click();
    await el.updateComplete;
    expect(el.value).toEqual([]);
  });

  it("limits additions in multiple mode with max while allowing removal", async () => {
    const el = await fixture<GkSelect>(html`
      <gk-select multiple max="2" .value=${["apple"]}>
        <gk-option value="apple">Apple</gk-option>
        <gk-option value="pear">Pear</gk-option>
        <gk-option value="plum">Plum</gk-option>
      </gk-select>
    `);
    el.open = true;
    await el.updateComplete;
    const pear = document.querySelector(
      '.gk-select-listbox [data-value="pear"]',
    ) as HTMLElement;
    pear.click();
    await el.updateComplete;
    expect(el.value).toEqual(["apple", "pear"]);

    const plum = document.querySelector(
      '.gk-select-listbox [data-value="plum"]',
    ) as HTMLElement;
    plum.click();
    await el.updateComplete;
    expect(el.value).toEqual(["apple", "pear"]);

    const apple = document.querySelector(
      '.gk-select-listbox [data-value="apple"]',
    ) as HTMLElement;
    apple.click();
    await el.updateComplete;
    expect(el.value).toEqual(["pear"]);
  });

  it("renders loading state and blocks selection", async () => {
    const el = await fixture<GkSelect>(html`
      <gk-select loading open>
        <gk-option value="apple">Apple</gk-option>
      </gk-select>
    `);
    await el.updateComplete;
    expect(document.querySelector(".gk-select-listbox__loading")?.textContent).toBe(
      "Loading...",
    );
    const option = document.querySelector(
      '.gk-select-listbox [data-value="apple"]',
    ) as HTMLElement | null;
    expect(option).toBeNull();
    expect(el.value).toBe("");
  });

  it("renders custom loading and empty slot content", async () => {
    const loading = await fixture<GkSelect>(html`
      <gk-select loading open>
        <span slot="loading">Fetching fruits…</span>
      </gk-select>
    `);
    await loading.updateComplete;
    expect(document.querySelector(".gk-select-listbox__loading")?.textContent).toBe(
      "Fetching fruits…",
    );

    const empty = await fixture<GkSelect>(html`
      <gk-select open>
        <span slot="empty">Nothing found</span>
      </gk-select>
    `);
    await empty.updateComplete;
    expect(document.querySelector(".gk-select-listbox__empty")?.textContent).toBe(
      "Nothing found",
    );
  });

  it("debounces remote search events and keeps only the latest query", async () => {
    vi.useFakeTimers();
    const el = await fixture<GkSelect>(html`
      <gk-select remote open>
        <gk-option value="apple">Apple</gk-option>
        <gk-option value="pear">Pear</gk-option>
      </gk-select>
    `);
    await el.updateComplete;
    const spy = vi.fn();
    el.addEventListener("search", spy);
    const input = document.querySelector(
      ".gk-select-listbox input[data-filter]",
    ) as HTMLInputElement;
    expect(input).toBeTruthy();
    input.value = "z";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.value = "zzz";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(299);
    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(spy).toHaveBeenCalledOnce();
    expect((spy.mock.calls[0][0] as CustomEvent).detail).toEqual({
      query: "zzz",
      requestId: 2,
    });
    expect(document.querySelectorAll('.gk-select-listbox [role="option"]')).toHaveLength(
      2,
    );
  });
});
