<script setup lang="ts">
import { ref } from "vue";

const score = ref(3.5);
function onScore(e: CustomEvent<{ value: number }>) {
  score.value = e.detail.value;
}

const codes = {
  basic: `<gk-rate :value="score" @change="onScore"></gk-rate>`,
  clear: `<gk-rate value="0"></gk-rate>`,
  size: `<gk-rate size="sm" value="4"></gk-rate>
<gk-rate size="md" value="4"></gk-rate>
<gk-rate size="lg" value="4"></gk-rate>`,
  quiet: `<gk-rate readonly value="4"></gk-rate>
<gk-rate disabled value="2"></gk-rate>`,
  whole: `<gk-rate .allowHalf="false" value="3"></gk-rate>`,
};
</script>

# Rate

Star rating. The default is five stars, half-star steps, and click-again to clear. Filled stars use the brand gold; empty stars stay a neutral outline.

## Demos

<DemoCard title="Basic" :code="codes.basic">
  <template #description>
    Half stars are on by default. Clicking the current value clears it to 0. Hover previews with <code>--gk-color-brand-hover</code>.
  </template>
  <div style="display:flex;align-items:center;gap:0.75rem">
    <gk-rate :value="score" @change="onScore"></gk-rate>
    <span>{{ score }}</span>
  </div>
</DemoCard>

<DemoCard title="Cleared" :code="codes.clear">
  <gk-rate value="0"></gk-rate>
</DemoCard>

<DemoCard title="Sizes" :code="codes.size">
  <template #description>
    Glyphs are 16 / 22 / 28. The hit box stays at least 28px tall.
  </template>
  <div style="display:grid;gap:0.5rem">
    <gk-rate size="sm" value="4"></gk-rate>
    <gk-rate size="md" value="4"></gk-rate>
    <gk-rate size="lg" value="4"></gk-rate>
  </div>
</DemoCard>

<DemoCard title="Readonly and disabled" :code="codes.quiet">
  <div style="display:grid;gap:0.5rem">
    <gk-rate readonly value="4"></gk-rate>
    <gk-rate disabled value="2"></gk-rate>
  </div>
</DemoCard>

<DemoCard title="Whole stars" :code="codes.whole">
  <template #description>
    In Vue, set <code>.allowHalf="false"</code>. A bare <code>allow-half="false"</code> attribute is still true.
  </template>
  <gk-rate .allowHalf="false" value="3"></gk-rate>
</DemoCard>

## API

### Properties

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `number` | `0` | `0` is cleared |
| `count` | `number` | `5` | |
| `allow-half` | `boolean` | `true` | |
| `allow-clear` | `boolean` | `true` | Click the current value again |
| `size` | `sm` \| `md` \| `lg` | `md` | |
| `color` | `string` | brand | Filled color. Empty stays neutral |
| `readonly` / `disabled` | `boolean` | `false` | |
| `name` | `string` | — | |

### Events

`change` and `update:value` with `{ value }`.

### Parts

`root`, `item`, `icon`, `half`, `full`. The group is a `radiogroup` labelled 評分 / Rating. Each stop is a radio. A custom character slot is a follow-up.
