# Date Picker (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add phase-1 `gk-date-picker` (single ISO date), Input-aligned trigger, body-portaled month calendar with Clear/Now, and EN/zh-TW docs under Data Entry.

**Architecture:** Pure date helpers in `date-utils.ts`; Lit `gk-date-picker` owns trigger + portal panel. Events mirror `gk-input` (`input`/`change` CustomEvents with `detail.value`). Calendar is not a public custom element yet.

**Tech Stack:** Lit 3, Vitest + `@open-wc/testing`, VitePress, pnpm `@gk-ui/core` (no date library).

## Global Constraints

- Phase 1: `type="date"` only; value `'YYYY-MM-DD' | ''`.
- Display `format` default `yyyy-MM-dd` (tokens `yyyy` `MM` `dd`); bound value stays ISO.
- Sizes `sm|md|lg` = 28/34/40 like Input; on-surface field text; no Button hover translate.
- `isDateDisabled?: (iso: string) => boolean` as JS property only.
- Panel: portal to `document.body`; Clear + Now; outside click / Escape close.
- Events: CustomEvent `input`/`change` `{ value }`; `gk-open-change` `{ open }`.
- Locale: `en` | `zh-TW` for weekday + action labels.
- Out of scope: range, datetime, month/year, shortcuts, firstDayOfWeek, manual parse, TimePicker.
- Sidebar: **Data Entry / 資料輸入** = Date Picker, Input; Input removed from General.
- Tests: `corepack pnpm --filter @gk-ui/core test`
- Docs: `corepack pnpm docs:build`
- Commit after each task; do not push unless asked.

## File map

| File | Responsibility |
|------|----------------|
| `packages/core/src/date-picker/date-utils.ts` | ISO parse/format, month grid, today |
| `packages/core/src/date-picker/date-utils.test.ts` | Helper unit tests |
| `packages/core/src/date-picker/gk-date-picker.styles.ts` | Trigger + panel styles |
| `packages/core/src/date-picker/gk-date-picker.ts` | Element |
| `packages/core/src/date-picker/gk-date-picker.test.ts` | Component tests |
| `packages/core/src/index.ts` | Export |
| `packages/core/package.json` | `sideEffects` |
| `apps/docs/components/date-picker.md` | EN docs |
| `apps/docs/zh-TW/components/date-picker.md` | zh-TW docs |
| `apps/docs/.vitepress/config.ts` | Sidebar Data Entry |

---

### Task 1: Date utils

**Files:**
- Create: `packages/core/src/date-picker/date-utils.ts`
- Create: `packages/core/src/date-picker/date-utils.test.ts`

**Interfaces:**
- Produces: `parseIsoDate`, `formatIsoDate`, `formatDisplay`, `toIsoDate`, `startOfMonth`, `addMonths`, `buildMonthGrid`, `isValidIsoDate`, `todayIso`
- Types: `CalendarCell = { iso: string; day: number; inMonth: boolean }`

- [ ] **Step 1: Write failing tests**

Create `packages/core/src/date-picker/date-utils.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  isValidIsoDate,
  parseIsoDate,
  toIsoDate,
  formatDisplay,
  addMonths,
  buildMonthGrid,
  todayIso,
} from "./date-utils.js";

describe("date-utils", () => {
  it("validates ISO dates", () => {
    expect(isValidIsoDate("2026-09-17")).toBe(true);
    expect(isValidIsoDate("2026-9-17")).toBe(false);
    expect(isValidIsoDate("")).toBe(false);
    expect(isValidIsoDate("not-a-date")).toBe(false);
  });

  it("round-trips parse and toIsoDate", () => {
    const d = parseIsoDate("2026-02-01");
    expect(d).not.toBeNull();
    expect(toIsoDate(d!)).toBe("2026-02-01");
  });

  it("formatDisplay replaces yyyy MM dd", () => {
    expect(formatDisplay("2026-09-07", "yyyy-MM-dd")).toBe("2026-09-07");
    expect(formatDisplay("2026-09-07", "dd/MM/yyyy")).toBe("07/09/2026");
  });

  it("addMonths moves calendar month", () => {
    expect(toIsoDate(addMonths(parseIsoDate("2026-01-31")!, 1))).toBe(
      "2026-02-28",
    );
  });

  it("buildMonthGrid returns 6 weeks starting Sunday", () => {
    const grid = buildMonthGrid(2026, 8); // September 2026 (month 0-based 8)
    expect(grid).toHaveLength(42);
    expect(grid.filter((c) => c.inMonth).length).toBe(30);
    const firstInMonth = grid.find((c) => c.inMonth)!;
    expect(firstInMonth.iso).toBe("2026-09-01");
  });

  it("todayIso matches local Y-M-D", () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    expect(todayIso()).toBe(`${y}-${m}-${d}`);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

Run: `corepack pnpm --filter @gk-ui/core test`

- [ ] **Step 3: Implement utils**

Create `packages/core/src/date-picker/date-utils.ts`:

```ts
export type CalendarCell = {
  iso: string;
  day: number;
  inMonth: boolean;
};

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isValidIsoDate(value: string): boolean {
  const m = ISO_RE.exec(value);
  if (!m) return false;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(y, mo - 1, d);
  return (
    dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d
  );
}

