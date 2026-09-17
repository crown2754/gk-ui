# Input Design

**Date:** 2026-09-17  
**Status:** Approved for planning  
**Scope:** Add `gk-input` (General) to `@gk-ui/core` with VitePress demos (EN + zh-TW)

## Goal

Ship a Naive-inspired Input for forms: single-line text, password (show/hide), textarea, sizes aligned with Button, clearable, prefix/suffix slots, validation `status`, and `round`. Value updates use a `value` property plus native-feeling `input` / `change` events.

## Decisions

| Topic | Decision |
|-------|----------|
| Architecture | Single Lit element `gk-input` under `packages/core/src/input/`; `type` switches internal `<input>` vs `<textarea>` |
| Types | `text` \| `password` \| `textarea`; default `text` |
| Sizes | `sm` \| `md` \| `lg` — heights **28 / 34 / 40px**, padding/font aligned with Button |
| Value / events | `value` property; dispatch bubbling composed `input` and `change` (approach A). Clear also emits both after emptying |
| Password | Toggle visibility on click (`show-password-on` fixed to click for v1); reveal control in suffix area |
| Clearable | Show clear when `clearable` and value is non-empty (and not disabled/readonly) |
| Prefix / suffix | Named slots `#prefix` / `#suffix`; system clear + password toggle sit after custom suffix content |
| Status | unset \| `success` \| `warning` \| `error` — border / focus color from semantic tokens |
| Round | Boolean; uses `--gk-radius-pill` |
| Visual vs Button | Same font, radius-sm default, size scale, brand focus ring, disabled opacity — **no** Button hover translate / hard offset shadow |
| Nav | Sidebar **General / 通用**: Button → **Input** (alphabetical) |
| Out of scope | Pair input, show-count, loading, autosize, ElementInternals / form-associated, custom `show-password-on` modes beyond click |

## API

### `gk-input`

| Name | Type | Default | Notes |
|------|------|---------|-------|
| `type` | `'text' \| 'password' \| 'textarea'` | `'text'` | Controls native control |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height / padding / font |
| `value` | `string` | `''` | Current value |
| `placeholder` | `string` | `''` | Placeholder |
| `disabled` | `boolean` | `false` | Disables interaction |
| `readonly` | `boolean` | `false` | Read-only |
| `clearable` | `boolean` | `false` | Clear control when non-empty |
| `round` | `boolean` | `false` | Pill radius |
| `status` | `'success' \| 'warning' \| 'error'` \| unset | — | Validation chrome |
| `rows` | `number` | `3` | Textarea rows only |
| `name` | `string` \| unset | — | Optional; reflected for docs/forms (not ElementInternals in v1) |

**Slots**

| Name | Description |
|------|-------------|
| `prefix` | Leading adornment |
| `suffix` | Trailing adornment (before system clear / password toggle) |

**Events**

| Name | When |
|------|------|
| `input` | Value changes (typing, clear, password does not change value); `bubbles`, `composed`; detail may include `{ value: string }` |
| `change` | Commit-style change (native blur-commit where applicable, and after clear); `bubbles`, `composed` |

**Parts:** `base`, `input`, `prefix`, `suffix`, `clear`, `password-toggle`

## Visual / tokens

- Host: `display: inline-block` (textarea: `display: block`; width 100% of host when block).
- `[part="base"]`: flex row; surface background; 1px `--gk-color-border`; `border-radius: var(--gk-radius-sm)`; font from `--gk-font-family-sans`.
- Sizes (single-line height): sm 28 / md 34 / lg 40; horizontal padding similar to Button (10 / 14 / 18); font 14 / 14 / 15.
- Focus-within: outline or border using `--gk-color-focus-ring` (brand yellow), matching Button focus language without offset transform.
- `status`: border (and focus) use success / warning / danger tokens.
- `round`: `--gk-radius-pill` on base (textarea may keep softer radius or still pill ends — prefer pill on single-line; textarea uses `radius-md` if pill looks wrong).
- Disabled: opacity ~0.5, `cursor: not-allowed`.
- Clear / password icons: minimal inline SVG or × / eye glyphs; `aria-label` on buttons.

## Docs

### Input pages (EN + zh-TW)

- Basic
- Sizes
- Password
- Textarea
- Clearable
- Prefix / suffix
- Status
- Round
- Disabled / readonly

Sidebar: under General / 通用, insert **Input** after **Button**.

## Tests

- Reflect `type`, `size`, `value`, `placeholder`, `disabled`, `readonly`, `clearable`, `round`, `status`, `rows`
- Typing updates `value` and dispatches `input`
- Clear empties value and dispatches `input` + `change`
- Password toggle switches internal input `type` between `password` and `text` without clearing value
- `type="textarea"` renders textarea with `rows`
- Export from `@gk-ui/core`

## Success criteria

1. Input demos live in EN + zh-TW  
2. Sizes visually align with Button height scale  
3. `pnpm test` (core) and `pnpm docs:build` pass  
4. Public export includes `gk-input`
