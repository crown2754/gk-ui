<script setup lang="ts">
import { ref } from "vue";

const dept = ref<string | null>("design");
const options = [
  {
    label: "總公司",
    value: "hq",
    children: [
      {
        label: "產品部",
        value: "product",
        children: [
          { label: "設計組", value: "design" },
          { label: "研發組", value: "rd" },
          { label: "實驗組（停用）", value: "lab", disabled: true },
        ],
      },
      { label: "行銷部", value: "mkt", children: [{ label: "品牌組", value: "brand" }] },
      { label: "營運部", value: "ops", children: [{ label: "客服組", value: "cs" }] },
    ],
  },
  { label: "分公司", value: "branch", children: [{ label: "台中", value: "txg" }] },
];

function onDept(event: CustomEvent<{ value: string | null }>) {
  dept.value = event.detail.value;
}
</script>

# TreeSelect 樹選擇

外觀跟 Select 一樣，面板是一棵可展開的樹。v1 只單選。面板掛到 `document.body`，z-index 4000，每層巢狀再加 10。複選、`check-strategy` 與搜尋之後再做。

## 範例

<DemoCard title="部門" code="<gk-tree-select clearable placeholder=&quot;請選擇部門&quot;>">
  <template #description>
    觸發器以 <code> / </code> 串起路徑。左側開關只展開，點節點會寫入並關閉。
  </template>
  <div style="max-width:22rem">
    <gk-tree-select :options="options" :value="dept" clearable placeholder="請選擇部門" @change="onDept"></gk-tree-select>
    <p style="margin:0.75rem 0 0;font-size:0.875rem;opacity:0.8">{{ dept || "（空）" }}</p>
  </div>
</DemoCard>

<DemoCard title="只顯示節點名稱" code="<gk-tree-select show-path=&quot;false&quot;>">
  <gk-tree-select show-path="false" value="design" :options="options" clearable></gk-tree-select>
</DemoCard>

<DemoCard title="尺寸與狀態" code="<gk-tree-select status=&quot;error&quot; placeholder=&quot;必填&quot;>">
  <div style="display:grid;gap:0.75rem;max-width:22rem">
    <gk-tree-select size="sm" :options="options" value="design" clearable></gk-tree-select>
    <gk-tree-select size="lg" placeholder="請選擇部門"></gk-tree-select>
    <gk-tree-select status="success" :options="options" value="ops"></gk-tree-select>
    <gk-tree-select status="warning" placeholder="請再確認部門"></gk-tree-select>
    <gk-tree-select status="error" placeholder="必填"></gk-tree-select>
    <gk-tree-select disabled :options="options" value="mkt"></gk-tree-select>
  </div>
</DemoCard>

<DemoCard title="沒有資料" code="<gk-tree-select open>">
  <gk-tree-select open lang="zh-Hant" placeholder="沒有資料"></gk-tree-select>
</DemoCard>

<DemoCard title="放進表單" code="<gk-form-item label=&quot;部門&quot;>">
  <gk-form style="max-width:22rem">
    <gk-form-item label="部門" path="dept">
      <gk-tree-select :options="options" placeholder="請選擇部門" clearable></gk-tree-select>
    </gk-form-item>
  </gk-form>
</DemoCard>

## API

`value` 是選中節點的 `value` 或 `key`。`show-path="false"` 時觸發器只顯示該節點名稱。`separator` 預設 ` / `。

`expanded-keys` 為 `null` 時由元件自己記展開狀態。`selectable` 可限制哪些節點能選。停用節點不能選、也不能展開。

`change` 與 `update:value` 的 detail 是 `{ value, option, path }`。清除另有 `clear`。空資料顯示「沒有資料」，可用 `empty` slot 替換。

鍵盤：方向鍵下、Enter 或空白打開；上下移動；左右展開收合；Enter 寫入；Esc 關閉並把焦點還給觸發器。
