<script setup lang="ts">
import { nextTick, ref } from "vue";

const delayed = ref(false);

async function startDelay() {
  delayed.value = false;
  await nextTick();
  delayed.value = true;
}

const codes = {
  sizes: `<gk-spin size="sm"></gk-spin>
<gk-spin size="md" description="載入中…"></gk-spin>
<gk-spin size="lg" description="正在取得資料"></gk-spin>`,
  wrap: `<gk-spin description="載入中…">
  <article>
    <h3>課程詳情</h3>
    <p>內容在載入時仍佔位，但不可互動。</p>
  </article>
</gk-spin>`,
  idle: `<gk-spin show="false">
  <p>遮罩已隱藏，按鈕可以按。</p>
  <gk-button>繼續</gk-button>
</gk-spin>`,
  delay: `<gk-spin :show="delayed" delay="400" description="載入中…">
  <p>極短的請求不會閃一下。</p>
</gk-spin>`,
};
</script>

# Spin 載入

Spin 是區塊載入指示：可單獨顯示品牌轉圈，或在內容上蓋一層柔白遮罩。Button 的載入與 Message 的載入共用同一種描邊；區塊遮罩由 Spin 負責。

## 示範

<DemoCard title="尺寸" :code="codes.sizes">
  <template #description>
    直徑為 <code>sm</code> 18、<code>md</code> 28、<code>lg</code> 40。描邊寬度 2 / 2.5 / 3。軌道是 25% 品牌色，頂端為實心品牌色，0.75 秒轉一圈。
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:28px;align-items:flex-end">
    <div style="display:grid;justify-items:center;gap:8px">
      <gk-spin size="sm"></gk-spin>
      <span style="font-size:12px;font-weight:600;color:var(--gk-color-text-muted, rgb(118, 124, 130))">sm 18</span>
    </div>
    <div style="display:grid;justify-items:center;gap:8px">
      <gk-spin size="md" description="載入中…"></gk-spin>
      <span style="font-size:12px;font-weight:600;color:var(--gk-color-text-muted, rgb(118, 124, 130))">md 28</span>
    </div>
    <div style="display:grid;justify-items:center;gap:8px">
      <gk-spin size="lg" description="正在取得資料"></gk-spin>
      <span style="font-size:12px;font-weight:600;color:var(--gk-color-text-muted, rgb(118, 124, 130))">lg 40</span>
    </div>
  </div>
</DemoCard>

<DemoCard title="包覆內容" :code="codes.wrap">
  <template #description>
    有子內容且 <code>show</code> 時，遮罩為 <code>color-mix(#fff 55%, transparent)</code>。內容仍佔位，但沒有 pointer events。
  </template>
  <gk-spin description="載入中…" style="width:100%">
    <article style="padding:1.25rem;border:1px solid var(--gk-color-border, rgb(224, 224, 230));border-radius:0.5rem">
      <h3 style="margin:0 0 0.5rem;font-family:var(--gk-font-family-display, Fraunces, Georgia, serif)">課程詳情</h3>
      <p style="margin:0;color:var(--gk-color-text-muted, rgb(118, 124, 130))">內容在載入時仍佔位，但不可互動。</p>
    </article>
  </gk-spin>
</DemoCard>

<DemoCard title="閒置" :code="codes.idle">
  <template #description>
    <code>:show="false"</code> 或 <code>show="false"</code> 會隱藏遮罩。<code>spinning</code> 是 <code>show</code> 的別名。
  </template>
  <gk-spin show="false" style="width:100%">
    <article style="padding:1.25rem;border:1px solid var(--gk-color-border, rgb(224, 224, 230));border-radius:0.5rem">
      <h3 style="margin:0 0 0.5rem;font-family:var(--gk-font-family-display, Fraunces, Georgia, serif)">已載入完成</h3>
      <p style="margin:0 0 0.75rem;color:var(--gk-color-text-muted, rgb(118, 124, 130))">轉圈已隱藏，按鈕可以按。</p>
      <gk-button type="button">繼續</gk-button>
    </article>
  </gk-spin>
</DemoCard>

<DemoCard title="延遲" :code="codes.delay">
  <template #description>
    <code>delay</code> 是出現轉圈前的毫秒數。若 <code>show</code> 先結束，就不會閃一下。300–500ms 可避免極短請求的閃爍。預設為 0。
  </template>
  <div style="display:grid;gap:12px;width:100%">
    <gk-spin :show="delayed" delay="400" description="載入中…" style="width:100%">
      <article style="padding:1.25rem;border:1px dashed var(--gk-color-border, rgb(224, 224, 230));border-radius:0.5rem">
        <p style="margin:0">遮罩會等 400ms。在那之前關掉就不會出現。</p>
      </article>
    </gk-spin>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <gk-button type="button" @click="startDelay">400ms 後顯示</gk-button>
      <gk-button type="button" variant="secondary" @click="delayed = false">隱藏</gk-button>
    </div>
  </div>
</DemoCard>

<p>
  對話框頁尾的巢狀載入請看 <a href="./modal">Modal 對話框</a>。按鈕內的轉圈是 <a href="./button">Button 按鈕</a> 的 <code>loading</code>，不是 Spin。
</p>

## API

### Spin 屬性

| 屬性 | 型別 | 預設 |
|------|------|------|
| `show` | `boolean` | `true` |
| `spinning` | `boolean` | `show` 的別名 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `description` | `string` | `''` |
| `tip` | `string` | `description` 的別名 |
| `delay` | `number` | `0` |
| `stroke-width` | `number` | 依尺寸 2 / 2.5 / 3 |

文件以 `show` 與 `description` 為準。v1 沒有事件。

### Spin 插槽

| 名稱 | 說明 |
|------|------|
| 預設 | 載入時要蓋住的內容，可省略 |

### CSS Parts

| Part | 說明 |
|------|------|
| `container` | 定位遮罩。載入中為 `aria-busy` |
| `content` | 子內容 |
| `mask` | 柔白遮罩。只在蓋住內容時出現 |
| `spinner` | 狀態即時區域與轉圈 |
| `tip` | 說明文字；沒有說明時為視覺隱藏的「載入中」/ “Loading” |

### 無障礙

- 轉圈可見時，容器為 `aria-busy="true"`，spinner 為 `role="status"` 且 `aria-live="polite"`。
- 朗讀文字是 `description` / `tip`。沒有文字時，文件語言以 `zh` 開頭為「載入中」，否則為 “Loading”。
- 閒置時移除 busy，spinner 為 `aria-hidden`。
- 若 `show` 在 `delay` 結束前關掉，狀態不會暴露給輔助科技。
