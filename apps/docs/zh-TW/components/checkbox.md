<script setup lang="ts">
import { ref } from "vue";

const agree = ref(false);
const mixed = ref(true);
const mixedChecked = ref(false);
const group = ref<string[]>(["pear"]);

function onAgree(e: CustomEvent<{ checked: boolean }>) {
  agree.value = e.detail.checked;
}
function onMixed(e: CustomEvent<{ checked: boolean }>) {
  mixed.value = false;
  mixedChecked.value = e.detail.checked;
}
function onGroup(e: CustomEvent<{ value: string[] }>) {
  group.value = e.detail.value;
}

const codes = {
  basic: `<gk-checkbox :checked="agree" @change="onAgree">我同意</gk-checkbox>`,
  size: `<gk-checkbox size="sm" checked>小</gk-checkbox>
<gk-checkbox size="md" checked>中</gk-checkbox>
<gk-checkbox size="lg" checked>大</gk-checkbox>`,
  disabled: `<gk-checkbox disabled>關</gk-checkbox>
<gk-checkbox disabled checked>開</gk-checkbox>`,
  mixed: `<gk-checkbox :checked="mixedChecked" :indeterminate="mixed" @change="onMixed">全選</gk-checkbox>`,
  group: `<gk-checkbox-group :value="group" @change="onGroup">
  <gk-checkbox value="apple">蘋果</gk-checkbox>
  <gk-checkbox value="pear">梨</gk-checkbox>
  <gk-checkbox value="plum">李</gk-checkbox>
</gk-checkbox-group>`,
};
</script>

# Checkbox 核取方塊

核取方塊用來切換布林值。勾選與混合狀態使用品牌色填色，並搭配深色勾選或減號圖示。

## 示範

<DemoCard title="基礎" :code="codes.basic">
  <template #description>
    綁定 <code>checked</code>，並以 <code>e.detail.checked</code> 監聽 <code>change</code>。
  </template>
  <gk-checkbox :checked="agree" @change="onAgree">我同意</gk-checkbox>
</DemoCard>

<DemoCard title="尺寸" :code="codes.size">
  <template #description>
    尺寸列舉與 Button、Input 一致：<code>sm</code>、<code>md</code>、<code>lg</code>。
  </template>
  <gk-checkbox size="sm" checked>小</gk-checkbox>
  <gk-checkbox size="md" checked>中</gk-checkbox>
  <gk-checkbox size="lg" checked>大</gk-checkbox>
</DemoCard>

<DemoCard title="停用" :code="codes.disabled">
  <template #description>
    <code>disabled</code> 會阻擋切換。
  </template>
  <gk-checkbox disabled>關</gk-checkbox>
  <gk-checkbox disabled checked>開</gk-checkbox>
</DemoCard>

<DemoCard title="不確定" :code="codes.mixed">
  <template #description>
    <code>indeterminate</code> 會設定 <code>aria-checked="mixed"</code> 並顯示減號。點擊後會勾選並清除混合狀態。
  </template>
  <gk-checkbox :checked="mixedChecked" :indeterminate="mixed" @change="onMixed">全選</gk-checkbox>
</DemoCard>

<DemoCard title="群組" :code="codes.group">
  <template #description>
    <code>gk-checkbox-group</code> 的 <code>change</code> 帶有 <code>string[]</code> 的 <code>e.detail.value</code>。子項事件會在群組被攔截，以免 Vue 綁定讀到錯誤的 detail。
  </template>
  <gk-checkbox-group :value="group" @change="onGroup">
    <gk-checkbox value="apple">蘋果</gk-checkbox>
    <gk-checkbox value="pear">梨</gk-checkbox>
    <gk-checkbox value="plum">李</gk-checkbox>
  </gk-checkbox-group>
  <p style="margin:0;font-size:0.875rem;opacity:0.8">{{ group.join("、") || "（無）" }}</p>
</DemoCard>

## API

### Checkbox Props

| Prop | 型別 | 預設值 |
|------|------|---------|
| `checked` | `boolean` | `false` |
| `indeterminate` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `value` | `string` | `''` |

### Checkbox Events

| 名稱 | 說明 |
|------|------|
| `change` | 使用者切換；`detail: { checked: boolean }` |

### CheckboxGroup Props

| Prop | 型別 | 預設值 |
|------|------|---------|
| `value` | `string[]` | `[]` |
| `disabled` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |

### CheckboxGroup Events

| 名稱 | 說明 |
|------|------|
| `change` | `detail: { value: string[] }` |
