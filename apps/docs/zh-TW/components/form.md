<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";

const model = reactive({
  name: "陳小安",
  email: "chen@",
  city: "taipei",
  qty: 2,
  score: 4,
  region: ["tw", "tpe", "daan"] as string[] | null,
  note: "",
});
const rules = {
  name: { required: true },
  email: { required: true, pattern: /^[^@]+@[^@]+\.[^@]+$/, message: "請輸入有效的電子郵件" },
  qty: { required: true, min: 1, max: 99 },
  region: { required: true, message: "請選擇地區" },
};
const regionOptions = [
  {
    label: "台灣",
    value: "tw",
    children: [
      { label: "台北市", value: "tpe", children: [{ label: "大安區", value: "daan" }] },
    ],
  },
];
const orderForm = ref<{ validate: () => Promise<unknown> } | null>(null);
onMounted(() => orderForm.value?.validate());
function onField(key: keyof typeof model, e: CustomEvent<{ value: unknown }>) {
  (model as Record<string, unknown>)[key] = e.detail.value;
}
</script>

# Form 表單

`gk-form` 與 `gk-form-item` 負責標籤、必填星號與錯誤訊息，包住 Input、Select、InputNumber、Rate、Cascader。元件本身不會在窄螢幕自動改成上下排；寬度約 640px 以下請由應用綁定 `label-placement="top"`。

## 範例

<DemoCard title="訂單" code="<gk-form label-width=&quot;7.5rem&quot;>">
  <template #description>
    電子郵件一開始是無效的，所以錯誤會直接出現。只有全部通過時，<code>submit</code> 才會帶出 <code>{ model }</code>。驗證是同步的。
  </template>
  <gk-form ref="orderForm" :model="model" :rules="rules" label-width="7.5rem" style="max-width:36rem">
    <gk-form-item label="姓名" path="name" required help="與證件相同">
      <gk-input :value="model.name" @input="onField('name', $event)"></gk-input>
    </gk-form-item>
    <gk-form-item label="電子郵件" path="email" required>
      <gk-input :value="model.email" @input="onField('email', $event)"></gk-input>
    </gk-form-item>
    <gk-form-item label="城市" path="city">
      <gk-select :value="model.city" @change="onField('city', $event)">
        <gk-option value="taipei">台北市</gk-option>
        <gk-option value="new-taipei">新北市</gk-option>
      </gk-select>
    </gk-form-item>
    <gk-form-item label="數量" path="qty" required>
      <gk-input-number :value="model.qty" min="1" max="99" @change="onField('qty', $event)">
        <span slot="suffix">件</span>
      </gk-input-number>
    </gk-form-item>
    <gk-form-item label="滿意度" path="score">
      <gk-rate :value="model.score" @change="onField('score', $event)"></gk-rate>
    </gk-form-item>
    <gk-form-item label="地區" path="region" required>
      <gk-cascader :options="regionOptions" :value="model.region" @change="onField('region', $event)"></gk-cascader>
    </gk-form-item>
    <gk-form-item label="備註" path="note">
      <gk-input type="textarea" :value="model.note" placeholder="請放在管理室" @input="onField('note', $event)"></gk-input>
      <span slot="extra">最多 200 字</span>
    </gk-form-item>
    <gk-form-item>
      <gk-button type="submit">送出</gk-button>
      <gk-button type="reset" style="margin-inline-start:0.5rem">重設</gk-button>
    </gk-form-item>
  </gk-form>
</DemoCard>

<DemoCard title="標籤在上" code="<gk-form label-placement=&quot;top&quot;>">
  <gk-form label-placement="top" style="max-width:20rem">
    <gk-form-item label="顯示名稱">
      <gk-input value="小安的店"></gk-input>
    </gk-form-item>
    <gk-form-item label="庫存警示" validation-status="warning" feedback="低於 5 件會提醒補貨">
      <gk-input-number value="3"></gk-input-number>
    </gk-form-item>
    <gk-form-item label="折扣碼" .showFeedback="false">
      <gk-input status="error" value="SUMMER"></gk-input>
    </gk-form-item>
  </gk-form>
</DemoCard>

## API

`label-placement` 預設 `left`。必填星號是危險色文字，並且 `aria-hidden`；控制項本身帶 `aria-required`。錯誤時設定 `aria-invalid` 與 `aria-describedby`。

`validate()` 回傳 `{ valid, errors }`。`restoreValidation()` 清除錯誤。重設會改同一個 model 物件。規則若回傳 Promise，會得到「尚不支援非同步驗證」。

`gk-rate` 沒有狀態框線，錯誤只顯示在說明文字。`feedback` 會蓋過規則產生的訊息。
