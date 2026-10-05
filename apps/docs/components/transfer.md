<script setup lang="ts">
import { ref } from "vue";

const options = ref([
  { label: "訂單編號", value: "id" },
  { label: "客戶名稱", value: "name" },
  { label: "下單日期", value: "date" },
  { label: "付款狀態", value: "pay" },
  { label: "內部備註（停用）", value: "note", disabled: true },
  { label: "物流單號", value: "ship" },
]);
const keys = ref<string[]>(["id", "name"]);
const pickedShip = ref(["ship"]);
const pickedId = ref(["id"]);

function onChange(event: CustomEvent<{ value: string[] }>) {
  keys.value = event.detail.value;
}
</script>

# Transfer

Two lists and four move buttons. `>` and `>>` are brand primary. `<` and `<<` are secondary outline. Search is on by default. On narrow screens the panels stack and the buttons sit in a row.

## Demos

<DemoCard title="Columns" :code="`<gk-transfer :options=&quot;options&quot; :value=&quot;keys&quot;>`">
  <template #description>
    Header counts are checked / total. Disabled rows stay put. Search filters the visible labels and does not remove keys.
  </template>
  <gk-transfer lang="zh-Hant" :options="options" :value="keys" @change="onChange"></gk-transfer>
  <p style="margin:0.75rem 0 0;font-size:0.875rem;opacity:0.8">{{ keys.join(", ") || "(empty)" }}</p>
</DemoCard>

<DemoCard title="Empty target" code="<gk-transfer>">
  <gk-transfer lang="zh-Hant" :options="options"></gk-transfer>
</DemoCard>

<DemoCard title="Search off, titles, disabled" code="<gk-transfer show-search=&quot;false&quot; source-title=&quot;可選&quot;>">
  <div style="display:grid;gap:1rem">
    <gk-transfer
      lang="zh-Hant"
      show-search="false"
      source-title="可選"
      target-title="已選"
      :options="options"
      :value="pickedShip"
    ></gk-transfer>
    <gk-transfer lang="zh-Hant" disabled :options="options" :value="pickedId"></gk-transfer>
    <gk-transfer lang="zh-Hant" size="sm" :options="options"></gk-transfer>
  </div>
</DemoCard>

<DemoCard title="Inside a form item" code="<gk-form-item label=&quot;可見欄位&quot; path=&quot;cols&quot;>">
  <gk-form>
    <gk-form-item label="可見欄位" path="cols">
      <gk-transfer lang="zh-Hant" :options="options" :value="keys" @change="onChange"></gk-transfer>
    </gk-form-item>
  </gk-form>
</DemoCard>

## API

### Properties

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` / `target-keys` | key[] | `[]` | Keys in the target list |
| `options` / `data` | `TransferOption[]` | `[]` | `{ label, value` or `key, disabled? }` |
| `source-title` / `target-title` | `string` | localized | 來源 / Source, 目標 / Target |
| `titles` | `[string, string]` | — | Overrides the two titles |
| `show-search` / `filterable` | `boolean` | `true` | Either one can turn search off |
| `source-filterable` / `target-filterable` | `boolean` | inherit | |
| `filter-placeholder` | `string` | localized | 搜尋 / Search |
| `size` | `sm` \| `md` \| `lg` | `md` | Row and button height 28 / 34 / 40 |
| `disabled` | `boolean` | `false` | Opacity 0.5 |

### Events

| Name | Detail |
| --- | --- |
| `change`, `update:value` | `{ value, targetKeys, direction: 'source' \| 'target', movedKeys }` |
| `select` | `{ sourceSelectedKeys, targetSelectedKeys }` |
| `search` | `{ direction, value }` |

`direction` is the list the keys moved **to**.

### Parts

`root`, `source-panel`, `target-panel`, `header`, `title`, `count`, `search`, `list`, `item`, `checkbox`, `empty`, `actions`, `button`.

### Slots

`source-title`, `target-title`, `source-empty`, `target-empty`. Empty copy defaults to「暫無資料」.

Virtual scroll, one-way mode, and custom item rendering are follow-ups.
