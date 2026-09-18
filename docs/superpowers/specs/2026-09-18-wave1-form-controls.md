# Wave 1 form controls

**Date:** 2026-09-18  
**Status:** Approved (product owner)  
**Scope:** Finish Switch; add Checkbox (+ group), Radio (+ group), Select (single) on the same PR as `gk-switch`.

## Shared

- Lit 3 file trio `gk-*.ts` / `.styles.ts` / `.test.ts`; register in `index.ts` + `sideEffects`.
- Size enum `sm | md | lg` (default `md`); field chrome 28 / 34 / 40 where the control is a text field (Select). Checkbox/radio/switch marks are smaller than field height.
- Events: bubbling composed `CustomEvent` only. No native checkbox/radio `input`/`change` leaks (Vue `detail` lesson from Input). Prefer `role=checkbox|radio` buttons.
- Disabled: Checkbox / Radio / Select use **0.5** opacity like Input/Button. Switch stays **0.4** (already shipped).
- Docs EN + zh-TW, DemoCard, sidebar **Data Entry**: Date Picker (keep), Input, Switch, Checkbox, Radio, Select.
- Out of scope: form association, loading, Select filterable / multi-select.

## Checkbox

| Prop | Type | Default |
|------|------|---------|
| `checked` | boolean | false |
| `indeterminate` | boolean | false |
| `disabled` | boolean | false |
| `size` | sm\|md\|lg | md |
| `value` | string | `''` (group key) |

- `change` → `{ checked: boolean }` (standalone).
- `aria-checked`: `true` / `false` / `mixed` when indeterminate.
- Click while mixed → `indeterminate=false`, `checked=true`.
- Visual: unchecked = 1px `--gk-color-border`, `--gk-radius-sm`. Checked/mixed = brand fill + **dark** SVG check / minus (`--gk-color-brand-on`), not clipped.

### `gk-checkbox-group`

| Prop | Type | Default |
|------|------|---------|
| `value` | `string[]` | `[]` |
| `disabled` | boolean | false |
| `size` | sm\|md\|lg | md |

- `change` → `{ value: string[] }`.
- Stop child `change` at the group (capture) so Vue on the group only sees `{ value: string[] }`.

## Radio

| Prop | Type | Default |
|------|------|---------|
| `checked` | boolean | false |
| `disabled` | boolean | false |
| `size` | sm\|md\|lg | md |
| `value` | string | `''` |

**Selected visual (do not diverge):** white fill + deep-gold ring `var(--gk-color-brand-pressed)` + deep-gold center dot. **Forbidden:** solid yellow disc + black dot.

### `gk-radio-group`

| Prop | Type | Default |
|------|------|---------|
| `value` | string | `''` |
| `disabled` | boolean | false |
| `size` | sm\|md\|lg | md |

- Host `role="radiogroup"`; children `role="radio"`; roving tabindex.
- Arrow keys (Left/Up previous, Right/Down next) skip disabled and **select**.
- `change` → `{ value: string }`; stop child events at the group.
- Clicking a selected radio does not deselect.

## Select (v1 single)

| Prop | Type | Default |
|------|------|---------|
| `value` | string | `''` |
| `placeholder` | string | `''` |
| `size` | sm\|md\|lg | md |
| `disabled` | boolean | false |
| `clearable` | boolean | false |
| `status` | success\|warning\|error\|'' | `''` |
| `open` | boolean | false |

- Slotted `<gk-option value="…">Label</gk-option>`.
- Trigger chrome matches Input (height/border/yellow focus). Chevron suffix; clearable like Input.
- Listbox **portaled** to `document.body` (date-picker pattern + `computeFixedPanelPosition`); min width = trigger.
- Option hover/selected: `color-mix` brand **~22%** transparent; text `--gk-color-brand-on`. No solid yellow blocks.
- A11y: combobox + listbox + option; Escape / outside click close; Arrow+Enter select.
- `change` → `{ value: string }`.

## Deviations to call out in the PR

- Date Picker remains under Data Entry (not in the Wave 1 sidebar list; do not remove).
- Checkbox/Radio/Select disabled opacity 0.5 vs Switch 0.4.
- Select options via `<gk-option>` slot (not a JSON `options` prop).
