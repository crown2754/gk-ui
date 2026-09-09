# Avatar & Avatar Group Design

**Date:** 2026-09-09  
**Status:** Approved for planning  
**Scope:** Add `gk-avatar` and `gk-avatar-group` to `@gk-ui/core` with VitePress demos (EN + zh-TW)

## Goal

Ship a Naive-inspired Avatar for brand-forward UIs: image, text/icon via slot, image-error fallback, and an overlapping Avatar Group with `max` plus a customizable overflow slot. Follow existing Lit + tokens + docs patterns from Button.

## Decisions

| Topic | Decision |
|-------|----------|
| Architecture | Separate Lit elements: `gk-avatar`, `gk-avatar-group` (same package layout as button / button-group) |
| Icons | No icon library. Default slot holds arbitrary content (SVG, emoji, text) |
| Size API | Named `sm` \| `md` \| `lg` plus numeric string for custom px (e.g. `size="48"`). Default `md` |
| Named sizes (px) | Align with Naive medium scale: `sm` ≈ 28, `md` ≈ 34, `lg` ≈ 40 |
| Shape | `round` boolean; default `false` (slight radius). `true` → circle (`border-radius: 50%`) |
| Group overflow | `max` + `#overflow` slot for custom `+N` / “more” UI |
| Badge / lazy load / auto text fit | Out of scope for v1 |

## API

### `gk-avatar`

| Name | Type | Default | Notes |
|------|------|---------|-------|
| `src` | `string` \| unset | — | Image URL |
| `alt` | `string` | `""` | Passed to `<img>` when `src` is set |
| `size` | `'sm' \| 'md' \| 'lg' \| \`${number}\`` | `'md'` | Named or pixel number as string attribute |
| `round` | `boolean` | `false` | Circle when true |
| `color` | `string` \| unset | — | Background for text/icon avatar (CSS color) |
| `object-fit` | `string` | `'cover'` | Applied to image (`object-fit`) |

**Content priority**

1. If `src` is set and the image has not errored → show image  
2. Else → show default slot (initials, icon, etc.)  
3. Else → empty colored/surface base  

**Fallback:** On `<img>` `error`, hide the image and show the default slot (docs demo uses text initials).

**Parts:** `base`, `image`, `content`

**Slot:** `default` — label / icon / fallback content

### `gk-avatar-group`

| Name | Type | Default | Notes |
|------|------|---------|-------|
| `max` | `number` \| unset | — | Max visible avatars; remainder go to overflow |
| `size` | same as avatar \| unset | — | Optional; when set, reflected onto / expected on children for consistent overlap (document: children should match group size) |

**Slots**

| Name | Description |
|------|-------------|
| `default` | `gk-avatar` children |
| `overflow` | Custom overflow control (e.g. `+N`). Group exposes remaining count as a reflected attribute `rest` on the host for consumers to read, and/or documents composing overflow with that count in demos |

**Layout (v1):** Horizontal overlap via negative margin; circular/square edges preserved per child `round`. No vertical mode.

## Visual / tokens

- Use `--gk-*` surfaces, text, radius tokens where sensible; avatar named sizes use fixed px for Naive parity.
- Non-round default radius: `var(--gk-radius-sm)` (or ~3px Naive-like).
- Image fills the base; slot content centered.

## Docs

EN + zh-TW component pages:

- Size (named + custom px)
- Shape (`round`)
- Color
- Icon (slot example with inline SVG)
- Fallback (broken `src` + initials)
- Avatar Group (`max` + custom `#overflow`)

Use `DemoCard` with show/copy code. Register nav/sidebar entries beside Button.

## Tests

- Reflect `size`, `round`, `src` / `alt`
- Image error path shows slotted fallback (simulate error event)
- Group with `max` keeps only `max` avatars visible in the default slot projection and sets `rest` appropriately
- Export both elements from `@gk-ui/core`

## Out of scope (v1)

- Badge composition
- Lazy load / IntersectionObserver
- Automatic font scaling for long text
- Vertical group
- Built-in icon set
- Vue-generic `options` API (Naive `NGAvatarGroup`)

## Success criteria

1. Live demos for all sections above in EN and zh-TW  
2. `pnpm test` (core) and `pnpm docs:build` pass  
3. Public exports include `gk-avatar` and `gk-avatar-group`
