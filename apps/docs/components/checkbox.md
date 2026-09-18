<script setup lang="ts">
import { ref } from "vue";

const agree = ref(false);
const mixed = ref(true);
const mixedChecked = ref(false);
const group = ref<string[]>(["pear"]);

function onAgree(e: CustomEvent<{ checked: boolean }>) {
  agree.value = e.detail.checked;
}
function onMixed(e: CustomEvent<{ checked: boolean }>) {
  mixed.value = false;
  mixedChecked.value = e.detail.checked;
}
function onGroup(e: CustomEvent<{ value: string[] }>) {
  group.value = e.detail.value;
}

const codes = {
  basic: `<!-- host: const agree = ref(false); function onAgree(e: CustomEvent<{ checked: boolean }>) { agree.value = e.detail.checked } -->
<gk-checkbox :checked="agree" @change="onAgree">I agree</gk-checkbox>`,
  size: `<gk-checkbox size="sm" checked>Small</gk-checkbox>
<gk-checkbox size="md" checked>Medium</gk-checkbox>
<gk-checkbox size="lg" checked>Large</gk-checkbox>`,
  disabled: `<gk-checkbox disabled>Off</gk-checkbox>
<gk-checkbox disabled checked>On</gk-checkbox>`,
  mixed: `<gk-checkbox :checked="mixedChecked" :indeterminate="mixed" @change="onMixed">Select all</gk-checkbox>`,
  group: `<gk-checkbox-group :value="group" @change="onGroup">
  <gk-checkbox value="apple">Apple</gk-checkbox>
  <gk-checkbox value="pear">Pear</gk-checkbox>
  <gk-checkbox value="plum">Plum</gk-checkbox>
</gk-checkbox-group>`,
};
</script>

# Checkbox

Checkbox toggles a boolean. Checked and mixed states use brand fill with a dark check or minus.

## Demos

<DemoCard title="Basic" :code="codes.basic">
  <template #description>
    Bind <code>checked</code> and listen for <code>change</code> with <code>e.detail.checked</code>.
  </template>
  <gk-checkbox :checked="agree" @change="onAgree">I agree</gk-checkbox>
</DemoCard>

<DemoCard title="Size" :code="codes.size">
  <template #description>
    Size enum matches Button and Input: <code>sm</code>, <code>md</code>, <code>lg</code>.
  </template>
  <gk-checkbox size="sm" checked>Small</gk-checkbox>
  <gk-checkbox size="md" checked>Medium</gk-checkbox>
  <gk-checkbox size="lg" checked>Large</gk-checkbox>
</DemoCard>

<DemoCard title="Disabled" :code="codes.disabled">
  <template #description>
    <code>disabled</code> blocks toggling.
  </template>
  <gk-checkbox disabled>Off</gk-checkbox>
  <gk-checkbox disabled checked>On</gk-checkbox>
</DemoCard>

<DemoCard title="Indeterminate" :code="codes.mixed">
  <template #description>
    <code>indeterminate</code> sets <code>aria-checked="mixed"</code> and shows a minus. Clicking checks the box and clears mixed.
  </template>
  <gk-checkbox :checked="mixedChecked" :indeterminate="mixed" @change="onMixed">Select all</gk-checkbox>
</DemoCard>

<DemoCard title="Group" :code="codes.group">
  <template #description>
    <code>gk-checkbox-group</code> emits <code>change</code> with <code>e.detail.value</code> as <code>string[]</code>. Child checkbox events are stopped so Vue bindings on the group stay correct.
  </template>
  <gk-checkbox-group :value="group" @change="onGroup">
    <gk-checkbox value="apple">Apple</gk-checkbox>
    <gk-checkbox value="pear">Pear</gk-checkbox>
    <gk-checkbox value="plum">Plum</gk-checkbox>
  </gk-checkbox-group>
  <p style="margin:0;font-size:0.875rem;opacity:0.8">{{ group.join(", ") || "(none)" }}</p>
</DemoCard>

## API

### Checkbox Props

| Prop | Type | Default |
|------|------|---------|
| `checked` | `boolean` | `false` |
| `indeterminate` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `value` | `string` | `''` |

### Checkbox Events

| Name | Description |
|------|-------------|
| `change` | User toggled; `detail: { checked: boolean }` |

### CheckboxGroup Props

| Prop | Type | Default |
|------|------|---------|
| `value` | `string[]` | `[]` |
| `disabled` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |

### CheckboxGroup Events

| Name | Description |
|------|-------------|
| `change` | `detail: { value: string[] }` |
