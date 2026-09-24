<script setup lang="ts">
import { ref } from "vue";

const last = ref("");

function onSelect(event: CustomEvent<{ key: string }>) {
  last.value = event.detail.key;
}

const codes = {
  basic: `<gk-dropdown label="More actions" variant="primary" @select="onSelect">
  <gk-dropdown-item key="edit" shortcut="⌘E">Edit</gk-dropdown-item>
  <gk-dropdown-item key="copy" shortcut="⌘C">Copy link</gk-dropdown-item>
  <gk-dropdown-item key="archive" disabled>Archive (unavailable)</gk-dropdown-item>
  <gk-dropdown-item type="divider"></gk-dropdown-item>
  <gk-dropdown-item key="delete" shortcut="⌫" danger>Delete</gk-dropdown-item>
</gk-dropdown>`,
  danger: `<gk-dropdown label="More">
  <gk-dropdown-item key="edit">Edit</gk-dropdown-item>
  <gk-dropdown-item type="divider"></gk-dropdown-item>
  <gk-dropdown-item key="delete" danger>Delete</gk-dropdown-item>
</gk-dropdown>`,
  shortcuts: `<gk-dropdown-item key="edit" shortcut="⌘E">Edit</gk-dropdown-item>`,
  disabled: `<gk-dropdown-item key="archive" disabled>Archive</gk-dropdown-item>`,
  placement: `<gk-dropdown label="Placement" placement="bottom-end"></gk-dropdown>`,
  icon: `<gk-dropdown>
  <gk-button slot="trigger" quaternary aria-label="More actions">⋯</gk-button>
  <gk-dropdown-item key="edit">Edit</gk-dropdown-item>
</gk-dropdown>`,
  text: `<gk-dropdown label="More actions">...</gk-dropdown>`,
};
</script>

# Dropdown

An action menu, not a form select. The menu reuses the Select listbox wash: white surface, 1px border, `--gk-radius-sm` (6px), and a 22% brand wash on hover. Danger rows use danger text and a soft danger wash. z-index is **4000**.

## Demos

<DemoCard title="Text and chevron" :code="codes.basic">
  <template #description>
    The built-in trigger is label plus a chevron. <code>variant="primary"</code> is the brand fill from the approved mock; the default variant is the outlined size scale below. Choosing an item emits <code>select</code> with <code>{ key, item }</code> and closes the menu.
  </template>
  <gk-dropdown label="More actions" variant="primary" @select="onSelect">
    <gk-dropdown-item key="edit" shortcut="⌘E">Edit</gk-dropdown-item>
    <gk-dropdown-item key="copy" shortcut="⌘C">Copy link</gk-dropdown-item>
    <gk-dropdown-item key="archive" disabled>Archive (unavailable)</gk-dropdown-item>
    <gk-dropdown-item type="divider"></gk-dropdown-item>
    <gk-dropdown-item key="delete" shortcut="⌫" danger>Delete</gk-dropdown-item>
  </gk-dropdown>
  <p style="margin:0;font-size:0.875rem;opacity:0.8">Last key: {{ last || "(none)" }}</p>
</DemoCard>

<DemoCard title="Danger and divider" :code="codes.danger">
  <template #description>
    <code>type="divider"</code> is a separator. <code>danger</code> paints the row in the danger color.
  </template>
  <gk-dropdown label="More">
    <gk-dropdown-item key="edit">Edit</gk-dropdown-item>
    <gk-dropdown-item key="copy">Copy link</gk-dropdown-item>
    <gk-dropdown-item type="divider"></gk-dropdown-item>
    <gk-dropdown-item key="delete" danger>Delete</gk-dropdown-item>
  </gk-dropdown>
</DemoCard>

<DemoCard title="Shortcuts" :code="codes.shortcuts">
  <template #description>
    <code>shortcut</code> is a muted hint on the right. It does not register a real keyboard shortcut.
  </template>
  <gk-dropdown label="With shortcuts">
    <gk-dropdown-item key="edit" shortcut="⌘E">Edit</gk-dropdown-item>
    <gk-dropdown-item key="copy" shortcut="⌘C">Copy link</gk-dropdown-item>
    <gk-dropdown-item key="delete" shortcut="⌫" danger>Delete</gk-dropdown-item>
  </gk-dropdown>
</DemoCard>

