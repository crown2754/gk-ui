# Date Picker Design (Phase 4 — month / year)

**Date:** 2026-09-17  
**Status:** Approved for planning  
**Scope:** Extend `gk-date-picker` with `type="month"` and `type="year"`; update VitePress demos (EN + zh-TW)

## Goal

Add Naive-inspired month and year pickers on the existing `gk-date-picker`: month grid (12 cells) and year grid (~12-year pages), immediate commit on cell click, values as `YYYY-MM` / `YYYY`, and Clear / Now actions aligned with `type="date"`.

Phases 1–3 (`date`, `daterange`, `datetime`, `datetimerange`) must remain unchanged.

## Decisions

| Topic | Decision |
|-------|----------|
| Architecture | Extend `gk-date-picker` (approach 1); helpers in `date-utils.ts`; no separate public elements |
| Types | Add `'month' \| 'year'` to existing union |
| Month value | `string` — `YYYY-MM` or `''` |
| Year value | `string` — `YYYY` or `''` |
| Display | `format` default `yyyy-MM` (month) / `yyyy` (year); tokens reuse `yyyy` `MM` |
| Commit | Click month/year cell → set value, emit `input` + `change`, close panel |
| Actions | **Clear** + **Now** (no Confirm) |
| Now | Month → current `YYYY-MM`; year → current `YYYY`; respect `isDateDisabled` |
| Disable | Same `isDateDisabled?: (value: string) => boolean`; callback receives `YYYY-MM` or `YYYY` for these types |
| Events | `detail.value` is `string` for month/year |
| Out of scope | `monthrange` / `yearrange`, Confirm, quarter, shortcuts, typed parse |

## API additions / changes

### `gk-date-picker` (delta)

| Name | Type | Default | Notes |
|------|------|---------|-------|
| `type` | `… \| 'month' \| 'year'` | `'date'` | Full union includes prior types |
| `value` | `string` (for month/year) | `''` | See Decisions |
| `format` | `string` | `yyyy-MM` / `yyyy` | Set when type is month/year (same upgrade pattern as datetime) |

Existing props unchanged: `size`, `placeholder`, `disabled`, `clearable`, `round`, `status`, `open`, `locale`, `isDateDisabled`, etc. Range-only props unused for month/year.

**Parts:** `panel`, `actions`; month/year grids use `calendar` (or document `month-grid` / `year-grid` if separate parts are added — prefer reusing `calendar` for YAGNI).

**Locale:** month names for the 12 cells (`en` short / `zh-TW` 數字或月名); Clear / Now reuse existing labels.

## Interaction

### `month`

1. Open → 12-month grid for `viewYear`; prev/next year on header.  
2. Click enabled month → `YYYY-MM`, emit both, close.  
3. **Now** → current month if not disabled; **Clear** → `''`.  
4. Outside / Escape → close without changing value.

### `year`

1. Open → page of ~12 years (decade-style window); prev/next page shifts the window.  
2. Click enabled year → `YYYY`, emit both, close.  
3. **Now** / **Clear** as above for current year / empty.  
4. Outside / Escape → close without changing value.

## Visual

- Selected cell: brand fill (same language as selected day).  
- Current month/year: subtle today indicator.  
- Disabled cells: muted + non-interactive.  
- Panel chrome matches existing date picker.

## Docs

- New **Month** and **Year** demos (EN + zh-TW).  
- Update API tables for `type`, value shapes, format defaults.  
- Remove roadmap line (Date Picker type roadmap complete).  
- Sidebar unchanged.

## Tests

- `month` / `year` defaults empty; format defaults  
- Cell click sets value and emits; closes panel  
- Clear / Now; Now respects `isDateDisabled`  
- Prior types still pass  
- Export / type union updated

## Success criteria

1. Month + Year demos work in EN + zh-TW  
2. Phases 1–3 behaviors unchanged  
3. `pnpm test` (core) and `pnpm docs:build` pass  
4. No monthrange / yearrange in this phase
