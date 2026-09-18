# Date Picker Mobile Sheet Design

**Date:** 2026-09-18  
**Status:** Approved for planning  
**Scope:** Responsive panel for `gk-date-picker` on narrow viewports; update docs briefly (EN + zh-TW)

## Goal

On viewports ≤640px, open the date-picker panel as a **bottom sheet** with backdrop instead of an anchored popover, so mobile users can reach all controls. Desktop behavior (anchor + flip) stays unchanged. Range types use a **single month** in compact mode.

## Decisions

| Topic | Decision |
|-------|----------|
| Breakpoint | `max-width: 640px` via `matchMedia` → `isCompact` |
| Mobile UI | Bottom sheet + semi-transparent backdrop |
| Dismiss | Backdrop click / Escape / existing clear-commit close |
| Range calendars | Compact: one month; desktop: dual month |
| Types | All panel types (`date`, `daterange`, `datetime`, `datetimerange`, `month`, `year`) use sheet when compact |
| Desktop | Keep `positionPanel` flip/clamp; no sheet |
| Architecture | Extend `gk-date-picker` (CSS class + matchMedia); no separate mobile element |
| Out of scope | Drag-to-dismiss, fine safe-area polish, separate mobile component |

## Behavior

1. On connect / resize: sync `isCompact` from `(max-width: 640px)`.  
2. When `open` and compact: render backdrop on `document.body`; panel gets `is-sheet` (fixed bottom, full width, top radius, `max-height: ~85vh`, overflow auto); skip anchor positioning.  
3. When not compact: teardown backdrop; use existing `positionPanel`.  
4. Range render: if compact, one calendar only.

## Visual

- Backdrop: dimmed overlay, below sheet in stacking order.  
- Sheet: surface token background, top corners rounded, full width.  
- Tokens only (no hard-coded brand from screenshots).

## Tests

- Mock `matchMedia` compact → panel has sheet class + backdrop exists  
- Compact `daterange` → one `.gk-dp-cal`  
- Non-compact `daterange` → two `.gk-dp-cal`  
- Existing suites still pass  

## Docs

- One line in EN + zh-TW: narrow screens use a bottom sheet.

## Success criteria

1. Usable on ~375px viewport without clipped controls  
2. Desktop dual-month + flip unchanged  
3. `pnpm test` (core) and docs build pass  
