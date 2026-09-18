# Switch Design

**Date:** 2026-09-18  
**Status:** Approved for implementation  
**Scope:** Add `gk-switch` (Data Entry) to `@gk-ui/core` with VitePress demos (EN + zh-TW)

## Goal

Ship a settings-row Switch: boolean on/off with Button/Input size language (`sm` / `md` / `lg`), brand-yellow ON state, and a bubbling composed `change` event that Vue/Alpine can bind without native checkbox leaks.

## Decisions

| Topic | Decision |
|-------|----------|
| Architecture | Single Lit element `gk-switch` under `packages/core/src/switch/` |
| Control | Inner `<button type="button" role="switch">` — **no** native checkbox (avoids Vue `e.detail` leak; same lesson as `gk-input`) |
| Sizes | `sm` \| `md` \| `lg` (default `md`). Track is **smaller** than field height 28/34/40 — do not add a fourth size |
| Track sizes | sm **28×16**, md **36×20**, lg **44×24**; thumb inset 2px (12 / 16 / 20) |
| Round | Boolean, **default `true`** (pill). `round=false` uses `--gk-radius-sm` on track + thumb |
| Events | Only CustomEvent `change` with `detail: { checked: boolean }`, `bubbles: true`, `composed: true`. Toggle on user activation only |
| Disabled | No toggle; opacity **0.4** (design ~40%; Button/Input use 0.5 — Switch follows design) |
| Loading | Out of scope for v1 |
| Label | Optional default slot; `::part(label)` when present. Accessible name from slot (via `aria-labelledby`) or host `aria-label` |
| Nav | Sidebar **Data Entry / 資料輸入**: Date Picker, Input, **Switch** |

## API

### `gk-switch`

| Name | Type | Default | Notes |
|------|------|---------|-------|
| `checked` | `boolean` | `false` | Reflects |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Reflects |
| `disabled` | `boolean` | `false` | Reflects; blocks toggle |
| `round` | `boolean` | `true` | Reflects; pill track. Set via property / Vue `:round="false"` (Lit boolean attrs cannot express `false` in raw HTML) |

**Slots**

| Name | Description |
|------|-------------|
| default | Optional visible label |

**Events**

| Name | When |
|------|------|
| `change` | User toggles; `bubbles`, `composed`; `detail: { checked: boolean }` |

**Parts:** `track`, `thumb`, `label`

## Visual / tokens

- Host: `inline-flex`, align center, gap `--gk-space-2`; settings-row friendly.
- OFF track: `--gk-color-button-default`; OFF thumb: `#fff` + `--gk-shadow-sm`.
- ON track: `--gk-color-brand` (`#F2CE5E`); ON thumb: `--gk-color-brand-on`.
- Focus-visible: `--gk-color-focus-ring` outline, 2px / offset 2px (Button language).
- Disabled: `opacity: 0.4`; `cursor: not-allowed`.
- Motion: 150ms ease on track background and thumb translate.

## A11y

- Inner button: `role="switch"`, `aria-checked` mirrors `checked`.
- Space / Enter toggle (native button activation + host click).
- Disabled: `disabled` on the button; host click must not toggle.
- Accessible name required: slotted text or `aria-label` on the host (forwarded to the button).

## Docs

EN + zh-TW pages under Data Entry:

- Basic (settings-row)
- Size
- Disabled
- With label
- Playground

## Tests

- Default `checked=false`
- Toggle sets `checked`
- Disabled blocks toggle
- Size reflection
- `change` detail / bubbles / composed
- `role="switch"` and `aria-checked` basics

## Out of scope

Loading, form association / `ElementInternals`, `name` / native form submit, `before-change`.

## Success criteria

1. Switch demos live in EN + zh-TW  
2. `pnpm test` (core) and `pnpm docs:build` pass  
3. Public export includes `gk-switch`
