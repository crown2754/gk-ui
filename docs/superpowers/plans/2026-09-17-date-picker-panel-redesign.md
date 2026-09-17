# Date Picker Panel Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `gk-date-picker` panels: dual-month for ranges, year/month chevrons, editable panel date/time fields, Confirm for `daterange`/`datetime`/`datetimerange`; remove H/M/S columns; default separator ` → `.

**Architecture:** Extend existing Lit element and panel CSS. Shared helpers for month nav and field parse. Value formats unchanged. Update tests that assumed immediate `daterange` commit or `data-h` columns.

**Tech Stack:** Lit 3, Vitest + `@open-wc/testing`, VitePress.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-17-date-picker-panel-redesign.md`
- Value shapes unchanged (ISO date / datetime / pairs)
- `daterange`: draft until Confirm (breaking)
- Remove H/M/S columns; time via `HH:mm:ss` text fields
- Dual month for `daterange` / `datetimerange` only
- `date`: still immediate day commit; panel may show one date field
- `separator` default `' → '`
- Tokens only (no hard-coded teal)
- `month` / `year` unchanged
- Tests: `corepack pnpm --filter @gk-ui/core test`
- Docs: `corepack pnpm docs:build`
- Commit after each task; do not push; do not commit `README.md`

## File map

| File | Responsibility |
|------|----------------|
| `packages/core/src/date-picker/date-utils.ts` | `isValidTime`, parse time, optional month nav helpers |
| `packages/core/src/date-picker/date-utils.test.ts` | Time parse tests |
| `packages/core/src/date-picker/gk-date-picker.ts` | Dual calendar, fields, Confirm for daterange, remove columns |
| `packages/core/src/date-picker/gk-date-picker.styles.ts` | Dual layout, panel fields, nav chevrons |
| `packages/core/src/date-picker/gk-date-picker.test.ts` | Update + new tests |
| `apps/docs/components/date-picker.md` | Breaking notes + demos copy |
| `apps/docs/zh-TW/components/date-picker.md` | zh-TW mirror |

---

### Task 1: Dual-month range + Confirm + panel date fields + separator

**Files:**
- Modify: `packages/core/src/date-picker/gk-date-picker.ts`
- Modify: `packages/core/src/date-picker/gk-date-picker.styles.ts`
- Modify: `packages/core/src/date-picker/gk-date-picker.test.ts`

**Interfaces:**
- Consumes: existing range draft/stash, `buildMonthGrid`, `addMonths`
- Produces:
  - Default `separator = " → "`
  - Dual calendars in panel for `daterange` / `datetimerange` (`.gk-dp-calendars` with two `.gk-dp-cal`)
  - Headers with `data-nav="prev-year"|"prev-month"|"next-month"|"next-year"` (apply to left view; right = left+1)
  - `daterange` day clicks only update draft; Confirm commits (like datetimerange)
  - Panel fields: `input[data-field="start-date"]`, `end-date` (and for date: `data-field="date"`); blur/Enter parse
  - `date` panel optional single date field synced with selection

- [ ] **Step 1: Update / add failing tests**

Change existing daterange “two-click selection sets ordered pair and emits” to expect **no commit until Confirm**:

```ts
it("two-click selection does not commit until Confirm", async () => {
  const el = await fixture<GkDatePicker>(
    html`<gk-date-picker type="daterange"></gk-date-picker>`,
  );
  el.open = true;
  await el.updateComplete;
  const inMonth = [
    ...document.querySelectorAll(
      ".gk-date-picker-panel button[data-iso]:not(.is-outside):not([disabled])",
    ),
  ] as HTMLButtonElement[];
  // Prefer days on left calendar if dual: query .gk-dp-cal or first calendar region
  const a = inMonth[5];
  const b = inMonth[10];
  a.click();
  await el.updateComplete;
  b.click();
  await el.updateComplete;
  expect(el.value).toBeNull();
  expect(el.open).toBe(true);
  (
    document.querySelector(
      '.gk-date-picker-panel button[data-action="confirm"]',
    ) as HTMLButtonElement
  ).click();
  await el.updateComplete;
  expect(el.value).not.toBeNull();
  expect(el.open).toBe(false);
});
```

Add:

```ts
it("renders dual calendars for daterange", async () => {
  const el = await fixture<GkDatePicker>(
    html`<gk-date-picker type="daterange"></gk-date-picker>`,
  );
  el.open = true;
  await el.updateComplete;
  expect(
    document.querySelectorAll(".gk-date-picker-panel .gk-dp-cal").length,
  ).toBe(2);
});

it("default separator is arrow", async () => {
  const el = await fixture<GkDatePicker>(
    html`<gk-date-picker type="daterange"></gk-date-picker>`,
  );
  expect(el.separator).toBe(" → ");
});

