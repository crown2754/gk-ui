# Date Picker Mobile Sheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On ≤640px viewports, show `gk-date-picker` panel as a bottom sheet with backdrop; single-month for ranges; keep desktop anchor+flip.

**Architecture:** `matchMedia('(max-width: 640px)')` drives `isCompact`. Compact: backdrop + `.is-sheet` CSS, skip `positionPanel`. Range renders one calendar when compact.

**Tech Stack:** Lit 3, Vitest + `@open-wc/testing`, VitePress.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-18-date-picker-mobile-sheet-design.md`
- Breakpoint 640px; bottom sheet + backdrop; range single month when compact
- Desktop unchanged
- Tokens only
- Tests: `corepack pnpm --filter @gk-ui/core test`
- Docs: `corepack pnpm docs:build`
- Commit after each task; no push; no `README.md`

## File map

| File | Responsibility |
|------|----------------|
| `packages/core/src/date-picker/gk-date-picker.ts` | matchMedia, backdrop, compact render |
| `packages/core/src/date-picker/gk-date-picker.styles.ts` | `.is-sheet`, backdrop CSS |
| `packages/core/src/date-picker/gk-date-picker.test.ts` | Compact / desktop tests |
| `apps/docs/components/date-picker.md` | One-line note |
| `apps/docs/zh-TW/components/date-picker.md` | zh-TW note |

---

### Task 1: Compact sheet + single-month range

**Files:**
- Modify: `packages/core/src/date-picker/gk-date-picker.ts`
- Modify: `packages/core/src/date-picker/gk-date-picker.styles.ts`
- Modify: `packages/core/src/date-picker/gk-date-picker.test.ts`

**Interfaces:**
- `isCompact: boolean` (state)
- Backdrop element class `gk-date-picker-backdrop`
- Panel class `is-sheet` when compact
- `dualCalendars` only when `!isCompact` for range types

- [ ] **Step 1: Failing tests**

```ts
function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
      onchange: null,
    }),
  });
}

it("uses sheet + backdrop when compact", async () => {
  mockMatchMedia(true);
  const el = await fixture<GkDatePicker>(html`<gk-date-picker></gk-date-picker>`);
  el.open = true;
  await el.updateComplete;
  const panel = document.querySelector(".gk-date-picker-panel")!;
  expect(panel.classList.contains("is-sheet")).toBe(true);
  expect(document.querySelector(".gk-date-picker-backdrop")).toBeTruthy();
});

it("daterange shows one calendar when compact", async () => {
  mockMatchMedia(true);
  const el = await fixture<GkDatePicker>(
    html`<gk-date-picker type="daterange"></gk-date-picker>`,
  );
  el.open = true;
  await el.updateComplete;
  expect(document.querySelectorAll(".gk-date-picker-panel .gk-dp-cal").length).toBe(1);
});

it("daterange shows two calendars when not compact", async () => {
  mockMatchMedia(false);
  const el = await fixture<GkDatePicker>(
    html`<gk-date-picker type="daterange"></gk-date-picker>`,
  );
  el.open = true;
  await el.updateComplete;
  expect(document.querySelectorAll(".gk-date-picker-panel .gk-dp-cal").length).toBe(2);
});
```

Restore matchMedia in `afterEach` if needed.

- [ ] **Step 2: FAIL then implement**

1. `@state() isCompact = false`; subscribe matchMedia in connectedCallback; cleanup disconnect.  
2. `ensurePanel` / `positionPanel`: if compact, add `is-sheet`, create backdrop (click → close), return early from position. Else remove sheet class / backdrop, position as today.  
3. `teardownPanel`: remove backdrop.  
4. Range dual render: `if (!this.isCompact) { right month }`.  
5. CSS for `.gk-date-picker-panel.is-sheet` and `.gk-date-picker-backdrop`.

- [ ] **Step 3: PASS** `corepack pnpm --filter @gk-ui/core test`

- [ ] **Step 4: Commit**

```bash
git commit -m "feat(date-picker): mobile bottom sheet and compact single month"
```

---

### Task 2: Docs

**Files:** EN + zh-TW `date-picker.md`

- [ ] One sentence about ≤640px bottom sheet; docs:build; commit

```bash
git commit -m "docs(date-picker): note mobile bottom sheet"
```

---

## Spec coverage

| Item | Task |
|------|------|
| Sheet + backdrop | 1 |
| Single month compact | 1 |
| Desktop dual month | 1 |
| Docs | 2 |
