# Date Picker Design (Phase 1)

**Date:** 2026-09-17  
**Status:** Approved for planning  
**Scope:** Add `gk-date-picker` (single `date` only) to `@gk-ui/core` with VitePress demos (EN + zh-TW)

## Goal

Ship a Naive-inspired single-day Date Picker: Input-aligned trigger, popup month calendar, ISO `YYYY-MM-DD` value, clearable, Clear / Now actions, optional `isDateDisabled`, and `input` / `change` events matching `gk-input`.

Later phases (out of this spec): `daterange`, `datetime` / `datetimerange`, `month` / `year`.

## Decisions

| Topic | Decision |
|-------|----------|
| Architecture | Single Lit element `gk-date-picker`; calendar logic as private helpers under `packages/core/src/date-picker/` (not a public `gk-calendar` yet) |
| Type | Phase 1 fixed to **date** only (`type` may reflect `"date"` for forward compat) |
| Value | ISO string `'YYYY-MM-DD'` or `''` when empty (approach B) |
| Display format | `format` prop for trigger text (default `yyyy-MM-dd`); bound `value` stays ISO |
| Trigger chrome | Align with `gk-input`: size `sm\|md\|lg` (28/34/40), clearable, disabled, placeholder, status, round, `--gk-color-on-surface` for field text |
| Panel | Portaled to `document.body`; month nav; weekday header; day grid; actions **Clear** + **Now** |
| Disable dates | JS property `isDateDisabled?: (iso: string) => boolean` (not an HTML attribute) |
| Events | CustomEvent `input` / `change` with `detail: { value: string }`; `bubbles` + `composed`; stop native composed leaks like Input |
| Select behavior | Choosing a day sets value, emits `input` + `change`, closes panel; Clear empties + emits both; Now sets today (if not disabled) + emits both + closes |
| Outside click / Escape | Close panel without changing value |
| Nav | New sidebar group **Data Entry / 資料輸入**: Date Picker, Input (move Input from General). Button stays under General |
| Out of scope | Range, datetime, month/year, shortcuts, firstDayOfWeek customization, typed manual parse, TimePicker, ElementInternals |

## API

### `gk-date-picker`

| Name | Type | Default | Notes |
|------|------|---------|-------|
| `type` | `'date'` | `'date'` | Phase 1 only `date` |
| `value` | `string` | `''` | `YYYY-MM-DD` or empty |
| `format` | `string` | `'yyyy-MM-dd'` | Display in trigger; tokens `yyyy` `MM` `dd` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Same heights as Input |
| `placeholder` | `string` | `''` | Empty trigger hint |
| `disabled` | `boolean` | `false` | |
| `clearable` | `boolean` | `false` | Clear control on trigger when value set |
| `round` | `boolean` | `false` | Pill trigger |
| `status` | `'success' \| 'warning' \| 'error'` \| unset | — | Border / focus like Input |
| `open` | `boolean` | `false` | Controlled panel visibility |
| `locale` | `'en' \| 'zh-TW'` | `'en'` | Weekday + Clear/Now labels |
| `isDateDisabled` | `(iso: string) => boolean` | unset | Property only |

**Parts:** `base` (trigger), `input` (readonly text display), `clear`, `suffix` (calendar icon), `panel`, `calendar`, `actions`

**Events**

| Name | When |
|------|------|
| `input` | Value changed (select / clear / now) |
| `change` | Same commits as Input clear pattern (select / clear / now) |
| `gk-open-change` | Panel open state changed; `detail: { open: boolean }` |

## Visual / tokens

- Trigger: reuse Input visual language (surface, border, focus ring, on-surface text, status colors).
- Panel: elevated surface, border, shadow; selected day uses brand fill; today indicator (subtle ring or underline); disabled days muted + non-interactive.
- Weekday + action labels: prop `locale` `'en' | 'zh-TW'` (default `'en'`).

## Docs

### Date Picker pages (EN + zh-TW)

- Basic (bind value + events)
- Size
- Clearable
- Status / round
- Disabled + `isDateDisabled` demo
- Actions (Clear / Now visible in panel)

Sidebar: create **Data Entry** / **資料輸入**; list **Date Picker** then **Input**; remove Input from General.

## Tests

- Defaults: type date, empty value, size md
- Reflect size, format, clearable, disabled, status, round
- Selecting a day sets ISO value and emits `input` + `change` with `detail.value`
- Clear / Now behaviors; Now respects `isDateDisabled`
- Disabled dates not selectable
- Panel open/close; outside dismiss
- Export from `@gk-ui/core`

## Success criteria

1. Date Picker demos live in EN + zh-TW  
2. Trigger sizes align with Input / Button  
3. `pnpm test` (core) and `pnpm docs:build` pass  
4. Public export includes `gk-date-picker`  
5. Roadmap note in docs: range / datetime / month / year coming later
