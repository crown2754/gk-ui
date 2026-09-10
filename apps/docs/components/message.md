<script setup lang="ts">
import { gkMessage } from "@gk-ui/core";

function showInfo() {
  gkMessage.info("Informational message");
}

function showSuccess() {
  gkMessage.success("Saved successfully");
}

function showWarning() {
  gkMessage.warning("Please check your input");
}

function showError() {
  gkMessage.error("Something went wrong");
}

function showDefault() {
  gkMessage.create("Default message");
}

function showLoading() {
  const h = gkMessage.loading("Loading…");
  window.setTimeout(() => h.destroy(), 2000);
}

function showClosable() {
  gkMessage.info("You can dismiss this", { closable: true, duration: 0 });
}

function showShortDuration() {
  gkMessage.success("Disappears in 1s", { duration: 1000 });
}

function showPersistent() {
  gkMessage.warning("Stays until closed", { duration: 0, closable: true });
}

function showBottomRight() {
  gkMessage.info("Bottom-right placement");
}

function destroyAll() {
  gkMessage.destroyAll();
}

const codes = {
  basic: `<gk-message-provider>
  <gk-button @click="() => gkMessage.info('Informational message')">Info</gk-button>
  <gk-button @click="() => gkMessage.success('Saved successfully')">Success</gk-button>
  <gk-button @click="() => gkMessage.warning('Please check your input')">Warning</gk-button>
  <gk-button @click="() => gkMessage.error('Something went wrong')">Error</gk-button>
</gk-message-provider>`,
  types: `<gk-message-provider>
  <gk-button @click="() => gkMessage.create('Default message')">Default</gk-button>
  <gk-button @click="() => gkMessage.info('Informational message')">Info</gk-button>
  <gk-button @click="() => gkMessage.success('Saved successfully')">Success</gk-button>
  <gk-button @click="() => gkMessage.warning('Please check your input')">Warning</gk-button>
  <gk-button @click="() => gkMessage.error('Something went wrong')">Error</gk-button>
  <gk-button @click="() => {
    const h = gkMessage.loading('Loading…');
    window.setTimeout(() => h.destroy(), 2000);
  }">Loading (2s)</gk-button>
</gk-message-provider>`,
  closable: `<gk-message-provider>
  <gk-button @click="() => gkMessage.info('You can dismiss this', { closable: true, duration: 0 })">
    Closable message
  </gk-button>
</gk-message-provider>`,
  duration: `<gk-message-provider>
  <gk-button @click="() => gkMessage.success('Disappears in 1s', { duration: 1000 })">
    1 second
  </gk-button>
  <gk-button @click="() => gkMessage.warning('Stays until closed', { duration: 0, closable: true })">
    Duration 0
  </gk-button>
</gk-message-provider>`,
  placement: `<gk-message-provider placement="bottom-right">
  <gk-button @click="() => gkMessage.info('Bottom-right placement')">
    Bottom right
  </gk-button>
</gk-message-provider>`,
  destroyAll: `<gk-message-provider>
  <gk-button @click="() => gkMessage.info('One')">Info</gk-button>
  <gk-button @click="() => gkMessage.success('Two')">Success</gk-button>
  <gk-button @click="() => gkMessage.destroyAll()">Destroy all</gk-button>
</gk-message-provider>`,
};
</script>

# Message

Message shows global toast feedback via an imperative API. Wrap the app (or each demo) in `<gk-message-provider>`; call `gkMessage` to create, update lifecycle with `destroy()` / `destroyAll()`. Unlike Alert, Message owns its lifecycle and removes itself from the queue.

## Demos

<DemoCard title="Basic" :code="codes.basic">
  <template #description>
    Trigger <code>gkMessage.info</code>, <code>success</code>, <code>warning</code>, and <code>error</code>. Requires a connected <code>gk-message-provider</code>.
  </template>
  <gk-message-provider>
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
      <gk-button variant="info" @click="showInfo">Info</gk-button>
      <gk-button variant="success" @click="showSuccess">Success</gk-button>
      <gk-button variant="warning" @click="showWarning">Warning</gk-button>
      <gk-button variant="danger" @click="showError">Error</gk-button>
    </div>
  </gk-message-provider>
</DemoCard>

