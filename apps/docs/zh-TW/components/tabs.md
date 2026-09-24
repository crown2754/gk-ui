<script setup lang="ts">
import { ref } from "vue";

const line = ref("overview");
const segment = ref("list");

function onLine(event: CustomEvent<{ value: string }>) {
  line.value = event.detail.value;
}

function onSegment(event: CustomEvent<{ value: string }>) {
  segment.value = event.detail.value;
}

const codes = {
  line: `<gk-tabs aria-label="課程內容" :value="line" @update:value="onLine">
  <gk-tab-pane name="overview" tab="總覽">總覽內容。</gk-tab-pane>
  <gk-tab-pane name="syllabus" tab="大綱">週次。</gk-tab-pane>
  <gk-tab-pane name="reviews" tab="評價">評價。</gk-tab-pane>
  <gk-tab-pane name="files" tab="附件（停用）" disabled>不可用。</gk-tab-pane>
</gk-tabs>`,
  segment: `<gk-tabs type="segment" aria-label="檢視模式" :value="segment" @change="onSegment">
  <gk-tab-pane name="list" tab="列表">列表。</gk-tab-pane>
  <gk-tab-pane name="board" tab="看板">看板。</gk-tab-pane>
  <gk-tab-pane name="timeline" tab="時間軸">時間軸。</gk-tab-pane>
</gk-tabs>`,
  sizes: `<gk-tabs size="sm" aria-label="小">
  <gk-tab-pane name="a" tab="sm 28">小尺寸 28px。</gk-tab-pane>
  <gk-tab-pane name="b" tab="項目 B">項目 B。</gk-tab-pane>
</gk-tabs>`,
  disabled: `<gk-tab-pane name="files" tab="附件" disabled>停用內容。</gk-tab-pane>`,
  many: `<gk-tabs aria-label="分類">
  <gk-tab-pane name="all" tab="全部">分頁列橫向捲動、不換行。</gk-tab-pane>
</gk-tabs>`,
  still: `<gk-tabs animated="false" aria-label="無動畫">
  <gk-tab-pane name="a" tab="即時">沒有淡入。</gk-tab-pane>
  <gk-tab-pane name="b" tab="其他">其他面板。</gk-tab-pane>
</gk-tabs>`,
  icon: `<gk-tab-pane name="overview">
  <span slot="tab">★ 總覽</span>
  tab 插槽可放圖示。
</gk-tab-pane>`,
};
</script>

# Tabs 分頁

分頁用來切換面板。預設是底線（`line`），`segment` 是緊湊的次要樣式。v1 不做 card。

## 示範

<DemoCard title="底線" :code="codes.line">
  <template #description>
    選中文字為 brand-pressed，分隔線上有 2px 品牌指示條。方向鍵在啟用的分頁之間移動。
  </template>
  <gk-tabs aria-label="課程內容" :value="line" @update:value="onLine" style="width:100%">
    <gk-tab-pane name="overview" tab="總覽">
      這門課介紹 GK 好知識品牌設計系統與元件實作節奏。
    </gk-tab-pane>
    <gk-tab-pane name="syllabus" tab="大綱">
      Week 1 Tokens · Week 2 Form · Week 3 Overlays · Week 4 Display
    </gk-tab-pane>
    <gk-tab-pane name="reviews" tab="評價">
      學員評價將顯示於此。
    </gk-tab-pane>
    <gk-tab-pane name="files" tab="附件（停用）" disabled>
      附件暫不可用。
    </gk-tab-pane>
  </gk-tabs>
</DemoCard>

<DemoCard title="Segment" :code="codes.segment">
  <template #description>
    軌道是按鈕預設灰底。選中區塊為 22% 品牌洗與 pressed 文字，沒有底線，也不是 card 邊框。
  </template>
  <gk-tabs type="segment" aria-label="檢視模式" :value="segment" @change="onSegment">
    <gk-tab-pane name="list" tab="列表">Segment 軌道與品牌淡洗的選中項。</gk-tab-pane>
    <gk-tab-pane name="board" tab="看板">看板。</gk-tab-pane>
    <gk-tab-pane name="timeline" tab="時間軸">時間軸。</gk-tab-pane>
  </gk-tabs>
</DemoCard>

<DemoCard title="尺寸" :code="codes.sizes">
  <template #description>
    底線分頁的點擊高度對齊 Button：<code>sm</code> 28、<code>md</code> 34、<code>lg</code> 40。Segment 在軌道內為 26 / 30 / 36。
  </template>
  <div style="display:grid;gap:12px;width:100%">
    <gk-tabs size="sm" aria-label="小">
      <gk-tab-pane name="a" tab="sm 28">小尺寸底線分頁。</gk-tab-pane>
      <gk-tab-pane name="b" tab="項目 B">項目 B。</gk-tab-pane>
    </gk-tabs>
    <gk-tabs size="lg" aria-label="大">
      <gk-tab-pane name="a" tab="lg 40">大尺寸底線分頁。</gk-tab-pane>
      <gk-tab-pane name="b" tab="項目 B">項目 B。</gk-tab-pane>
    </gk-tabs>
  </div>
</DemoCard>

