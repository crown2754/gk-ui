# Button Appearance Modes & Button Group

**Date:** 2026-09-09  
**Status:** Approved for planning  
**Scope:** Extend `gk-button`; add `gk-button-group`

## Goal

Match Naive UI–style secondary / dashed / text button appearances and a horizontal button group, without replacing the existing solid `variant` system.

## Decisions

| Topic | Decision |
|-------|----------|
| Secondary | Boolean attribute `secondary` (not a new variant). Soft tinted fill + same-hue text derived from `variant`. |
| Existing `variant="secondary"` | Keep as the gray “default” solid type. Distinct from boolean `secondary`. |
| Dashed / text | Boolean attributes `dashed` and `text`. |
| Mutual exclusion | Precedence: `text` > `dashed` > `secondary` > solid fill. |
| Button group | New custom element `gk-button-group` (not CSS-only on the consumer). |
| Group layout (v1) | Horizontal `inline-flex` only; flush edges; shared outer radius; no vertical mode; no size inheritance. |

## API

### `gk-button` (additions)

| Name | Type | Default | Notes |
|------|------|---------|-------|
| `secondary` | boolean | `false` | Soft appearance for the current `variant` colors. |
| `dashed` | boolean | `false` | Transparent background, dashed border in variant color. |
| `text` | boolean | `false` | No fill / border; text-colored by variant (link-like). |

Existing props unchanged: `variant`, `size`, `type`, `disabled`, `loading`, `href`.

Appearance precedence when multiple flags are set: **text → dashed → secondary → solid**.

### `gk-button-group` (new)

| Name | Type | Notes |
|------|------|-------|
| default slot | `gk-button` children | Renders grouped controls |

- Display: `inline-flex`; children sit flush.
- Middle buttons: square adjoining sides (zero radius on shared edges).
- First / last: keep outer corner radius.
- Hover “nudge” shadow on individual buttons should not break the joined silhouette (disable or neutralize transform/shadow while inside a group via `:host-context(gk-button-group)` or a group-provided attribute/CSS part).

## Visual rules (summary)

- **secondary:** background ≈ variant color at ~16% alpha; text/icon = variant color; no hard border; brand hover nudge may stay for standalone buttons.
- **dashed:** transparent fill; `1px dashed` border using variant/border color; text = variant or default text for gray secondary type.
- **text:** transparent fill and border; padding may shrink horizontally; height can stay size-token aligned or slightly tighter like Naive (~30px at md); text = variant color (or muted default for `variant="secondary"`).
- Color mapping uses existing `--gk-color-*` tokens (`brand`, `info`, `success`, `warning`, `danger`, and default text/button tokens for `variant="secondary"` / ghost as sensible).

## Docs

Update EN and zh-TW Button pages:

- Demo sections: Secondary, Dashed, Text, Button group
- Each static demo uses `DemoCard` with show/copy code
- API tables: new button props + ButtonGroup slot/props

## Tests

- Reflect `secondary` / `dashed` / `text` attributes
- Precedence smoke (e.g. `text` wins over `dashed` when both set) via attribute presence / class or computed style if practical
- `gk-button-group` renders slotted `gk-button` children

## Out of scope (v1)

- Tertiary / quaternary modes
- Vertical button group
- Group-level `size` / `variant` propagation
- Icon-only / shape APIs beyond current button

## Success criteria

1. Docs demos match Naive-style secondary / dashed / text / group visually enough for comparison.
2. `pnpm test` and `pnpm docs:build` pass.
3. Public exports include `gk-button-group`.
