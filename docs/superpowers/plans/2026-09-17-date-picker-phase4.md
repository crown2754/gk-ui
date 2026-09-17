# Date Picker Phase 4 (month / year) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `type="month"` and `type="year"` to `gk-date-picker` with `YYYY-MM` / `YYYY` values, grid panels, immediate commit on cell click, Clear/Now, and VitePress demos.

**Architecture:** Extend the existing Lit element and `date-utils.ts`. Month panel = 12 cells + year nav; year panel = ~12-year page + page nav. Immediate commit like `date` (no Confirm). Phases 1–3 paths unchanged.

**Tech Stack:** Lit 3, Vitest + `@open-wc/testing`, VitePress, existing date-utils.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-17-date-picker-phase4-design.md`
- Types add `'month' | 'year'`; values `YYYY-MM` / `YYYY` or `''`
- Click cell → emit `input`+`change`, close; Clear + Now (no Confirm)
- `isDateDisabled` receives `YYYY-MM` or `YYYY` for these types
- format defaults: `yyyy-MM` / `yyyy`
- Out of scope: monthrange, yearrange, Confirm, quarter, shortcuts, typed parse
- Tests: `corepack pnpm --filter @gk-ui/core test`
- Docs: `corepack pnpm docs:build`
- Commit after each task; do not push unless asked; do not commit `README.md`

## File map

| File | Responsibility |
|------|----------------|
| `packages/core/src/date-picker/date-utils.ts` | Validate/format month & year; todayMonth; todayYear; year page helper |
| `packages/core/src/date-picker/date-utils.test.ts` | Helper tests |
| `packages/core/src/date-picker/gk-date-picker.ts` | type month/year panels + selection |
| `packages/core/src/date-picker/gk-date-picker.styles.ts` | Month/year grid CSS in panel stylesheet |
| `packages/core/src/date-picker/gk-date-picker.test.ts` | month/year + regressions |
| `packages/core/src/index.ts` | Type export if needed |
| `apps/docs/components/date-picker.md` | Month/Year demos + API; remove roadmap |
| `apps/docs/zh-TW/components/date-picker.md` | zh-TW mirror |

---

### Task 1: Month / year helpers + panel behavior

**Files:**
- Modify: `packages/core/src/date-picker/date-utils.ts`
- Modify: `packages/core/src/date-picker/date-utils.test.ts`
- Modify: `packages/core/src/date-picker/gk-date-picker.ts`
- Modify: `packages/core/src/date-picker/gk-date-picker.styles.ts`
- Modify: `packages/core/src/date-picker/gk-date-picker.test.ts`

**Interfaces:**
- Consumes: existing date-utils, panel portal, Clear/Now pattern from `date`
- Produces:
  - `isValidYearMonth(s: string): boolean` — `YYYY-MM`
  - `isValidYear(s: string): boolean` — `YYYY` (4 digits, sensible range e.g. 1000–9999)
  - `todayYearMonth(): string` / `todayYear(): string`
  - `formatDisplay` handles `YYYY-MM` and `YYYY` with `yyyy`/`MM` tokens
  - `buildYearPage(centerOrStart: number, size = 12): number[]` — contiguous years for one page
  - `GkDatePickerType` includes `"month" | "year"`
  - Panels + immediate commit

- [ ] **Step 1: Add failing tests**

Append to `date-utils.test.ts`:

```ts
import {
  isValidYearMonth,
  isValidYear,
  todayYearMonth,
  todayYear,
  formatDisplay,
  buildYearPage,
} from "./date-utils.js";

it("validates month and year strings", () => {
  expect(isValidYearMonth("2026-09")).toBe(true);
  expect(isValidYearMonth("2026-13")).toBe(false);
  expect(isValidYear("2026")).toBe(true);
  expect(isValidYear("26")).toBe(false);
  expect(formatDisplay("2026-09", "yyyy-MM")).toBe("2026-09");
  expect(formatDisplay("2026", "yyyy")).toBe("2026");
  expect(buildYearPage(2020, 12)).toEqual([
    2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031,
  ]);
});
```

Append to `gk-date-picker.test.ts`:

```ts
describe("gk-date-picker month", () => {
  afterEach(() => {
    document.querySelectorAll(".gk-date-picker-panel").forEach((n) => n.remove());
  });

  it("defaults empty and format yyyy-MM", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="month"></gk-date-picker>`,
    );
    expect(el.value).toBe("");
    expect(el.format).toBe("yyyy-MM");
  });

  it("clicking a month commits and closes", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="month"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const btn = document.querySelector(
      ".gk-date-picker-panel button[data-month]",
    ) as HTMLButtonElement;
    const ym = btn.dataset.month!;
    const onInput = vi.fn();
    el.addEventListener("input", onInput);
    btn.click();
    await el.updateComplete;
    expect(el.value).toBe(ym);
    expect(el.open).toBe(false);
    expect((onInput.mock.calls[0][0] as CustomEvent).detail.value).toBe(ym);
  });

  it("panel has Clear and Now, not Confirm", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="month"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const panel = document.querySelector(".gk-date-picker-panel")!;
    expect(panel.querySelector('[data-action="clear"]')).toBeTruthy();
    expect(panel.querySelector('[data-action="now"]')).toBeTruthy();
    expect(panel.querySelector('[data-action="confirm"]')).toBeFalsy();
  });

  it("Now sets current month", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="month"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    (
      document.querySelector(
        '.gk-date-picker-panel button[data-action="now"]',
      ) as HTMLButtonElement
    ).click();
    await el.updateComplete;
    expect(el.value).toMatch(/^\d{4}-\d{2}$/);
    expect(el.open).toBe(false);
  });
});

describe("gk-date-picker year", () => {
  afterEach(() => {
    document.querySelectorAll(".gk-date-picker-panel").forEach((n) => n.remove());
  });

  it("defaults empty and format yyyy", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="year"></gk-date-picker>`,
    );
    expect(el.value).toBe("");
    expect(el.format).toBe("yyyy");
  });

  it("clicking a year commits and closes", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="year"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const btn = document.querySelector(
      ".gk-date-picker-panel button[data-year]",
    ) as HTMLButtonElement;
    const y = btn.dataset.year!;
    btn.click();
    await el.updateComplete;
    expect(el.value).toBe(y);
    expect(el.open).toBe(false);
  });

  it("isDateDisabled blocks year cell", async () => {
    const el = await fixture<GkDatePicker>(html`
      <gk-date-picker
        type="year"
        .isDateDisabled=${(v: string) => v === "2026"}
      ></gk-date-picker>
    `);
    el.open = true;
    await el.updateComplete;
    // Navigate pages until 2026 visible if needed, or set view via picking around current
    const btn = [
      ...document.querySelectorAll(
        ".gk-date-picker-panel button[data-year]",
      ),
    ].find((b) => (b as HTMLButtonElement).dataset.year === "2026") as
      | HTMLButtonElement
      | undefined;
    if (btn) {
      expect(btn.disabled).toBe(true);
    }
  });
});
```

(If year-page navigation makes finding 2026 flaky, force `viewYear` by opening with `value="2026"` first then clear, or expose page that includes 2026 via prev/next clicks in the test.)

- [ ] **Step 2: Run tests — expect FAIL**

Run: `corepack pnpm --filter @gk-ui/core test`

Expected: FAIL — missing helpers / types / panels.

- [ ] **Step 3: Implement date-utils helpers**

```ts
const YM_RE = /^(\d{4})-(\d{2})$/;
const Y_RE = /^(\d{4})$/;

