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

/** Disable weekends (property-only; not an HTML attribute). */
function isWeekend(iso: string) {
  const day = new Date(`${iso}T00:00:00`).getDay();
  return day === 0 || day === 6;
}

const codes = {
  basic: `<!-- host: const value = ref("2026-09-17"); function onInput(e: CustomEvent<{ value: string }>) { value.value = e.detail.value } -->
<gk-date-picker :value="value" @input="onInput" clearable></gk-date-picker>
<p>Value: {{ value }}</p>`,
  range: `<!-- host: const range = ref<[string, string] | null>(["2026-09-01", "2026-09-17"]); function onRangeInput(e: CustomEvent<{ value: [string, string] | null }>) { range.value = e.detail.value } -->
<gk-date-picker
  type="daterange"
  clearable
  :value="range"
  start-placeholder="Start"
  end-placeholder="End"
  @input="onRangeInput"
></gk-date-picker>
<p>{{ range }}</p>`,
  datetime: `<!-- host: const datetimeValue = ref("2026-09-17 08:00:00"); function onDatetimeInput(e: CustomEvent<{ value: string }>) { datetimeValue.value = e.detail.value } -->
<gk-date-picker
  type="datetime"
  clearable
  :value="datetimeValue"
  @input="onDatetimeInput"
></gk-date-picker>
<p>Value: {{ datetimeValue }}</p>`,
  datetimerange: `<!-- host: const dateTimeRange = ref<[string, string] | null>(["2026-09-01 09:00:00", "2026-09-17 18:00:00"]); function onDateTimeRangeInput(e: CustomEvent<{ value: [string, string] | null }>) { dateTimeRange.value = e.detail.value } -->
<gk-date-picker
  type="datetimerange"
  clearable
  :value="dateTimeRange"
  start-placeholder="Start"
  end-placeholder="End"
  @input="onDateTimeRangeInput"
></gk-date-picker>
<p>{{ dateTimeRange }}</p>`,
  month: `<!-- host: const monthValue = ref("2026-09"); function onMonthInput(e: CustomEvent<{ value: string }>) { monthValue.value = e.detail.value } -->
<gk-date-picker
  type="month"
  clearable
  :value="monthValue"
  @input="onMonthInput"
></gk-date-picker>
<p>Value: {{ monthValue }}</p>`,
  year: `<!-- host: const yearValue = ref("2026"); function onYearInput(e: CustomEvent<{ value: string }>) { yearValue.value = e.detail.value } -->
<gk-date-picker
  type="year"
  clearable
  :value="yearValue"
  @input="onYearInput"
></gk-date-picker>
<p>Value: {{ yearValue }}</p>`,
  size: `<gk-date-picker size="sm" placeholder="Small"></gk-date-picker>
<gk-date-picker size="md" placeholder="Medium"></gk-date-picker>
<gk-date-picker size="lg" placeholder="Large"></gk-date-picker>`,
  clearable: `<gk-date-picker
  clearable
  placeholder="Pick a date"
  :value="clearableValue"
  @input="onClearableInput"
></gk-date-picker>`,
  statusRound: `<gk-date-picker status="success" value="2026-09-17"></gk-date-picker>
<gk-date-picker status="warning" value="2026-09-17"></gk-date-picker>
<gk-date-picker status="error" value="2026-09-17"></gk-date-picker>
<gk-date-picker round placeholder="Round"></gk-date-picker>
<gk-date-picker round size="lg" placeholder="Large round"></gk-date-picker>`,
  disabled: `<!-- host: function isWeekend(iso: string) { const day = new Date(iso + "T00:00:00").getDay(); return day === 0 || day === 6 } -->
<gk-date-picker disabled placeholder="Disabled" value="2026-09-17"></gk-date-picker>
<gk-date-picker
  placeholder="Weekends disabled"
  value="2026-09-17"
  :isDateDisabled="isWeekend"
></gk-date-picker>`,
};
</script>

# Date Picker

Date Picker selects a single calendar day, a date range (`type="daterange"`), a date-time (`type="datetime"`), a date-time range (`type="datetimerange"`), a calendar month (`type="month"`), or a calendar year (`type="year"`). The trigger matches Input sizing and chrome; the panel portals to `document.body`. Day panels show editable **panel fields** at the top (ISO dates and, for datetime types, `HH:mm:ss` text — no hour/minute/second scroll columns). Range types use **dual-month** calendars (left month = view; right = next month) with `<<` / `<` / title / `>` / `>>` navigation per calendar. Month and year types keep their grid panels (unchanged).

`type="date"` commits on day click (**Clear** / **Now**). `datetime` and both range types keep a panel draft until **Confirm** (**Clear** commits immediately). `daterange` and `datetimerange` show **Clear** + **Confirm** (no **Now**). Default range display separator is ` → ` (override with `separator`).

## Breaking changes

- **`daterange`**: no longer commits on the second day click; click **Confirm** to emit the pair.
- **`datetime` / `datetimerange`**: H/M/S scroll columns removed; edit time in panel text fields (`HH:mm:ss`, blur or Enter to parse; invalid input reverts).
- **`separator` default**: `' - '` → `' → '`.

