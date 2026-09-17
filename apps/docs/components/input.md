<script setup lang="ts">
import { ref } from "vue";

const text = ref("");
const clearableValue = ref("Clear me");
const passwordValue = ref("secret");
const textareaValue = ref("A longer note…");

function onInput(e: CustomEvent<{ value: string }>) {
  text.value = e.detail.value;
}

function onClearableInput(e: CustomEvent<{ value: string }>) {
  clearableValue.value = e.detail.value;
}

function onPasswordInput(e: CustomEvent<{ value: string }>) {
  passwordValue.value = e.detail.value;
}

function onTextareaInput(e: CustomEvent<{ value: string }>) {
  textareaValue.value = e.detail.value;
}

const codes = {
  basic: `<!-- host: const text = ref(""); function onInput(e: CustomEvent<{ value: string }>) { text.value = e.detail.value } -->
<gk-input placeholder="Type here" :value="text" @input="onInput"></gk-input>
<p>Value: {{ text }}</p>`,
  size: `<gk-input size="sm" placeholder="Small"></gk-input>
<gk-input size="md" placeholder="Medium"></gk-input>
<gk-input size="lg" placeholder="Large"></gk-input>`,
  password: `<gk-input
  type="password"
  placeholder="Password"
  :value="passwordValue"
  @input="onPasswordInput"
></gk-input>`,
  textarea: `<gk-input
  type="textarea"
  rows="4"
  placeholder="Write a note"
  :value="textareaValue"
  @input="onTextareaInput"
></gk-input>`,
  clearable: `<gk-input
  clearable
  placeholder="Clearable"
  :value="clearableValue"
  @input="onClearableInput"
></gk-input>`,
  prefixSuffix: `<gk-input placeholder="example.com">
  <span slot="prefix">https://</span>
</gk-input>
<gk-input placeholder="Amount">
  <span slot="prefix">$</span>
  <span slot="suffix">USD</span>
</gk-input>`,
  status: `<gk-input status="success" placeholder="Success" value="Looks good"></gk-input>
<gk-input status="warning" placeholder="Warning" value="Check this"></gk-input>
<gk-input status="error" placeholder="Error" value="Invalid"></gk-input>`,
  round: `<gk-input round placeholder="Round"></gk-input>
<gk-input round size="lg" placeholder="Large round"></gk-input>`,
  disabledReadonly: `<gk-input disabled placeholder="Disabled" value="Cannot edit"></gk-input>
<gk-input readonly placeholder="Readonly" value="Read only"></gk-input>`,
};
</script>

# Input

Input collects text with sizes aligned to Button, plus password, textarea, clearable, prefix/suffix, status, and round.

## Demos

<DemoCard title="Basic" :code="codes.basic">
  <template #description>
    Bind <code>value</code> and listen for <code>input</code> with <code>e.detail.value</code>.
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-input placeholder="Type here" :value="text" @input="onInput"></gk-input>
    <p style="margin:0;font-size:0.875rem;opacity:0.8">Value: {{ text || "(empty)" }}</p>
  </div>
</DemoCard>

<DemoCard title="Size" :code="codes.size">
  <template #description>
    Sizes match Button: <code>sm</code>, <code>md</code>, and <code>lg</code>.
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-input size="sm" placeholder="Small"></gk-input>
    <gk-input size="md" placeholder="Medium"></gk-input>
    <gk-input size="lg" placeholder="Large"></gk-input>
  </div>
</DemoCard>

<DemoCard title="Password" :code="codes.password">
  <template #description>
    <code>type="password"</code> adds a show/hide toggle in the suffix area.
  </template>
  <div style="max-width:20rem">
    <gk-input
      type="password"
      placeholder="Password"
      :value="passwordValue"
      @input="onPasswordInput"
    ></gk-input>
  </div>
</DemoCard>

<DemoCard title="Textarea" :code="codes.textarea">
  <template #description>
    <code>type="textarea"</code> renders a multi-line control; set <code>rows</code> for height.
  </template>
  <div style="max-width:20rem">
    <gk-input
      type="textarea"
      rows="4"
      placeholder="Write a note"
      :value="textareaValue"
      @input="onTextareaInput"
    ></gk-input>
  </div>
</DemoCard>

<DemoCard title="Clearable" :code="codes.clearable">
  <template #description>
    <code>clearable</code> shows a clear control when the value is non-empty and the field is interactive.
  </template>
  <div style="max-width:20rem">
    <gk-input
      clearable
      placeholder="Clearable"
      :value="clearableValue"
      @input="onClearableInput"
    ></gk-input>
  </div>
</DemoCard>

<DemoCard title="Prefix / suffix" :code="codes.prefixSuffix">
  <template #description>
    Use the <code>prefix</code> and <code>suffix</code> slots for adornments. Built-in clear and password toggle render after the suffix slot.
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-input placeholder="example.com">
      <span slot="prefix">https://</span>
    </gk-input>
    <gk-input placeholder="Amount">
      <span slot="prefix">$</span>
      <span slot="suffix">USD</span>
    </gk-input>
  </div>
</DemoCard>

<DemoCard title="Status" :code="codes.status">
  <template #description>
    Validation feedback via <code>status</code>: <code>success</code>, <code>warning</code>, or <code>error</code>.
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-input status="success" placeholder="Success" value="Looks good"></gk-input>
    <gk-input status="warning" placeholder="Warning" value="Check this"></gk-input>
    <gk-input status="error" placeholder="Error" value="Invalid"></gk-input>
  </div>
</DemoCard>

<DemoCard title="Round" :code="codes.round">
  <template #description>
    Set <code>round</code> for a fully rounded field.
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-input round placeholder="Round"></gk-input>
    <gk-input round size="lg" placeholder="Large round"></gk-input>
  </div>
</DemoCard>

<DemoCard title="Disabled / readonly" :code="codes.disabledReadonly">
  <template #description>
    <code>disabled</code> blocks interaction; <code>readonly</code> keeps focus but prevents edits.
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-input disabled placeholder="Disabled" value="Cannot edit"></gk-input>
    <gk-input readonly placeholder="Readonly" value="Read only"></gk-input>
  </div>
</DemoCard>

## API

### Input Props

| Prop | Type | Default |
|------|------|---------|
| `type` | `'text' \| 'password' \| 'textarea'` | `'text'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `value` | `string` | `''` |
| `placeholder` | `string` | `''` |
| `disabled` | `boolean` | `false` |
| `readonly` | `boolean` | `false` |
| `clearable` | `boolean` | `false` |
| `round` | `boolean` | `false` |
| `status` | `'success' \| 'warning' \| 'error' \| ''` | `''` |
| `rows` | `number` | `3` |
| `name` | `string` | `''` |

### Input Slots

| Name | Description |
|------|-------------|
| `prefix` | Leading adornment |
| `suffix` | Trailing adornment (before clear / password toggle) |

### Input Events

| Name | Description |
|------|-------------|
| `input` | Value changed (typing or clear); bubbles; `composed: true`; `detail: { value: string }` |
| `change` | Native-style change (blur/commit or clear); bubbles; `composed: true`; `detail: { value: string }` |

### CSS Parts

| Part | Description |
|------|-------------|
| `base` | Outer surface |
| `input` | Native `<input>` or `<textarea>` |
| `prefix` | Prefix slot wrapper |
| `suffix` | Suffix slot + built-in controls wrapper |
| `clear` | Clear button |
| `password-toggle` | Show/hide password button |
