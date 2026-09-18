<script setup lang="ts">
import { ref } from "vue";

const fruit = ref("pear");
function onFruit(e: CustomEvent<{ value: string }>) {
  fruit.value = e.detail.value;
}

const codes = {
  basic: `<gk-radio-group :value="fruit" @change="onFruit">
  <gk-radio value="apple">Apple</gk-radio>
  <gk-radio value="pear">Pear</gk-radio>
  <gk-radio value="plum">Plum</gk-radio>
</gk-radio-group>`,
  size: `<gk-radio-group size="sm" value="a">
  <gk-radio value="a">Small</gk-radio>
</gk-radio-group>
<gk-radio-group size="md" value="a">
  <gk-radio value="a">Medium</gk-radio>
</gk-radio-group>
<gk-radio-group size="lg" value="a">
  <gk-radio value="a">Large</gk-radio>
</gk-radio-group>`,
  disabled: `<gk-radio-group disabled value="a">
  <gk-radio value="a">Selected</gk-radio>
  <gk-radio value="b">Other</gk-radio>
</gk-radio-group>`,
};
</script>

# Radio

Radio picks one value in a group. Selected state is a **white fill**, a **deep-gold ring**, and a **deep-gold center dot** — not a solid yellow disc.

## Demos

<DemoCard title="Basic" :code="codes.basic">
  <template #description>
    Bind group <code>value</code> and listen for <code>change</code> with <code>e.detail.value</code>. Arrow keys move and select, skipping disabled radios.
  </template>
  <gk-radio-group :value="fruit" @change="onFruit">
    <gk-radio value="apple">Apple</gk-radio>
    <gk-radio value="pear">Pear</gk-radio>
    <gk-radio value="plum">Plum</gk-radio>
  </gk-radio-group>
  <p style="margin:0;font-size:0.875rem;opacity:0.8">Value: {{ fruit }}</p>
</DemoCard>

<DemoCard title="Size" :code="codes.size">
  <template #description>
    Size enum matches other controls: <code>sm</code>, <code>md</code>, <code>lg</code>.
  </template>
  <gk-radio-group size="sm" value="a">
    <gk-radio value="a">Small</gk-radio>
  </gk-radio-group>
  <gk-radio-group size="md" value="a">
    <gk-radio value="a">Medium</gk-radio>
  </gk-radio-group>
  <gk-radio-group size="lg" value="a">
    <gk-radio value="a">Large</gk-radio>
  </gk-radio-group>
</DemoCard>

<DemoCard title="Disabled" :code="codes.disabled">
  <template #description>
    Group <code>disabled</code> blocks selection.
  </template>
  <gk-radio-group disabled value="a">
    <gk-radio value="a">Selected</gk-radio>
    <gk-radio value="b">Other</gk-radio>
  </gk-radio-group>
</DemoCard>

## API

### Radio Props

| Prop | Type | Default |
|------|------|---------|
| `checked` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `value` | `string` | `''` |

### RadioGroup Props

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | `''` |
| `disabled` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |

### RadioGroup Events

| Name | Description |
|------|-------------|
| `change` | `detail: { value: string }` |
