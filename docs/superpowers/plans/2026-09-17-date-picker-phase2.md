# Date Picker Phase 2 (daterange) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `type="daterange"` to `gk-date-picker` with `[start, end] | null` value, two-click selection, range highlight, Clear-only panel actions, and Range demos.

**Architecture:** Extend the existing Lit element and panel renderer. Introduce a Lit `value` converter that branches on `type`. Keep phase-1 `type=date` paths intact. Optional small helpers in `date-utils.ts` for range compare / in-range checks.

**Tech Stack:** Lit 3, Vitest + `@open-wc/testing`, VitePress, existing date-utils.

## Global Constraints

- `type`: `'date' | 'daterange'`; date value stays `string`; range value is `[string, string] | null` (attribute JSON).
- Two-click start→end; swap if end < start; complete emits `input`+`change` and closes.
- First click after a complete range starts a new range (Naive-like).
- Range panel: **Clear only** (hide Now).
- `separator` default `' - '`; `start-placeholder` / `end-placeholder`.
- Same `isDateDisabled(iso)` for both ends.
- Out of scope: dual month, datetime, shortcuts, confirm.
- Phase 1 date tests must still pass.
- Tests: `corepack pnpm --filter @gk-ui/core test`
- Docs: `corepack pnpm docs:build`
- Commit after each task; do not push unless asked. Do not commit README.md.

## File map

| File | Responsibility |
|------|----------------|
| `packages/core/src/date-picker/date-utils.ts` | Optional `compareIso`, `isIsoInRange` |
| `packages/core/src/date-picker/date-utils.test.ts` | Helper tests if added |
| `packages/core/src/date-picker/gk-date-picker.ts` | type daterange + selection state |
| `packages/core/src/date-picker/gk-date-picker.styles.ts` | in-range / start / end cell classes |
| `packages/core/src/date-picker/gk-date-picker.test.ts` | Range + regression tests |
| `packages/core/src/index.ts` | Export updated types |
| `apps/docs/components/date-picker.md` | Range demo + API |
| `apps/docs/zh-TW/components/date-picker.md` | zh-TW Range demo + API |

---

### Task 1: Range value + selection behavior

**Files:**
- Modify: `packages/core/src/date-picker/date-utils.ts` (optional helpers)
- Modify: `packages/core/src/date-picker/date-utils.test.ts` (if helpers added)
- Modify: `packages/core/src/date-picker/gk-date-picker.ts`
- Modify: `packages/core/src/date-picker/gk-date-picker.styles.ts` / panel CSS text
- Modify: `packages/core/src/date-picker/gk-date-picker.test.ts`
- Modify: `packages/core/src/index.ts` (types only if needed)

**Interfaces:**
- Consumes: existing date-utils + GkDatePicker
- Produces: `GkDatePickerType = "date" | "daterange"`; `value` union; `separator`, `startPlaceholder`, `endPlaceholder`; range selection UX

- [ ] **Step 1: Add failing range tests**

Append to `gk-date-picker.test.ts`:

```ts
describe("gk-date-picker daterange", () => {
  afterEach(() => {
    document.querySelectorAll(".gk-date-picker-panel").forEach((n) => n.remove());
  });

  it("defaults value null for daterange", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="daterange"></gk-date-picker>`,
    );
    expect(el.value).toBeNull();
  });

  it("two-click selection sets ordered pair and emits", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="daterange"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    // Force view to Sep 2026 via selecting start nearby — set internal view:
    el.value = null;
    // Navigate: use day buttons that exist after opening with default view.
    // Prefer setting a property if exposed, or click next until Sep 2026,
    // OR open with a pre-seeded incomplete state by calling private via days in current month.
    // Practical approach: set type daterange, open, query any two in-month days by data-iso.
    const days = [
      ...document.querySelectorAll(
        ".gk-date-picker-panel button[data-iso]:not([disabled])",
      ),
    ] as HTMLButtonElement[];
    const inMonth = days.filter((b) => !b.classList.contains("is-outside"));
    const a = inMonth[5];
    const b = inMonth[10];
    const isoA = a.dataset.iso!;
    const isoB = b.dataset.iso!;
    const onInput = vi.fn();
    el.addEventListener("input", onInput);
    a.click();
    await el.updateComplete;
    expect(el.open).toBe(true); // waiting for end
    b.click();
    await el.updateComplete;
    const [start, end] = el.value as [string, string];
    expect(start <= end).toBe(true);
    expect([start, end].sort().join()).toBe([isoA, isoB].sort().join());
    expect(el.open).toBe(false);
    expect((onInput.mock.calls[0][0] as CustomEvent).detail.value).toEqual([
      start,
      end,
    ]);
  });

  it("swaps when second click is before first", async () => {
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
    const later = inMonth[12];
    const earlier = inMonth[3];
    later.click();
    await el.updateComplete;
    earlier.click();
    await el.updateComplete;
    const [start, end] = el.value as [string, string];
    expect(start).toBe(earlier.dataset.iso);
    expect(end).toBe(later.dataset.iso);
  });

  it("clear sets null", async () => {
    const el = await fixture<GkDatePicker>(html`
      <gk-date-picker
        type="daterange"
        clearable
        .value=${["2026-09-01", "2026-09-10"]}
      ></gk-date-picker>
    `);
    const spy = vi.fn();
    el.addEventListener("input", spy);
    (el.shadowRoot?.querySelector("button[part='clear']") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.value).toBeNull();
    expect((spy.mock.calls[0][0] as CustomEvent).detail.value).toBeNull();
  });

  it("range panel has Clear but not Now", async () => {
    const el = await fixture<GkDatePicker>(
      html`<gk-date-picker type="daterange"></gk-date-picker>`,
    );
    el.open = true;
    await el.updateComplete;
    expect(
      document.querySelector(".gk-date-picker-panel [data-action='clear']"),
    ).not.toBeNull();
    expect(
      document.querySelector(".gk-date-picker-panel [data-action='now']"),
    ).toBeNull();
  });
});
```

Keep existing `type=date` tests green.

- [ ] **Step 2: Run — expect FAIL**

Run: `corepack pnpm --filter @gk-ui/core test`

- [ ] **Step 3: Helpers (optional but recommended)**

In `date-utils.ts` add:

```ts
export function compareIso(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function isIsoInRange(iso: string, start: string, end: string): boolean {
  const [s, e] = compareIso(start, end) <= 0 ? [start, end] : [end, start];
  return iso >= s && iso <= e;
}
```

Add 2–3 unit tests in `date-utils.test.ts`.

- [ ] **Step 4: Implement component changes**

In `gk-date-picker.ts`:

1. Expand type: `export type GkDatePickerType = "date" | "daterange"`.
2. Change `value` to union with converter:

```ts
type DateValue = string;
type RangeValue = [string, string] | null;

function parseRangeAttr(raw: string | null): RangeValue {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw);
    if (
      Array.isArray(v) &&
      v.length === 2 &&
      typeof v[0] === "string" &&
      typeof v[1] === "string" &&
      isValidIsoDate(v[0]) &&
      isValidIsoDate(v[1])
    ) {
      return [v[0], v[1]];
    }
  } catch {
    /* ignore */
  }
  return null;
}

