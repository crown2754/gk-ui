# Date Picker Panel Redesign (dual-month range + panel fields)

**Date:** 2026-09-17  
**Status:** Approved for planning  
**Scope:** Redesign `gk-date-picker` panels for `date` / `daterange` / `datetime` / `datetimerange` toward Naive-style dual calendars and editable panel fields; update VitePress demos (EN + zh-TW)

## Goal

Match the screenshot interaction model: dual-month calendars for ranges, year/month chevron navigation, editable date (± time) fields at the top of the panel, and Confirm for draft types — while keeping existing value formats and events. Use design-system tokens (not hard-coded screenshot teal).

`month` / `year` types are out of this change (unchanged).

## Decisions

| Topic | Decision |
|-------|----------|
| Architecture | Extend `gk-date-picker` (approach 1); remove H/M/S scroll columns |
| `date` | Single month; one date field; click day commits + closes; Clear + Now |
| `datetime` | Single month; date + time fields; draft until Confirm; Clear + Now + Confirm |
| `daterange` | **Dual month**; start + end date fields; draft until Confirm; Clear + Confirm |
| `datetimerange` | **Dual month**; start/end date + time fields; draft until Confirm; Clear + Confirm |
| Dual month | Left = `viewYear`/`viewMonth`; right = left + 1 month; each header: `<<` `<` title `>` `>>` |
| Panel fields | Editable text; parse on blur/Enter; invalid → revert display; sync with calendar draft |
| Time UI | Text `HH:mm:ss` only (no column pickers) |
| Separator default | ` → ` (prop `separator` still overridable) |
| Values / events | Unchanged shapes from phases 1–3 |
| Theme | Existing CSS variables / brand tokens |
| Out of scope | Screenshot-only colors, shortcuts, min-span validation (“at least N days”), typing in trigger, month/year redesign |

## Breaking changes

1. **`daterange`**: no longer commits on second day click; requires **Confirm**.  
2. **`datetime` / `datetimerange`**: H/M/S columns removed; time edited via panel text fields.  
3. **`separator` default**: `' - '` → `' → '`.

## API delta

| Name | Change |
|------|--------|
| `separator` | Default `' → '` |
| Parts | Add `panel-fields` (optional); keep `panel`, `calendar`, `actions`, `confirm`; drop time-column part usage |
| Locale | Unchanged Clear / Now / Confirm labels |

No new public props required for dual-month (always on for range types).

## Interaction details

### Range day pick

1. First click → start draft (and default times `00:00:00` for datetimerange if empty).  
2. Second click → end draft; swap if end < start (full datetime compare for datetimerange).  
3. Further click after both set → restart start (stash committed value for Esc restore, same idea as today).  
4. Confirm → emit pair + close. Clear → `null` + emit + close if open.

### Panel field parse

- Date: `YYYY-MM-DD` via existing `isValidIsoDate`.  
- Time: `HH:mm:ss` (0–23 / 0–59 / 0–59).  
- Combine into draft datetime strings for datetime types.

### Navigation

- `<` / `>`: ±1 month (for range, shifting left also moves right companion).  
- `<<` / `>>`: ±1 year.

## Docs

- Update Basic / Range / Datetime / Datetimerange copy for Confirm, dual month, panel fields, separator default.  
- Note breaking changes briefly.  
- EN + zh-TW.

## Tests

- `daterange`: two clicks do not commit until Confirm; dual month present  
- `datetimerange`: panel time fields + Confirm; no `[data-h]` columns  
- `datetime`: Confirm still required; fields instead of columns  
- `date`: still immediate commit on day click  
- Separator default ` → `  
- Field blur with invalid input reverts  
- Esc discards draft  
- Prior value formats still emit correctly  
- `month` / `year` regressions pass

## Success criteria

1. Range panel visually/structurally matches screenshot layout (dual calendars + top fields + Confirm)  
2. Value APIs unchanged; documented breaking UX changes  
3. `pnpm test` (core) and `pnpm docs:build` pass  
4. No hard-coded teal; tokens only
