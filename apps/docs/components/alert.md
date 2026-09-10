<script setup lang="ts">
import { ref } from "vue";

const alertVisible = ref(true);

function onAlertClose() {
  alertVisible.value = false;
}

const codes = {
  basic: `<gk-alert type="default" title="Default">Neutral inline feedback.</gk-alert>
<gk-alert type="info" title="Info">Helpful context for the user.</gk-alert>
<gk-alert type="success" title="Success">The operation completed.</gk-alert>
<gk-alert type="warning" title="Warning">Something needs attention.</gk-alert>
<gk-alert type="error" title="Error">Something went wrong.</gk-alert>`,
  bordered: `<gk-alert bordered type="info" title="Bordered">
  Soft fill plus a border around the alert.
</gk-alert>`,
  closable: `<!-- host: const alertVisible = ref(true); function onAlertClose() { alertVisible.value = false } -->
<gk-alert
  v-if="alertVisible"
  type="success"
  title="Closable"
  closable
  @gk-close="onAlertClose"
>
  Close emits gk-close; hide or remove the alert in the host.
</gk-alert>`,
  icon: `<gk-alert type="info" title="Custom icon">
  <svg slot="icon" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2 2 7l10 5 10-5-10-5Zm0 9.2L4.2 7.4 12 3.5l7.8 3.9L12 11.2Zm0 2.1 8-4v7.2c0 1.1-3.6 2.5-8 2.5s-8-1.4-8-2.5V9.3l8 4Z"/>
  </svg>
  The icon slot overrides the built-in type icon.
</gk-alert>`,
  noIcon: `<gk-alert type="warning" title="No icon" :show-icon="false">
  Icon column hidden when show-icon is false.
</gk-alert>`,
};
</script>

# Alert

Alert shows inline feedback with semantic types, optional border, built-in icons, and closable behavior that matches Card (`gk-close` only).

## Demos

<DemoCard title="Basic" :code="codes.basic">
  <template #description>
    Types: <code>default</code>, <code>info</code>, <code>success</code>, <code>warning</code>, and <code>error</code>. Each type sets color and the built-in icon.
  </template>
  <div style="display:grid;gap:0.75rem">
    <gk-alert type="default" title="Default">Neutral inline feedback.</gk-alert>
    <gk-alert type="info" title="Info">Helpful context for the user.</gk-alert>
    <gk-alert type="success" title="Success">The operation completed.</gk-alert>
    <gk-alert type="warning" title="Warning">Something needs attention.</gk-alert>
    <gk-alert type="error" title="Error">Something went wrong.</gk-alert>
  </div>
</DemoCard>

<DemoCard title="Bordered" :code="codes.bordered">
  <template #description>
    Set <code>bordered</code> for a border around the soft fill (default is fill only).
  </template>
  <gk-alert bordered type="info" title="Bordered">
    Soft fill plus a border around the alert.
  </gk-alert>
</DemoCard>

<DemoCard title="Closable" :code="codes.closable">
  <template #description>
    <code>closable</code> shows a close control that dispatches bubbling <code>gk-close</code>. The alert does not hide itself — handle the event in the host.
  </template>
  <gk-alert
    v-if="alertVisible"
    type="success"
    title="Closable"
    closable
    @gk-close="onAlertClose"
  >
    Close emits <code>gk-close</code>; hide or remove the alert in the host.
  </gk-alert>
  <p v-if="!alertVisible" style="margin:0;font-size:0.875rem;opacity:0.8">
    Alert closed (reload the page to reset the demo).
  </p>
</DemoCard>

<DemoCard title="Icon" :code="codes.icon">
  <template #description>
    Put content in the <code>icon</code> slot to override the built-in type icon.
  </template>
  <gk-alert type="info" title="Custom icon">
    <svg
      slot="icon"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M12 2 2 7l10 5 10-5-10-5Zm0 9.2L4.2 7.4 12 3.5l7.8 3.9L12 11.2Zm0 2.1 8-4v7.2c0 1.1-3.6 2.5-8 2.5s-8-1.4-8-2.5V9.3l8 4Z"
      />
    </svg>
    The <code>icon</code> slot overrides the built-in type icon.
  </gk-alert>
</DemoCard>

<DemoCard title="No icon" :code="codes.noIcon">
  <template #description>
    Bind <code>:show-icon="false"</code> to hide the icon column.
  </template>
  <gk-alert type="warning" title="No icon" :show-icon="false">
    Icon column hidden when <code>show-icon</code> is false.
  </gk-alert>
</DemoCard>

## API

### Alert Props

| Prop | Type | Default |
|------|------|---------|
| `type` | `'default' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'default'` |
| `title` | `string` | — |
| `bordered` | `boolean` | `false` |
| `closable` | `boolean` | `false` |
| `show-icon` | `boolean` | `true` |

### Alert Slots

| Name | Description |
|------|-------------|
| default | Body content |
| `icon` | Overrides the built-in type icon when present |

### Alert Events

| Name | Description |
|------|-------------|
| `gk-close` | Close button activated; bubbles; `composed: true` |

### CSS Parts

| Part | Description |
|------|-------------|
| `base` | Outer surface |
| `icon` | Icon column |
| `body` | Title + content wrapper |
| `title` | Title line |
| `content` | Default slot wrapper |
| `close` | Close button |
