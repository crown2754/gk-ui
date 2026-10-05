<script setup lang="ts">
import { ref } from "vue";

const region = ref<string[] | null>(["tw", "tpe", "daan"]);
const options = [
  {
    label: "台灣",
    value: "tw",
    children: [
      {
        label: "台北市",
        value: "tpe",
        children: [
          { label: "大安區", value: "daan" },
          { label: "中正區", value: "zhongzheng" },
        ],
      },
      {
        label: "新北市",
        value: "ntpc",
        children: [{ label: "板橋區", value: "banqiao" }],
      },
    ],
  },
  {
    label: "日本",
    value: "jp",
    children: [
      {
        label: "東京都",
        value: "tokyo",
        children: [{ label: "渋谷區", value: "shibuya" }],
      },
    ],
  },
  { label: "韓國（尚未開放）", value: "kr", disabled: true },
];

function onRegion(e: CustomEvent<{ value: string[] | null }>) {
  region.value = e.detail.value;
}

const codes = {
  basic: `<gk-cascader :options="options" :value="region" clearable placeholder="請選擇地區" @change="onRegion"></gk-cascader>`,
  status: `<gk-cascader status="success" placeholder="已核對地址"></gk-cascader>
<gk-cascader status="warning" placeholder="請再確認行政區"></gk-cascader>
<gk-cascader status="error" placeholder="必填"></gk-cascader>`,
};
</script>

# Cascader

Single-select hierarchical picker. The trigger matches Select. Choosing a branch opens the next column; choosing a leaf commits and closes. Multiple selection and filtering are follow-ups. `check-strategy` defaults to `child` for that follow-up and is ignored in v1.

## Demos

<DemoCard title="Region" :code="codes.basic">
  <template #description>
    The panel uses z-index 4000, plus 10 for each nested overlay. Click outside or press Esc to close.
  </template>
  <div style="max-width:22rem">
    <gk-cascader
      :options="options"
      :value="region"
      clearable
      placeholder="請選擇地區"
      @change="onRegion"
    ></gk-cascader>
    <p style="margin:0.75rem 0 0;font-size:0.875rem;opacity:0.8">
      {{ region ? region.join(" / ") : "(empty)" }}
    </p>
  </div>
</DemoCard>

<DemoCard title="Placeholder" :code="`<gk-cascader placeholder=&quot;請選擇地區&quot;></gk-cascader>`">
  <gk-cascader placeholder="請選擇地區"></gk-cascader>
</DemoCard>

<DemoCard title="Sizes" :code="`<gk-cascader size=&quot;sm&quot; placeholder=&quot;sm&quot;></gk-cascader>`">
  <div style="display:grid;gap:0.75rem;max-width:22rem">
    <gk-cascader size="sm" placeholder="sm"></gk-cascader>
    <gk-cascader size="md" placeholder="md"></gk-cascader>
    <gk-cascader size="lg" placeholder="lg"></gk-cascader>
  </div>
</DemoCard>

<DemoCard title="Status and disabled" :code="codes.status">
  <div style="display:grid;gap:0.75rem;max-width:22rem">
    <gk-cascader status="success" placeholder="已核對地址"></gk-cascader>
    <gk-cascader status="warning" placeholder="請再確認行政區"></gk-cascader>
    <gk-cascader status="error" placeholder="必填"></gk-cascader>
    <gk-cascader disabled placeholder="台灣 / 台北市 / 中正區"></gk-cascader>
  </div>
</DemoCard>

<DemoCard title="Empty" :code="`<gk-cascader open placeholder=&quot;沒有資料&quot;></gk-cascader>`">
  <template #description>
    An empty <code>options</code> list shows「沒有資料」when the document language is Chinese, otherwise “No data”. Replace it with the <code>empty</code> slot.
  </template>
  <gk-cascader open placeholder="沒有資料"></gk-cascader>
</DemoCard>

## API

### Properties

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string[] \| null` | `null` | Path from root to leaf |
| `options` | `CascaderOption[]` | `[]` | `{ label, value, children?, disabled? }` |
| `placeholder` | `string` | `''` | |
| `separator` | `string` | `' / '` | |
| `size` | `sm` \| `md` \| `lg` | `md` | |
| `clearable` | `boolean` | `false` | |
| `status` | `success` \| `warning` \| `error` | — | |
| `expand-trigger` | `click` \| `hover` | `click` | |
| `placement` | `bottom-start` \| `top-start` | `bottom-start` | Flips when space is tight |
| `column-width` | `number` | `160` | |
| `filterable` / `multiple` | `boolean` | `false` | Present, not implemented in v1 |
| `check-strategy` | `child` \| `parent` \| `all` | `child` | Ignored until multiple ships |

### Events

| Name | Detail |
| --- | --- |
| `change`, `update:value` | `{ value, option }` |
| `clear` | |

### Parts

`trigger`, `value`, `placeholder`, `clear`, `chevron`, `panel`, `column`, `option`, `empty`.