## Demos

<DemoCard title="Basic" :code="codes.basic">
  <template #description>
    Bind <code>value</code> (ISO <code>YYYY-MM-DD</code>) and listen for <code>input</code> with <code>e.detail.value</code>. The panel shows an editable date field plus a single-month calendar; clicking a day commits and closes. Use <strong>Clear</strong> and <strong>Now</strong> in the panel footer.
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-date-picker :value="value" @input="onInput" clearable></gk-date-picker>
    <p style="margin:0;font-size:0.875rem;opacity:0.8">Value: {{ value || "(empty)" }}</p>
  </div>
</DemoCard>

<DemoCard title="Range" :code="codes.range">
  <template #description>
    Set <code>type="daterange"</code> and bind <code>:value</code> to <code>[start, end] | null</code>. The panel shows start/end date fields and **dual-month** calendars. Two clicks pick start then end (order is normalized); values stay draft until you click <strong>Confirm</strong>. Footer: <strong>Clear</strong> + <strong>Confirm</strong> (no Now). Trigger display uses the default <code>separator</code> <code> → </code> between dates.
  </template>
  <div style="display:grid;gap:0.75rem;max-width:24rem">
    <gk-date-picker
      type="daterange"
      clearable
      :value="range"
      start-placeholder="Start"
      end-placeholder="End"
      @input="onRangeInput"
    ></gk-date-picker>
    <p style="margin:0;font-size:0.875rem;opacity:0.8">{{ range ?? "null" }}</p>
  </div>
</DemoCard>

<DemoCard title="Datetime" :code="codes.datetime">
  <template #description>
    Set <code>type="datetime"</code> and bind <code>value</code> as local <code>YYYY-MM-DD HH:mm:ss</code> (or empty). Editable date and <code>HH:mm:ss</code> panel fields and the calendar edit a draft until <strong>Confirm</strong> (<strong>Clear</strong> / <strong>Now</strong> commit immediately).
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-date-picker
      type="datetime"
      clearable
      :value="datetimeValue"
      @input="onDatetimeInput"
    ></gk-date-picker>
    <p style="margin:0;font-size:0.875rem;opacity:0.8">Value: {{ datetimeValue || "(empty)" }}</p>
  </div>
</DemoCard>

<DemoCard title="Datetimerange" :code="codes.datetimerange">
  <template #description>
    Set <code>type="datetimerange"</code> and bind <code>:value</code> to <code>[start, end] | null</code> (each string <code>YYYY-MM-DD HH:mm:ss</code>). **Dual-month** calendars plus start/end date and time fields; pick the range on the grid or type in the fields, then <strong>Confirm</strong>. Footer: <strong>Clear</strong> + <strong>Confirm</strong> only.
  </template>
  <div style="display:grid;gap:0.75rem;max-width:24rem">
    <gk-date-picker
      type="datetimerange"
      clearable
      :value="dateTimeRange"
      start-placeholder="Start"
      end-placeholder="End"
      @input="onDateTimeRangeInput"
    ></gk-date-picker>
    <p style="margin:0;font-size:0.875rem;opacity:0.8">{{ dateTimeRange ?? "null" }}</p>
  </div>
</DemoCard>

<DemoCard title="Month" :code="codes.month">
  <template #description>
    Set <code>type="month"</code> and bind <code>value</code> as <code>YYYY-MM</code> (or empty). The panel shows a 12-month grid with year navigation; picking a month commits and closes. Default display <code>format</code> is <code>yyyy-MM</code>. Panel actions: <strong>Clear</strong> / <strong>Now</strong> (no Confirm).
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-date-picker
      type="month"
      clearable
      :value="monthValue"
      @input="onMonthInput"
    ></gk-date-picker>
    <p style="margin:0;font-size:0.875rem;opacity:0.8">Value: {{ monthValue || "(empty)" }}</p>
  </div>
</DemoCard>

<DemoCard title="Year" :code="codes.year">
  <template #description>
    Set <code>type="year"</code> and bind <code>value</code> as four-digit <code>YYYY</code> (or empty). The panel shows a page of years with prev/next page controls; picking a year commits and closes. Default <code>format</code> is <code>yyyy</code>. Panel actions: <strong>Clear</strong> / <strong>Now</strong>.
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-date-picker
      type="year"
      clearable
      :value="yearValue"
      @input="onYearInput"
    ></gk-date-picker>
    <p style="margin:0;font-size:0.875rem;opacity:0.8">Value: {{ yearValue || "(empty)" }}</p>
  </div>
</DemoCard>

<DemoCard title="Size" :code="codes.size">
  <template #description>
    Sizes match Input / Button: <code>sm</code>, <code>md</code>, and <code>lg</code>.
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-date-picker size="sm" placeholder="Small"></gk-date-picker>
    <gk-date-picker size="md" placeholder="Medium"></gk-date-picker>
    <gk-date-picker size="lg" placeholder="Large"></gk-date-picker>
  </div>
</DemoCard>

