<script setup lang="ts">
const codes = {
  basic: `<gk-button variant="secondary">Default</gk-button>
<gk-button variant="primary">Primary</gk-button>
<gk-button variant="info">Info</gk-button>
<gk-button variant="success">Success</gk-button>
<gk-button variant="warning">Warning</gk-button>
<gk-button variant="danger">Danger</gk-button>
<gk-button variant="ghost">Ghost</gk-button>`,
  size: `<gk-button size="sm">Small</gk-button>
<gk-button size="md">Medium</gk-button>
<gk-button size="lg">Large</gk-button>`,
  disabled: `<gk-button disabled>Disabled</gk-button>
<gk-button variant="primary" disabled>Primary</gk-button>
<gk-button variant="danger" disabled>Error</gk-button>`,
  loading: `<gk-button loading>Loading</gk-button>
<gk-button variant="primary" loading>Primary</gk-button>
<gk-button variant="info" loading>Info</gk-button>`,
  ghost: `<gk-button variant="ghost">Ghost</gk-button>
<gk-button variant="ghost" size="lg">Large Ghost</gk-button>`,
  tag: `<gk-button href="/guide/getting-started">Getting started</gk-button>
<gk-button variant="info" href="/components/button">Button docs</gk-button>`,
};
</script>

# Button

Button is used to trigger some actions.

## Demos

<DemoCard title="Basic" :code="codes.basic">
  <template #description>
    There are <code>secondary</code>, <code>primary</code>, <code>info</code>, <code>success</code>, <code>warning</code>, <code>danger</code> and <code>ghost</code> button types.
  </template>
  <gk-button variant="secondary">Default</gk-button>
  <gk-button variant="primary">Primary</gk-button>
  <gk-button variant="info">Info</gk-button>
  <gk-button variant="success">Success</gk-button>
  <gk-button variant="warning">Warning</gk-button>
  <gk-button variant="danger">Danger</gk-button>
  <gk-button variant="ghost">Ghost</gk-button>
</DemoCard>

<DemoCard title="Size" :code="codes.size">
  <template #description>
    Buttons can be <code>sm</code>, <code>md</code> and <code>lg</code> in size.
  </template>
  <gk-button size="sm">Small</gk-button>
  <gk-button size="md">Medium</gk-button>
  <gk-button size="lg">Large</gk-button>
</DemoCard>

<DemoCard title="Disabled" :code="codes.disabled">
  <template #description>
    Buttons can be disabled.
  </template>
  <gk-button disabled>Disabled</gk-button>
  <gk-button variant="primary" disabled>Primary</gk-button>
  <gk-button variant="danger" disabled>Error</gk-button>
</DemoCard>

<DemoCard title="Loading" :code="codes.loading">
  <template #description>
    Buttons can have loading states.
  </template>
  <gk-button loading>Loading</gk-button>
  <gk-button variant="primary" loading>Primary</gk-button>
  <gk-button variant="info" loading>Info</gk-button>
</DemoCard>

<DemoCard title="Ghost" :code="codes.ghost">
  <template #description>
    Ghost buttons have transparent backgrounds.
  </template>
  <gk-button variant="ghost">Ghost</gk-button>
  <gk-button variant="ghost" size="lg">Large Ghost</gk-button>
</DemoCard>

<DemoCard title="Tag" :code="codes.tag">
  <template #description>
    You can render buttons as links with the <code>href</code> prop.
  </template>
  <gk-button href="/guide/getting-started">Getting started</gk-button>
  <gk-button variant="info" href="/components/button">Button docs</gk-button>
</DemoCard>

<DemoCard title="Playground">
  <template #description>
    Try combinations of props interactively.
  </template>
  <ButtonDemo />
</DemoCard>

## API

### Button Props

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'primary' \| 'secondary' \| 'info' \| 'success' \| 'warning' \| 'danger' \| 'ghost'` | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` |
| `disabled` | `boolean` | `false` |
| `loading` | `boolean` | `false` |
| `href` | `string` | — |

### Button Slots

| Name | Description |
|------|-------------|
| default | Button label content |

### CSS Parts

| Part | Description |
|------|-------------|
| `base` | Interactive element (`button` or `a`) |
| `label` | Label wrapper |
| `spinner` | Loading indicator |
