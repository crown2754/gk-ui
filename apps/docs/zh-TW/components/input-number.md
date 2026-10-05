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
</script>

# InputNumber 數字輸入

帶鍵盤步進與尾端按鈕的數字欄位。高度 28 / 34 / 40，圓角 `--gk-radius-md`，聚焦環約為 focus-ring 的 70%。

既有 `gk-input` 仍使用 `--gk-radius-sm`。統一圓角留待後續，避免表單列混用兩種圓角。

## 範例

<DemoCard title="基本" code="<gk-input-number :value=&quot;amount&quot; @change=&quot;onAmount&quot;>">
  <template #description>
    用 <code>change</code> 或 <code>update:value</code> 的 <code>e.detail.value</code> 提交。輸入過程中的 <code>input</code> 會持續送出。blur、Enter、按鈕或方向鍵才寫入值。
  </template>
  <div style="display:grid;gap:0.75rem;max-width:16rem">
    <gk-input-number :value="amount" @change="onAmount">
      <span slot="prefix">NT$</span>
    </gk-input-number>
    <p style="margin:0;font-size:0.875rem;opacity:0.8">值：{{ amount ?? "（空）" }}</p>
  </div>
</DemoCard>

<DemoCard title="上下限" code="<gk-input-number min=&quot;1&quot; max=&quot;9&quot;>">
  <gk-input-number :value="stepped" min="1" max="9" @change="onStepped">
    <span slot="suffix">件</span>
  </gk-input-number>
</DemoCard>

<DemoCard title="精度與尺寸" code="<gk-input-number step=&quot;0.5&quot; precision=&quot;1&quot;>">
  <div style="display:grid;gap:0.75rem;max-width:16rem">
    <gk-input-number value="12.5" step="0.5" precision="1"><span slot="suffix">kg</span></gk-input-number>
    <gk-input-number size="sm" value="2"></gk-input-number>
    <gk-input-number size="lg" value="2"></gk-input-number>
  </div>
</DemoCard>

<DemoCard title="狀態、唯讀、兩側按鈕" code="<gk-input-number button-placement=&quot;both&quot;>">
  <div style="display:grid;gap:0.75rem;max-width:18rem">
    <gk-input-number status="error" placeholder="必填"></gk-input-number>
    <gk-input-number readonly value="36"><span slot="suffix">件</span></gk-input-number>
    <gk-input-number button-placement="both" value="3"></gk-input-number>
  </div>
</DemoCard>

## API

`value` 為 `number | null`。`step` 預設 1。未設定 `precision` 時由 step 推斷。`button-placement` 預設 `right`（尾端上下箭頭）；`both` 把 − / + 放在欄位兩側。

事件 `input`、`change`、`update:value` 的 detail 都是 `{ value }`。原生 `input` 不會穿出 shadow root。按鈕的無障礙名稱在中文環境是「增加」與「減少」。按住連發不在這一版。

在 Vue 關閉按鈕請用 `.showButton="false"`。只要屬性存在，布林值就會被當成 true。