<DemoCard title="Clearable" :code="codes.clearable">
  <template #description>
    <code>clearable</code> shows a clear control on the trigger when the value is non-empty and the field is interactive. The panel footer also exposes Clear (and Now or Confirm depending on <code>type</code>).
  </template>
  <div style="max-width:20rem">
    <gk-date-picker
      clearable
      placeholder="Pick a date"
      :value="clearableValue"
      @input="onClearableInput"
    ></gk-date-picker>
  </div>
</DemoCard>

<DemoCard title="Status / round" :code="codes.statusRound">
  <template #description>
    Validation feedback via <code>status</code>; set <code>round</code> for a pill trigger.
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-date-picker status="success" value="2026-09-17"></gk-date-picker>
    <gk-date-picker status="warning" value="2026-09-17"></gk-date-picker>
    <gk-date-picker status="error" value="2026-09-17"></gk-date-picker>
    <gk-date-picker round placeholder="Round"></gk-date-picker>
    <gk-date-picker round size="lg" placeholder="Large round"></gk-date-picker>
  </div>
</DemoCard>

<DemoCard title="Disabled / isDateDisabled" :code="codes.disabled">
  <template #description>
    <code>disabled</code> blocks the whole control. <code>isDateDisabled</code> is a JS property <code>(iso: string) =&gt; boolean</code> that greys out days (and can block <strong>Now</strong>).
  </template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <gk-date-picker disabled placeholder="Disabled" value="2026-09-17"></gk-date-picker>
    <gk-date-picker
      placeholder="Weekends disabled"
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
| `format` | `string` | `'yyyy-MM-dd'`, `'yyyy-MM-dd HH:mm:ss'` (datetime types), `'yyyy-MM'` (`month`), or `'yyyy'` (`year`) |
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

For `type="date"`, `value` is ISO `YYYY-MM-DD` or empty string. For `type="daterange"`, `value` is `[start, end] | null` (each `YYYY-MM-DD`). For `type="datetime"`, `value` is local `YYYY-MM-DD HH:mm:ss` or empty string. For `type="datetimerange"`, `value` is `[start, end] | null` (each `YYYY-MM-DD HH:mm:ss`). For `type="month"`, `value` is `YYYY-MM` or empty string. For `type="year"`, `value` is four-digit `YYYY` or empty string. Prefer `:value` property binding; range attributes may be a JSON array. `format` only affects trigger display: date types use `yyyy` `MM` `dd`; datetime types also support `HH` `mm` `ss`; month uses `yyyy` `MM`; year uses `yyyy`. Default `format` is coerced when `type` changes: `yyyy-MM-dd HH:mm:ss` for `datetime` / `datetimerange`, `yyyy-MM` for `month`, `yyyy` for `year` (from the date default `yyyy-MM-dd`). `separator` (default `' → '`) and `start-placeholder` / `end-placeholder` apply to range trigger display and panel field separators (placeholders fall back to `placeholder` when empty). `isDateDisabled` is property-only (not an HTML attribute): for day types it receives `YYYY-MM-DD`; for `month`, `YYYY-MM`; for `year`, `YYYY`. Panel fields parse on blur/Enter (`YYYY-MM-DD` and `HH:mm:ss`); invalid text reverts. **Confirm** commits the panel draft for `datetime`, `daterange`, and `datetimerange`; **Now** and **Clear** commit immediately where shown. `date` / `month` / `year` commit on cell click (plus **Clear** / **Now** in the footer). Footer actions: `date` / `month` / `year` → **Clear** / **Now**; `datetime` → **Clear** / **Now** / **Confirm**; `daterange` / `datetimerange` → **Clear** / **Confirm**.

### Date Picker Events

| Name | Description |
|------|-------------|
| `input` | Value changed (select / clear / now / confirm); bubbles; `composed: true`; `detail.value` is `string` for `date`, `datetime`, `month`, and `year`, `[string, string] \| null` for `daterange` and `datetimerange` |
| `change` | Same commits as `input`; bubbles; `composed: true`; `detail.value` matches `input` |
| `gk-open-change` | Panel open state changed; bubbles; `composed: true`; `detail: { open: boolean }` |

### CSS Parts

Trigger parts are exposable via `gk-date-picker::part(...)`. The panel is portaled to `document.body`, so `panel` / `calendar` / `actions` are **not** reachable as `gk-date-picker::part(panel)` (etc.). Style the popup with `.gk-date-picker-panel` and its descendants (those nodes may still carry `part` attributes for targeting under that class).

| Part | Description |
|------|-------------|
| `base` | Trigger surface (`::part`) |
| `input` | Readonly display text (`::part`) |
| `suffix` | Clear + calendar icon area (`::part`) |
| `clear` | Trigger clear button (`::part`) |
| `panel` | Portaled popup root — style via `.gk-date-picker-panel` |
| `panel-fields` | Editable date/time inputs at top of day panels — under `.gk-date-picker-panel` |
| `calendar` | Month grid region (dual grids for range types) — under `.gk-date-picker-panel` |
| `confirm` | Confirm button — under `.gk-date-picker-panel` |
| `actions` | Clear / Now / Confirm row (varies by `type`) — under `.gk-date-picker-panel` |