<DemoCard title="Types" :code="codes.types">
  <template #description>
    Types: <code>default</code>, <code>info</code>, <code>success</code>, <code>warning</code>, <code>error</code>, and <code>loading</code>. Loading defaults to no auto-dismiss; this demo destroys the handle after 2s.
  </template>
  <gk-message-provider>
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
      <gk-button @click="showDefault">Default</gk-button>
      <gk-button variant="info" @click="showInfo">Info</gk-button>
      <gk-button variant="success" @click="showSuccess">Success</gk-button>
      <gk-button variant="warning" @click="showWarning">Warning</gk-button>
      <gk-button variant="danger" @click="showError">Error</gk-button>
      <gk-button variant="primary" @click="showLoading">Loading (2s)</gk-button>
    </div>
  </gk-message-provider>
</DemoCard>

<DemoCard title="Closable" :code="codes.closable">
  <template #description>
    Pass <code>{ closable: true }</code> per call (or set <code>closable</code> on the provider). Close removes the message from the queue.
  </template>
  <gk-message-provider>
    <gk-button variant="info" @click="showClosable">Closable message</gk-button>
  </gk-message-provider>
</DemoCard>

<DemoCard title="Duration" :code="codes.duration">
  <template #description>
    Override duration per call. Provider default is <code>3000</code> ms; <code>0</code> means no auto-dismiss.
  </template>
  <gk-message-provider>
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
      <gk-button variant="success" @click="showShortDuration">1 second</gk-button>
      <gk-button variant="warning" @click="showPersistent">Duration 0</gk-button>
    </div>
  </gk-message-provider>
</DemoCard>

<DemoCard title="Placement" :code="codes.placement">
  <template #description>
    Set <code>placement</code> on this demo’s provider only. Values: <code>top</code>, <code>top-left</code>, <code>top-right</code>, <code>bottom</code>, <code>bottom-left</code>, <code>bottom-right</code>.
  </template>
  <gk-message-provider placement="bottom-right">
    <gk-button variant="info" @click="showBottomRight">Bottom right</gk-button>
  </gk-message-provider>
</DemoCard>

<DemoCard title="Destroy all" :code="codes.destroyAll">
  <template #description>
    <code>gkMessage.destroyAll()</code> dismisses every message on the active provider.
  </template>
  <gk-message-provider>
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
      <gk-button variant="info" @click="showInfo">Info</gk-button>
      <gk-button variant="success" @click="showSuccess">Success</gk-button>
      <gk-button variant="warning" @click="showWarning">Warning</gk-button>
      <gk-button @click="destroyAll">Destroy all</gk-button>
    </div>
  </gk-message-provider>
</DemoCard>

## API

### `gk-message-provider` Props

| Prop | Type | Default |
|------|------|---------|
| `placement` | `'top' \| 'top-left' \| 'top-right' \| 'bottom' \| 'bottom-left' \| 'bottom-right'` | `'top'` |
| `duration` | `number` | `3000` |
| `closable` | `boolean` | `false` |
| `keep-alive-on-hover` | `boolean` | `false` |
| `max` | `number` | — |

### `gk-message-provider` Slots

| Name | Description |
|------|-------------|
| default | Application / page content |

### `gkMessage`

Imported from `@gk-ui/core`. Requires a connected `<gk-message-provider>`.

| Method | Signature | Notes |
|--------|-----------|-------|
| `create` | `(content: string, options?: GkMessageOptions) => GkMessageReactive` | Generic create |
| `info` | `(content: string, options?: GkMessageOptions) => GkMessageReactive` | `type: 'info'` |
| `success` | `(content: string, options?: GkMessageOptions) => GkMessageReactive` | `type: 'success'` |
| `warning` | `(content: string, options?: GkMessageOptions) => GkMessageReactive` | `type: 'warning'` |
| `error` | `(content: string, options?: GkMessageOptions) => GkMessageReactive` | `type: 'error'` |
| `loading` | `(content: string, options?: GkMessageOptions) => GkMessageReactive` | `type: 'loading'`; default `duration: 0` |
| `destroyAll` | `() => void` | Dismiss all on the active provider |

**`GkMessageOptions`:** `type`, `duration`, `closable`, `keepAliveOnHover`, `showIcon` (default `true`).

**`GkMessageReactive`:** `{ destroy: () => void }`.

### `gk-message` Props

| Prop | Type | Default |
|------|------|---------|
| `type` | `'default' \| 'info' \| 'success' \| 'warning' \| 'error' \| 'loading'` | `'default'` |
| `content` | `string` | `''` |
| `closable` | `boolean` | `false` |
| `show-icon` | `boolean` | `true` |

### `gk-message` Events

| Name | Description |
|------|-------------|
| `gk-close` | Close control activated; bubbles; `composed: true` |

### CSS Parts (`gk-message`)

| Part | Description |
|------|-------------|
| `base` | Outer surface |
| `icon` | Icon / spinner column |
| `content` | Text content |
| `close` | Close button |
