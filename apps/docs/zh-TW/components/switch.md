<script setup lang="ts">
import { ref } from "vue";

const basicOn = ref(true);
const labelOn = ref(false);
const pgChecked = ref(false);
const pgDisabled = ref(false);
const pgRound = ref(true);
const pgSize = ref<"sm" | "md" | "lg">("md");

function onBasicChange(e: CustomEvent<{ checked: boolean }>) {
  basicOn.value = e.detail.checked;
}

function onLabelChange(e: CustomEvent<{ checked: boolean }>) {
  labelOn.value = e.detail.checked;
}

function onPlaygroundChange(e: CustomEvent<{ checked: boolean }>) {
  pgChecked.value = e.detail.checked;
}

const codes = {
  basic: `<!-- host: const basicOn = ref(true); function onBasicChange(e: CustomEvent<{ checked: boolean }>) { basicOn.value = e.detail.checked } -->
<div class="settings-row">
  <span>通知</span>
  <gk-switch
    aria-label="通知"
    :checked="basicOn"
    @change="onBasicChange"
  ></gk-switch>
</div>`,
  size: `<gk-switch size="sm" checked aria-label="小"></gk-switch>
<gk-switch size="md" checked aria-label="中"></gk-switch>
<gk-switch size="lg" checked aria-label="大"></gk-switch>`,
  disabled: `<gk-switch disabled aria-label="停用（關）"></gk-switch>
<gk-switch disabled checked aria-label="停用（開）"></gk-switch>`,
  label: `<!-- host: const labelOn = ref(false); function onLabelChange(e: CustomEvent<{ checked: boolean }>) { labelOn.value = e.detail.checked } -->
<gk-switch :checked="labelOn" @change="onLabelChange">電子郵件提醒</gk-switch>
<gk-switch checked :round="false">方角</gk-switch>`,
};
</script>

# Switch 開關

開關用來在設定列切換布林值。尺寸列舉與 Button、Input 相同（`sm` / `md` / `lg`），軌道高度低於欄位高度。

## 示範

<DemoCard title="基礎" :code="codes.basic">
  <template #description>
    綁定 <code>checked</code>，並以 <code>e.detail.checked</code> 監聽 <code>change</code>。沒有可見標籤時，請用 <code>aria-label</code> 提供可存取名稱。
  </template>
  <div style="display:flex;justify-content:space-between;align-items:center;width:100%;max-width:22rem;padding:0.5rem 0">
    <span>通知</span>
    <gk-switch
      aria-label="通知"
      :checked="basicOn"
      @change="onBasicChange"
    ></gk-switch>
  </div>
</DemoCard>

<DemoCard title="尺寸" :code="codes.size">
  <template #description>
    尺寸列舉與 Button、Input 一致：<code>sm</code>、<code>md</code>、<code>lg</code>。軌道仍小於 28 / 34 / 40 的欄位高度。
  </template>
  <gk-switch size="sm" checked aria-label="小"></gk-switch>
  <gk-switch size="md" checked aria-label="中"></gk-switch>
  <gk-switch size="lg" checked aria-label="大"></gk-switch>
</DemoCard>

<DemoCard title="停用" :code="codes.disabled">
  <template #description>
    <code>disabled</code> 會阻擋切換。關閉時維持較淡；開啟時軌道仍可清楚辨認。
  </template>
  <gk-switch disabled aria-label="停用（關）"></gk-switch>
  <gk-switch disabled checked aria-label="停用（開）"></gk-switch>
</DemoCard>

<DemoCard title="附標籤" :code="codes.label">
  <template #description>
    預設插槽文字會作為可見標籤與可存取名稱。使用 <code>:round="false"</code> 可改為方角軌道（預設為膠囊形）。
  </template>
  <gk-switch :checked="labelOn" @change="onLabelChange">電子郵件提醒</gk-switch>
  <gk-switch checked :round="false">方角</gk-switch>
</DemoCard>

<DemoCard title="互動場">
  <template #description>
    自由組合屬性並即時預覽。
  </template>
  <div style="display:grid;gap:1rem;width:100%">
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem 1.25rem;align-items:end">
      <label style="display:grid;gap:0.35rem;font-size:0.8125rem;color:var(--gk-color-text-muted, rgb(118, 124, 130))">
        尺寸
        <select v-model="pgSize" style="min-width:8rem;padding:0.35rem 0.5rem;border:1px solid var(--gk-color-border, rgb(224, 224, 230));border-radius:4px;background:var(--gk-playground-control-bg, #fff);color:var(--gk-playground-control-fg, rgb(31, 34, 37));color-scheme:var(--gk-playground-color-scheme, light)">
          <option value="sm">sm</option>
          <option value="md">md</option>
          <option value="lg">lg</option>
        </select>
      </label>
      <label style="display:flex;align-items:center;gap:0.4rem;padding-bottom:0.35rem;font-size:0.8125rem;color:var(--gk-color-text-muted, rgb(118, 124, 130))">
        <input v-model="pgChecked" type="checkbox" /> checked
      </label>
      <label style="display:flex;align-items:center;gap:0.4rem;padding-bottom:0.35rem;font-size:0.8125rem;color:var(--gk-color-text-muted, rgb(118, 124, 130))">
        <input v-model="pgDisabled" type="checkbox" /> disabled
      </label>
      <label style="display:flex;align-items:center;gap:0.4rem;padding-bottom:0.35rem;font-size:0.8125rem;color:var(--gk-color-text-muted, rgb(118, 124, 130))">
        <input v-model="pgRound" type="checkbox" /> round
      </label>
    </div>
    <gk-switch
      :size="pgSize"
      :checked="pgChecked"
      :disabled="pgDisabled"
      :round="pgRound"
      @change="onPlaygroundChange"
    >
      飛航模式
    </gk-switch>
  </div>
</DemoCard>

## API

### Switch Props

| Prop | 型別 | 預設值 |
|------|------|---------|
| `checked` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled` | `boolean` | `false` |
| `round` | `boolean` | `true` |

`round` 預設為膠囊形。原始 HTML 的布林屬性無法表達 `false`；請使用屬性綁定或 Vue 的 `:round="false"`。

### Switch Slots

| 名稱 | 說明 |
|------|------|
| default | 可選的可見標籤（同時作為可存取名稱） |

### Switch Events

| 名稱 | 說明 |
|------|------|
| `change` | 使用者切換開關；bubbles；`composed: true`；`detail: { checked: boolean }` |

不使用原生 checkbox 的 `input` / `change`。Vue / Alpine 請只綁定此 CustomEvent。

### CSS Parts

| Part | 說明 |
|------|------|
| `track` | `role="switch"` 控制項 |
| `thumb` | 軌道內的圓鈕 |
| `label` | 預設插槽容器 |

### 無障礙

- 內部控制項：`role="switch"`，`aria-checked` 反映 `checked`。
- 空白鍵與 Enter 可切換。
- 請以預設插槽或 `aria-label` 提供可存取名稱。
- `disabled` 時不可切換。
