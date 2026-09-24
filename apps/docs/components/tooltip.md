<script setup lang="ts">
const codes = {
  placements: `<gk-tooltip content="Save edits" placement="top"><gk-button>Top</gk-button></gk-tooltip>
<gk-tooltip content="More options" placement="bottom"><gk-button variant="secondary">Bottom</gk-button></gk-tooltip>
<gk-tooltip content="Go back" placement="left"><gk-button variant="secondary">Left</gk-button></gk-tooltip>
<gk-tooltip content="Open filters" placement="right"><gk-button>Right</gk-button></gk-tooltip>`,
  arrow: `<gk-tooltip content="With arrow"><gk-button variant="secondary">Arrow</gk-button></gk-tooltip>
<gk-tooltip content="No arrow" arrow="false"><gk-button variant="secondary">No arrow</gk-button></gk-tooltip>`,
  long: `<gk-tooltip content="Long tips wrap inside 240px and stay readable."><gk-button variant="secondary">Long</gk-button></gk-tooltip>`,
  disabled: `<gk-tooltip disabled content="Hidden"><gk-button variant="secondary">Disabled</gk-button></gk-tooltip>`,
  focus: `<gk-tooltip content="Keyboard only" trigger="focus" delay="0"><gk-button variant="secondary">Focus</gk-button></gk-tooltip>`,
};
</script>

# Tooltip

Lightweight hover and focus tip. It is not a dialog: no mask, no focus trap, and it does not move focus.

The default surface is the dark tip (`--gk-color-on-surface` with `--gk-color-surface` text), max-width 240px, padding 6px 10px, radius `--gk-radius-sm`, shadow `--gk-shadow-md`, z-index **4000**. Show delay defaults to 200ms and hide to 100ms.

## Demos

<DemoCard title="Placements" :code="codes.placements">
  <template #description>
    <code>top</code>, <code>bottom</code>, <code>left</code>, <code>right</code>, plus <code>-start</code> / <code>-end</code>. The tip flips when it would leave the viewport.
  </template>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:3.5rem 2rem;padding:3rem 1rem;width:100%">
    <gk-tooltip content="Save edits" placement="top"><gk-button>Top</gk-button></gk-tooltip>
    <gk-tooltip content="More options" placement="bottom"><gk-button variant="secondary">Bottom</gk-button></gk-tooltip>
    <gk-tooltip content="Go back" placement="left"><gk-button variant="secondary">Left</gk-button></gk-tooltip>
    <gk-tooltip content="Open filters" placement="right"><gk-button>Right</gk-button></gk-tooltip>
  </div>
</DemoCard>

<DemoCard title="With arrow" :code="codes.arrow">
  <template #description>
    <code>arrow</code> (alias <code>show-arrow</code>) defaults to true. Set <code>arrow="false"</code> to hide the 8px triangle.
  </template>
  <gk-tooltip content="Saved locally"><gk-button variant="secondary">Arrow</gk-button></gk-tooltip>
  <gk-tooltip content="No pointer" arrow="false"><gk-button variant="secondary">No arrow</gk-button></gk-tooltip>
</DemoCard>

<DemoCard title="Long wrap" :code="codes.long">
  <template #description>
    Text wraps inside the 240px max width instead of shrinking the type.
  </template>
  <gk-tooltip content="Filters apply to the current board only. They reset when you leave this view.">
    <gk-button variant="secondary">Long tip</gk-button>
  </gk-tooltip>
</DemoCard>

<DemoCard title="Disabled" :code="codes.disabled">
  <template #description>
    <code>disabled</code> never shows the tip.
  </template>
  <gk-tooltip disabled content="You will not see this">
    <gk-button variant="secondary">Disabled</gk-button>
  </gk-tooltip>
</DemoCard>

<DemoCard title="Focus only" :code="codes.focus">
  <template #description>
    <code>trigger</code> accepts <code>hover</code>, <code>focus</code>, or <code>hover focus</code> (default). Escape hides the tip without moving focus. <code>update:show</code> reports the next boolean.
  </template>
  <gk-tooltip content="Shown on keyboard focus" trigger="focus" delay="0">
    <gk-button variant="secondary">Tab to me</gk-button>
  </gk-tooltip>
</DemoCard>

## Alpine

```html
<gk-tooltip content="Save" placement="top">
  <button type="button">Save</button>
</gk-tooltip>
```

## API

### Props

| Prop | Type | Default |
|------|------|---------|
| `content` | `string` | `''` |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` and `-start` / `-end` | `'top'` |
| `trigger` | `'hover' \| 'focus' \| 'hover focus'` | `'hover focus'` |
| `arrow` / `show-arrow` | `boolean` | `true` |
| `delay` | `number \| 'show,hide'` | `200` show / `100` hide |
| `disabled` | `boolean` | `false` |
| `show` | `boolean` | `false` |

### Slots

| Name | Description |
|------|-------------|
| default | Trigger |
| `content` | Tip body. Falls back to the `content` property |

### Events

| Name | Detail |
|------|--------|
| `update:show` | Next `boolean` |

### CSS parts

`trigger`, `tip`, `arrow`.

The tip uses `role="tooltip"` and sets `aria-describedby` on the trigger while visible. It is `position: fixed` in the shadow tree (z-index 4000) so `::part(tip)` works and it is not clipped by `overflow: hidden` ancestors that do not create a containing block.

### Placement

If the preferred side does not fit, the main axis flips (top ↔ bottom, left ↔ right). Start/end alignment is kept, then the tip is clamped inside the viewport with an 8–10px gap.
