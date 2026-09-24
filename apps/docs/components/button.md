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
  secondaryMode: `<gk-button secondary>Default</gk-button>
<gk-button variant="primary" secondary>Primary</gk-button>
<gk-button variant="info" secondary>Info</gk-button>
<gk-button variant="success" secondary>Success</gk-button>
<gk-button variant="warning" secondary>Warning</gk-button>
<gk-button variant="danger" secondary>Danger</gk-button>`,
  dashed: `<gk-button dashed>Default</gk-button>
<gk-button variant="primary" dashed>Primary</gk-button>
<gk-button variant="info" dashed>Info</gk-button>
<gk-button variant="success" dashed>Success</gk-button>
<gk-button variant="warning" dashed>Warning</gk-button>
<gk-button variant="danger" dashed>Danger</gk-button>`,
  quaternary: `<gk-button quaternary>More</gk-button>
<gk-button quaternary aria-label="More actions">⋯</gk-button>`,
  textMode: `<gk-button text>Default</gk-button>
<gk-button variant="primary" text>Primary</gk-button>
<gk-button variant="info" text>Info</gk-button>
<gk-button variant="success" text>Success</gk-button>
<gk-button variant="warning" text>Warning</gk-button>
<gk-button variant="danger" text>Danger</gk-button>`,
  group: `<gk-button-group>
  <gk-button variant="secondary">Left</gk-button>
  <gk-button variant="secondary">Middle</gk-button>
  <gk-button variant="secondary">Right</gk-button>
</gk-button-group>
<gk-button-group>
  <gk-button variant="primary">Live a</gk-button>
  <gk-button variant="primary">Sufficient</gk-button>
  <gk-button variant="primary">Life</gk-button>
</gk-button-group>`,
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

<DemoCard title="Secondary" :code="codes.secondaryMode">
  <template #description>
    Secondary buttons have a lighter fill than solid variants.
  </template>
  <gk-button secondary>Default</gk-button>
  <gk-button variant="primary" secondary>Primary</gk-button>
  <gk-button variant="info" secondary>Info</gk-button>
  <gk-button variant="success" secondary>Success</gk-button>
  <gk-button variant="warning" secondary>Warning</gk-button>
  <gk-button variant="danger" secondary>Danger</gk-button>
</DemoCard>

<DemoCard title="Size" :code="codes.size">
  <template #description>
    Buttons can be <code>sm</code>, <code>md</code> and <code>lg</code> in size.
  </template>
  <gk-button size="sm">Small</gk-button>
  <gk-button size="md">Medium</gk-button>
  <gk-button size="lg">Large</gk-button>
</DemoCard>

<DemoCard title="Dashed" :code="codes.dashed">
  <template #description>
    Dashed buttons use a dashed border style.
  </template>
  <gk-button dashed>Default</gk-button>
  <gk-button variant="primary" dashed>Primary</gk-button>
  <gk-button variant="info" dashed>Info</gk-button>
  <gk-button variant="success" dashed>Success</gk-button>
  <gk-button variant="warning" dashed>Warning</gk-button>
  <gk-button variant="danger" dashed>Danger</gk-button>
</DemoCard>

<DemoCard title="Text" :code="codes.textMode">
  <template #description>
    Text buttons have no background or border until hovered.
  </template>
  <gk-button text>Default</gk-button>
  <gk-button variant="primary" text>Primary</gk-button>
  <gk-button variant="info" text>Info</gk-button>
  <gk-button variant="success" text>Success</gk-button>
  <gk-button variant="warning" text>Warning</gk-button>
  <gk-button variant="danger" text>Danger</gk-button>
</DemoCard>

<DemoCard title="Quaternary" :code="codes.quaternary">
  <template #description>
    <code>quaternary</code> is a quiet transparent button (Naive quaternary). Use it for icon or menu triggers.
  </template>
  <gk-button quaternary>More</gk-button>
  <gk-button quaternary aria-label="More actions">⋯</gk-button>
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

<DemoCard title="Button group" :code="codes.group">
  <template #description>
    Group related buttons with <code>gk-button-group</code>.
  </template>
  <gk-button-group>
    <gk-button variant="secondary">Left</gk-button>
    <gk-button variant="secondary">Middle</gk-button>
    <gk-button variant="secondary">Right</gk-button>
  </gk-button-group>
  <gk-button-group>
    <gk-button variant="primary">Live a</gk-button>
    <gk-button variant="primary">Sufficient</gk-button>
    <gk-button variant="primary">Life</gk-button>
  </gk-button-group>
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
| `secondary` | `boolean` | `false` |
| `dashed` | `boolean` | `false` |
| `text` | `boolean` | `false` |
| `quaternary` | `boolean` | `false` |
| `href` | `string` | — |

### Button Slots

| Name | Description |
|------|-------------|
| default | Button label content |

### ButtonGroup

| Name | Description |
|------|-------------|
| default | Grouped `gk-button` children |

### CSS Parts

| Part | Description |
|------|-------------|
| `base` | Interactive element (`button` or `a`) |
| `label` | Label wrapper |
| `spinner` | Loading indicator |
