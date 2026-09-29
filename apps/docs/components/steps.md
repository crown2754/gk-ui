<script setup lang="ts">
import { ref } from "vue";

const step = ref(1);

function onStep(event: CustomEvent<{ current: number }>) {
  step.value = event.detail.current;
}

const codes = {
  basic: `<gk-steps current="1">
  <gk-step title="Details"></gk-step>
  <gk-step title="Payment"></gk-step>
  <gk-step title="Done"></gk-step>
</gk-steps>`,
  description: `<gk-steps current="2">
  <gk-step title="Plan" description="Annual plan selected"></gk-step>
  <gk-step title="Billing" description="Invoice and contact"></gk-step>
  <gk-step title="Pay" description="Card or transfer"></gk-step>
  <gk-step title="Confirm" description="Receipt sent"></gk-step>
</gk-steps>`,
  vertical: `<gk-steps direction="vertical" current="1">
  <gk-step title="Create project" description="Name and visibility saved"></gk-step>
  <gk-step title="Invite" description="Add collaborators"></gk-step>
  <gk-step title="Connect repo" description="Git remote"></gk-step>
</gk-steps>`,
  error: `<gk-steps current="1" status="error">
  <gk-step title="Upload"></gk-step>
  <gk-step title="Validate" description="Bad format. Fix and retry."></gk-step>
  <gk-step title="Publish"></gk-step>
</gk-steps>`,
  clickable: `<gk-steps clickable :current="step" @update:current="onStep">
  <gk-step title="One"></gk-step>
  <gk-step title="Two"></gk-step>
  <gk-step title="Three"></gk-step>
</gk-steps>`,
  sizes: `<gk-steps size="sm" current="1">...</gk-steps>`,
  icon: `<gk-step title="Start">
  <span slot="icon">★</span>
</gk-step>`,
};
</script>

# Steps

Ordered progress for wizards and checkout. In Chinese this component is 步驟條.

**Finish** is a success-green check. **Process** stays brand gold, so “you are here” is the only gold signal.

## Demos

<DemoCard title="Horizontal" :code="codes.basic">
  <template #description>
    <code>current</code> is 0-based. Earlier steps are finish, the current step is process, and later steps wait.
  </template>
  <gk-steps current="1" style="width:100%">
    <gk-step title="Details"></gk-step>
    <gk-step title="Payment"></gk-step>
    <gk-step title="Done"></gk-step>
  </gk-steps>
</DemoCard>

<DemoCard title="With description" :code="codes.description">
  <template #description>
    <code>description</code> sits under the title. You can also slot it.
  </template>
  <gk-steps current="2" style="width:100%">
    <gk-step title="Plan" description="Annual plan selected"></gk-step>
    <gk-step title="Billing" description="Invoice and contact"></gk-step>
    <gk-step title="Pay" description="Card or transfer"></gk-step>
    <gk-step title="Confirm" description="Receipt sent"></gk-step>
  </gk-steps>
</DemoCard>

<DemoCard title="Vertical" :code="codes.vertical">
  <template #description>
    <code>direction="vertical"</code> gives descriptions more room. Connectors run beside the titles.
  </template>
  <gk-steps direction="vertical" current="1">
    <gk-step title="Create project" description="Name and visibility saved"></gk-step>
    <gk-step title="Invite" description="Add collaborators"></gk-step>
    <gk-step title="Connect repo" description="Git remote"></gk-step>
  </gk-steps>
</DemoCard>

<DemoCard title="Error" :code="codes.error">
  <template #description>
    <code>status="error"</code> applies to the current step. Earlier steps stay finish. Navigating does not clear an explicit error; set <code>status</code> back to <code>process</code> in the app.
  </template>
  <gk-steps current="1" status="error" style="width:100%">
    <gk-step title="Upload"></gk-step>
    <gk-step title="Validate" description="Bad format. Fix and retry."></gk-step>
    <gk-step title="Publish"></gk-step>
  </gk-steps>
</DemoCard>

<DemoCard title="Clickable" :code="codes.clickable">
  <template #description>
    With <code>clickable</code>, only earlier steps can be activated. The current step and later steps do not emit <code>update:current</code>. Enter and Space activate a focused step.
  </template>
  <gk-steps clickable :current="step" style="width:100%" @update:current="onStep">
    <gk-step title="One"></gk-step>
    <gk-step title="Two"></gk-step>
    <gk-step title="Three"></gk-step>
  </gk-steps>
</DemoCard>

<DemoCard title="Sizes" :code="codes.sizes">
  <template #description>
    Circles are 24 / 28 / 32 at <code>sm</code> / <code>md</code> / <code>lg</code>.
  </template>
  <div style="display:grid;gap:18px;width:100%">
    <gk-steps size="sm" current="1">
      <gk-step title="Start"></gk-step>
      <gk-step title="Run"></gk-step>
      <gk-step title="End"></gk-step>
    </gk-steps>
    <gk-steps size="lg" current="1">
      <gk-step title="Start"></gk-step>
      <gk-step title="Run"></gk-step>
      <gk-step title="End"></gk-step>
    </gk-steps>
  </div>
</DemoCard>

<DemoCard title="Custom icon" :code="codes.icon">
  <template #description>
    Slot <code>icon</code> on a step replaces the number, check, or error mark.
  </template>
  <gk-steps current="1" style="width:100%">
    <gk-step title="Start">
      <span slot="icon">★</span>
    </gk-step>
    <gk-step title="Review"></gk-step>
    <gk-step title="Ship"></gk-step>
  </gk-steps>
</DemoCard>

## API

### Steps props

| Prop | Type | Default |
|------|------|---------|
| `current` | `number` | `0` |
| `status` | `'wait' \| 'process' \| 'finish' \| 'error'` | `'process'` |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `clickable` | `boolean` | `false` |
| `items` | `{ title, description?, status?, key? }[]` | — |

Slotted `gk-step` children win over `items`. A step `status` overrides the status derived from `current`.

### Step props

| Prop | Type | Default |
|------|------|---------|
| `title` | `string` | `''` |
| `description` | `string` | `''` |
| `status` | `'wait' \| 'process' \| 'finish' \| 'error' \| ''` | `''` |

### Slots

| Name | Description |
|------|-------------|
| default | `gk-step` children |
| `icon` | Replaces the indicator glyph |
| `title` | Title content |
| `description` | Description content |

### Events

| Name | Detail |
|------|--------|
| `update:current` | `{ current }` when a reachable step is activated |
| `change` | `{ current }` — same moment as `update:current` |

### CSS parts

`root`, `list`, `item`, `indicator`, `connector`, `title`, `description`.

### Accessibility

- The root is a `nav`. The name follows the document language: “Steps” or 「步驟」. Set `aria-label` on the host to override it.
- Each step is a `listitem`. Its name includes the index, status, and title, for example “Step 2, in progress: Payment”.
- The current step has `aria-current="step"`.
- Indicators and connectors are `aria-hidden`.
