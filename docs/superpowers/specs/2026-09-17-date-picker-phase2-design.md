# Date Picker Design (Phase 2 — daterange)

**Date:** 2026-09-17  
**Status:** Approved for planning  
**Scope:** Extend `gk-date-picker` with `type="daterange"`; update VitePress demos (EN + zh-TW)

## Goal

Add Naive-inspired date range selection on the existing `gk-date-picker`: pair value as `[startIso, endIso] | null`, single-month calendar with two-click start/end, range highlight, Clear action, and `input` / `change` events whose `detail.value` matches the active type.

Phase 1 single-date behavior must remain unchanged.

## Decisions

| Topic | Decision |
|-------|----------|
| Architecture | Extend `gk-date-picker` (approach 1); private helpers as needed; no new public element |
| Types | `'date' \| 'daterange'` |
| Range value (JS) | `[string, string] \| null` — both strings ISO `YYYY-MM-DD` |
| Range value (attribute) | JSON array string, e.g. `["2026-09-01","2026-09-17"]`; absent/empty → `null` |
| Display | `format` per day + `separator` (default `" - "`) between start and end |
| Placeholders | Optional `start-placeholder` / `end-placeholder`; else fall back to `placeholder` |
| Panel | Single month (YAGNI dual month); start click then end click; if end < start, swap |
| Complete | After end selected: emit `input` + `change`, close panel |
| Actions | Range panel shows **Clear** only (no Now) |
| Disable | Same `isDateDisabled?: (iso: string) => boolean` for both positions |
| Events | `detail.value` is `string` when `type=date`; `[string, string] \| null` when `type=daterange` |
| Out of scope | Dual month, datetime, shortcuts, confirm button, position-aware disable signature |

## API additions / changes

### `gk-date-picker` (delta)

| Name | Type | Default | Notes |
|------|------|---------|-------|
| `type` | `'date' \| 'daterange'` | `'date'` | |
| `value` | `string` \| `[string, string] \| null` | `''` / `null` | Depends on type |
| `separator` | `string` | `' - '` | Range display only |
| `start-placeholder` | `string` | `''` | Range trigger hint |
| `end-placeholder` | `string` | `''` | Range trigger hint |

**Value converter:** When `type=daterange`, Lit converter parses attribute JSON to `string[] | null` and serializes property to JSON attribute when reflected (reflect optional — prefer property-driven like complex values; attribute support for demos).

**Events:** unchanged names; `detail.value` typed per `type`.

## Interaction

1. Open panel → pick start (highlight as start; wait for end).  
2. Pick end → normalize order → set value → emit → close.  
3. Clear (trigger or panel) → `value = null` → emit both → close if open.  
4. Re-open with existing range → show both ends + in-range fill.  
5. Changing start after a complete range: first click resets to new start (Naive-like).

## Visual

- Start / end cells: brand fill (like selected day).  
- In-range cells: soft brand tint (`color-mix`).  
- Trigger shows `format(start) + separator + format(end)` or placeholders when empty.

## Docs

- New **Range** demo (EN + zh-TW) with bound `[start, end] | null`.  
- Update API tables for `type`, range value, separator, placeholders.  
- Roadmap: datetime / month / year still later.  
- Sidebar unchanged (already under Data Entry).

## Tests

- `type=daterange` defaults value `null`  
- Two-click selection sets ordered pair and emits  
- End before start swaps  
- Clear sets `null` and emits  
- `isDateDisabled` blocks picking that day  
- `type=date` regressions still pass  
- Export types updated

## Success criteria

1. Range demo works in EN + zh-TW  
2. Single-date demos unchanged in behavior  
3. `pnpm test` (core) and `pnpm docs:build` pass  
4. Phase 1 API for `type=date` remains compatible