<DemoCard title="Disabled item" :code="codes.disabled">
  <template #description>
    A <code>disabled</code> item is muted and cannot be selected. Arrow keys skip it.
  </template>
  <gk-dropdown label="Disabled row">
    <gk-dropdown-item key="edit">Edit</gk-dropdown-item>
    <gk-dropdown-item key="archive" disabled>Archive (unavailable)</gk-dropdown-item>
    <gk-dropdown-item key="download">Download</gk-dropdown-item>
  </gk-dropdown>
</DemoCard>

<DemoCard title="Placement" :code="codes.placement">
  <template #description>
    Default placement is <code>bottom-start</code>. The menu flips when it would leave the viewport, same helper as Tooltip.
  </template>
  <div style="display:flex;justify-content:flex-end;width:100%">
    <gk-dropdown label="Bottom end" placement="bottom-end">
      <gk-dropdown-item key="view">View</gk-dropdown-item>
      <gk-dropdown-item key="rename">Rename</gk-dropdown-item>
    </gk-dropdown>
  </div>
</DemoCard>

<DemoCard title="Trigger sizes" :code="codes.text">
  <template #description>
    Without a <code>trigger</code> slot, the outlined button shows <code>label</code> plus a chevron. Heights follow <code>size</code>: 28 / 34 / 40. Default size is <code>md</code>.
  </template>
  <gk-dropdown label="Small" size="sm">
    <gk-dropdown-item key="view">View</gk-dropdown-item>
    <gk-dropdown-item key="rename">Rename</gk-dropdown-item>
  </gk-dropdown>
  <gk-dropdown label="Medium">
    <gk-dropdown-item key="view">View</gk-dropdown-item>
  </gk-dropdown>
  <gk-dropdown label="Large" size="lg">
    <gk-dropdown-item key="view">View</gk-dropdown-item>
  </gk-dropdown>
</DemoCard>

<DemoCard title="Icon / quaternary trigger" :code="codes.icon">
  <template #description>
    Slot any trigger, including <code>gk-button quaternary</code>. The menu chrome stays the same. <code>quaternary</code> was added to Button for this quiet icon trigger; Button previously had <code>text</code>, <code>dashed</code>, and <code>secondary</code> only.
  </template>
  <gk-dropdown>
    <gk-button slot="trigger" quaternary aria-label="More actions">⋯</gk-button>
    <gk-dropdown-item key="edit">Edit</gk-dropdown-item>
    <gk-dropdown-item key="copy">Copy link</gk-dropdown-item>
    <gk-dropdown-item type="divider"></gk-dropdown-item>
    <gk-dropdown-item key="delete" danger>Delete</gk-dropdown-item>
  </gk-dropdown>
</DemoCard>

## Alpine

```html
<div x-data="{ key: '' }">
  <gk-dropdown label="More" x-on:select="key = $event.detail.key">
    <gk-dropdown-item key="edit">Edit</gk-dropdown-item>
    <gk-dropdown-item key="copy">Copy</gk-dropdown-item>
  </gk-dropdown>
  <span x-text="key"></span>
</div>
```

## API

### Dropdown props

| Prop | Type | Default |
|------|------|---------|
| `label` | `string` | `''` |
| `placement` | placement string | `'bottom-start'` |
| `trigger` | `'click' \| 'hover' \| 'manual'` | `'click'` |
| `disabled` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `variant` | `'default' \| 'primary'` | `'default'` |
| `open` | `boolean` | `false` |

### Dropdown item props

| Prop | Type | Default |
|------|------|---------|
| `key` | `string` | `''` |
| `label` | `string` | `''` |
| `shortcut` | `string` | `''` |
| `type` | `'item' \| 'divider'` | `'item'` |
| `disabled` | `boolean` | `false` |
| `danger` | `boolean` | `false` |

### Slots

| Name | Description |
|------|-------------|
| `trigger` | Custom trigger. Falls back to a text + chevron button |
| default | `gk-dropdown-item` children |

### Events

| Name | Detail |
|------|--------|
| `select` | `{ key, item }` |
| `update:open` | Next `boolean` |
| `open` / `close` | Fired when the menu opens or closes |

### Keyboard

Arrow Up/Down move the active item, Home/End jump, Enter selects, Escape closes. Outside clicks close. The trigger exposes `aria-haspopup="menu"` and `aria-expanded`. Items are `menuitem`; dividers are `separator`.

### CSS parts

`gk-dropdown`: `trigger`, `menu`. `gk-dropdown-item`: `item`, `label`, `shortcut`, `divider`.

Menu radius uses `--gk-radius-sm` (0.375rem, 6px), the same token as the Select listbox. The spec also wrote `--gk-radius-md` next to “6px”; that token is 0.5rem, so the approved 6px mock and the Select wash win.
