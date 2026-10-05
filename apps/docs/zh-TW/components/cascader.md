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
    ],
  },
  { label: "韓國（尚未開放）", value: "kr", disabled: true },
];
function onRegion(e: CustomEvent<{ value: string[] | null }>) {
  region.value = e.detail.value;
}
</script>

# Cascader 級聯選擇

單選的階層選擇。點分支只展開下一欄，點葉節點才寫入並關閉。多選與搜尋不在這一版。`check-strategy` 預設 `child`，等多選實作後才會生效。

## 範例

<DemoCard title="地區" code="<gk-cascader :options=&quot;options&quot; clearable>">
  <template #description>
    面板 z-index 為 4000，每層巢狀再加 10。點外面或按 Esc 關閉。
  </template>
  <div style="max-width:22rem">
    <gk-cascader :options="options" :value="region" clearable placeholder="請選擇地區" @change="onRegion"></gk-cascader>
    <p style="margin:0.75rem 0 0;font-size:0.875rem;opacity:0.8">{{ region ? region.join(" / ") : "（空）" }}</p>
  </div>
</DemoCard>

<DemoCard title="狀態" code="<gk-cascader status=&quot;error&quot; placeholder=&quot;必填&quot;>">
  <div style="display:grid;gap:0.75rem;max-width:22rem">
    <gk-cascader status="success" placeholder="已核對地址"></gk-cascader>
    <gk-cascader status="error" placeholder="必填"></gk-cascader>
    <gk-cascader disabled placeholder="台灣 / 台北市 / 中正區"></gk-cascader>
  </div>
</DemoCard>

## API

`value` 是從根到葉的 `string[] | null`。`expand-trigger` 預設 `click`。`options` 為 `{ label, value, children?, disabled? }`。

事件 `change` 與 `update:value` 的 detail 是 `{ value, option }`，清除時另有 `clear`。空資料顯示「沒有資料」，可用 `empty` slot 替換。
