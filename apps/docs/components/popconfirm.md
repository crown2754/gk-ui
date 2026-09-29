<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);

function onOpen(event: CustomEvent<boolean>) {
  open.value = event.detail;
}

const codes = {
  basic: `<gk-popconfirm title="Save this draft?" content="You can keep editing later.">
  <gk-button>Save draft</gk-button>
</gk-popconfirm>`,
  placements: `<gk-popconfirm placement="top" title="Above">...</gk-popconfirm>
<gk-popconfirm placement="bottom" title="Below">...</gk-popconfirm>
<gk-popconfirm placement="left" title="Left">...</gk-popconfirm>
<gk-popconfirm placement="right" title="Right">...</gk-popconfirm>`,
  danger: `<gk-popconfirm type="error" title="Delete this?" content="This cannot be undone." ok-text="Delete">
  <gk-button variant="danger">Delete</gk-button>
</gk-popconfirm>`,
  texts: `<gk-popconfirm title="Publish?" ok-text="Publish" cancel-text="Not now">
  <gk-button>Publish</gk-button>
</gk-popconfirm>`,
  icon: `<gk-popconfirm type="warning" title="Archive this file?" content="It stays available in Archive.">
  <gk-button variant="secondary" aria-label="Archive">···</gk-button>
</gk-popconfirm>`,
  cancel: `<gk-popconfirm show-cancel="false" title="Mark as read?">
  <gk-button variant="secondary">Mark read</gk-button>
</gk-popconfirm>`,
  arrow: `<gk-popconfirm show-arrow="false" title="No arrow" content="The panel still flips at the viewport edge.">
  <gk-button variant="secondary">No arrow</gk-button>
</gk-popconfirm>`,
  controlled: `<gk-popconfirm
  :open="open"
  title="Leave this page?"
  content="Unsaved notes will be kept locally."
  @update:open="onOpen"
>
  <gk-button>Leave</gk-button>
</gk-popconfirm>`,
};
</script>

# Popconfirm

A confirm popover anchored to a trigger. It is not a modal: no mask by default, and the panel uses the light Dropdown surface. In Chinese this component is 確認浮層.

The panel z-index is **4000**, the same as Tooltip and Dropdown. Each nested overlay adds **10**. OK and Cancel are 34px tall.

## Demos

<DemoCard title="Basic" :code="codes.basic">
  <template #description>
    Click the trigger to toggle. OK emits <code>confirm</code> and closes. Cancel, Escape, and an outside click emit <code>cancel</code> with <code>{ reason }</code>. Toggling the trigger does not emit <code>cancel</code>.
  </template>
  <gk-popconfirm title="Save this draft?" content="You can keep editing later.">
    <gk-button>Save draft</gk-button>
  </gk-popconfirm>
</DemoCard>

<DemoCard title="Placements" :code="codes.placements">
  <template #description>
    <code>top</code>, <code>bottom</code>, <code>left</code>, <code>right</code>, plus <code>-start</code> / <code>-end</code>. The panel flips when it would leave the viewport.
  </template>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:4.5rem 2rem;padding:4rem 1rem;width:100%">
    <gk-popconfirm placement="top" title="Placed above" content="Default placement.">
      <gk-button variant="secondary">Top</gk-button>
    </gk-popconfirm>
    <gk-popconfirm placement="bottom" title="Placed below">
      <gk-button variant="secondary">Bottom</gk-button>
    </gk-popconfirm>
    <gk-popconfirm placement="left" title="Placed left">
      <gk-button variant="secondary">Left</gk-button>
    </gk-popconfirm>
    <gk-popconfirm placement="right" title="Placed right">
      <gk-button variant="secondary">Right</gk-button>
    </gk-popconfirm>
  </div>
</DemoCard>

<DemoCard title="Warning and delete" :code="codes.danger">
  <template #description>
    <code>warning</code> and <code>error</code> use a danger OK button and an icon. <code>error</code> is an <code>alertdialog</code> and moves focus to Cancel.
  </template>
  <gk-popconfirm type="warning" title="Archive this project?" content="You can restore it from Archive." ok-text="Archive">
    <gk-button variant="secondary">Archive</gk-button>
  </gk-popconfirm>
  <gk-popconfirm type="error" title="Delete this project?" content="This cannot be undone." ok-text="Delete">
    <gk-button variant="danger">Delete</gk-button>
  </gk-popconfirm>
</DemoCard>

