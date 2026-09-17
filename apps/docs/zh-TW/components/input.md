<script setup lang="ts">
import { ref } from "vue";

const text = ref("");
const clearableValue = ref("清除我");
const passwordValue = ref("secret");
const textareaValue = ref("較長的備註…");

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
<gk-input placeholder="請輸入" :value="text" @input="onInput"></gk-input>
<p>值：{{ text }}</p>`,
  size: `<gk-input size="sm" placeholder="小"></gk-input>
<gk-input size="md" placeholder="中"></gk-input>
<gk-input size="lg" placeholder="大"></gk-input>`,
  password: `<gk-input
  type="password"
  placeholder="密碼"
  :value="passwordValue"
  @input="onPasswordInput"
></gk-input>`,
  textarea: `<gk-input
  type="textarea"
  rows="4"
  placeholder="寫下備註"
  :value="textareaValue"
  @input="onTextareaInput"
></gk-input>`,
  clearable: `<gk-input
  clearable
  placeholder="可清除"
  :value="clearableValue"
  @input="onClearableInput"
></gk-input>`,
  prefixSuffix: `<gk-input placeholder="example.com">
  <span slot="prefix">https://</span>
</gk-input>
<gk-input placeholder="金額">
  <span slot="prefix">$</span>
  <span slot="suffix">USD</span>
</gk-input>`,
  status: `<gk-input status="success" placeholder="成功" value="看起來沒問題"></gk-input>
<gk-input status="warning" placeholder="警告" value="請檢查"></gk-input>
<gk-input status="error" placeholder="錯誤" value="無效"></gk-input>`,
  round: `<gk-input round placeholder="圓角"></gk-input>
<gk-input round size="lg" placeholder="大型圓角"></gk-input>`,
  disabledReadonly: `<gk-input disabled placeholder="停用" value="無法編輯"></gk-input>
<gk-input readonly placeholder="唯讀" value="僅供閱讀"></gk-input>`,
};
</script>

# Input 輸入

輸入框用來收集文字，尺寸對齊 Button，並支援密碼、多行、清除、前後綴、狀態與圓角。

## 示範

<DemoCard title="基礎" :code="codes.basic">
  <template #description>
    綁定 <code>value</code>，並以 <code>e.detail.value</code> 監聽 <code>input</code>。
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-input placeholder="請輸入" :value="text" @input="onInput"></gk-input>
    <p style="margin:0;font-size:0.875rem;opacity:0.8">值：{{ text || "（空）" }}</p>
  </div>
</DemoCard>

<DemoCard title="尺寸" :code="codes.size">
  <template #description>
    尺寸與 Button 一致：<code>sm</code>、<code>md</code>、<code>lg</code>。
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-input size="sm" placeholder="小"></gk-input>
    <gk-input size="md" placeholder="中"></gk-input>
    <gk-input size="lg" placeholder="大"></gk-input>
  </div>
</DemoCard>

<DemoCard title="密碼" :code="codes.password">
  <template #description>
    <code>type="password"</code> 會在後綴區加入顯示／隱藏切換。
  </template>
  <div style="max-width:20rem">
    <gk-input
      type="password"
      placeholder="密碼"
      :value="passwordValue"
      @input="onPasswordInput"
    ></gk-input>
  </div>
</DemoCard>

<DemoCard title="多行文字" :code="codes.textarea">
  <template #description>
    <code>type="textarea"</code> 會渲染多行控制項；以 <code>rows</code> 設定高度。
  </template>
  <div style="max-width:20rem">
    <gk-input
      type="textarea"
      rows="4"
      placeholder="寫下備註"
      :value="textareaValue"
      @input="onTextareaInput"
    ></gk-input>
  </div>
</DemoCard>

<DemoCard title="可清除" :code="codes.clearable">
  <template #description>
    <code>clearable</code> 在有值且可互動時顯示清除按鈕。
  </template>
  <div style="max-width:20rem">
    <gk-input
      clearable
      placeholder="可清除"
      :value="clearableValue"
      @input="onClearableInput"
    ></gk-input>
  </div>
</DemoCard>

<DemoCard title="前後綴" :code="codes.prefixSuffix">
  <template #description>
    使用 <code>prefix</code> 與 <code>suffix</code> 插槽放置裝飾。內建清除與密碼切換會渲染在 suffix 插槽之後。
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-input placeholder="example.com">
      <span slot="prefix">https://</span>
    </gk-input>
    <gk-input placeholder="金額">
      <span slot="prefix">$</span>
      <span slot="suffix">USD</span>
    </gk-input>
  </div>
</DemoCard>

<DemoCard title="狀態" :code="codes.status">
  <template #description>
    以 <code>status</code> 顯示驗證回饋：<code>success</code>、<code>warning</code> 或 <code>error</code>。
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-input status="success" placeholder="成功" value="看起來沒問題"></gk-input>
    <gk-input status="warning" placeholder="警告" value="請檢查"></gk-input>
    <gk-input status="error" placeholder="錯誤" value="無效"></gk-input>
  </div>
</DemoCard>

<DemoCard title="圓角" :code="codes.round">
  <template #description>
    設定 <code>round</code> 可得到全圓角外觀。
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-input round placeholder="圓角"></gk-input>
    <gk-input round size="lg" placeholder="大型圓角"></gk-input>
  </div>
</DemoCard>

<DemoCard title="停用／唯讀" :code="codes.disabledReadonly">
  <template #description>
    <code>disabled</code> 會阻擋互動；<code>readonly</code> 可聚焦但無法編輯。
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-input disabled placeholder="停用" value="無法編輯"></gk-input>
    <gk-input readonly placeholder="唯讀" value="僅供閱讀"></gk-input>
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
| `prefix` | 前方裝飾 |
| `suffix` | 後方裝飾（位於清除／密碼切換之前） |

### Input Events

| Name | Description |
|------|-------------|
| `input` | 值變更（輸入或清除）；bubbles；`composed: true`；`detail: { value: string }` |
| `change` | 類似原生 change（失焦／提交或清除）；bubbles；`composed: true`；`detail: { value: string }` |

### CSS Parts

| Part | Description |
|------|-------------|
| `base` | 外層表面 |
| `input` | 原生 `<input>` 或 `<textarea>` |
| `prefix` | prefix 插槽容器 |
| `suffix` | suffix 插槽與內建控制項容器 |
| `clear` | 清除按鈕 |
| `password-toggle` | 顯示／隱藏密碼按鈕 |
