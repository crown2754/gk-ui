<script setup lang="ts">
import { ref } from "vue";

const right = ref(false);
const left = ref(false);
const top = ref(false);
const bottom = ref(false);
const filters = ref(false);
const bare = ref(false);

const codes = {
  right: `<gk-drawer :open="open" title="Details" placement="right" @update:open="open = $event.detail">...</gk-drawer>`,
  left: `<gk-drawer placement="left" title="Navigation" :open="open"></gk-drawer>`,
  top: `<gk-drawer placement="top" height="32vh" title="Notice" :open="open"></gk-drawer>`,
  bottom: `<gk-drawer placement="bottom" title="Sheet" :open="open"></gk-drawer>`,
  footer: `<gk-drawer :open="open" title="Filters">
  <span slot="footer"><gk-button>Apply</gk-button></span>
</gk-drawer>`,
  form: `<gk-drawer :open="open" title="Filters"><gk-input placeholder="Keyword"></gk-input></gk-drawer>`,
  mask: `<gk-drawer show-mask="false" :open="open" title="Peek"></gk-drawer>`,
};
</script>

# Drawer

Edge panel for filters, detail, and settings. It uses the same mask language as Modal: 40% black, mask z-index **3990**, panel **4000**. While open it locks body scroll and traps focus.

## Demos

<DemoCard title="Right" :code="codes.right">
  <template #description>
    Default <code>placement</code> is <code>right</code>. <code>width</code> defaults to 400.
  </template>
  <gk-button @click="right = true">Open right</gk-button>
  <gk-drawer title="Details" :open="right" @update:open="right = $event.detail">
    <p style="margin:0">Side panel content scrolls inside the body.</p>
  </gk-drawer>
</DemoCard>

<DemoCard title="Left" :code="codes.left">
  <template #description>
    <code>placement="left"</code>. On viewports ≤640px, left and right drawers use <code>calc(100% - 48px)</code>.
  </template>
  <gk-button variant="secondary" @click="left = true">Open left</gk-button>
  <gk-drawer placement="left" title="Navigation" width="320" :open="left" @update:open="left = $event.detail">
    <p style="margin:0">A narrower navigation pane.</p>
  </gk-drawer>
</DemoCard>

<DemoCard title="Top" :code="codes.top">
  <template #description>
    Top keeps a modest height so content below stays hinted. <code>height</code> defaults to <code>40vh</code>.
  </template>
  <gk-button variant="secondary" @click="top = true">Open top</gk-button>
  <gk-drawer placement="top" height="32vh" title="Notice" :open="top" @update:open="top = $event.detail">
    <p style="margin:0">A short banner drawer.</p>
  </gk-drawer>
</DemoCard>

<DemoCard title="Bottom" :code="codes.bottom">
  <template #description>
    Bottom uses a large top radius, the same sheet language as the date picker on small screens.
  </template>
  <gk-button variant="secondary" @click="bottom = true">Open bottom</gk-button>
  <gk-drawer placement="bottom" title="Quick actions" :open="bottom" @update:open="bottom = $event.detail">
    <p style="margin:0">Bottom sheet content.</p>
  </gk-drawer>
</DemoCard>

<DemoCard title="With footer" :code="codes.footer">
  <template #description>
    Slot <code>footer</code> for the same right-aligned actions as Modal.
  </template>
  <gk-button @click="filters = true">Filters</gk-button>
  <gk-drawer title="Filters" :open="filters" @update:open="filters = $event.detail">
    <p style="margin:0 0 0.75rem">Choose what stays visible.</p>
    <gk-input placeholder="Keyword"></gk-input>
    <div slot="footer" style="display:flex;gap:0.75rem;justify-content:flex-end;width:100%">
      <gk-button variant="secondary" @click="filters = false">Reset</gk-button>
      <gk-button @click="filters = false">Apply</gk-button>
    </div>
  </gk-drawer>
</DemoCard>

<DemoCard title="Form filters" :code="codes.form">
  <template #description>
    Body content scrolls. Fields use the same 34px control height as Input.
  </template>
  <gk-button variant="secondary" @click="filters = true">Open filters</gk-button>
</DemoCard>

<DemoCard title="No mask" :code="codes.mask">
  <template #description>
    <code>show-mask="false"</code> omits the mask and sets <code>aria-modal="false"</code>. Escape still closes when <code>closable</code>.
  </template>
  <gk-button variant="secondary" @click="bare = true">Peek</gk-button>
  <gk-drawer show-mask="false" title="Peek" width="280" :open="bare" @update:open="bare = $event.detail">
    <p style="margin:0">No dim layer behind this panel.</p>
  </gk-drawer>
</DemoCard>

## Alpine

```html
<div x-data="{ open: false }">
  <gk-button type="button" x-on:click="open = true">Filters</gk-button>
  <gk-drawer title="Filters" x-bind:open="open" x-on:update:open="open = $event.detail">
    <p>Edge panel</p>
  </gk-drawer>
</div>
```

## API

### Props

| Prop | Type | Default |
|------|------|---------|
| `open` | `boolean` | `false` |
| `title` | `string` | `''` |
| `placement` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` |
| `width` | `number \| string` | `400` |
| `height` | `number \| string` | `40vh` |
| `closable` | `boolean` | `true` |
| `mask-closable` | `boolean` | `true` |
| `show-mask` | `boolean` | `true` |

`width` applies to left/right. `height` applies to top/bottom. A bare number is pixels.

### Slots

| Name | Description |
|------|-------------|
| default | Body |
| `header` | Extra header content |
| `footer` | Actions |

### Events

| Name | Detail |
|------|--------|
| `update:open` | `false` when dismissed |
| `close` | Dismissed |

### CSS parts

`mask`, `panel`, `header`, `title`, `close`, `body`, `footer`.

The panel enters over 180ms with a 12px translate from its edge. It shares Modal’s blocking stack, so later dialogs and drawers sit 10 z-index steps higher.
