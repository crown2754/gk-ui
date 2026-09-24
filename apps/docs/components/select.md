<script setup lang="ts">
import { ref } from "vue";

const fruit = ref("pear");
const clearable = ref("apple");
const multipleValues = ref(["apple", "pear"]);
const remoteLoading = ref(false);
const remoteOptions = ref([
  { value: "apple", label: "Apple" },
  { value: "pear", label: "Pear" },
  { value: "plum", label: "Plum" },
]);
function onFruit(e: CustomEvent<{ value: string }>) {
  fruit.value = e.detail.value;
}
function onClearable(e: CustomEvent<{ value: string }>) {
  clearable.value = e.detail.value;
}
function onMultiple(e: CustomEvent<{ value: string[] }>) {
  multipleValues.value = e.detail.value;
}
let latestRemoteRequest = 0;
function onRemoteSearch(e: CustomEvent<{ query: string; requestId: number }>) {
  latestRemoteRequest = e.detail.requestId;
  remoteLoading.value = true;
  const query = e.detail.query.toLowerCase();
  window.setTimeout(() => {
    if (e.detail.requestId !== latestRemoteRequest) return;
    remoteOptions.value = [
      { value: "apple", label: "Apple" },
      { value: "pear", label: "Pear" },
      { value: "plum", label: "Plum" },
    ].filter((option) => option.label.toLowerCase().includes(query));
    remoteLoading.value = false;
  }, 300);
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
  filterable: `<gk-select filterable placeholder="Search fruit">
  <gk-option value="apple">Apple</gk-option>
  <gk-option value="pear">Pear</gk-option>
  <gk-option value="plum">Plum</gk-option>
</gk-select>`,
  groups: `<gk-select placeholder="Pick a fruit">
  <gk-option-group label="Fresh">
    <gk-option value="apple">Apple</gk-option>
    <gk-option value="pear">Pear</gk-option>
  </gk-option-group>
  <gk-option-group label="Unavailable" disabled>
    <gk-option value="plum">Plum</gk-option>
  </gk-option-group>
</gk-select>`,
  empty: `<gk-select open placeholder="No options"></gk-select>`,
  multiple: `<gk-select multiple :value="multipleValues" placeholder="Pick fruits" @change="onMultiple">
  <gk-option value="apple">Apple</gk-option>
  <gk-option value="pear">Pear</gk-option>
  <gk-option value="plum">Plum</gk-option>
</gk-select>`,
  max: `<gk-select multiple max="2" placeholder="Pick up to two fruits">
  <gk-option value="apple">Apple</gk-option>
  <gk-option value="pear">Pear</gk-option>
  <gk-option value="plum">Plum</gk-option>
</gk-select>`,
  remote: `<gk-select remote remote-debounce="300" :loading="remoteLoading" placeholder="Search remotely" @search="onRemoteSearch">
  <gk-option v-for="option in remoteOptions" :key="option.value" :value="option.value">{{ option.label }}</gk-option>
</gk-select>`,
  customState: `<gk-select loading open>
  <span slot="loading">Fetching fruits...</span>
  <span slot="empty">No matching fruit</span>
</gk-select>`,
  virtual: `<gk-select virtual item-height="34" placeholder="Many options">
  <!-- render a large list of gk-option elements here -->
</gk-select>`,
};
</script>

# Select

Single-select dropdown. The trigger matches Input chrome; option hover and selected states use a light brand wash, not a solid yellow block.

## Demos

<DemoCard title="Basic" :code="codes.basic">
  <template #description>
    Bind <code>value</code> and listen for <code>change</code> with <code>e.detail.value</code>. Options are slotted <code>gk-option</code> children.
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

<DemoCard title="Custom loading and empty content" :code="codes.customState">
  <template #description>
    Provide elements with <code>slot="loading"</code> or <code>slot="empty"</code>
    to customize the corresponding listbox state.
  </template>
  <div style="min-width:16rem">
    <gk-select loading open>
      <span slot="loading">Fetching fruits...</span>
      <span slot="empty">No matching fruit</span>
    </gk-select>
  </div>
</DemoCard>

<DemoCard title="Loading and remote search" :code="codes.remote">
  <template #description>
    <code>loading</code> shows a loading state and blocks selection. <code>remote</code>
    emits a debounced <code>search</code> event with <code>e.detail.query</code>
    and a monotonically increasing <code>e.detail.requestId</code>. Keep the
    latest request id to ignore stale async responses.
  </template>
  <div style="min-width:16rem">
    <gk-select remote remote-debounce="300" :loading="remoteLoading" placeholder="Search remotely" @search="onRemoteSearch">
      <gk-option v-for="option in remoteOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </gk-option>
    </gk-select>
  </div>
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

