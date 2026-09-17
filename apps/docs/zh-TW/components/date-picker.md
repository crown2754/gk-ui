<script setup lang="ts">
import { ref } from "vue";

const value = ref("2026-09-17");
const clearableValue = ref("2026-09-17");
const range = ref<[string, string] | null>(["2026-09-01", "2026-09-17"]);
const datetimeValue = ref("2026-09-17 08:00:00");
const dateTimeRange = ref<[string, string] | null>([
  "2026-09-01 09:00:00",
  "2026-09-17 18:00:00",
]);
const monthValue = ref("2026-09");
const yearValue = ref("2026");

function onInput(e: CustomEvent<{ value: string }>) {
  value.value = e.detail.value;
}

function onClearableInput(e: CustomEvent<{ value: string }>) {
  clearableValue.value = e.detail.value;
}

function onRangeInput(e: CustomEvent<{ value: [string, string] | null }>) {
  range.value = e.detail.value;
}

function onDatetimeInput(e: CustomEvent<{ value: string }>) {
  datetimeValue.value = e.detail.value;
}

function onDateTimeRangeInput(e: CustomEvent<{ value: [string, string] | null }>) {
  dateTimeRange.value = e.detail.value;
}

function onMonthInput(e: CustomEvent<{ value: string }>) {
  monthValue.value = e.detail.value;
}

