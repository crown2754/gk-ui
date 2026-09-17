# Date Picker Design (Phase 3 — datetime / datetimerange)

**Date:** 2026-09-17  
**Status:** Approved for planning  
**Scope:** Extend `gk-date-picker` with `type="datetime"` and `type="datetimerange"`; update VitePress demos (EN + zh-TW)

## Goal

Add Naive-inspired date-time selection on the existing `gk-date-picker`: calendar plus hour/minute/second columns, draft editing until **Confirm**, values as local `YYYY-MM-DD HH:mm:ss` (range as `[string, string] | null`), and panel actions aligned with phase 1/2.

Phase 1 (`date`) and phase 2 (`daterange`) behavior must remain unchanged.

## Decisions

| Topic | Decision |
|-------|----------|
| Architecture | Extend `gk-date-picker` (approach 1); private time-column helpers under `date-picker/`; no public `gk-time-picker` yet |
| Types | `'date' \| 'daterange' \| 'datetime' \| 'datetimerange'` |
| Datetime value (JS) | `string` — `YYYY-MM-DD HH:mm:ss` or `''` when empty |
| Datetimerange value (JS) | `[string, string] \| null` — both strings `YYYY-MM-DD HH:mm:ss` |
| Attribute (range) | JSON array string (same pattern as phase 2) |
| Display | `format` default `yyyy-MM-dd HH:mm:ss`; range uses `separator` between formatted ends |
| Commit | Draft until **Confirm** (except **Now** / **Clear**, which commit immediately) |
| Actions | `datetime`: Clear + Now + Confirm; `datetimerange`: Clear + Confirm only |
| Now | Sets value to current local datetime (if date not disabled), emits `input` + `change`, closes panel |
| Disable | Same `isDateDisabled?: (iso: string) => boolean` on **date** portion only (`YYYY-MM-DD`) |
| Events | `detail.value` matches active type |
| Out of scope | Public TimePicker, timezones, second-less values, dual month, shortcuts, typed parse, `isTimeDisabled` |

## API additions / changes

### `gk-date-picker` (delta)

| Name | Type | Default | Notes |
|------|------|---------|-------|
| `type` | `'date' \| 'daterange' \| 'datetime' \| 'datetimerange'` | `'date'` | |
| `value` | per type | `''` / `null` | See Decisions |
| `format` | `string` | `yyyy-MM-dd` or `yyyy-MM-dd HH:mm:ss` | Default depends on type family (date vs datetime); tokens add `HH` `mm` `ss` |

Existing props unchanged: `size`, `placeholder`, `start-placeholder`, `end-placeholder`, `separator`, `disabled`, `clearable`, `round`, `status`, `open`, `locale`, `isDateDisabled`.

**Parts:** existing + `time`, `confirm` (and keep `panel`, `calendar`, `actions`).

**Locale:** add Confirm label (`Confirm` / `確認`); reuse Clear / Now.

## Interaction

### `datetime`

1. Open → show month calendar + H/M/S columns; load draft from `value` or empty.  
2. Pick day → update draft date; if no time yet, default `00:00:00`.  
3. Change time columns → update draft only (no emit).  
4. **Confirm** → if draft has a date, write `value`, emit `input` + `change`, close.  
5. **Now** → commit now (respect `isDateDisabled` on today's date), emit both, close.  
6. **Clear** → `value = ''`, emit both, close if open.  
7. Outside click / Escape → discard draft; leave `value` unchanged.

### `datetimerange`

1. Two day clicks for start/end (swap full datetimes if end < start).  
2. Single time column binds to the **active end** (start after first day pick; end after second; re-picking start resets like phase 2).  
3. **Confirm** only when both ends present → set pair, emit, close.  
4. **Clear** → `null`, emit, close. No Now.  
5. Outside / Escape → discard draft.

## Visual

- Panel layout: calendar | scrollable hour / minute / second lists; selected row highlighted.  
- Range: keep single-month grid + start/end/in-range fills from phase 2.  
- Actions row as in Decisions; elevated panel styling unchanged.

## Docs

- New **Datetime** and **Datetimerange** demos (EN + zh-TW).  
- Update API tables for `type`, value shapes, format tokens, Confirm.  
- Roadmap: only **month / year** remain later.  
- Sidebar unchanged (Data Entry).

## Tests

- `datetime`: Confirm commits; pre-Confirm no value change; Now / Clear; Esc discards draft  
- `datetimerange`: two ends + Confirm; Clear → `null`; swap when end < start  
- `isDateDisabled` blocks day pick for datetime types  
- `date` / `daterange` regressions still pass  
- Format display includes time tokens  
- Export / type union updated

## Success criteria

1. Datetime + datetimerange demos work in EN + zh-TW  
2. Phase 1/2 behaviors unchanged  
3. `pnpm test` (core) and `pnpm docs:build` pass  
4. No public `gk-time-picker` in this phase