<DemoCard title="Virtual scrolling" :code="codes.virtual">
  <template #description>
    Enable <code>virtual</code> for large option lists. Set <code>item-height</code>
    to the rendered option height in pixels.
  </template>
  <div style="min-width:16rem">
    <gk-select virtual item-height="34" placeholder="Many options">
      <gk-option v-for="index in 100" :key="index" :value="`option-${index}`">
        Option {{ index }}
      </gk-option>
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

<DemoCard title="Filterable" :code="codes.filterable">
  <template #description>
    <code>filterable</code> adds a search field and filters by option label or value.
  </template>
  <div style="min-width:16rem">
    <gk-select filterable placeholder="Search fruit">
      <gk-option value="apple">Apple</gk-option>
      <gk-option value="pear">Pear</gk-option>
      <gk-option value="plum">Plum</gk-option>
    </gk-select>
  </div>
</DemoCard>

<DemoCard title="Multiple" :code="codes.multiple">
  <template #description>
    <code>multiple</code> keeps the menu open and renders selected values as tags.
    Bind <code>value</code> as a string array. Options display checkbox indicators
    while multiple selection is enabled.
  </template>
  <div style="min-width:16rem">
    <gk-select multiple :value="multipleValues" placeholder="Pick fruits" @change="onMultiple">
      <gk-option value="apple">Apple</gk-option>
      <gk-option value="pear">Pear</gk-option>
      <gk-option value="plum">Plum</gk-option>
    </gk-select>
  </div>
  <p style="margin:0;font-size:0.875rem;opacity:0.8">
    Selected: {{ multipleValues.length ? multipleValues.join(", ") : "(empty)" }}
  </p>
</DemoCard>

<DemoCard title="Maximum multiple selections" :code="codes.max">
  <template #description>
    Set <code>max</code> to limit additions in multiple mode. Removing an
    already selected option remains available.
  </template>
  <div style="min-width:16rem">
    <gk-select multiple max="2" placeholder="Pick up to two fruits">
      <gk-option value="apple">Apple</gk-option>
      <gk-option value="pear">Pear</gk-option>
      <gk-option value="plum">Plum</gk-option>
    </gk-select>
  </div>
</DemoCard>

## Option groups and empty state

Use `<gk-option-group label="…">` to visually group options. Disabled options
are skipped by Arrow/Home/End keyboard navigation. An empty Select displays a
`No options` status in the listbox.

Set <code>filterable</code> to show a search field while the listbox is open.
Filtering matches option labels or values case-insensitively; Arrow keys and
Enter continue to select from the filtered results.

<DemoCard title="Option groups" :code="codes.groups">
  <template #description>
    Group options with <code>gk-option-group</code>. A disabled group disables all its options.
  </template>
  <div style="min-width:16rem">
    <gk-select placeholder="Pick a fruit">
      <gk-option-group label="Fresh">
        <gk-option value="apple">Apple</gk-option>
        <gk-option value="pear">Pear</gk-option>
      </gk-option-group>
      <gk-option-group label="Unavailable" disabled>
        <gk-option value="plum">Plum</gk-option>
      </gk-option-group>
    </gk-select>
  </div>
</DemoCard>

<DemoCard title="Empty state" :code="codes.empty">
  <template #description>
    An open Select with no options shows the empty listbox state.
  </template>
  <div style="min-width:16rem">
    <gk-select open placeholder="No options"></gk-select>
  </div>
</DemoCard>

## API

### Select Props

| Prop | Type | Default |
|------|------|---------|
| `value` | `string \| string[]` | `''` / `[]` when `multiple` |
| `placeholder` | `string` | `''` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled` | `boolean` | `false` |
| `clearable` | `boolean` | `false` |
| `filterable` | `boolean` | `false` |
| `loading` | `boolean` | `false` |
| `remote` | `boolean` | `false` |
| `remote-debounce` | `number` | `300` |
| `virtual` | `boolean` | `false` |
| `item-height` | `number` | `34` |
| `name` | `string` | `''` |
| `required` | `boolean` | `false` |

State content can be customized with the `loading` and `empty` named slots.
Use `name` to include the value in a native form submission and `required` to
enable constraint validation. Calling `form.reset()` clears the Select value.
| `multiple` | `boolean` | `false` |
| `max` | `number` | `0` (unlimited) |
| `status` | `'success' \| 'warning' \| 'error' \| ''` | `''` |
| `open` | `boolean` | `false` |

### Select Slots

| Name | Description |
|------|-------------|
| default | `<gk-option value="…">` children |
| loading | Content shown while `loading` is `true` |
| empty | Content shown when no options are visible |

### Select Events

| Name | Description |
|------|-------------|
| `change` | `detail: { value: string \| string[] }` |
| `search` | `detail: { query: string, requestId: number }` after the remote debounce delay |

### Option Props

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | `''` |
| `disabled` | `boolean` | `false` |

### Option Group Props

| Prop | Type | Default |
|------|------|---------|
| `label` | `string` | `''` |
| `disabled` | `boolean` | `false` |