<DemoCard title="停用分頁" :code="codes.disabled">
  <template #description>
    停用的面板仍留在列表中，透明度 50%，點擊與鍵盤都會跳過。
  </template>
  <gk-tabs aria-label="停用示例" style="width:100%">
    <gk-tab-pane name="open" tab="開放">可選的面板。</gk-tab-pane>
    <gk-tab-pane name="locked" tab="鎖定" disabled>無法選取此分頁。</gk-tab-pane>
    <gk-tab-pane name="done" tab="完成">下一個可選分頁。</gk-tab-pane>
  </gk-tabs>
</DemoCard>

<DemoCard title="大量分頁" :code="codes.many">
  <template #description>
    分頁列橫向捲動、預設不換行。窄螢幕時滑動分頁列即可。
  </template>
  <gk-tabs aria-label="分類" style="width:100%">
    <gk-tab-pane name="all" tab="全部">分頁列橫向捲動，不換行。</gk-tab-pane>
    <gk-tab-pane name="design" tab="設計系統">設計系統。</gk-tab-pane>
    <gk-tab-pane name="frontend" tab="前端工程">前端工程。</gk-tab-pane>
    <gk-tab-pane name="product" tab="產品策略">產品策略。</gk-tab-pane>
    <gk-tab-pane name="content" tab="內容行銷">內容行銷。</gk-tab-pane>
    <gk-tab-pane name="brand" tab="品牌視覺">品牌視覺。</gk-tab-pane>
    <gk-tab-pane name="a11y" tab="無障礙">無障礙。</gk-tab-pane>
    <gk-tab-pane name="perf" tab="效能">效能。</gk-tab-pane>
  </gk-tabs>
</DemoCard>

<DemoCard title="關閉動畫" :code="codes.still">
  <template #description>
    <code>animated</code> 預設為 true（面板淡入與指示條滑動約 180ms）。<code>:animated="false"</code> 或 <code>animated="false"</code> 可關閉。
  </template>
  <gk-tabs animated="false" aria-label="無動畫" style="width:100%">
    <gk-tab-pane name="a" tab="即時">面板切換沒有淡入。</gk-tab-pane>
    <gk-tab-pane name="b" tab="其他">另一個面板。</gk-tab-pane>
  </gk-tabs>
</DemoCard>

<DemoCard title="圖示標籤" :code="codes.icon">
  <template #description>
    豐富的標籤放在 pane 的 <code>tab</code> 插槽，會取代 <code>tab</code> 字串。
  </template>
  <gk-tabs aria-label="含圖示" style="width:100%">
    <gk-tab-pane name="overview">
      <span slot="tab">★ 總覽</span>
      tab 插槽可以同時放圖示與文字。
    </gk-tab-pane>
    <gk-tab-pane name="notes" tab="筆記">字串標籤仍可與插槽並存於不同分頁。</gk-tab-pane>
  </gk-tabs>
</DemoCard>

## API

### Tabs 屬性

| 屬性 | 型別 | 預設 |
|------|------|------|
| `value` | `string` | 第一個啟用的面板 |
| `default-value` | `string` | — |
| `type` | `'line' \| 'segment'` | `'line'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `animated` | `boolean` | `true` |
| `placement` | `'top'` | `'top'` |

有設定 `value` 時為受控。值是空的時，使用 `default-value` 或第一個啟用的面板。v1 只支援上方 placement；垂直分頁以後再做。沒有 `card` 類型。

`animated="false"` 會被當成 false（字串 `"false"` 不是 true）。

### Tab Pane 屬性

| 屬性 | 型別 | 預設 |
|------|------|------|
| `name` | `string` | — |
| `tab` | `string` | — |
| `label` | `string` | — |
| `disabled` | `boolean` | `false` |

`label` 是 `tab` 的別名。兩者都有時以 `tab` 為準。`name` 是值的鍵，應唯一。

### Tabs 插槽

| 名稱 | 說明 |
|------|------|
| 預設 | `gk-tab-pane` 子元件 |
| pane `tab` | 豐富的分頁標籤，取代 `tab` 文字 |
| pane 預設 | 面板內容 |

### Tabs 事件

| 名稱 | 說明 |
|------|------|
| `update:value` | 選取改變。`detail: { value: string }`。會冒泡；`composed: true`。 |
| `change` | 與 `update:value` 相同內容。 |

### CSS Parts

| Part | 說明 |
|------|------|
| `tablist` | 可橫向捲動的分頁列 |
| `tab` | 單一按鈕 |
| `indicator` | 2px 品牌底線。`segment` 時隱藏 |
| `panels` | 面板容器 |
| `panel` | 顯示或隱藏的面板外殼 |

### 無障礙

- 列表為 `role="tablist"`，`aria-orientation="horizontal"`。請在 `gk-tabs` 上提供 `aria-label`。
- 每個分頁是 `role="tab"`，帶有 `aria-selected`、`aria-controls`，停用時為 `aria-disabled`。
- 每個面板是 `role="tabpanel"`，以 `aria-labelledby` 指向分頁。未選中的面板帶 `hidden`。
- ← → 在啟用分頁間移動並循環。Home / End 跳到兩端。Tab 離開分頁列、進入作用中的面板。
- 只有選中且啟用的分頁在 Tab 順序中。
- 焦點環為柔和的品牌環。

垂直 placement 與 card 分頁不在這個版本。