@property({
  converter: {
    fromAttribute(value: string | null, _type?: unknown): string | RangeValue {
      // Note: converter cannot read `this.type` reliably in all Lit versions.
      // Prefer: attribute "value" for date is plain ISO; for daterange use property binding in apps.
      // Implement dual: if looks like JSON array → range; else → string for date.
      if (value == null || value === "") return "";
      if (value.trim().startsWith("[")) return parseRangeAttr(value);
      return value;
    },
    toAttribute(value: string | RangeValue): string | null {
      if (value == null) return null;
      if (Array.isArray(value)) return JSON.stringify(value);
      return value || null;
    },
  },
})
value: string | RangeValue = "";
```

**Important:** When `type==="daterange"`, initialize / coerce empty string `""` to `null` in `willUpdate` if needed so defaults match tests.

3. Props:

```ts
@property() separator = " - ";
@property({ attribute: "start-placeholder" }) startPlaceholder = "";
@property({ attribute: "end-placeholder" }) endPlaceholder = "";
```

4. State for incomplete selection:

```ts
@state() private rangeDraftStart: string | null = null;
```

5. `emitValue(next: string | RangeValue)` — same CustomEvents, `detail: { value: next }`.

6. `onDayClick`:
   - if `type==="date"`: existing behavior
   - if `daterange`:
     - if `!rangeDraftStart` → set draft start (do not close); if existing complete value, clear it visually to draft-only
     - else → order `[draft, iso]`, `emitValue(pair)`, clear draft, `setOpen(false)`

7. Clear: if range → `emitValue(null)`; if date → `emitValue("")`.

8. Panel actions: if `type==="daterange"` render Clear only; hide Now.

9. Display text:
   - date: unchanged
   - range: if pair → `formatDisplay(start)+separator+formatDisplay(end)`; else show `startPlaceholder`/`endPlaceholder` or `placeholder`

10. `syncViewFromValue`: if range pair, use start date for view month.

11. Panel day cell classes: `is-selected` for start/end; `is-in-range` for between (use draft start alone as selected while picking).

12. Styles in panel CSS: `.is-in-range { background: color-mix(in srgb, var(--gk-color-brand) 22%, transparent); }` etc.

13. `updated()`: also re-render panel when `type`, `separator`, `rangeDraftStart` change.

- [ ] **Step 5: Run — expect PASS**

Run: `corepack pnpm --filter @gk-ui/core test`

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/date-picker packages/core/src/index.ts
git commit -m "feat(date-picker): add daterange type with pair value"
```

---

### Task 2: Docs (Range demo + API)

**Files:**
- Modify: `apps/docs/components/date-picker.md`
- Modify: `apps/docs/zh-TW/components/date-picker.md`

**Interfaces:**
- Consumes: `type="daterange"` API from Task 1

- [ ] **Step 1: Update intro + roadmap**

EN: mention single date **and** date range; roadmap = datetime / month / year later.

- [ ] **Step 2: Add Range DemoCard**

```vue
<script setup>
const range = ref<[string, string] | null>(["2026-09-01", "2026-09-17"]);
function onRangeInput(e: CustomEvent<{ value: [string, string] | null }>) {
  range.value = e.detail.value;
}
</script>
<gk-date-picker
  type="daterange"
  clearable
  :value="range"
  start-placeholder="Start"
  end-placeholder="End"
  @input="onRangeInput"
></gk-date-picker>
<p>{{ range }}</p>
```

zh-TW: `locale="zh-TW"`, 繁中文案.

- [ ] **Step 3: API table updates**

Document `type`, range `value`, `separator`, `start-placeholder`, `end-placeholder`, and that `detail.value` depends on type. Panel Clear-only for range.

- [ ] **Step 4: Build**

Run: `corepack pnpm docs:build`

- [ ] **Step 5: Commit**

```bash
git add apps/docs/components/date-picker.md apps/docs/zh-TW/components/date-picker.md
git commit -m "docs(date-picker): add daterange demos and API"
```

---

## Spec coverage checklist

| Spec item | Task |
|-----------|------|
| type daterange + pair value + JSON attr | 1 |
| Two-click, swap, clear null, no Now | 1 |
| Range highlight styles | 1 |
| Date mode regressions | 1 |
| Docs Range + API | 2 |
