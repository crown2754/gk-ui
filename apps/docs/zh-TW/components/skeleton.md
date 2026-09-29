<script setup lang="ts">
import { ref } from "vue";

const loading = ref(true);

const codes = {
  text: `<gk-skeleton text rows="4"></gk-skeleton>`,
  avatar: `<gk-skeleton avatar text rows="3"></gk-skeleton>`,
  shapes: `<gk-skeleton button></gk-skeleton>
<gk-skeleton button animated="false"></gk-skeleton>
<gk-skeleton image></gk-skeleton>`,
  swap: `<gk-skeleton :loading="loading" image avatar text rows="2" height="100">
  <article>真實卡片</article>
</gk-skeleton>`,
  repeat: `<gk-skeleton avatar text rows="2" repeat="3"></gk-skeleton>`,
  template: `<gk-skeleton>
  <div slot="template"><!-- 載入中的自訂骨架 --></div>
  <p>載入完成的內容。</p>
</gk-skeleton>`,
};
</script>

# Skeleton 骨架屏

骨架屏是內容載入時的安靜占位。掃光是中性灰，不是品牌色。

## 示範

<DemoCard title="文字列" :code="codes.text">
  <template #description>
    <code>rows</code> 決定行數，最後一行約 62% 寬。沒有指定形狀時，預設就是文字列。
  </template>
  <gk-skeleton text rows="4" style="width:100%"></gk-skeleton>
</DemoCard>

<DemoCard title="頭像與文字" :code="codes.avatar">
  <template #description>
    頭像骨塊是 40px 圓，與文字間距 12px。
  </template>
  <gk-skeleton avatar text rows="3" style="width:100%"></gk-skeleton>
</DemoCard>

<DemoCard title="按鈕、圖片、關閉動畫" :code="codes.shapes">
  <template #description>
    按鈕骨塊對齊 Button md（34×96）。<code>animated="false"</code> 是靜態灰塊。預設高光是 55% 白，不是品牌色；若要改掃光，覆寫 <code>--gk-skeleton-highlight</code>。
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;width:100%">
    <gk-skeleton button></gk-skeleton>
    <gk-skeleton button animated="false"></gk-skeleton>
    <span style="font-size:0.85rem;color:var(--gk-color-text-muted, rgb(118, 124, 130))">左：掃光。右：靜態。</span>
  </div>
  <gk-skeleton image style="width:100%"></gk-skeleton>
</DemoCard>

<DemoCard title="載入結束" :code="codes.swap">
  <template #description>
    <code>loading="false"</code> 會卸載骨塊並顯示預設插槽。<code>prefers-reduced-motion: reduce</code> 會關掉掃光。
  </template>
  <div style="width:100%;display:grid;gap:0.75rem">
    <gk-skeleton :loading="loading" image avatar text rows="2" height="100">
      <article style="display:grid;gap:0.75rem">
        <div style="height:100px;border-radius:0.5rem;background:linear-gradient(145deg,#f2ce5e33,#e8e8f0)"></div>
        <div style="display:flex;gap:12px;align-items:center">
          <gk-avatar round size="lg" color="#f2ce5e">知</gk-avatar>
          <div>
            <strong style="font-family:Fraunces, Georgia, serif">好知識 · 課程卡</strong>
            <p style="margin:0.2rem 0 0;color:var(--gk-color-text-muted, rgb(118, 124, 130))">loading 為 false 時顯示真實內容。</p>
          </div>
        </div>
      </article>
    </gk-skeleton>
    <gk-button type="button" variant="secondary" @click="loading = !loading">{{ loading ? "顯示內容" : "顯示骨架" }}</gk-button>
  </div>
</DemoCard>

<DemoCard title="重複" :code="codes.repeat">
  <template #description>
    <code>repeat</code> 重複整塊占位。每一組文字仍會縮短最後一行。
  </template>
  <gk-skeleton avatar text rows="2" repeat="3" style="width:100%"></gk-skeleton>
</DemoCard>

<DemoCard title="template 插槽" :code="codes.template">
  <template #description>
    <code>template</code> 插槽可放自訂骨架，載入中會取代內建骨塊。
  </template>
  <gk-skeleton style="width:100%">
    <div slot="template" style="display:grid;gap:10px">
      <div style="height:13px;width:70%;border-radius:0.375rem;background:rgba(46,51,56,0.07)"></div>
      <div style="height:13px;width:40%;border-radius:0.375rem;background:rgba(46,51,56,0.07)"></div>
    </div>
    <p style="margin:0">載入完成的內容。</p>
  </gk-skeleton>
</DemoCard>

## API

### Skeleton 屬性

| 屬性 | 型別 | 預設 |
|------|------|------|
| `loading` | `boolean` | `true` |
| `animated` | `boolean` | `true` |
| `repeat` | `number` | `1` |
| `text` | `boolean` | `false`（未指定其他形狀時改畫文字列） |
| `rows` | `number` | `3` |
| `avatar` | `boolean` | `false` |
| `button` | `boolean` | `false` |
| `image` | `boolean` | `false` |
| `round` | `boolean` | `false` |
| `sharp` | `boolean` | `false` |
| `width` / `height` | `string \| number` | — |

`image`、`avatar`、`text` 可以組成卡片占位。`width` 與 `height` 作用在圖片、按鈕或純矩形。`height="100"` 即 `100px`。

### Skeleton 插槽

| 名稱 | 說明 |
|------|------|
| 預設 | `loading` 為 false 時的真實內容 |
| `template` | 載入中取代內建骨塊的自訂占位 |

### CSS Parts

| Part | 說明 |
|------|------|
| `root` | 區塊外層 |
| `content` | 預設插槽容器 |
| `avatar` / `text` / `line` / `button` / `image` | 各形狀骨塊 |
| `bone` | 每一塊占位 |

### CSS 變數

| 變數 | 預設 |
|------|------|
| `--gk-skeleton-base` | `rgba(46, 51, 56, 0.07)` |
| `--gk-skeleton-highlight` | `rgba(255, 255, 255, 0.55)` |

### 無障礙

- 載入中宿主為 `aria-busy="true"`，並有視覺隱藏的「載入中」。
- 骨塊為 `aria-hidden="true"`。
- 載入結束後清除 busy，並卸載骨塊。
