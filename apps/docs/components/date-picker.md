<script setup lang="ts">
import { ref } from "vue";

const value = ref("2026-09-17");
const clearableValue = ref("2026-09-17");

function onInput(e: CustomEvent<{ value: string }>) {
  value.value = e.detail.value;
}

function onClearableInput(e: CustomEvent<{ value: string }>) {
  clearableValue.value = e.detail.value;
}

/** Disable weekends (property-only; not an HTML attribute). */
function isWeekend(iso: string) {
  const day = new Date(`${iso}T00:00:00`).getDay();
  return day === 0 || day === 6;
}

const codes = {
  basic: `<!-- host: const value = ref("2026-09-17"); function onInput(e: CustomEvent<{ value: string }>) { value.value = e.detail.value } -->
<gk-date-picker :value="value" @input="onInput" clearable></gk-date-picker>
<p>Value: {{ value }}</p>`,
  size: `<gk-date-picker size="sm" placeholder="Small"></gk-date-picker>
<gk-date-picker size="md" placeholder="Medium"></gk-date-picker>
<gk-date-picker size="lg" placeholder="Large"></gk-date-picker>`,
  clearable: `<gk-date-picker
  clearable
  placeholder="Pick a date"
  :value="clearableValue"
  @input="onClearableInput"
></gk-date-picker>`,
  statusRound: `<gk-date-picker status="success" value="2026-09-17"></gk-date-picker>
<gk-date-picker status="warning" value="2026-09-17"></gk-date-picker>
<gk-date-picker status="error" value="2026-09-17"></gk-date-picker>
<gk-date-picker round placeholder="Round"></gk-date-picker>
<gk-date-picker round size="lg" placeholder="Large round"></gk-date-picker>`,
  disabled: `<!-- host: function isWeekend(iso: string) { const day = new Date(iso + "T00:00:00").getDay(); return day === 0 || day === 6 } -->
<gk-date-picker disabled placeholder="Disabled" value="2026-09-17"></gk-date-picker>
<gk-date-picker
  placeholder="Weekends disabled"
  value="2026-09-17"
  :isDateDisabled="isWeekend"
></gk-date-picker>`,
};
</script>

# Date Picker

Date Picker selects a single calendar day. The trigger matches Input sizing and chrome; the panel portals to `document.body` with month navigation plus **Clear** / **Now**.

Phase 1 supports single date only; range / datetime / month / year come later.

## Demos

<DemoCard title="Basic" :code="codes.basic">
  <template #description>
    Bind <code>value</code> (ISO <code>YYYY-MM-DD</code>) and listen for <code>input</code> with <code>e.detail.value</code>. Open the panel to use <strong>Clear</strong> and <strong>Now</strong>.
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-date-picker :value="value" @input="onInput" clearable></gk-date-picker>
    <p style="margin:0;font-size:0.875rem;opacity:0.8">Value: {{ value || "(empty)" }}</p>
  </div>
</DemoCard>

<DemoCard title="Size" :code="codes.size">
  <template #description>
    Sizes match Input / Button: <code>sm</code>, <code>md</code>, and <code>lg</code>.
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-date-picker size="sm" placeholder="Small"></gk-date-picker>
    <gk-date-picker size="md" placeholder="Medium"></gk-date-picker>
    <gk-date-picker size="lg" placeholder="Large"></gk-date-picker>
  </div>
</DemoCard>

<DemoCard title="Clearable" :code="codes.clearable">
  <template #description>
    <code>clearable</code> shows a clear control on the trigger when the value is non-empty and the field is interactive. The panel also exposes Clear / Now.
  </template>
  <div style="max-width:20rem">
    <gk-date-picker
      clearable
      placeholder="Pick a date"
      :value="clearableValue"
      @input="onClearableInput"
    ></gk-date-picker>
  </div>
</DemoCard>

<DemoCard title="Status / round" :code="codes.statusRound">
  <template #description>
    Validation feedback via <code>status</code>; set <code>round</code> for a pill trigger.
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-date-picker status="success" value="2026-09-17"></gk-date-picker>
    <gk-date-picker status="warning" value="2026-09-17"></gk-date-picker>
    <gk-date-picker status="error" value="2026-09-17"></gk-date-picker>
    <gk-date-picker round placeholder="Round"></gk-date-picker>
    <gk-date-picker round size="lg" placeholder="Large round"></gk-date-picker>
  </div>
</DemoCard>

<DemoCard title="Disabled / isDateDisabled" :code="codes.disabled">
  <template #description>
    <code>disabled</code> blocks the whole control. <code>isDateDisabled</code> is a JS property <code>(iso: string) =&gt; boolean</code> that greys out days (and can block <strong>Now</strong>).
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-date-picker disabled placeholder="Disabled" value="2026-09-17"></gk-date-picker>
    <gk-date-picker
      placeholder="Weekends disabled"
      value="2026-09-17"
      :isDateDisabled="isWeekend"
    ></gk-date-picker>
  </div>
</DemoCard>

## API

### Date Picker Props

| Prop | Type | Default |
|------|------|---------|
| `type` | `'date'` | `'date'` |
| `value` | `string` | `''` |
| `format` | `string` | `'yyyy-MM-dd'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `placeholder` | `string` | `''` |
| `disabled` | `boolean` | `false` |
| `clearable` | `boolean` | `false` |
| `round` | `boolean` | `false` |
| `status` | `'success' \| 'warning' \| 'error' \| ''` | `''` |
| `open` | `boolean` | `false` |
| `locale` | `'en' \| 'zh-TW'` | `'en'` |
| `isDateDisabled` | `(iso: string) => boolean` | — |

`value` is ISO `YYYY-MM-DD` or empty. `format` only affects trigger display (`yyyy` `MM` `dd`). `isDateDisabled` is property-only (not an HTML attribute).

### Date Picker Events

| Name | Description |
|------|-------------|
| `input` | Value changed (select / clear / now); bubbles; `composed: true`; `detail: { value: string }` |
| `change` | Same commits as `input`; bubbles; `composed: true`; `detail: { value: string }` |
| `gk-open-change` | Panel open state changed; bubbles; `composed: true`; `detail: { open: boolean }` |

### CSS Parts

Trigger parts are exposable via `gk-date-picker::part(...)`. The panel is portaled to `document.body`, so `panel` / `calendar` / `actions` are **not** reachable as `gk-date-picker::part(panel)` (etc.). Style the popup with `.gk-date-picker-panel` and its descendants (those nodes may still carry `part` attributes for targeting under that class).

| Part | Description |
|------|-------------|
| `base` | Trigger surface (`::part`) |
| `input` | Readonly display text (`::part`) |
| `suffix` | Clear + calendar icon area (`::part`) |
| `clear` | Trigger clear button (`::part`) |
| `panel` | Portaled popup root — style via `.gk-date-picker-panel` |
| `calendar` | Month grid region — under `.gk-date-picker-panel` |
| `actions` | Clear / Now row — under `.gk-date-picker-panel` |