<DemoCard title="Custom texts" :code="codes.texts">
  <template #description>
    Empty <code>ok-text</code> / <code>cancel-text</code> follow the document language: OK / Cancel, or 確定 / 取消.
  </template>
  <gk-popconfirm title="Publish now?" content="The page goes live." ok-text="Publish" cancel-text="Not now">
    <gk-button>Publish</gk-button>
  </gk-popconfirm>
</DemoCard>

<DemoCard title="Icon trigger" :code="codes.icon">
  <template #description>
    The trigger can be an icon button. Keep the hit target at least 34px.
  </template>
  <gk-popconfirm type="warning" title="Archive this file?" content="It stays available in Archive.">
    <gk-button variant="secondary" aria-label="Archive">···</gk-button>
  </gk-popconfirm>
</DemoCard>

<DemoCard title="No cancel" :code="codes.cancel">
  <template #description>
    <code>show-cancel="false"</code> leaves only OK. Outside click and Escape still dismiss.
  </template>
  <gk-popconfirm show-cancel="false" title="Mark as read?" content="This thread leaves the inbox.">
    <gk-button variant="secondary">Mark read</gk-button>
  </gk-popconfirm>
</DemoCard>

<DemoCard title="Arrow off" :code="codes.arrow">
  <template #description>
    <code>show-arrow</code> defaults to true. Set <code>show-arrow="false"</code> to hide the 8px arrow.
  </template>
  <gk-popconfirm show-arrow="false" title="No arrow" content="The panel still flips at the viewport edge.">
    <gk-button variant="secondary">No arrow</gk-button>
  </gk-popconfirm>
</DemoCard>

<DemoCard title="Controlled" :code="codes.controlled">
  <template #description>
    <code>open</code> and <code>show</code> are aliases. <code>update:open</code> and <code>update:show</code> carry the next boolean. <code>mask</code> defaults to false; set it only when you want the 40% dim layer and a scroll lock. Async loading on OK is a follow-up — compose it in the app.
  </template>
  <gk-popconfirm
    :open="open"
    title="Leave this page?"
    content="Unsaved notes will be kept locally."
    @update:open="onOpen"
  >
    <gk-button>Leave</gk-button>
  </gk-popconfirm>
  <gk-button variant="secondary" @click="open = !open">{{ open ? "Close from outside" : "Open from outside" }}</gk-button>
</DemoCard>

## Alpine

```html
<gk-popconfirm title="Save this draft?" content="You can keep editing later.">
  <button type="button">Save draft</button>
</gk-popconfirm>
```

## API

### Props

| Prop | Type | Default |
|------|------|---------|
| `open` / `show` | `boolean` | `false` |
| `title` | `string` | `''` |
| `content` / `message` | `string` | `''` |
| `placement` | Tooltip placements | `'top'` |
| `trigger` | `'click' \| 'manual'` | `'click'` |
| `type` | `'default' \| 'warning' \| 'error'` | `'default'` |
| `ok-text` | `string` | `''` (OK / 確定) |
| `cancel-text` | `string` | `''` (Cancel / 取消) |
| `show-cancel` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `show-arrow` | `boolean` | `true` |
| `mask` | `boolean` | `false` |

v1 opens on click. `trigger="manual"` leaves opening to `open` / `show`. Hover does not open a confirm.

### Slots

| Name | Description |
|------|-------------|
| default | Trigger |
| `title` | Title |
| `content` | Supporting copy |
| `footer` / `action` | Replaces the default OK and Cancel buttons |

### Events

| Name | Detail |
|------|--------|
| `update:open` / `update:show` | Next `boolean` |
| `open` / `close` | — |
| `confirm` | OK clicked. The panel then closes. |
| `cancel` | `{ reason: 'cancel' \| 'outside' \| 'escape' }` |

### CSS parts

`trigger`, `panel`, `arrow`, `icon`, `title`, `content`, `footer`, `ok`, `cancel`, `mask`.

### Accessibility

- The panel is `role="dialog"`. `type="error"` uses `role="alertdialog"`.
- `aria-modal` is `true` only when `mask` is set.
- The title and content are referenced with `aria-labelledby` and `aria-describedby`.
- The trigger gets `aria-haspopup="dialog"` and `aria-expanded`.
- Default confirms focus OK. Warning and error focus Cancel when it is shown.
- Tab cycles inside the panel. Escape closes only the topmost overlay and restores focus to the trigger.
