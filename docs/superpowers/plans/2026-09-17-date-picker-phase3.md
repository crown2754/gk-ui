# Date Picker Phase 3 (datetime / datetimerange) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `type="datetime"` and `type="datetimerange"` to `gk-date-picker` with local `YYYY-MM-DD HH:mm:ss` values, calendar + H/M/S columns, Confirm-gated commit, and VitePress demos.

**Architecture:** Extend the existing Lit element. Add datetime helpers in `date-utils.ts`. Keep draft state until Confirm (Now/Clear still commit immediately). Phase 1/2 paths must stay intact. Time UI is private (no public `gk-time-picker`).

**Tech Stack:** Lit 3, Vitest + `@open-wc/testing`, VitePress, existing date-utils.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-17-date-picker-phase3-design.md`
- `type`: `'date' | 'daterange' | 'datetime' | 'datetimerange'`
- Datetime value: `'YYYY-MM-DD HH:mm:ss'` or `''`; datetimerange: `[string, string] | null` (attribute JSON)
- Commit: draft until **Confirm**; **Now** / **Clear** commit immediately
- Actions: datetime = Clear + Now + Confirm; datetimerange = Clear + Confirm
- Default time when day picked with no time yet: `00:00:00`
- `isDateDisabled(isoDate)` uses date portion only (`YYYY-MM-DD`)
- `format` tokens: existing + `HH` `mm` `ss`; datetime types default format `yyyy-MM-dd HH:mm:ss`
- Out of scope: public TimePicker, timezones, dual month, shortcuts, typed parse, `isTimeDisabled`
- Tests: `corepack pnpm --filter @gk-ui/core test`
- Docs: `corepack pnpm docs:build`
- Commit after each task; do not push unless asked. Do not commit `README.md`.

## File map

| File | Responsibility |
|------|----------------|
| `packages/core/src/date-picker/date-utils.ts` | Parse/format/compare datetime strings; date portion helper |
| `packages/core/src/date-picker/date-utils.test.ts` | Helper unit tests |
| `packages/core/src/date-picker/gk-date-picker.ts` | Types, draft/confirm, time columns, actions |
| `packages/core/src/date-picker/gk-date-picker.styles.ts` | Panel layout + time column CSS |
| `packages/core/src/date-picker/gk-date-picker.test.ts` | datetime + datetimerange + regressions |
| `packages/core/src/index.ts` | Export updated `GkDatePickerType` if needed |
| `apps/docs/components/date-picker.md` | Datetime / Datetimerange demos + API |
| `apps/docs/zh-TW/components/date-picker.md` | zh-TW mirror |

---

### Task 1: Datetime helpers + `type="datetime"` behavior

**Files:**
- Modify: `packages/core/src/date-picker/date-utils.ts`
- Modify: `packages/core/src/date-picker/date-utils.test.ts`
- Modify: `packages/core/src/date-picker/gk-date-picker.ts`
- Modify: `packages/core/src/date-picker/gk-date-picker.styles.ts`
- Modify: `packages/core/src/date-picker/gk-date-picker.test.ts`
- Modify: `packages/core/src/index.ts` (only if type export needs update)

**Interfaces:**
- Consumes: existing `isValidIsoDate`, `toIsoDate`, `formatDisplay`, panel portal
- Produces:
  - `isValidDateTime(s: string): boolean` — matches `YYYY-MM-DD HH:mm:ss`
  - `parseDateTime(s: string): { date: string; h: number; m: number; s: number } | null`
  - `toDateTime(dateIso: string, h: number, m: number, s: number): string`
  - `todayDateTime(): string` — local now truncated to seconds
  - `datePart(s: string): string` — `YYYY-MM-DD` from date or datetime
  - `compareDateTime(a: string, b: string): number`
  - `formatDisplay` extended to replace `HH`/`mm`/`ss` when present in format string (date-only values leave time tokens empty or omit — for datetime values fill them)
  - `GkDatePickerType` includes `"datetime"`
  - Panel: time columns + Confirm; draft until Confirm

- [ ] **Step 1: Add failing datetime util + component tests**

Append to `date-utils.test.ts`:

```ts
import {
  isValidDateTime,
  parseDateTime,
  toDateTime,
  datePart,
  compareDateTime,
  formatDisplay,
} from "./date-utils.js";