function onYearInput(e: CustomEvent<{ value: string }>) {
  yearValue.value = e.detail.value;
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
  range: `<!-- host: const range = ref<[string, string] | null>(["2026-09-01", "2026-09-17"]); function onRangeInput(e: CustomEvent<{ value: [string, string] | null }>) { range.value = e.detail.value } -->
<gk-date-picker
  locale="zh-TW"
  type="daterange"
  clearable
  :value="range"
  start-placeholder="開始"
  end-placeholder="結束"
  @input="onRangeInput"
></gk-date-picker>
<p>{{ range }}</p>`,
  datetime: `<!-- host: const datetimeValue = ref("2026-09-17 08:00:00"); function onDatetimeInput(e: CustomEvent<{ value: string }>) { datetimeValue.value = e.detail.value } -->
<gk-date-picker
  locale="zh-TW"
  type="datetime"
  clearable
  :value="datetimeValue"
  @input="onDatetimeInput"
></gk-date-picker>
<p>值：{{ datetimeValue }}</p>`,
  datetimerange: `<!-- host: const dateTimeRange = ref<[string, string] | null>(["2026-09-01 09:00:00", "2026-09-17 18:00:00"]); function onDateTimeRangeInput(e: CustomEvent<{ value: [string, string] | null }>) { dateTimeRange.value = e.detail.value } -->
<gk-date-picker
  locale="zh-TW"
  type="datetimerange"
  clearable
  :value="dateTimeRange"
  start-placeholder="開始"
  end-placeholder="結束"
  @input="onDateTimeRangeInput"
></gk-date-picker>
<p>{{ dateTimeRange }}</p>`,
  month: `<!-- host: const monthValue = ref("2026-09"); function onMonthInput(e: CustomEvent<{ value: string }>) { monthValue.value = e.detail.value } -->
<gk-date-picker
  locale="zh-TW"
  type="month"
  clearable
  :value="monthValue"
  @input="onMonthInput"
></gk-date-picker>
<p>值：{{ monthValue }}</p>`,
  year: `<!-- host: const yearValue = ref("2026"); function onYearInput(e: CustomEvent<{ value: string }>) { yearValue.value = e.detail.value } -->
<gk-date-picker
  locale="zh-TW"
  type="year"
  clearable
  :value="yearValue"
  @input="onYearInput"
></gk-date-picker>
<p>值：{{ yearValue }}</p>`,
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

日期選擇器用來挑選單一曆日、日期範圍（`type="daterange"`）、日期時間（`type="datetime"`）、日期時間範圍（`type="datetimerange"`）、曆月（`type="month"`）或曆年（`type="year"`）。觸發器外觀對齊 Input；面板會 portal 到 `document.body`。日類型面板頂部為可編輯的 **面板欄位**（ISO 日期；日期時間類型另含 `HH:mm:ss` 文字，已移除時／分／秒捲動欄）。範圍類型使用 **雙月曆**（左側為檢視月、右側為下一月），各曆具 `<<`／`<`／標題／`>`／`>>` 導覽。月份／年份類型維持原格線面板（未變更）。

`type="date"` 點選日期即提交（**清除**／**現在**）。`datetime` 與兩種範圍類型在按 **確認** 前為面板草稿（**清除** 仍立即提交）。`daterange`／`datetimerange` 為 **清除**＋**確認**（無「現在」）。範圍觸發器預設分隔符為 ` → `（可用 `separator` 覆寫）。

## 破壞性變更

- **`daterange`**：第二次點日期不再直接提交；須按 **確認** 才會 emit 區間。
- **`datetime`／`datetimerange`**：已移除 H/M/S 捲動欄；請在面板文字欄編輯時間（`HH:mm:ss`，blur 或 Enter 解析；無效輸入會還原）。
- **`separator` 預設值**：`' - '` → `' → '`。

## 示範

<DemoCard title="基礎" :code="codes.basic">
  <template #description>
    綁定 <code>value</code>（ISO <code>YYYY-MM-DD</code>），並以 <code>e.detail.value</code> 監聽 <code>input</code>。面板含可編輯日期欄與單月曆；點選日期即提交並關閉。面板底部可使用 <strong>清除</strong> 與 <strong>現在</strong>。
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-date-picker locale="zh-TW" :value="value" @input="onInput" clearable></gk-date-picker>
    <p style="margin:0;font-size:0.875rem;opacity:0.8">值：{{ value || "（空）" }}</p>
  </div>
</DemoCard>

<DemoCard title="範圍" :code="codes.range">
  <template #description>
    設定 <code>type="daterange"</code>，並以 <code>:value</code> 綁定 <code>[start, end] | null</code>。面板含開始／結束日期欄與 **雙月曆**；兩次點擊選起訖（順序會正規化），須按 <strong>確認</strong> 才提交。底部為 <strong>清除</strong>＋<strong>確認</strong>（無「現在」）。觸發器預設以 <code>separator</code> <code> → </code> 分隔日期。
  </template>
  <div style="display:grid;gap:0.75rem;max-width:24rem">
    <gk-date-picker
      locale="zh-TW"
      type="daterange"
      clearable
      :value="range"
      start-placeholder="開始"
      end-placeholder="結束"
      @input="onRangeInput"
    ></gk-date-picker>
    <p style="margin:0;font-size:0.875rem;opacity:0.8">{{ range ?? "null" }}</p>
  </div>
</DemoCard>

<DemoCard title="日期時間" :code="codes.datetime">
  <template #description>
    設定 <code>type="datetime"</code>，並以本地 <code>YYYY-MM-DD HH:mm:ss</code>（或空）綁定 <code>value</code>。可編輯的日期與 <code>HH:mm:ss</code> 面板欄及日曆共同編輯草稿，須按 <strong>確認</strong> 才提交（<strong>清除</strong>／<strong>現在</strong> 會立即提交）。
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-date-picker
      locale="zh-TW"
      type="datetime"
      clearable
      :value="datetimeValue"
      @input="onDatetimeInput"
    ></gk-date-picker>
    <p style="margin:0;font-size:0.875rem;opacity:0.8">值：{{ datetimeValue || "（空）" }}</p>
  </div>
</DemoCard>

<DemoCard title="日期時間範圍" :code="codes.datetimerange">
  <template #description>
    設定 <code>type="datetimerange"</code>，並以 <code>:value</code> 綁定 <code>[start, end] | null</code>（每段為 <code>YYYY-MM-DD HH:mm:ss</code>）。**雙月曆**與起訖日期／時間欄；在格線選範圍或在欄位輸入後按 <strong>確認</strong>。底部僅 <strong>清除</strong>＋<strong>確認</strong>。
  </template>
  <div style="display:grid;gap:0.75rem;max-width:24rem">
    <gk-date-picker
      locale="zh-TW"
      type="datetimerange"
      clearable
      :value="dateTimeRange"
      start-placeholder="開始"
      end-placeholder="結束"
      @input="onDateTimeRangeInput"
    ></gk-date-picker>
    <p style="margin:0;font-size:0.875rem;opacity:0.8">{{ dateTimeRange ?? "null" }}</p>
  </div>
</DemoCard>

<DemoCard title="月份" :code="codes.month">
  <template #description>
    設定 <code>type="month"</code>，並以 <code>YYYY-MM</code>（或空）綁定 <code>value</code>。面板為 12 個月份格線並可切換年份；點選月份即提交並關閉。預設顯示 <code>format</code> 為 <code>yyyy-MM</code>。面板操作：<strong>清除</strong>／<strong>現在</strong>（無「確認」）。
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-date-picker
      locale="zh-TW"
      type="month"
      clearable
      :value="monthValue"
      @input="onMonthInput"
    ></gk-date-picker>
    <p style="margin:0;font-size:0.875rem;opacity:0.8">值：{{ monthValue || "（空）" }}</p>
  </div>
</DemoCard>

<DemoCard title="年份" :code="codes.year">
  <template #description>
    設定 <code>type="year"</code>，並以四位數 <code>YYYY</code>（或空）綁定 <code>value</code>。面板顯示一頁年份並可前後翻頁；點選年份即提交並關閉。預設 <code>format</code> 為 <code>yyyy</code>。面板操作：<strong>清除</strong>／<strong>現在</strong>。
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-date-picker
      locale="zh-TW"
      type="year"
      clearable
      :value="yearValue"
      @input="onYearInput"
    ></gk-date-picker>
    <p style="margin:0;font-size:0.875rem;opacity:0.8">值：{{ yearValue || "（空）" }}</p>
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
    <code>clearable</code> 在有值且可互動時於觸發器顯示清除按鈕。面板底部亦提供清除（以及依 <code>type</code> 顯示「現在」或「確認」）。
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
| `type` | `'date' \| 'daterange' \| 'datetime' \| 'datetimerange' \| 'month' \| 'year'` | `'date'` |
| `value` | `string` \| `[string, string] \| null` | `''` / `null` |
| `format` | `string` | `'yyyy-MM-dd'`、`'yyyy-MM-dd HH:mm:ss'`（日期時間）、`'yyyy-MM'`（`month`）或 `'yyyy'`（`year`） |
| `separator` | `string` | `' → '` |
| `start-placeholder` | `string` | `''` |
| `end-placeholder` | `string` | `''` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `placeholder` | `string` | `''` |
| `disabled` | `boolean` | `false` |
| `clearable` | `boolean` | `false` |
| `round` | `boolean` | `false` |
| `status` | `'success' \| 'warning' \| 'error' \| ''` | `''` |
| `open` | `boolean` | `false` |
| `locale` | `'en' \| 'zh-TW'` | `'en'` |
| `isDateDisabled` | `(iso: string) => boolean` | — |

`type="date"` 時，`value` 為 ISO `YYYY-MM-DD` 或空字串。`type="daterange"` 時，`value` 為 `[start, end] | null`（各為 `YYYY-MM-DD`）。`type="datetime"` 時，`value` 為本地 `YYYY-MM-DD HH:mm:ss` 或空字串。`type="datetimerange"` 時，`value` 為 `[start, end] | null`（各為 `YYYY-MM-DD HH:mm:ss`）。`type="month"` 時，`value` 為 `YYYY-MM` 或空字串。`type="year"` 時，`value` 為四位數 `YYYY` 或空字串。建議用 `:value` 屬性綁定；範圍 attribute 可為 JSON 陣列。`format` 僅影響觸發器顯示：日期類型用 `yyyy` `MM` `dd`；日期時間類型另支援 `HH` `mm` `ss`；月份用 `yyyy` `MM`；年份用 `yyyy`。變更 `type` 時會調整預設 `format`：`datetime`／`datetimerange` 為 `yyyy-MM-dd HH:mm:ss`，`month` 為 `yyyy-MM`，`year` 為 `yyyy`（自日期預設 `yyyy-MM-dd` 轉換）。`separator`（預設 `' → '`）與 `start-placeholder`／`end-placeholder` 用於範圍觸發器顯示與面板欄位分隔（佔位為空時回退到 `placeholder`）。`isDateDisabled` 僅為 JS 屬性（非 HTML attribute）：日類型傳入 `YYYY-MM-DD`；`month` 為 `YYYY-MM`；`year` 為 `YYYY`。面板欄位在 blur／Enter 時解析（`YYYY-MM-DD` 與 `HH:mm:ss`）；無效文字會還原。**確認** 會提交 `datetime`、`daterange`、`datetimerange` 的面板草稿；**現在** 與 **清除** 在出現時立即提交。`date`／`month`／`year` 點格線即提交（底部另有 **清除**／**現在**）。底部操作：`date`／`month`／`year` → **清除**／**現在**；`datetime` → **清除**／**現在**／**確認**；`daterange`／`datetimerange` → **清除**／**確認**。

### Date Picker Events

| Name | Description |
|------|-------------|
| `input` | 值變更（選擇／清除／現在／確認）；bubbles；`composed: true`；`detail.value` 在 `date`、`datetime`、`month`、`year` 為 `string`，在 `daterange` 與 `datetimerange` 為 `[string, string] \| null` |
| `change` | 與 `input` 相同的提交時機；bubbles；`composed: true`；`detail.value` 與 `input` 一致 |
| `gk-open-change` | 面板開關狀態變更；bubbles；`composed: true`；`detail: { open: boolean }` |

### CSS Parts

觸發器 parts 可用 `gk-date-picker::part(...)`。面板會 portal 到 `document.body`，因此 `panel`／`calendar`／`actions` **無法**以 `gk-date-picker::part(panel)`（等）選取。請以 `.gk-date-picker-panel` 及其子孫樣式化彈出層（這些節點仍可能帶有 `part` 屬性，供在該 class 下定位）。

| Part | Description |
|------|-------------|
| `base` | 觸發器表面（`::part`） |
| `input` | 唯讀顯示文字（`::part`） |
| `suffix` | 清除與日曆圖示區（`::part`） |
| `clear` | 觸發器清除按鈕（`::part`） |
| `panel` | Portal 彈出層根節點 — 以 `.gk-date-picker-panel` 樣式化 |
| `panel-fields` | 日類型面板頂部可編輯日期／時間輸入 — 位於 `.gk-date-picker-panel` 下 |
| `calendar` | 月份格線區（範圍類型為雙曆）— 位於 `.gk-date-picker-panel` 下 |
| `confirm` | 確認按鈕 — 位於 `.gk-date-picker-panel` 下 |
| `actions` | 清除／現在／確認列（依 `type` 而異）— 位於 `.gk-date-picker-panel` 下 |
