# Alert Design

**Date:** 2026-09-10  
**Status:** Approved for planning  
**Scope:** Add `gk-alert` (Feedback) to `@gk-ui/core`; update Card closable demo to pair with Alert via shared `gk-close`

## Goal

Ship a Naive-inspired Alert for inline feedback: semantic types, optional border, built-in type icons (overridable via slot), and closable that matches Card — emit `gk-close` only. Document Card + Alert together so closing a card shows an alert.

## Decisions

| Topic | Decision |
|-------|----------|
| Architecture | Single Lit element `gk-alert` under `packages/core/src/alert/` |
| Closable | Same as Card: dispatch bubbling composed `gk-close`; do **not** hide/remove |
| Icons | Built-in simple SVG per `type`; `#icon` slot overrides; `show-icon` toggles icon column |
| Types | `default` \| `info` \| `success` \| `warning` \| `error` |
| Bordered | Boolean; default `false` (soft fill without border unless set) |
| Nav | Place under Components, alphabetical: **Alert → Avatar → Button → Card** |
| Card pairing | Update Card Closable demo: on `gk-close`, host hides/removes card and shows a `gk-alert` |
| Out of scope | Marquee, global Toast/Message API, auto-dismiss timer |

## API

### `gk-alert`

| Name | Type | Default | Notes |
|------|------|---------|-------|
| `type` | `'default' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'default'` | Color / icon set |
| `title` | `string` \| unset | — | Optional title line |
| `bordered` | `boolean` | `false` | Border around alert |
| `closable` | `boolean` | `false` | Close control |
| `show-icon` | `boolean` | `true` | Show icon column (built-in or `#icon`) |

**Slots**

| Name | Description |
|------|-------------|
| `default` | Body content |
| `icon` | Overrides built-in type icon when present |
| `header` | Optional custom header (wins over `title` when provided) — v1 may use `title` attr only if simpler; prefer `title` + default slot for v1 YAGNI unless header slot is cheap |

**Events**

| Name | When |
|------|------|
| `gk-close` | Close activated; `bubbles: true`, `composed: true` |

**Parts:** `base`, `icon`, `body`, `title`, `content`, `close`

## Visual / tokens

- Soft tinted backgrounds from semantic tokens (`--gk-color-info`, success, warning, danger / brand for default).
- Built-in icons: minimal inline SVG (info circle, check, warning triangle, error cross, neutral info) — **not** a separate icon package.
- Layout: horizontal flex — icon | body (title + content) | close.
- Close control mirrors Card close affordance (×, `aria-label="Close"`).

## Docs

### Alert pages (EN + zh-TW)

- Basic (types)
- Bordered
- Closable
- Icon (custom `#icon`)
- No icon (`show-icon` false)

### Card pages (update Closable)

- On Card `gk-close`: host sets card hidden/removed and reveals a closable `gk-alert` (e.g. type `success`, title “Card closed”).
- Alert itself remains closable via the same event pattern.
- Update EN + zh-TW Card closable demo + copyable code to include the pairing pattern.

Sidebar: insert Alert first alphabetically in Components for both locales.

## Tests

- Reflect `type`, `bordered`, `closable`, `show-icon`, `title`
- Closable dispatches `gk-close` once; alert stays connected / not component-hidden
- `#icon` slot suppresses built-in SVG (no built-in when slot has content)
- `show-icon=false` hides icon column
- Export from `@gk-ui/core`

## Success criteria

1. Alert demos live in EN + zh-TW  
2. Card Closable demo demonstrates Alert pairing  
3. `pnpm test` (core) and `pnpm docs:build` pass  
4. Public export includes `gk-alert`
