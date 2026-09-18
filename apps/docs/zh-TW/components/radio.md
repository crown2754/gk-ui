<script setup lang="ts">
import { ref } from "vue";

const fruit = ref("pear");
function onFruit(e: CustomEvent<{ value: string }>) {
  fruit.value = e.detail.value;
}

const codes = {
  basic: `<gk-radio-group :value="fruit" @change="onFruit">
  <gk-radio value="apple">蘋果</gk-radio>
  <gk-radio value="pear">梨</gk-radio>
  <gk-radio value="plum">李</gk-radio>
</gk-radio-group>`,
  size: `<gk-radio-group size="sm" value="a">
  <gk-radio value="a">小</gk-radio>
</gk-radio-group>
<gk-radio-group size="md" value="a">
  <gk-radio value="a">中</gk-radio>
</gk-radio-group>
<gk-radio-group size="lg" value="a">
  <gk-radio value="a">大</gk-radio>
</gk-radio-group>`,
  disabled: `<gk-radio-group disabled value="a">
  <gk-radio value="a">已選</gk-radio>
  <gk-radio value="b">其他</gk-radio>
</gk-radio-group>`,
};
</script>

# Radio 單選

單選用來在群組中選擇一個值。選中狀態是**白底**、**深金色外圈**與**深金色圓點**，不是實心黃圓加黑點。

## 示範

<DemoCard title="基礎" :code="codes.basic">
  <template #description>
    綁定群組 <code>value</code>，並以 <code>e.detail.value</code> 監聽 <code>change</code>。方向鍵可移動並選取，會跳過停用項目。
  </template>
  <gk-radio-group :value="fruit" @change="onFruit">
    <gk-radio value="apple">蘋果</gk-radio>
    <gk-radio value="pear">梨</gk-radio>
    <gk-radio value="plum">李</gk-radio>
  </gk-radio-group>
  <p style="margin:0;font-size:0.875rem;opacity:0.8">值：{{ fruit }}</p>
</DemoCard>

<DemoCard title="尺寸" :code="codes.size">
  <template #description>
    尺寸列舉與其他控制項一致：<code>sm</code>、<code>md</code>、<code>lg</code>。
  </template>
  <gk-radio-group size="sm" value="a">
    <gk-radio value="a">小</gk-radio>
  </gk-radio-group>
  <gk-radio-group size="md" value="a">
    <gk-radio value="a">中</gk-radio>
  </gk-radio-group>
  <gk-radio-group size="lg" value="a">
    <gk-radio value="a">大</gk-radio>
  </gk-radio-group>
</DemoCard>

<DemoCard title="停用" :code="codes.disabled">
  <template #description>
    群組 <code>disabled</code> 會阻擋選取。
  </template>
  <gk-radio-group disabled value="a">
    <gk-radio value="a">已選</gk-radio>
    <gk-radio value="b">其他</gk-radio>
  </gk-radio-group>
</DemoCard>

## API

### Radio Props

| Prop | 型別 | 預設值 |
|------|------|---------|
| `checked` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `value` | `string` | `''` |

### RadioGroup Props

| Prop | 型別 | 預設值 |
|------|------|---------|
| `value` | `string` | `''` |
| `disabled` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |

### RadioGroup Events

| 名稱 | 說明 |
|------|------|
| `change` | `detail: { value: string }` |
