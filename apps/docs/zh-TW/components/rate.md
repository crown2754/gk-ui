<script setup lang="ts">
import { ref } from "vue";
const score = ref(3.5);
function onScore(e: CustomEvent<{ value: number }>) {
  score.value = e.detail.value;
}
</script>

# Rate 評分

星級評分。預設五顆星、允許半星，再點同一個值會清空為 0。填滿用品牌金，空星維持中性灰。

## 範例

<DemoCard title="基本" code="<gk-rate :value=&quot;score&quot; @change=&quot;onScore&quot;>">
  <div style="display:flex;align-items:center;gap:0.75rem">
    <gk-rate :value="score" @change="onScore"></gk-rate>
    <span>{{ score }}</span>
  </div>
</DemoCard>

<DemoCard title="尺寸與狀態" code="<gk-rate size=&quot;lg&quot; value=&quot;4&quot;>">
  <div style="display:grid;gap:0.5rem">
    <gk-rate size="sm" value="4"></gk-rate>
    <gk-rate size="lg" value="4"></gk-rate>
    <gk-rate readonly value="4"></gk-rate>
    <gk-rate disabled value="2"></gk-rate>
  </div>
</DemoCard>

<DemoCard title="整顆星" code="<gk-rate .allowHalf=&quot;false&quot;>">
  <template #description>
    Vue 請寫 <code>.allowHalf="false"</code>。屬性 <code>allow-half="false"</code> 仍會被視為 true。
  </template>
  <gk-rate .allowHalf="false" value="3"></gk-rate>
</DemoCard>

## API

`allow-half` 與 `allow-clear` 預設都是 true。`value` 為 0 代表已清空。事件 `change` 與 `update:value` 的 detail 是 `{ value }`。

根節點是 `radiogroup`，名稱為「評分」。半星與整星各是一個 radio。自訂字元 slot 不在這一版。