it("daterange panel has Confirm", async () => {
  const el = await fixture<GkDatePicker>(
    html`<gk-date-picker type="daterange"></gk-date-picker>`,
  );
  el.open = true;
  await el.updateComplete;
  expect(
    document.querySelector('.gk-date-picker-panel button[data-action="confirm"]'),
  ).toBeTruthy();
});
```

Update any other daterange tests that assumed immediate commit after two clicks (swap test, restart tests, etc.) to click Confirm where needed.

- [ ] **Step 2: Run tests — expect FAIL**

Run: `corepack pnpm --filter @gk-ui/core test`

- [ ] **Step 3: Implement**

1. `separator = " → "`
2. State: keep `viewYear`/`viewMonth` as left month; right = `addMonths(left, 1)`.
3. `shiftView(deltaMonths)` / `shiftViewYears(deltaYears)` for nav buttons.
4. `renderMonthCalendar(year, month)` helper returning one calendar block with nav + grid.
5. Range panel body:
   ```html
   <div class="gk-dp-fields" part="panel-fields">...</div>
   <div class="gk-dp-calendars">
     ${renderMonthCalendar(left)}
     ${renderMonthCalendar(right)}
   </div>
   ```
6. `daterange` `onDayClick`: draft only (mirror datetimerange date-only drafts using ISO dates); show Confirm; `onPanelConfirm` emits pair.
7. Panel date inputs: bind draft strings; `@change`/`@keydown.enter` parse with `isValidIsoDate`.
8. Styles: flex dual calendars; field row; nav button group.
9. Keep `datetimerange` still using time columns for now if Task 2 not done — OR stub Confirm path only. Prefer: Task 1 updates daterange fully; datetimerange gets dual month + date fields but may still have columns until Task 2 (document in report). **Better:** Task 1 also switches datetimerange calendar to dual-month layout while leaving columns temporarily so layout tests pass; Task 2 removes columns.

- [ ] **Step 4: Tests PASS**

Run: `corepack pnpm --filter @gk-ui/core test`

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/date-picker
git commit -m "feat(date-picker): dual-month range panel with Confirm and date fields"
```

---

### Task 2: Replace time columns with panel time fields

**Files:**
- Modify: `packages/core/src/date-picker/date-utils.ts`
- Modify: `packages/core/src/date-picker/date-utils.test.ts`
- Modify: `packages/core/src/date-picker/gk-date-picker.ts`
- Modify: `packages/core/src/date-picker/gk-date-picker.styles.ts`
- Modify: `packages/core/src/date-picker/gk-date-picker.test.ts`

**Interfaces:**
- Consumes: Task 1 dual layout + drafts
- Produces:
  - `isValidTime(s: string): boolean` — `HH:mm:ss`
  - `parseTime` / combine with date via `toDateTime`
  - Panel fields `start-time` / `end-time` / `time` for datetime types
  - Remove `timeColumns()`, `data-h`/`data-m`/`data-s`, `.gk-dp-time` usage
  - Update datetime tests that click `data-h="14"` to set time via field instead

- [ ] **Step 1: Failing util + component tests**

```ts
it("validates HH:mm:ss", () => {
  expect(isValidTime("13:45:15")).toBe(true);
  expect(isValidTime("24:00:00")).toBe(false);
});
```

Replace datetime “Confirm commits selected day and time draft” to fill `input[data-field="time"]` with `14:00:00` (or start-time) then Confirm.

Assert panel has **no** `button[data-h]`.

- [ ] **Step 2: FAIL then implement helpers + wire fields; delete column UI**

- [ ] **Step 3: PASS full suite**

- [ ] **Step 4: Commit**

```bash
git add packages/core/src/date-picker
git commit -m "feat(date-picker): replace time columns with panel time fields"
```

---

### Task 3: Docs EN + zh-TW

**Files:**
- Modify: `apps/docs/components/date-picker.md`
- Modify: `apps/docs/zh-TW/components/date-picker.md`

- [ ] **Step 1:** Document dual month, Confirm for ranges, panel fields, separator default, breaking notes for daterange / removed columns.

- [ ] **Step 2:** zh-TW mirror.

- [ ] **Step 3:** `corepack pnpm docs:build` exit 0.

- [ ] **Step 4: Commit**

```bash
git add apps/docs/components/date-picker.md apps/docs/zh-TW/components/date-picker.md
git commit -m "docs(date-picker): document dual-month panel redesign"
```

---

## Spec coverage

| Spec item | Task |
|-----------|------|
| Dual month + nav | 1 |
| daterange Confirm | 1 |
| Panel date fields | 1 |
| Separator default | 1 |
| Time text fields, no columns | 2 |
| Docs / breaking notes | 3 |
| date immediate commit | 1 (preserve) |
| month/year untouched | all |
