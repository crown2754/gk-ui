# Card Design

**Date:** 2026-09-10  
**Status:** Approved for planning  
**Scope:** Add `gk-card` to `@gk-ui/core` with VitePress demos (EN + zh-TW)

## Goal

Ship a Naive-inspired Card for brand-forward layouts: header / content / footer segmentation, cover image (URL prop or slot), hoverable elevation, bordered toggle, and closable that only emits an event for the host to handle.

## Decisions

| Topic | Decision |
|-------|----------|
| Architecture | Single Lit element `gk-card` (slots for regions), same package layout as button / avatar |
| Cover | Both: `cover` URL attribute for built-in `<img>`, and `#cover` slot (slot wins when provided) |
| Closable | Show close control; dispatch bubbling `gk-close` only — do **not** hide/remove the card |
| Segmented | Boolean `segmented` adds dividers between header / content / footer when those regions exist |
| Title | Optional `title` attribute used when `#header` slot is empty |
| Size | `sm` \| `md` \| `lg`, default `md` (padding / title scale) |
| Out of scope | Collapse, loading, CardGroup, form layouts, badge |

## API

### `gk-card`

| Name | Type | Default | Notes |
|------|------|---------|-------|
| `title` | `string` \| unset | — | Shown in header when `#header` has no content |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Density |
| `cover` | `string` \| unset | — | Image URL; ignored visually if `#cover` slot is used |
| `hoverable` | `boolean` | `false` | Elevate / nudge on hover |
| `bordered` | `boolean` | `true` | Border around card |
| `segmented` | `boolean` | `false` | Dividers between header / content / footer |
| `closable` | `boolean` | `false` | Renders close button |

**Slots**

| Name | Description |
|------|-------------|
| `cover` | Custom cover (wins over `cover` attr) |
| `header` | Custom header (wins over `title` attr) |
| `default` | Main content |
| `footer` | Footer region |
| `action` | Top-right actions (beside close when both present) |

**Events**

| Name | When |
|------|------|
| `gk-close` | Close button activated (click); bubbles; `composed: true` |

**Parts:** `base`, `cover`, `header`, `content`, `footer`, `action`, `close`

## Visual / tokens

- Surface: `--gk-color-surface-elevated` / border `--gk-color-border`, radius `--gk-radius-md` (or sm).
- Cover image: full bleed top, `object-fit: cover`, fixed aspect or max-height documented in demos.
- Hoverable: soft shadow and/or slight translate consistent with brand button nudge (keep subtler than button).
- Close: text/icon button in header row; accessible name (e.g. `aria-label="Close"`).

## Docs

EN + zh-TW pages under Components (sidebar alphabetical: **Avatar → Button → Card**):

- Basic (title + content)
- Cover (URL and slot examples)
- Size
- Hoverable
- Segmented
- Closable (show toast / log `gk-close` in demo — card stays mounted)

Use `DemoCard` with show/copy. Register nav/sidebar in both locales.

## Tests

- Reflect `size`, `hoverable`, `bordered`, `segmented`, `closable`, `title`, `cover`
- Cover slot takes precedence over `cover` attribute (no built-in img when slot assigned, or slot visible as primary)
- Closable button dispatches `gk-close` once per activation; card remains in DOM / not `hidden` by the component
- Export from `@gk-ui/core`

## Success criteria

1. Live demos for all sections above in EN and zh-TW  
2. `pnpm test` (core) and `pnpm docs:build` pass  
3. Public export includes `gk-card`