/** Local calendar date at noon to avoid DST edge cases. */
export function parseIsoDate(value: string): Date | null {
  if (!isValidIsoDate(value)) return null;
  const [y, mo, d] = value.split("-").map(Number);
  return new Date(y, mo - 1, d, 12, 0, 0, 0);
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayIso(): string {
  return toIsoDate(new Date());
}

export function formatDisplay(iso: string, format: string): string {
  if (!isValidIsoDate(iso)) return "";
  const [yyyy, MM, dd] = iso.split("-");
  return format.replace(/yyyy/g, yyyy).replace(/MM/g, MM).replace(/dd/g, dd);
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0, 0);
}

export function addMonths(date: Date, delta: number): Date {
  const y = date.getFullYear();
  const m = date.getMonth() + delta;
  const day = date.getDate();
  const last = new Date(y, m + 1, 0).getDate();
  return new Date(y, m, Math.min(day, last), 12, 0, 0, 0);
}

/** month is 0-based. Grid is 6×7 = 42 cells, weeks start on Sunday. */
export function buildMonthGrid(year: number, month: number): CalendarCell[] {
  const first = new Date(year, month, 1, 12, 0, 0, 0);
  const startOffset = first.getDay(); // 0=Sun
  const gridStart = new Date(year, month, 1 - startOffset, 12, 0, 0, 0);
  const cells: CalendarCell[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + i,
      12,
      0,
      0,
      0,
    );
    cells.push({
      iso: toIsoDate(d),
      day: d.getDate(),
      inMonth: d.getMonth() === month,
    });
  }
  return cells;
}
```

- [ ] **Step 4: Run — expect PASS**

Run: `corepack pnpm --filter @gk-ui/core test`

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/date-picker/date-utils.ts packages/core/src/date-picker/date-utils.test.ts
git commit -m "feat(date-picker): add ISO date and month grid helpers"
```

---

### Task 2: `gk-date-picker` element

**Files:**
- Create: `packages/core/src/date-picker/gk-date-picker.styles.ts`
- Create: `packages/core/src/date-picker/gk-date-picker.ts`
- Create: `packages/core/src/date-picker/gk-date-picker.test.ts`
- Modify: `packages/core/src/index.ts`
- Modify: `packages/core/package.json`

**Interfaces:**
- Consumes: date-utils from Task 1
- Produces: `GkDatePicker`; props per spec; events `input`, `change`, `gk-open-change`

- [ ] **Step 1: Write failing component tests**

Create `packages/core/src/date-picker/gk-date-picker.test.ts`:

