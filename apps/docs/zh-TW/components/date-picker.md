<script setup lang="ts">
import { ref } from "vue";

const value = ref("2026-09-17");
const clearableValue = ref("2026-09-17");

function onInput(e: CustomEvent<{ value: string }>) {
  value.value = e.detail.value;
}

function onClearableInput(e: CustomEvent<{ value: string }>) {
  clearableValue.value = e.detail.value;
}

/** 停用週末（僅 JS 屬性；非 HTML attribute）。 */
function isWeekend(iso: string) {
  const day = new Date(`${iso}T00:00:00`).getDay();
  return day === 0 || day === 6;
}

const codes = {
  basic: `<!-- host: const value = ref("2026-09-17"); function onInput(e: CustomEvent<{ value: string }>) { value.value = e.detail.value } -->
<gk-date-picker locale="zh-TW" :value="value" @input="onInput" clearable></gk-date-picker>
<p>值：{{ value }}</p>`,
  size: `<gk-date-picker locale="zh-TW" size="sm" placeholder="小"></gk-date-picker>
<gk-date-picker locale="zh-TW" size="md" placeholder="中"></gk-date-picker>
<gk-date-picker locale="zh-TW" size="lg" placeholder="大"></gk-date-picker>`,
  clearable: `<gk-date-picker
  locale="zh-TW"
  clearable
  placeholder="選擇日期"
  :value="clearableValue"
  @input="onClearableInput"
></gk-date-picker>`,
  statusRound: `<gk-date-picker locale="zh-TW" status="success" value="2026-09-17"></gk-date-picker>
<gk-date-picker locale="zh-TW" status="warning" value="2026-09-17"></gk-date-picker>
<gk-date-picker locale="zh-TW" status="error" value="2026-09-17"></gk-date-picker>
<gk-date-picker locale="zh-TW" round placeholder="圓角"></gk-date-picker>
<gk-date-picker locale="zh-TW" round size="lg" placeholder="大型圓角"></gk-date-picker>`,
  disabled: `<!-- host: function isWeekend(iso: string) { const day = new Date(iso + "T00:00:00").getDay(); return day === 0 || day === 6 } -->
<gk-date-picker locale="zh-TW" disabled placeholder="停用" value="2026-09-17"></gk-date-picker>
<gk-date-picker
  locale="zh-TW"
  placeholder="週末停用"
  value="2026-09-17"
  :isDateDisabled="isWeekend"
></gk-date-picker>`,
};
</script>

# Date Picker 日期選擇

日期選擇器用來挑選單一曆日。觸發器外觀對齊 Input；面板會 portal 到 `document.body`，並提供月份導覽與 **清除**／**現在**。

第一階段僅支援單一日期；範圍、日期時間、月份／年份稍後提供。

## 示範

<DemoCard title="基礎" :code="codes.basic">
  <template #description>
    綁定 <code>value</code>（ISO <code>YYYY-MM-DD</code>），並以 <code>e.detail.value</code> 監聽 <code>input</code>。開啟面板可使用 <strong>清除</strong> 與 <strong>現在</strong>。
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-date-picker locale="zh-TW" :value="value" @input="onInput" clearable></gk-date-picker>
    <p style="margin:0;font-size:0.875rem;opacity:0.8">值：{{ value || "（空）" }}</p>
  </div>
</DemoCard>

<DemoCard title="尺寸" :code="codes.size">
  <template #description>
    尺寸與 Input／Button 一致：<code>sm</code>、<code>md</code>、<code>lg</code>。
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-date-picker locale="zh-TW" size="sm" placeholder="小"></gk-date-picker>
    <gk-date-picker locale="zh-TW" size="md" placeholder="中"></gk-date-picker>
    <gk-date-picker locale="zh-TW" size="lg" placeholder="大"></gk-date-picker>
  </div>
</DemoCard>

<DemoCard title="可清除" :code="codes.clearable">
  <template #description>
    <code>clearable</code> 在有值且可互動時於觸發器顯示清除按鈕。面板也提供清除／現在。
  </template>
  <div style="max-width:20rem">
    <gk-date-picker
      locale="zh-TW"
      clearable
      placeholder="選擇日期"
      :value="clearableValue"
      @input="onClearableInput"
    ></gk-date-picker>
  </div>
</DemoCard>

<DemoCard title="狀態／圓角" :code="codes.statusRound">
  <template #description>
    以 <code>status</code> 顯示驗證回饋；設定 <code>round</code> 可得到全圓角觸發器。
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-date-picker locale="zh-TW" status="success" value="2026-09-17"></gk-date-picker>
    <gk-date-picker locale="zh-TW" status="warning" value="2026-09-17"></gk-date-picker>
    <gk-date-picker locale="zh-TW" status="error" value="2026-09-17"></gk-date-picker>
    <gk-date-picker locale="zh-TW" round placeholder="圓角"></gk-date-picker>
    <gk-date-picker locale="zh-TW" round size="lg" placeholder="大型圓角"></gk-date-picker>
  </div>
</DemoCard>

<DemoCard title="停用／isDateDisabled" :code="codes.disabled">
  <template #description>
    <code>disabled</code> 會停用整個控制項。<code>isDateDisabled</code> 是 JS 屬性 <code>(iso: string) =&gt; boolean</code>，用來停用日期（亦可阻擋 <strong>現在</strong>）。
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-date-picker locale="zh-TW" disabled placeholder="停用" value="2026-09-17"></gk-date-picker>
    <gk-date-picker
      locale="zh-TW"
      placeholder="週末停用"
      value="2026-09-17"
      :isDateDisabled="isWeekend"
    ></gk-date-picker>
  </div>
</DemoCard>

## API

### Date Picker Props

| Prop | Type | Default |
|------|------|---------|
| `type` | `'date'` | `'date'` |
| `value` | `string` | `''` |
| `format` | `string` | `'yyyy-MM-dd'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `placeholder` | `string` | `''` |
| `disabled` | `boolean` | `false` |
| `clearable` | `boolean` | `false` |
| `round` | `boolean` | `false` |
| `status` | `'success' \| 'warning' \| 'error' \| ''` | `''` |
| `open` | `boolean` | `false` |
| `locale` | `'en' \| 'zh-TW'` | `'en'` |
| `isDateDisabled` | `(iso: string) => boolean` | — |

`value` 為 ISO `YYYY-MM-DD` 或空字串。`format` 僅影響觸發器顯示（`yyyy` `MM` `dd`）。`isDateDisabled` 僅為 JS 屬性（非 HTML attribute）。

### Date Picker Events

| Name | Description |
|------|-------------|
| `input` | 值變更（選擇／清除／現在）；bubbles；`composed: true`；`detail: { value: string }` |
| `change` | 與 `input` 相同的提交時機；bubbles；`composed: true`；`detail: { value: string }` |
| `gk-open-change` | 面板開關狀態變更；bubbles；`composed: true`；`detail: { open: boolean }` |

### CSS Parts

| Part | Description |
|------|-------------|
| `base` | 觸發器表面 |
| `input` | 唯讀顯示文字 |
| `suffix` | 清除與日曆圖示區 |
| `clear` | 觸發器清除按鈕 |
| `panel` | Portal 彈出層根節點 |
| `calendar` | 月份格線區 |
| `actions` | 清除／現在列 |
