<script setup lang="ts">
import { ref } from "vue";

const amount = ref<number | null>(1280);
const stepped = ref<number | null>(2);

function onAmount(e: CustomEvent<{ value: number | null }>) {
  amount.value = e.detail.value;
}
function onStepped(e: CustomEvent<{ value: number | null }>) {
  stepped.value = e.detail.value;
}

const codes = {
  basic: `<gk-input-number :value="amount" @change="onAmount">
  <span slot="prefix">NT$</span>
</gk-input-number>`,
  bounds: `<gk-input-number :value="stepped" min="1" max="9" step="1" @change="onStepped">
  <span slot="suffix">件</span>
</gk-input-number>`,
  precision: `<gk-input-number value="12.5" step="0.5" precision="1">
  <span slot="suffix">kg</span>
</gk-input-number>`,
  size: `<gk-input-number size="sm" value="2"></gk-input-number>
<gk-input-number size="md" value="2"></gk-input-number>
<gk-input-number size="lg" value="2"></gk-input-number>`,
  status: `<gk-input-number status="success" value="8"></gk-input-number>
<gk-input-number status="warning" value="0"></gk-input-number>
<gk-input-number status="error" placeholder="Required"></gk-input-number>`,
  quiet: `<gk-input-number disabled value="4"></gk-input-number>
<gk-input-number readonly value="36">
  <span slot="suffix">件</span>
</gk-input-number>`,
  both: `<gk-input-number button-placement="both" value="3"></gk-input-number>`,
};
</script>

# InputNumber

Numeric field with keyboard stepping and embedded spin buttons. Height 28 / 34 / 40, radius `--gk-radius-md`, and a soft focus ring.

`gk-input` still uses `--gk-radius-sm`. Unifying that radius is a follow-up so form rows do not mix corners.

## Demos

<DemoCard title="Basic" :code="codes.basic">
  <template #description>
    Bind <code>value</code> and listen for <code>change</code> or <code>update:value</code> with <code>e.detail.value</code>. <code>input</code> streams while typing. Commit happens on blur, Enter, a spin button, or an arrow key.
  </template>
  <div style="display:grid;gap:0.75rem;max-width:16rem">
    <gk-input-number :value="amount" @change="onAmount">
      <span slot="prefix">NT$</span>
    </gk-input-number>
    <p style="margin:0;font-size:0.875rem;opacity:0.8">Value: {{ amount ?? "(empty)" }}</p>
  </div>
</DemoCard>

<DemoCard title="Min, max, step" :code="codes.bounds">
  <template #description>
    The button at the limit is disabled. The field stays editable.
  </template>
  <gk-input-number :value="stepped" min="1" max="9" step="1" @change="onStepped">
    <span slot="suffix">件</span>
  </gk-input-number>
</DemoCard>

<DemoCard title="Precision" :code="codes.precision">
  <template #description>
    When <code>precision</code> is omitted, decimal places come from <code>step</code> (<code>0.5</code> → 1).
  </template>
  <gk-input-number value="12.5" step="0.5" precision="1">
    <span slot="suffix">kg</span>
  </gk-input-number>
</DemoCard>

<DemoCard title="Sizes" :code="codes.size">
  <div style="display:grid;gap:0.75rem;max-width:16rem">
    <gk-input-number size="sm" value="2"></gk-input-number>
    <gk-input-number size="md" value="2"></gk-input-number>
    <gk-input-number size="lg" value="2"></gk-input-number>
  </div>
</DemoCard>

<DemoCard title="Status" :code="codes.status">
  <div style="display:grid;gap:0.75rem;max-width:16rem">
    <gk-input-number status="success" value="8"></gk-input-number>
    <gk-input-number status="warning" value="0"></gk-input-number>
    <gk-input-number status="error" placeholder="Required"></gk-input-number>
  </div>
</DemoCard>

<DemoCard title="Disabled and readonly" :code="codes.quiet">
  <template #description>
    Readonly omits the spin buttons. Disabled fades the whole field.
  </template>
  <div style="display:flex;gap:1rem;flex-wrap:wrap">
    <gk-input-number disabled value="4"></gk-input-number>
    <gk-input-number readonly value="36">
      <span slot="suffix">件</span>
    </gk-input-number>
  </div>
</DemoCard>

<DemoCard title="Buttons on both sides" :code="codes.both">
  <template #description>
    <code>button-placement="both"</code> puts − and + outside the field. The default <code>right</code> stacks chevrons at the end. To turn buttons off in Vue, bind <code>.showButton="false"</code> — a present boolean attribute is always true.
  </template>
  <gk-input-number button-placement="both" value="3"></gk-input-number>
</DemoCard>

## API

### Properties

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `number \| null` | `null` | Empty when null |
| `min` / `max` | `number` | — | Clamp on commit and on step |
| `step` | `number` | `1` | Arrow and button increment |
| `precision` | `number` | from `step` | Decimal places |
| `size` | `sm` \| `md` \| `lg` | `md` | 28 / 34 / 40 |
| `status` | `success` \| `warning` \| `error` | — | |
| `disabled` / `readonly` | `boolean` | `false` | Readonly hides steppers |
| `show-button` | `boolean` | `true` | |
| `button-placement` | `right` \| `both` | `right` | |
| `placeholder` / `name` | `string` | — | `name` participates in a native form |

### Events

| Name | Detail |
| --- | --- |
| `input` | `{ value }` while typing or stepping. Native input does not cross the shadow root |
| `change`, `update:value` | `{ value }` on commit |
| `focus`, `blur` | |

### Slots and parts

Slots: `prefix`, `suffix`. Parts: `base`, `input`, `prefix`, `suffix`, `controls`, `increment`, `decrement`.

The input is `role="spinbutton"`. Buttons are labelled Increase / Decrease, or 增加 / 減少 when the language is Chinese. Holding a button to repeat is a follow-up.
