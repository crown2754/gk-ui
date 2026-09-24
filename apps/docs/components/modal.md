<script setup lang="ts">
import { ref } from "vue";

const basic = ref(false);
const widths = ref(false);
const width = ref("md");
const dialog = ref(false);
const danger = ref(false);
const formOpen = ref(false);
const formName = ref("");
const loadingOpen = ref(false);
const loading = ref(false);
const locked = ref(false);
const maskLocked = ref(false);
const outer = ref(false);
const inner = ref(false);

function confirmSave() {
  loading.value = true;
  window.setTimeout(() => {
    loading.value = false;
    loadingOpen.value = false;
  }, 900);
}

const codes = {
  basic: `<gk-button @click="basic = true">Open modal</gk-button>
<gk-modal
  :open="basic"
  title="Save changes?"
  @update:open="basic = $event.detail"
>
  <p>Unsaved edits will be written to the workspace.</p>
  <div slot="footer">
    <gk-button variant="secondary" @click="basic = false">Cancel</gk-button>
    <gk-button @click="basic = false">Save</gk-button>
  </div>
</gk-modal>`,
  width: `<gk-modal :open="open" :width="width" title="Width">...</gk-modal>`,
  dialog: `<gk-modal preset="dialog" title="Publish?" :open="open" @confirm="open = false" @update:open="open = $event.detail"></gk-modal>`,
  danger: `<gk-modal title="Delete project?" :open="open" width="sm" @update:open="open = $event.detail">
  <p>This cannot be undone.</p>
  <div slot="footer">
    <gk-button variant="ghost" @click="open = false">Cancel</gk-button>
    <gk-button variant="danger" @click="open = false">Delete</gk-button>
  </div>
</gk-modal>`,
  form: `<gk-modal title="Edit profile" preset="card" :open="open">
  <gk-input label-like placeholder="Name"></gk-input>
</gk-modal>`,
  loading: `<gk-modal preset="dialog" :loading="loading" :open="open" title="Publishing" @confirm="confirmSave"></gk-modal>`,
  locked: `<gk-modal :closable="false" title="Required" :open="open">...</gk-modal>`,
  mask: `<gk-modal :mask-closable="false" title="Stay open" :open="open">...</gk-modal>`,
  nested: `<gk-modal :open="outer" title="First">
  <gk-button @click="inner = true">Open another</gk-button>
</gk-modal>
<gk-modal :open="inner" title="Second"></gk-modal>`,
};
</script>

# Modal

Centered dialog over a dim mask. Focus stays inside the panel until it closes.

Mask uses `color-mix(in srgb, #000 40%, transparent)` at z-index **3990**. The panel sits at **4000**. A second modal stacks **+10** per level. Escape and mask clicks apply only to the topmost dialog; closing it restores focus to the previous panel.

## Demos

<DemoCard title="Basic" :code="codes.basic">
  <template #description>
    <code>open</code> is controlled. Dismissals emit <code>update:open</code> with <code>detail: false</code> and <code>close</code>.
  </template>
  <gk-button @click="basic = true">Open modal</gk-button>
  <gk-modal :open="basic" title="Save changes?" @update:open="basic = $event.detail">
    <p style="margin:0">Unsaved edits will be written to the workspace. You can undo this later.</p>
    <div slot="footer" style="display:flex;gap:0.75rem;justify-content:flex-end;width:100%">
      <gk-button variant="secondary" @click="basic = false">Cancel</gk-button>
      <gk-button @click="basic = false">Save</gk-button>
    </div>
  </gk-modal>
</DemoCard>

<DemoCard title="Width presets" :code="codes.width">
  <template #description>
    <code>sm</code> 400 / <code>md</code> 520 / <code>lg</code> 720. A number is pixels. At ≤640px the panel uses a 16px side margin and <code>max-height: 85vh</code>.
  </template>
  <gk-button size="sm" variant="secondary" @click="width = 'sm'; widths = true">sm · 400</gk-button>
  <gk-button @click="width = 'md'; widths = true">md · 520</gk-button>
  <gk-button size="lg" variant="secondary" @click="width = 'lg'; widths = true">lg · 720</gk-button>
  <gk-modal :open="widths" :width="width" :title="'Width ' + width" @update:open="widths = $event.detail">
    <p style="margin:0">Current width token: {{ width }}</p>
  </gk-modal>
</DemoCard>

<DemoCard title="Dialog confirm" :code="codes.dialog">
  <template #description>
    <code>preset="dialog"</code> renders Cancel and Confirm. Confirm emits <code>confirm</code> and does not close by itself.
  </template>
  <gk-button @click="dialog = true">Confirm</gk-button>
  <gk-modal preset="dialog" title="Publish changes?" :open="dialog" @confirm="dialog = false" @update:open="dialog = $event.detail">
    <p style="margin:0">The primary action emits <code>confirm</code>.</p>
  </gk-modal>
</DemoCard>

<DemoCard title="Danger confirm" :code="codes.danger">
  <template #description>
    Slot a danger button in <code>footer</code> when the action cannot be undone.
  </template>
  <gk-button variant="danger" @click="danger = true">Delete</gk-button>
  <gk-modal title="Delete project?" width="sm" :open="danger" @update:open="danger = $event.detail">
    <p style="margin:0">“Booth intro” will be removed permanently.</p>
    <div slot="footer" style="display:flex;gap:0.75rem;justify-content:flex-end;width:100%">
      <gk-button variant="ghost" @click="danger = false">Cancel</gk-button>
      <gk-button variant="danger" @click="danger = false">Delete</gk-button>
    </div>
  </gk-modal>
