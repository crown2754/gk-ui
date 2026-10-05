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

# Transfer 穿梭框

左右兩欄，中間四個搬移鈕。`>`、`>>` 是品牌主色，`<`、`<<` 是次要描邊。搜尋預設打開。窄螢幕改成上下堆疊，按鈕改成橫排。

## 範例

<DemoCard title="欄位權限" code="<gk-transfer :options=&quot;options&quot; :value=&quot;keys&quot;>">
  <template #description>
    標題計數是已勾選 / 該欄總數。停用列留在原地。搜尋只過濾畫面上的文字，不會改已選的 key。
  </template>
  <gk-transfer lang="zh-Hant" :options="options" :value="keys" @change="onChange"></gk-transfer>
  <p style="margin:0.75rem 0 0;font-size:0.875rem;opacity:0.8">{{ keys.join("、") || "（空）" }}</p>
</DemoCard>

<DemoCard title="目標是空的" code="<gk-transfer>">
  <gk-transfer lang="zh-Hant" :options="options"></gk-transfer>
</DemoCard>

<DemoCard title="關閉搜尋、自訂標題、停用" code="<gk-transfer show-search=&quot;false&quot;>">
  <div style="display:grid;gap:1rem">
    <gk-transfer lang="zh-Hant" show-search="false" source-title="可選" target-title="已選" :options="options" :value="pickedShip"></gk-transfer>
    <gk-transfer lang="zh-Hant" disabled :options="options" :value="pickedId"></gk-transfer>
    <gk-transfer lang="zh-Hant" size="sm" :options="options"></gk-transfer>
  </div>
</DemoCard>

<DemoCard title="放進表單" code="<gk-form-item label=&quot;可見欄位&quot;>">
  <gk-form>
    <gk-form-item label="可見欄位" path="cols">
      <gk-transfer lang="zh-Hant" :options="options" :value="keys" @change="onChange"></gk-transfer>
    </gk-form-item>
  </gk-form>
</DemoCard>

## API

`value` 與 `target-keys` 是目標欄的 key。`options` 為 `{ label, value 或 key, disabled? }`。

`show-search` 與 `filterable` 預設都是 true，關掉任一個就沒有搜尋框。標題空白時依語系顯示「來源／目標」或 Source / Target。

`change` 的 detail 是 `{ value, targetKeys, direction, movedKeys }`。`direction` 是搬過去的那一側：`target` 或 `source`。

勾選時另有 `select`。搜尋時有 `search`。空清單顯示「暫無資料」，可用 `source-empty`、`target-empty` slot 替換。

虛擬捲動、單向搬移與自訂列內容不在這一版。
