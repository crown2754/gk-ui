<script setup lang="ts">
import { ref } from "vue";

const fruit = ref("pear");
const clearable = ref("apple");
function onFruit(e: CustomEvent<{ value: string }>) {
  fruit.value = e.detail.value;
}
function onClearable(e: CustomEvent<{ value: string }>) {
  clearable.value = e.detail.value;
}

const codes = {
  basic: `<gk-select :value="fruit" placeholder="Pick a fruit" @change="onFruit">
  <gk-option value="apple">Apple</gk-option>
  <gk-option value="pear">Pear</gk-option>
  <gk-option value="plum">Plum</gk-option>
</gk-select>`,
  size: `<gk-select size="sm" value="a" placeholder="Small">
  <gk-option value="a">Small</gk-option>
</gk-select>
<gk-select size="md" value="a" placeholder="Medium">
  <gk-option value="a">Medium</gk-option>
</gk-select>
<gk-select size="lg" value="a" placeholder="Large">
  <gk-option value="a">Large</gk-option>
</gk-select>`,
  clearable: `<gk-select clearable :value="clearable" placeholder="Clearable" @change="onClearable">
  <gk-option value="apple">Apple</gk-option>
  <gk-option value="pear">Pear</gk-option>
</gk-select>`,
  status: `<gk-select status="success" value="ok" placeholder="Success">
  <gk-option value="ok">Looks good</gk-option>
</gk-select>
<gk-select status="warning" value="warn" placeholder="Warning">
  <gk-option value="warn">Check this</gk-option>
</gk-select>
<gk-select status="error" value="bad" placeholder="Error">
  <gk-option value="bad">Invalid</gk-option>
</gk-select>`,
  disabled: `<gk-select disabled value="apple" placeholder="Disabled">
  <gk-option value="apple">Apple</gk-option>
</gk-select>`,
};
</script>

# Select

Single-select dropdown. The trigger matches Input chrome; option hover and selected states use a light brand wash, not a solid yellow block.

## Demos

<DemoCard title="Basic" :code="codes.basic">
  <template #description>
    Bind <code>value</code> and listen for <code>change</code> with <code>e.detail.value</code>. Options are slotted <code>gk-option</code> children. v1 is single-select only (no filter / multi).
  </template>
  <div style="min-width:16rem">
    <gk-select :value="fruit" placeholder="Pick a fruit" @change="onFruit">
      <gk-option value="apple">Apple</gk-option>
      <gk-option value="pear">Pear</gk-option>
      <gk-option value="plum">Plum</gk-option>
    </gk-select>
  </div>
  <p style="margin:0;font-size:0.875rem;opacity:0.8">Value: {{ fruit || "(empty)" }}</p>
</DemoCard>

<DemoCard title="Size" :code="codes.size">
  <template #description>
    Heights match Input: 28 / 34 / 40 for <code>sm</code> / <code>md</code> / <code>lg</code>.
  </template>
  <div style="display:grid;gap:0.75rem;min-width:16rem">
    <gk-select size="sm" value="a" placeholder="Small">
      <gk-option value="a">Small</gk-option>
    </gk-select>
    <gk-select size="md" value="a" placeholder="Medium">
      <gk-option value="a">Medium</gk-option>
    </gk-select>
    <gk-select size="lg" value="a" placeholder="Large">
      <gk-option value="a">Large</gk-option>
    </gk-select>
  </div>
</DemoCard>

<DemoCard title="Clearable" :code="codes.clearable">
  <template #description>
    <code>clearable</code> shows a clear control when a value is set.
  </template>
  <div style="min-width:16rem">
    <gk-select clearable :value="clearable" placeholder="Clearable" @change="onClearable">
      <gk-option value="apple">Apple</gk-option>
      <gk-option value="pear">Pear</gk-option>
    </gk-select>
  </div>
</DemoCard>

<DemoCard title="Status" :code="codes.status">
  <template #description>
    Validation chrome via <code>status</code>: <code>success</code>, <code>warning</code>, or <code>error</code>.
  </template>
  <div style="display:grid;gap:0.75rem;min-width:16rem">
    <gk-select status="success" value="ok" placeholder="Success">
      <gk-option value="ok">Looks good</gk-option>
    </gk-select>
    <gk-select status="warning" value="warn" placeholder="Warning">
      <gk-option value="warn">Check this</gk-option>
    </gk-select>
    <gk-select status="error" value="bad" placeholder="Error">
      <gk-option value="bad">Invalid</gk-option>
    </gk-select>
  </div>
</DemoCard>

<DemoCard title="Disabled" :code="codes.disabled">
  <template #description>
    <code>disabled</code> blocks opening.
  </template>
  <div style="min-width:16rem">
    <gk-select disabled value="apple" placeholder="Disabled">
      <gk-option value="apple">Apple</gk-option>
    </gk-select>
  </div>
</DemoCard>

## API

### Select Props

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | `''` |
| `placeholder` | `string` | `''` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled` | `boolean` | `false` |
| `clearable` | `boolean` | `false` |
| `status` | `'success' \| 'warning' \| 'error' \| ''` | `''` |
| `open` | `boolean` | `false` |

### Select Slots

| Name | Description |
|------|-------------|
| default | `<gk-option value="…">` children |

### Select Events

| Name | Description |
|------|-------------|
| `change` | `detail: { value: string }` |

### Option Props

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | `''` |
| `disabled` | `boolean` | `false` |