it("validates and builds datetime strings", () => {
  expect(isValidDateTime("2026-09-17 14:30:00")).toBe(true);
  expect(isValidDateTime("2026-09-17")).toBe(false);
  expect(toDateTime("2026-09-17", 14, 30, 5)).toBe("2026-09-17 14:30:05");
  expect(parseDateTime("2026-09-17 14:30:05")).toEqual({
    date: "2026-09-17",
    h: 14,
    m: 30,
    s: 5,
  });
  expect(datePart("2026-09-17 14:30:00")).toBe("2026-09-17");
  expect(compareDateTime("2026-09-17 10:00:00", "2026-09-17 09:00:00")).toBe(1);
  expect(formatDisplay("2026-09-17 14:30:05", "yyyy-MM-dd HH:mm:ss")).toBe(
    "2026-09-17 14:30:05",
  );
});
```

Append to `gk-date-picker.test.ts`:

```ts
describe("gk-date-picker datetime", () => {
  afterEach(() => {
    document.querySelectorAll(".gk-date-picker-panel").forEach((n) => n.remove());
  });

  it("defaults empty string and format with time", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="datetime"></gk-date-picker>`,
    );
    expect(el.value).toBe("");
    expect(el.format).toBe("yyyy-MM-dd HH:mm:ss");
  });

  it("does not commit until Confirm", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="datetime"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const day = document.querySelector(
      ".gk-date-picker-panel button[data-iso]:not(.is-outside):not([disabled])",
    ) as HTMLButtonElement;
    const iso = day.dataset.iso!;
    day.click();
    await el.updateComplete;
    expect(el.value).toBe("");
    expect(el.open).toBe(true);
    const confirm = document.querySelector(
      '.gk-date-picker-panel button[data-action="confirm"]',
    ) as HTMLButtonElement;
    confirm.click();
    await el.updateComplete;
    expect(el.value).toBe(`${iso} 00:00:00`);
    expect(el.open).toBe(false);
  });

  it("Now commits immediately", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="datetime"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const onInput = vi.fn();
    el.addEventListener("input", onInput);
    (
      document.querySelector(
        '.gk-date-picker-panel button[data-action="now"]',
      ) as HTMLButtonElement
    ).click();
    await el.updateComplete;
    expect(typeof el.value).toBe("string");
    expect(el.value as string).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    expect(el.open).toBe(false);
    expect(onInput).toHaveBeenCalled();
  });

  it("Escape discards draft", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="datetime" value="2026-09-17 08:00:00"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const day = [
      ...document.querySelectorAll(
        ".gk-date-picker-panel button[data-iso]:not(.is-outside):not([disabled])",
      ),
    ].find((b) => (b as HTMLButtonElement).dataset.iso !== "2026-09-17") as
      | HTMLButtonElement
      | undefined;
    day?.click();
    await el.updateComplete;
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe("2026-09-17 08:00:00");
    expect(el.open).toBe(false);
  });

  it("panel has Clear, Now, Confirm", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="datetime"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const panel = document.querySelector(".gk-date-picker-panel")!;
    expect(panel.querySelector('[data-action="clear"]')).toBeTruthy();
    expect(panel.querySelector('[data-action="now"]')).toBeTruthy();
    expect(panel.querySelector('[data-action="confirm"]')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `corepack pnpm --filter @gk-ui/core test`

Expected: FAIL — missing datetime helpers / Confirm / type.

- [ ] **Step 3: Implement date-utils datetime helpers**

In `date-utils.ts` add:

```ts
const DT_RE = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

export function isValidDateTime(value: string): boolean {
  const m = DT_RE.exec(value);
  if (!m) return false;
  if (!isValidIsoDate(`${m[1]}-${m[2]}-${m[3]}`)) return false;
  const h = Number(m[4]);
  const mi = Number(m[5]);
  const s = Number(m[6]);
  return h <= 23 && mi <= 59 && s <= 59;
}

export function parseDateTime(
  value: string,
): { date: string; h: number; m: number; s: number } | null {
  if (!isValidDateTime(value)) return null;
  const m = DT_RE.exec(value)!;
  return {
    date: `${m[1]}-${m[2]}-${m[3]}`,
    h: Number(m[4]),
    m: Number(m[5]),
    s: Number(m[6]),
  };
}

export function toDateTime(
  dateIso: string,
  h: number,
  m: number,
  s: number,
): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${dateIso} ${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function todayDateTime(): string {
  const n = new Date();
  return toDateTime(toIsoDate(n), n.getHours(), n.getMinutes(), n.getSeconds());
}

export function datePart(value: string): string {
  if (isValidIsoDate(value)) return value;
  const dt = parseDateTime(value);
  return dt ? dt.date : "";
}

export function compareDateTime(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}
```

Extend `formatDisplay` so when `iso` is a datetime (or when format has time tokens and value is datetime), replace `HH`/`mm`/`ss`. Keep date-only `formatDisplay("2026-09-17", "yyyy-MM-dd")` unchanged. Preferred approach:

```ts
export function formatDisplay(value: string, format: string): string {
  const dt = parseDateTime(value);
  if (dt) {
    const pad = (n: number) => String(n).padStart(2, "0");
    return format
      .replace(/yyyy/g, dt.date.slice(0, 4))
      .replace(/MM/g, dt.date.slice(5, 7))
      .replace(/dd/g, dt.date.slice(8, 10))
      .replace(/HH/g, pad(dt.h))
      .replace(/mm/g, pad(dt.m))
      .replace(/ss/g, pad(dt.s));
  }
  if (!isValidIsoDate(value)) return "";
  const [yyyy, MM, dd] = value.split("-");
  return format
    .replace(/yyyy/g, yyyy)
    .replace(/MM/g, MM)
    .replace(/dd/g, dd)
    .replace(/HH/g, "00")
    .replace(/mm/g, "00")
    .replace(/ss/g, "00");
}
```

(If date-only + time tokens in format is undesirable, strip time tokens for date-only — either is fine as long as datetime display works.)

- [ ] **Step 4: Implement `datetime` on GkDatePicker**

Key changes in `gk-date-picker.ts`:

1. `GkDatePickerType = "date" | "daterange" | "datetime" | "datetimerange"`
2. `LABELS` add `confirm: "Confirm" | "確認"`
3. `parseRangeAttr` / `isRangePair`: accept datetime strings when type is datetimerange (Task 2 can finish range; for Task 1 at least support datetime single value in converter — if attr looks like `[` use range parser that validates with `isValidDateTime` OR `isValidIsoDate` depending on type; simplest: validate with `isValidDateTime` for pairs when either string has a space, else `isValidIsoDate`)
4. On `type` change / connected: if `datetime` and format still default date-only, set format to `yyyy-MM-dd HH:mm:ss` (mirror: when switching to datetime, if format === `yyyy-MM-dd` upgrade; when leaving datetime family, optional downgrade — keep simple: `willUpdate` when type becomes datetime/datetimerange and format is `yyyy-MM-dd`, set `yyyy-MM-dd HH:mm:ss`)
5. State drafts:
   - `draftDate: string | null`
   - `draftH`, `draftM`, `draftS` (numbers)
6. Open panel for datetime: init draft from `value` if valid datetime, else null date + 0:0:0
7. Day click (datetime): set `draftDate`; do **not** emit or close
8. Time column buttons: set draftH/M/S; re-render
9. Confirm: if `draftDate`, `emitValue(toDateTime(...))`, close
10. Now: if today not disabled via `datePart`/`todayIso`, `emitValue(todayDateTime())`, close
11. Clear: `emitValue("")`, close
12. Dismiss (outside/Esc): clear draft only; restore no value change
13. Render panel body: flex row calendar | `.gk-dp-time` with three columns of buttons `data-h` / `data-m` / `data-s` (0–23 / 0–59 / 0–59). Use `part="time"`
14. Actions: show Now for datetime; always show Confirm for datetime; `data-action="confirm"`
15. Trigger display: `formatDisplay` with current format
16. `coerceValueForType`: datetime → string `''` if invalid
17. Keep `date` / `daterange` branches unchanged (day click still immediate commit for those)

Styles (`datePickerPanelCssText`):

```css
.gk-dp-body { display: flex; gap: 8px; }
.gk-dp-time { display: flex; gap: 4px; max-height: 240px; }
.gk-dp-time-col {
  overflow-y: auto;
  width: 2.5rem;
  border-left: 1px solid var(--gk-color-outline-variant, #ccc);
}
.gk-dp-time-col button {
  display: block; width: 100%; border: 0; background: transparent;
  padding: 4px 0; cursor: pointer;
}
.gk-dp-time-col button.is-active {
  background: var(--gk-color-brand, #3b82f6);
  color: #fff;
}
```

- [ ] **Step 5: Run tests — expect PASS for Task 1 scope**

Run: `corepack pnpm --filter @gk-ui/core test`

Expected: all existing + new datetime tests PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/date-picker packages/core/src/index.ts
git commit -m "feat(date-picker): add datetime type with confirm and time columns"
```

---

### Task 2: `type="datetimerange"` behavior

**Files:**
- Modify: `packages/core/src/date-picker/gk-date-picker.ts`
- Modify: `packages/core/src/date-picker/gk-date-picker.test.ts`
- Modify: `packages/core/src/date-picker/date-utils.ts` (only if range helpers needed)

**Interfaces:**
- Consumes: Task 1 helpers + existing range draft/stash pattern
- Produces: `datetimerange` value `[string, string] | null`; Confirm commits pair; time column binds to active end

- [ ] **Step 1: Add failing datetimerange tests**

```ts
describe("gk-date-picker datetimerange", () => {
  afterEach(() => {
    document.querySelectorAll(".gk-date-picker-panel").forEach((n) => n.remove());
  });

  it("defaults value null", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="datetimerange"></gk-date-picker>`,
    );
    expect(el.value).toBeNull();
  });

  it("two days + Confirm sets ordered pair", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="datetimerange"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const inMonth = [
      ...document.querySelectorAll(
        ".gk-date-picker-panel button[data-iso]:not(.is-outside):not([disabled])",
      ),
    ] as HTMLButtonElement[];
    const a = inMonth[5];
    const b = inMonth[10];
    const isoA = a.dataset.iso!;
    const isoB = b.dataset.iso!;
    a.click();
    await el.updateComplete;
    b.click();
    await el.updateComplete;
    expect(el.value).toBeNull(); // not committed yet
    (
      document.querySelector(
        '.gk-date-picker-panel button[data-action="confirm"]',
      ) as HTMLButtonElement
    ).click();
    await el.updateComplete;
    const pair = el.value as [string, string];
    expect(pair[0] <= pair[1]).toBe(true);
    expect(datePart(pair[0])).toBe(isoA < isoB ? isoA : isoB);
    expect(datePart(pair[1])).toBe(isoA < isoB ? isoB : isoA);
    expect(el.open).toBe(false);
  });

  it("panel has Clear and Confirm but not Now", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="datetimerange"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    const panel = document.querySelector(".gk-date-picker-panel")!;
    expect(panel.querySelector('[data-action="clear"]')).toBeTruthy();
    expect(panel.querySelector('[data-action="confirm"]')).toBeTruthy();
    expect(panel.querySelector('[data-action="now"]')).toBeFalsy();
  });

  it("Clear sets null", async () => {
    const el = await fixture<GkDatePicker>(html`
      <gk-date-picker
        type="datetimerange"
        .value=${["2026-09-01 00:00:00", "2026-09-10 12:00:00"]}
      ></gk-date-picker>
    `);
    el.open = true;
    await el.updateComplete;
    (
      document.querySelector(
        '.gk-date-picker-panel button[data-action="clear"]',
      ) as HTMLButtonElement
    ).click();
    await el.updateComplete;
    expect(el.value).toBeNull();
  });
});
```

Import `datePart` in the test file from `./date-utils.js`.

- [ ] **Step 2: Run tests — expect FAIL**

Run: `corepack pnpm --filter @gk-ui/core test`

Expected: FAIL on datetimerange cases.

- [ ] **Step 3: Implement datetimerange**

1. Treat `datetimerange` like `daterange` for empty value (`null`), placeholders, separator display, range cell highlighting (compare **date** parts for in-range fill).
2. Draft: `rangeDraftStartDt: string | null` (full datetime), `rangeDraftEndDt: string | null`, plus which end is active for time columns (`"start" | "end"`).
3. Day click: first sets start datetime (`iso 00:00:00` or keep existing time if re-edit); second sets end; if end < start swap full strings via `compareDateTime`.
4. After complete draft pair exists, first new day click resets to new start (stash previous committed value for dismiss restore — same as phase 2 stash idea).
5. Time columns edit the **active** end's H/M/S.
6. Confirm: both ends present → `emitValue([start, end])`, close.
7. Clear: `emitValue(null)`.
8. No Now button.
9. Dismiss: discard draft; restore stash / committed value like phase 2.
10. `isRangePair` for datetimerange: both `isValidDateTime`.
11. Converter `parseRangeAttr`: accept ISO date **or** datetime pairs (branch: if `isValidDateTime(v[0])` use datetime validation; elseif `isValidIsoDate` for date range).

- [ ] **Step 4: Run full core tests — PASS**

Run: `corepack pnpm --filter @gk-ui/core test`

Expected: PASS (including date / daterange regressions).

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/date-picker
git commit -m "feat(date-picker): add datetimerange with confirm"
```