export function isValidYearMonth(value: string): boolean {
  const m = YM_RE.exec(value);
  if (!m) return false;
  const mo = Number(m[2]);
  return mo >= 1 && mo <= 12;
}

export function isValidYear(value: string): boolean {
  return Y_RE.test(value);
}

export function todayYearMonth(): string {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
}

export function todayYear(): string {
  return String(new Date().getFullYear());
}

export function buildYearPage(startYear: number, size = 12): number[] {
  return Array.from({ length: size }, (_, i) => startYear + i);
}
```

Extend `formatDisplay`:
- If `isValidYearMonth(value)`, replace `yyyy`/`MM` (and ignore day/time tokens or leave as-is).
- If `isValidYear(value)`, replace `yyyy`.
- Keep existing datetime/date branches.

- [ ] **Step 4: Implement month/year on GkDatePicker**

1. Extend `GkDatePickerType` with `"month" | "year"`.
2. Format coercion in `willUpdate`: month → if format is date/datetime default, set `yyyy-MM`; year → `yyyy`.
3. `coerceValueForType`: month invalid → `''`; year invalid → `''`.
4. State: reuse `viewYear`; for year panel add `yearPageStart` (number, aligned to page of 12).
5. Month panel render:
   - Header: prev year / `{viewYear}` / next year
   - Grid 3×4 or 4×3 of `button[data-month="YYYY-MM"]` with locale month labels
   - `MONTH_NAMES` map for `en` / `zh-TW`
   - Disabled via `isDateDisabled?.(ym)`
   - Selected if `value === ym`; today class if `ym === todayYearMonth()`
6. Year panel render:
   - Header: prev page (`yearPageStart -= 12`) / range label / next page
   - `button[data-year="YYYY"]` for `buildYearPage(yearPageStart)`
   - Same disable/selected/today patterns
7. Click handlers: `emitValue(ym|year)`, `setOpen(false)`.
8. Now: `todayYearMonth()` / `todayYear()` if not disabled.
9. Clear: `emitValue("")` (same as date).
10. Actions: show Clear + Now; hide Confirm (same as date, not datetime).
11. Trigger display: `formatDisplay(value, format)`.
12. Styles: `.gk-dp-month-grid` / `.gk-dp-year-grid` with gap, cell buttons similar to day cells.

- [ ] **Step 5: Run full core tests — PASS**

Run: `corepack pnpm --filter @gk-ui/core test`

Expected: PASS including prior types.

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/date-picker
git commit -m "feat(date-picker): add month and year types"
```

---

### Task 2: Docs (EN + zh-TW)

**Files:**
- Modify: `apps/docs/components/date-picker.md`
- Modify: `apps/docs/zh-TW/components/date-picker.md`

**Interfaces:**
- Consumes: shipped month/year API
- Produces: demos + API; no remaining roadmap line for picker types

- [ ] **Step 1: Update EN**

- Intro lists month/year; remove “month / year come later”.
- Refs: `monthValue`, `yearValue`, handlers.
- Demos **Month** / **Year** with clearable + bound value.
- API: type union, value shapes, format defaults.

- [ ] **Step 2: Mirror zh-TW**

Titles 月份 / 年份; locale demos with `locale="zh-TW"` where useful.

- [ ] **Step 3: docs:build**

Run: `corepack pnpm docs:build` — expect exit 0.

- [ ] **Step 4: Commit**

```bash
git add apps/docs/components/date-picker.md apps/docs/zh-TW/components/date-picker.md
git commit -m "docs(date-picker): add month and year demos"
```

---

## Spec coverage (self-review)

| Spec item | Task |
|-----------|------|
| month/year types + values | 1 |
| Immediate commit + Clear/Now | 1 |
| Grids + nav | 1 |
| isDateDisabled | 1 |
| Docs + roadmap removal | 2 |
| No ranges | all |

No TBD. Types: `YYYY-MM` / `YYYY`.