```ts
import { describe, it, expect, vi, afterEach } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-date-picker.js";
import type { GkDatePicker } from "./gk-date-picker.js";

describe("gk-date-picker", () => {
  afterEach(() => {
    document.querySelectorAll(".gk-date-picker-panel").forEach((n) => n.remove());
  });

  it("defaults type date, empty value, size md, locale en", async () => {
    const el = await fixture<GkDatePicker>(html`<gk-date-picker></gk-date-picker>`);
    expect(el.type).toBe("date");
    expect(el.value).toBe("");
    expect(el.size).toBe("md");
    expect(el.format).toBe("yyyy-MM-dd");
    expect(el.locale).toBe("en");
    expect(el.open).toBe(false);
  });

  it("opens panel on trigger click and emits gk-open-change", async () => {
    const el = await fixture<GkDatePicker>(html`<gk-date-picker></gk-date-picker>`);
    const spy = vi.fn();
    el.addEventListener("gk-open-change", spy);
    (el.shadowRoot?.querySelector("[part='base']") as HTMLElement).click();
    await el.updateComplete;
    expect(el.open).toBe(true);
    expect(document.querySelector(".gk-date-picker-panel")).not.toBeNull();
    expect(spy).toHaveBeenCalled();
    expect((spy.mock.calls[0][0] as CustomEvent).detail).toEqual({ open: true });
  });

  it("selecting a day sets ISO value and emits input+change", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker value="2026-09-01"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const onInput = vi.fn();
    const onChange = vi.fn();
    el.addEventListener("input", onInput);
    el.addEventListener("change", onChange);
    const dayBtn = document.querySelector(
      '.gk-date-picker-panel button[data-iso="2026-09-17"]',
    ) as HTMLButtonElement;
    dayBtn.click();
    await el.updateComplete;
    expect(el.value).toBe("2026-09-17");
    expect(el.open).toBe(false);
    expect((onInput.mock.calls[0][0] as CustomEvent).detail).toEqual({
      value: "2026-09-17",
    });
    expect(onChange).toHaveBeenCalled();
  });

  it("clear empties value", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker value="2026-09-17" clearable></gk-date-picker>`,
    );
    const spy = vi.fn();
    el.addEventListener("input", spy);
    (el.shadowRoot?.querySelector("button[part='clear']") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.value).toBe("");
    expect((spy.mock.calls[0][0] as CustomEvent).detail).toEqual({ value: "" });
  });

  it("panel Clear and Now actions work", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker value="2026-01-01"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    (document.querySelector(
      ".gk-date-picker-panel [data-action='clear']",
    ) as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.value).toBe("");

    el.open = true;
    await el.updateComplete;
    (document.querySelector(
      ".gk-date-picker-panel [data-action='now']",
    ) as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(el.open).toBe(false);
  });

  it("isDateDisabled blocks selection and Now", async () => {
    const el = await fixture<GkDatePicker>(html`<gk-date-picker></gk-date-picker>`);
    el.isDateDisabled = (iso) => iso === "2026-09-17";
    el.open = true;
    // navigate calendar view to Sep 2026 via internal state — set view by selecting nearby first:
    el.value = "2026-09-01";
    el.open = true;
    await el.updateComplete;
    const btn = document.querySelector(
      '.gk-date-picker-panel button[data-iso="2026-09-17"]',
    ) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

Run: `corepack pnpm --filter @gk-ui/core test`

- [ ] **Step 3: Implement styles**

`gk-date-picker.styles.ts`:

- Trigger `[part="base"]`: copy Input field chrome (surface, on-surface color, border, sizes 28/34/40, padding, focus-within, status, round, disabled opacity).
- Readonly display `[part="input"]` (div or span, not editable native input for v1 — click opens panel).
- Panel styles applied via a shared CSS text string injected on the portal node (like Message container), class `.gk-date-picker-panel`:
  - min-width ~280px; padding; surface-elevated; border; shadow; z-index 4000
  - grid 7 columns for days
  - selected: brand background
  - today: outline brand
  - disabled: opacity 0.4
  - actions row: Clear / Now text buttons

- [ ] **Step 4: Implement element**

`gk-date-picker.ts` outline (implement fully):

```ts
@customElement("gk-date-picker")
export class GkDatePicker extends LitElement {
  // props: type="date", value, format, size, placeholder, disabled, clearable,
  //        round, status, open, locale, isDateDisabled?: (iso: string) => boolean

  @state() private viewYear = /* from value or today */;
  @state() private viewMonth = /* 0-based */;

  // connected: document click + keydown Escape listeners when open
  // ensurePanel / teardownPanel on open changes (portal under body)
  // setOpen(next) updates open prop + emit gk-open-change

  private emitValue(next: string) {
    this.value = next;
    this.dispatchEvent(new CustomEvent("input", { detail: { value: next }, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent("change", { detail: { value: next }, bubbles: true, composed: true }));
  }

  // trigger click toggles open (if !disabled)
  // day click: if !isDateDisabled(iso) → emitValue(iso); setOpen(false)
  // clear (trigger or panel): emitValue(""); setOpen(false) for panel clear
  // now: iso=todayIso(); if disabled skip; else emitValue + close
  // display: value ? formatDisplay(value, format) : placeholder
  // locale maps: en weekdays Su..Sa, Clear/Now; zh-TW 日..六, 清除/現在
}
```

**Important:** Follow Input lesson — do not let stray native events confuse Vue. Trigger is not a text `<input>` that fires native input; use a button-like trigger or `div` with `role="combobox"` / `aria-expanded`.

Panel positioning v1: `position: fixed` near trigger via `getBoundingClientRect()` (below trigger, flip if needed optional — YAGNI: always below-start).

- [ ] **Step 5: Export**

```ts
import "./date-picker/gk-date-picker.js";
export { GkDatePicker } from "./date-picker/gk-date-picker.js";
export type { GkDatePickerLocale, GkDatePickerSize, GkDatePickerStatus } from "./date-picker/gk-date-picker.js";
```

Add `"./src/date-picker/gk-date-picker.ts"` to `sideEffects`.

- [ ] **Step 6: Run — expect PASS**

Run: `corepack pnpm --filter @gk-ui/core test`

- [ ] **Step 7: Commit**

```bash
git add packages/core/src/date-picker packages/core/src/index.ts packages/core/package.json
git commit -m "feat(date-picker): add gk-date-picker single date phase 1"
```

---

### Task 3: Docs + sidebar

**Files:**
- Create: `apps/docs/components/date-picker.md`
- Create: `apps/docs/zh-TW/components/date-picker.md`
- Modify: `apps/docs/.vitepress/config.ts`

**Interfaces:**
- Consumes: `gk-date-picker`

- [ ] **Step 1: Sidebar**

EN:

```ts
{
  text: "General",
  items: [{ text: "Button", link: "/components/button" }],
},
{
  text: "Data Entry",
  items: [
    { text: "Date Picker", link: "/components/date-picker" },
    { text: "Input", link: "/components/input" },
  ],
},
```

zh-TW:

```ts
{
  text: "通用",
  items: [{ text: "Button 按鈕", link: "/zh-TW/components/button" }],
},
{
  text: "資料輸入",
  items: [
    { text: "Date Picker 日期選擇", link: "/zh-TW/components/date-picker" },
    { text: "Input 輸入", link: "/zh-TW/components/input" },
  ],
},
```

- [ ] **Step 2: EN + zh-TW pages**

Use DemoCard pattern. Demos: Basic (bind `@input` with `e.detail.value`), Size, Clearable, Status/Round, Disabled + `isDateDisabled`, note that panel has Clear/Now.

EN Basic:

```vue
<script setup lang="ts">
import { ref } from "vue";
const value = ref("2026-09-17");
function onInput(e: CustomEvent<{ value: string }>) {
  value.value = e.detail.value;
}
</script>
<gk-date-picker :value="value" @input="onInput" clearable></gk-date-picker>
```

zh-TW page: `locale="zh-TW"` on demos.

Add short roadmap line: Phase 1 supports single date only; range / datetime / month / year later.

API tables for props, events, parts.

- [ ] **Step 3: Build**

Run: `corepack pnpm docs:build`

- [ ] **Step 4: Commit**

```bash
git add apps/docs/components/date-picker.md apps/docs/zh-TW/components/date-picker.md apps/docs/.vitepress/config.ts
git commit -m "docs(date-picker): add pages and Data Entry sidebar"
```

---

## Spec coverage checklist

| Spec item | Task |
|-----------|------|
| ISO helpers + month grid | 1 |
| Trigger Input-aligned + portal calendar + Clear/Now | 2 |
| isDateDisabled, open, locale, events | 2 |
| EN/zh-TW docs + Data Entry sidebar | 3 |
| Out of scope honored | all |