---

### Task 3: Docs (EN + zh-TW)

**Files:**
- Modify: `apps/docs/components/date-picker.md`
- Modify: `apps/docs/zh-TW/components/date-picker.md`

**Interfaces:**
- Consumes: shipped `datetime` / `datetimerange` API
- Produces: demos + API tables; roadmap = month / year only

- [ ] **Step 1: Update EN docs**

- Intro: mention datetime types; roadmap month/year only.
- Add refs: `datetimeValue`, `dateTimeRange`, handlers.
- Demo **Datetime**: `type="datetime"` clearable, show bound value.
- Demo **Datetimerange**: `type="datetimerange"`, start/end placeholders, show pair.
- API table: extend `type`, value shapes, format tokens `HH`/`mm`/`ss`, Confirm action.

- [ ] **Step 2: Mirror zh-TW**

Same structure; Confirm = 確認; section titles localized.

- [ ] **Step 3: Build docs**

Run: `corepack pnpm docs:build`

Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add apps/docs/components/date-picker.md apps/docs/zh-TW/components/date-picker.md
git commit -m "docs(date-picker): add datetime and datetimerange demos"
```

---

## Spec coverage (self-review)

| Spec item | Task |
|-----------|------|
| `datetime` / `datetimerange` types | 1, 2 |
| Value formats | 1, 2 |
| Confirm / Now / Clear rules | 1, 2 |
| Time columns H/M/S | 1 |
| Active-end time for range | 2 |
| `isDateDisabled` date-only | 1 (reuse) |
| Esc discard draft | 1, 2 |
| Docs + roadmap | 3 |
| No public TimePicker | all |

No TBD placeholders. Types consistent: `YYYY-MM-DD HH:mm:ss`, `[string, string] | null`.