</DemoCard>

<DemoCard title="Form in body" :code="codes.form">
  <template #description>
    <code>preset="card"</code> is a padded content shell. Put fields in the default slot.
  </template>
  <gk-button variant="secondary" @click="formOpen = true">Edit profile</gk-button>
  <gk-modal preset="card" title="Edit profile" :open="formOpen" @update:open="formOpen = $event.detail">
    <gk-input placeholder="Display name" :value="formName" @input="formName = $event.detail?.value ?? $event.target?.value ?? formName"></gk-input>
    <div slot="footer" style="display:flex;gap:0.75rem;justify-content:flex-end;width:100%">
      <gk-button variant="secondary" @click="formOpen = false">Cancel</gk-button>
      <gk-button @click="formOpen = false">Save</gk-button>
    </div>
  </gk-modal>
</DemoCard>

<DemoCard title="Loading confirm" :code="codes.loading">
  <template #description>
    <code>loading</code> shows a spinner on the dialog primary button and ignores confirm clicks.
  </template>
  <gk-button @click="loadingOpen = true">Publish</gk-button>
  <gk-modal
    preset="dialog"
    title="Publishing"
    confirm-text="Publish"
    :open="loadingOpen"
    :loading="loading"
    @confirm="confirmSave"
    @update:open="loadingOpen = $event.detail"
  >
    <p style="margin:0">Uploading assets…</p>
  </gk-modal>
</DemoCard>

<DemoCard title="Non-closable" :code="codes.locked">
  <template #description>
    <code>closable="false"</code> hides the close button and ignores Escape.
  </template>
  <gk-button variant="secondary" @click="locked = true">Open locked</gk-button>
  <gk-modal :closable="false" title="Action required" :open="locked">
    <p style="margin:0 0 0.75rem">Finish this step to continue.</p>
    <gk-button @click="locked = false">Continue</gk-button>
  </gk-modal>
</DemoCard>

<DemoCard title="Mask not closable" :code="codes.mask">
  <template #description>
    <code>mask-closable="false"</code> keeps the mask but ignores clicks on it. Escape and the close button still dismiss when <code>closable</code>.
  </template>
  <gk-button variant="secondary" @click="maskLocked = true">Open</gk-button>
  <gk-modal :mask-closable="false" title="Mask stays" :open="maskLocked" @update:open="maskLocked = $event.detail">
    <p style="margin:0">Clicking the dim layer does nothing.</p>
  </gk-modal>
</DemoCard>

<DemoCard title="Nested modal" :code="codes.nested">
  <template #description>
    A second modal is allowed. Its mask is 4000 and its panel is 4010. Only the top dialog receives Escape and mask clicks. Closing it focuses the previous panel.
  </template>
  <gk-button @click="outer = true">Open first</gk-button>
  <gk-modal title="First dialog" :open="outer" @update:open="outer = $event.detail">
    <p style="margin:0 0 0.75rem">This panel stays underneath.</p>
    <gk-button variant="secondary" @click="inner = true">Open second</gk-button>
  </gk-modal>
  <gk-modal title="Second dialog" width="sm" :open="inner" @update:open="inner = $event.detail">
    <p style="margin:0">Escape closes only this layer.</p>
  </gk-modal>
</DemoCard>

## Alpine

```html
<div x-data="{ open: false }">
  <gk-button type="button" x-on:click="open = true">Open</gk-button>
  <gk-modal
    title="Hello"
    x-bind:open="open"
    x-on:update:open="open = $event.detail"
  >
    <p>Alpine can drive the same element.</p>
  </gk-modal>
</div>
```

The string `"false"` is treated as closed, so attribute bindings from Alpine work.

## API

### Props

| Prop | Type | Default |
|------|------|---------|
| `open` | `boolean` | `false` |
| `title` | `string` | `''` |
| `closable` | `boolean` | `true` |
| `mask-closable` | `boolean` | `true` |
| `preset` | `'dialog' \| 'card' \| ''` | `''` |
| `width` | `number \| 'sm' \| 'md' \| 'lg'` | `'md'` (520px) |
| `loading` | `boolean` | `false` |
| `confirm-text` | `string` | `'Confirm'` |
| `cancel-text` | `string` | `'Cancel'` |

`confirm-text` and `cancel-text` label the built-in dialog footer. Slot `footer` to replace that footer.

### Slots

| Name | Description |
|------|-------------|
| default | Body |
| `header` | Extra header content beside `title` |
| `footer` | Actions. Replaces the dialog preset buttons when present |

### Events

| Name | Detail |
|------|--------|
| `update:open` | `false` when dismissed |
| `close` | Dismissed (Escape, mask, close, cancel) |
| `confirm` | Dialog primary action. Does not close automatically |

### CSS parts

`mask`, `panel`, `header`, `title`, `close`, `body`, `footer`, plus `cancel` / `confirm` / `spinner` on the dialog preset buttons.

Enter and leave use a 180ms opacity and 10px translate. The panel is `position: fixed` inside the component shadow tree so `::part` works. It is not portaled to `document.body` the way Select and Date Picker panels are.

### Stacking

| Level | Mask | Panel |
|-------|------|-------|
| 0 | 3990 | 4000 |
| 1 | 4000 | 4010 |

Drawers share this blocking stack, so a dialog opened after a drawer paints above it.
