<script setup lang="ts">
import { ref } from "vue";

const fruit = ref("pear");
const clearable = ref("apple");
function onFruit(e: CustomEvent<{ value: string }>) {
  fruit.value = e.detail.value;
}
function onClearable(e: CustomEvent<{ value: string }>) {
  clearable.value = e.detail.value;
}

const codes = {
  basic: `<gk-select :value="fruit" placeholder="選擇水果" @change="onFruit">
  <gk-option value="apple">蘋果</gk-option>
  <gk-option value="pear">梨</gk-option>
  <gk-option value="plum">李</gk-option>
</gk-select>`,
  size: `<gk-select size="sm" value="a" placeholder="小">
  <gk-option value="a">小</gk-option>
</gk-select>
<gk-select size="md" value="a" placeholder="中">
  <gk-option value="a">中</gk-option>
</gk-select>
<gk-select size="lg" value="a" placeholder="大">
  <gk-option value="a">大</gk-option>
</gk-select>`,
  clearable: `<gk-select clearable :value="clearable" placeholder="可清除" @change="onClearable">
  <gk-option value="apple">蘋果</gk-option>
  <gk-option value="pear">梨</gk-option>
</gk-select>`,
  status: `<gk-select status="success" value="ok" placeholder="成功">
  <gk-option value="ok">看起來沒問題</gk-option>
</gk-select>
<gk-select status="warning" value="warn" placeholder="警告">
  <gk-option value="warn">請檢查</gk-option>
</gk-select>
<gk-select status="error" value="bad" placeholder="錯誤">
  <gk-option value="bad">無效</gk-option>
</gk-select>`,
  disabled: `<gk-select disabled value="apple" placeholder="停用">
  <gk-option value="apple">蘋果</gk-option>
</gk-select>`,
};
</script>

# Select 選擇器

單選下拉選單。觸發器對齊 Input 外觀；選項懸停與選中使用淺品牌色，不是實心黃塊。

## 示範

<DemoCard title="基礎" :code="codes.basic">
  <template #description>
    綁定 <code>value</code>，並以 <code>e.detail.value</code> 監聽 <code>change</code>。選項以 <code>gk-option</code> 插槽提供。v1 僅單選（不含篩選／多選）。
  </template>
  <div style="min-width:16rem">
    <gk-select :value="fruit" placeholder="選擇水果" @change="onFruit">
      <gk-option value="apple">蘋果</gk-option>
      <gk-option value="pear">梨</gk-option>
      <gk-option value="plum">李</gk-option>
    </gk-select>
  </div>
  <p style="margin:0;font-size:0.875rem;opacity:0.8">值：{{ fruit || "（空）" }}</p>
</DemoCard>

<DemoCard title="尺寸" :code="codes.size">
  <template #description>
    高度對齊 Input：<code>sm</code> / <code>md</code> / <code>lg</code> 為 28 / 34 / 40。
  </template>
  <div style="display:grid;gap:0.75rem;min-width:16rem">
    <gk-select size="sm" value="a" placeholder="小">
      <gk-option value="a">小</gk-option>
    </gk-select>
    <gk-select size="md" value="a" placeholder="中">
      <gk-option value="a">中</gk-option>
    </gk-select>
    <gk-select size="lg" value="a" placeholder="大">
      <gk-option value="a">大</gk-option>
    </gk-select>
  </div>
</DemoCard>

<DemoCard title="可清除" :code="codes.clearable">
  <template #description>
    <code>clearable</code> 在有值時顯示清除按鈕。
  </template>
  <div style="min-width:16rem">
    <gk-select clearable :value="clearable" placeholder="可清除" @change="onClearable">
      <gk-option value="apple">蘋果</gk-option>
      <gk-option value="pear">梨</gk-option>
    </gk-select>
  </div>
</DemoCard>

<DemoCard title="狀態" :code="codes.status">
  <template #description>
    以 <code>status</code> 顯示驗證外觀：<code>success</code>、<code>warning</code> 或 <code>error</code>。
  </template>
  <div style="display:grid;gap:0.75rem;min-width:16rem">
    <gk-select status="success" value="ok" placeholder="成功">
      <gk-option value="ok">看起來沒問題</gk-option>
    </gk-select>
    <gk-select status="warning" value="warn" placeholder="警告">
      <gk-option value="warn">請檢查</gk-option>
    </gk-select>
    <gk-select status="error" value="bad" placeholder="錯誤">
      <gk-option value="bad">無效</gk-option>
    </gk-select>
  </div>
</DemoCard>

<DemoCard title="停用" :code="codes.disabled">
  <template #description>
    <code>disabled</code> 會阻擋開啟。
  </template>
  <div style="min-width:16rem">
    <gk-select disabled value="apple" placeholder="停用">
      <gk-option value="apple">蘋果</gk-option>
    </gk-select>
  </div>
</DemoCard>

## API

### Select Props

| Prop | 型別 | 預設值 |
|------|------|---------|
| `value` | `string` | `''` |
| `placeholder` | `string` | `''` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled` | `boolean` | `false` |
| `clearable` | `boolean` | `false` |
| `status` | `'success' \| 'warning' \| 'error' \| ''` | `''` |
| `open` | `boolean` | `false` |

### Select Slots

| 名稱 | 說明 |
|------|------|
| default | `<gk-option value="…">` 子元素 |

### Select Events

| 名稱 | 說明 |
|------|------|
| `change` | `detail: { value: string }` |

### Option Props

| Prop | 型別 | 預設值 |
|------|------|---------|
| `value` | `string` | `''` |
| `disabled` | `boolean` | `false` |
