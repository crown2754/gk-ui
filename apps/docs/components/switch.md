<script setup lang="ts">
import { ref } from "vue";

const basicOn = ref(true);
const labelOn = ref(false);
const pgChecked = ref(false);
const pgDisabled = ref(false);
const pgRound = ref(true);
const pgSize = ref<"sm" | "md" | "lg">("md");

function onBasicChange(e: CustomEvent<{ checked: boolean }>) {
  basicOn.value = e.detail.checked;
}

function onLabelChange(e: CustomEvent<{ checked: boolean }>) {
  labelOn.value = e.detail.checked;
}

function onPlaygroundChange(e: CustomEvent<{ checked: boolean }>) {
  pgChecked.value = e.detail.checked;
}

const codes = {
  basic: `<!-- host: const basicOn = ref(true); function onBasicChange(e: CustomEvent<{ checked: boolean }>) { basicOn.value = e.detail.checked } -->
<div class="settings-row">
  <span>Notifications</span>
  <gk-switch
    aria-label="Notifications"
    :checked="basicOn"
    @change="onBasicChange"
  ></gk-switch>
</div>`,
  size: `<gk-switch size="sm" checked aria-label="Small"></gk-switch>
<gk-switch size="md" checked aria-label="Medium"></gk-switch>
<gk-switch size="lg" checked aria-label="Large"></gk-switch>`,
  disabled: `<gk-switch disabled aria-label="Disabled off"></gk-switch>
<gk-switch disabled checked aria-label="Disabled on"></gk-switch>`,
  label: `<!-- host: const labelOn = ref(false); function onLabelChange(e: CustomEvent<{ checked: boolean }>) { labelOn.value = e.detail.checked } -->
<gk-switch :checked="labelOn" @change="onLabelChange">Email alerts</gk-switch>`,
};
</script>

# Switch

Switch toggles a boolean in a settings row. Sizes share Button/Input’s `sm` / `md` / `lg` enum; the track is shorter than field height.

## Demos

<DemoCard title="Basic" :code="codes.basic">
  <template #description>
    Bind <code>checked</code> and listen for <code>change</code> with <code>e.detail.checked</code>. Provide an accessible name with <code>aria-label</code> when there is no visible label.
  </template>
  <div style="display:flex;justify-content:space-between;align-items:center;width:100%;max-width:22rem;padding:0.5rem 0">
    <span>Notifications</span>
    <gk-switch
      aria-label="Notifications"
      :checked="basicOn"
      @change="onBasicChange"
    ></gk-switch>
  </div>
</DemoCard>

<DemoCard title="Size" :code="codes.size">
  <template #description>
    Size enum matches Button and Input: <code>sm</code>, <code>md</code>, and <code>lg</code>. The track stays smaller than the 28 / 34 / 40 field heights.
  </template>
  <gk-switch size="sm" checked aria-label="Small"></gk-switch>
  <gk-switch size="md" checked aria-label="Medium"></gk-switch>
  <gk-switch size="lg" checked aria-label="Large"></gk-switch>
</DemoCard>

<DemoCard title="Disabled" :code="codes.disabled">
  <template #description>
    <code>disabled</code> blocks toggling (opacity 0.4).
  </template>
  <gk-switch disabled aria-label="Disabled off"></gk-switch>
  <gk-switch disabled checked aria-label="Disabled on"></gk-switch>
</DemoCard>

<DemoCard title="With label" :code="codes.label">
  <template #description>
    Default slot text is the visible label and the accessible name. Use <code>:round="false"</code> for a squared track (pill is the default).
  </template>
  <gk-switch :checked="labelOn" @change="onLabelChange">Email alerts</gk-switch>
  <gk-switch checked :round="false">Squared</gk-switch>
</DemoCard>

<DemoCard title="Playground">
  <template #description>
    Try combinations of props interactively.
  </template>
  <div style="display:grid;gap:1rem;width:100%">
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem 1.25rem;align-items:end">
      <label style="display:grid;gap:0.35rem;font-size:0.8125rem;color:var(--gk-color-text-muted, rgb(118, 124, 130))">
        Size
        <select v-model="pgSize" style="min-width:8rem;padding:0.35rem 0.5rem;border:1px solid var(--gk-color-border, rgb(224, 224, 230));border-radius:4px;background:var(--gk-playground-control-bg, #fff);color:var(--gk-playground-control-fg, rgb(31, 34, 37));color-scheme:var(--gk-playground-color-scheme, light)">
          <option value="sm">sm</option>
          <option value="md">md</option>
          <option value="lg">lg</option>
        </select>
      </label>
      <label style="display:flex;align-items:center;gap:0.4rem;padding-bottom:0.35rem;font-size:0.8125rem;color:var(--gk-color-text-muted, rgb(118, 124, 130))">
        <input v-model="pgChecked" type="checkbox" /> checked
      </label>
      <label style="display:flex;align-items:center;gap:0.4rem;padding-bottom:0.35rem;font-size:0.8125rem;color:var(--gk-color-text-muted, rgb(118, 124, 130))">
        <input v-model="pgDisabled" type="checkbox" /> disabled
      </label>
      <label style="display:flex;align-items:center;gap:0.4rem;padding-bottom:0.35rem;font-size:0.8125rem;color:var(--gk-color-text-muted, rgb(118, 124, 130))">
        <input v-model="pgRound" type="checkbox" /> round
      </label>
    </div>
    <gk-switch
      :size="pgSize"
      :checked="pgChecked"
      :disabled="pgDisabled"
      :round="pgRound"
      @change="onPlaygroundChange"
    >
      Airplane mode
    </gk-switch>
  </div>
</DemoCard>

## API

### Switch Props

| Prop | Type | Default |
|------|------|---------|
| `checked` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled` | `boolean` | `false` |
| `round` | `boolean` | `true` |

`round` defaults to pill. In raw HTML a boolean attribute cannot express `false`; use the property or Vue `:round="false"`.

### Switch Slots

| Name | Description |
|------|-------------|
| default | Optional visible label (also used as the accessible name) |

### Switch Events

| Name | Description |
|------|-------------|
| `change` | User toggled the switch; bubbles; `composed: true`; `detail: { checked: boolean }` |

Native `input` / `change` from a checkbox are not used. Bind Vue/Alpine to this CustomEvent only.

### CSS Parts

| Part | Description |
|------|-------------|
| `track` | The `role="switch"` control |
| `thumb` | Knob inside the track |
| `label` | Default-slot wrapper |

### Accessibility

- Inner control: `role="switch"` and `aria-checked` reflecting `checked`.
- Space and Enter toggle.
- Provide an accessible name via the default slot or `aria-label`.
- `disabled` prevents toggling.
