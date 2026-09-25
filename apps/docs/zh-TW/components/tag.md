<script setup lang="ts">
import { ref } from "vue";

const closableTags = ref([
  { id: "knowledge", text: "好知識", type: "primary", round: false, bordered: false },
  { id: "a", text: "標籤 A", type: "info", round: true, bordered: false },
  { id: "remove", text: "可移除", type: "default", round: false, bordered: true },
]);

const filters = ref([
  { key: "all", label: "全部", checked: true },
  { key: "design", label: "設計", checked: true },
  { key: "dev", label: "開發", checked: false },
  { key: "marketing", label: "行銷", checked: false },
]);

function removeTag(id: string) {
  closableTags.value = closableTags.value.filter((tag) => tag.id !== id);
}

function onFilter(key: string, event: CustomEvent<{ checked: boolean }>) {
  const item = filters.value.find((filter) => filter.key === key);
  if (item) item.checked = event.detail.checked;
}

const codes = {
  types: `<gk-tag>預設</gk-tag>
<gk-tag type="primary">品牌</gk-tag>
<gk-tag type="success">成功</gk-tag>
<gk-tag type="warning">警告</gk-tag>
<gk-tag type="error">錯誤</gk-tag>
<gk-tag type="info">資訊</gk-tag>`,
  bordered: `<gk-tag bordered>預設</gk-tag>
<gk-tag type="primary" bordered>品牌</gk-tag>
<gk-tag type="success" bordered>成功</gk-tag>
<gk-tag type="warning" bordered>警告</gk-tag>
<gk-tag type="error" bordered>錯誤</gk-tag>
<gk-tag type="info" bordered>資訊</gk-tag>`,
  round: `<gk-tag type="primary" round>課程</gk-tag>
<gk-tag type="info" round>直播</gk-tag>
<gk-tag type="success" round>已發布</gk-tag>
<gk-tag bordered round>草稿</gk-tag>`,
  sizes: `<gk-tag size="sm" type="primary">sm 22</gk-tag>
<gk-tag size="md" type="primary">md 24</gk-tag>
<gk-tag size="lg" type="primary">lg 28</gk-tag>`,
  closable: `<!-- host：收到 close 後自行移除 -->
<gk-tag type="primary" closable @close="removeTag('knowledge')">好知識</gk-tag>`,
  icon: `<gk-tag type="success">
  <svg slot="icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M6.5 11.2 3.3 8l1.1-1.1 2.1 2.1 5-5L12.6 5.1z"/></svg>
  已驗證
</gk-tag>`,
  checkable: `<gk-tag checkable checked @update:checked="onFilter('design', $event)">設計</gk-tag>
<gk-tag checkable @check="onFilter('dev', $event)">開發</gk-tag>`,
  disabled: `<gk-tag disabled>停用</gk-tag>
<gk-tag type="primary" disabled>品牌</gk-tag>
<gk-tag type="error" disabled>錯誤</gk-tag>`,
};
</script>

# Tag 標籤

標籤是狀態、分類，以及可移除或可勾選篩選的緊湊晶片。語意色沿用 Message 的淡洗；勾選篩選使用 22% 品牌洗。

## 示範

<DemoCard title="類型" :code="codes.types">
  <template #description>
    <code>default</code> 是淡灰底。<code>primary</code> 為品牌實心與 brand-on 文字。成功、警告、錯誤、資訊為 16% 淡洗加上 pressed 文字。
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
    <gk-tag>預設</gk-tag>
    <gk-tag type="primary">品牌</gk-tag>
    <gk-tag type="success">成功</gk-tag>
    <gk-tag type="warning">警告</gk-tag>
    <gk-tag type="error">錯誤</gk-tag>
    <gk-tag type="info">資訊</gk-tag>
  </div>
</DemoCard>

<DemoCard title="邊框" :code="codes.bordered">
  <template #description>
    <code>bordered</code> 保留淡洗並加上 1px 類型色邊框。有邊框的 primary 改為 18% 品牌洗，不再使用實心。
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
    <gk-tag bordered>預設</gk-tag>
    <gk-tag type="primary" bordered>品牌</gk-tag>
    <gk-tag type="success" bordered>成功</gk-tag>
    <gk-tag type="warning" bordered>警告</gk-tag>
    <gk-tag type="error" bordered>錯誤</gk-tag>
    <gk-tag type="info" bordered>資訊</gk-tag>
  </div>
</DemoCard>

<DemoCard title="膠囊" :code="codes.round">
  <template #description>
    <code>round</code> 使用 pill 圓角。
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
    <gk-tag type="primary" round>課程</gk-tag>
    <gk-tag type="info" round>直播</gk-tag>
    <gk-tag type="success" round>已發布</gk-tag>
    <gk-tag bordered round>草稿</gk-tag>
  </div>
</DemoCard>

<DemoCard title="尺寸" :code="codes.sizes">
  <template #description>
    晶片高度比 Button 更緊：<code>sm</code> 22、<code>md</code> 24、<code>lg</code> 28。
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
    <gk-tag size="sm" type="primary">sm 22</gk-tag>
    <gk-tag size="md" type="primary">md 24</gk-tag>
    <gk-tag size="lg" type="primary">lg 28</gk-tag>
  </div>
</DemoCard>

<DemoCard title="可關閉" :code="codes.closable">
  <template #description>
    × 按鈕發出 <code>close</code>，元件不會自己消失。文件語言為中文時，無障礙名稱是「關閉」。
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
    <gk-tag
      v-for="tag in closableTags"
      :key="tag.id"
      :type="tag.type"
      :round="tag.round"
      :bordered="tag.bordered"
      closable
      @close="removeTag(tag.id)"
    >
      {{ tag.text }}
    </gk-tag>
  </div>
</DemoCard>

<DemoCard title="圖示" :code="codes.icon">
  <template #description>
    <code>icon</code> 插槽在文字左側。
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
    <gk-tag type="success">
      <svg slot="icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M6.5 11.2 3.3 8l1.1-1.1 2.1 2.1 5-5L12.6 5.1z" fill="currentColor"/></svg>
      已驗證
    </gk-tag>
    <gk-tag type="warning" bordered>
      <svg slot="icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5 14.5 13H1.5L8 1.5zm0 3.2-.9 4.6h1.8L8 4.7zm0 6.3a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8z" fill="currentColor"/></svg>
      注意
    </gk-tag>
  </div>
</DemoCard>

<DemoCard title="可勾選篩選" :code="codes.checkable">
  <template #description>
    <code>checkable</code> 使用 <code>role="checkbox"</code>。勾選為 22% 品牌洗與 pressed 文字；未勾選 hover 為 18% 洗。<code>type="primary"</code> 勾選時維持實心。
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
    <gk-tag
      v-for="filter in filters"
      :key="filter.key"
      checkable
      :checked="filter.checked"
      @update:checked="onFilter(filter.key, $event)"
    >
      {{ filter.label }}
    </gk-tag>
    <gk-tag checkable disabled>封存</gk-tag>
  </div>
</DemoCard>

<DemoCard title="停用" :code="codes.disabled">
  <template #description>
    <code>disabled</code> 透明度 0.5，並阻擋關閉、勾選與焦點環。
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
    <gk-tag disabled>停用</gk-tag>
    <gk-tag type="primary" disabled>品牌</gk-tag>
    <gk-tag type="error" disabled>錯誤</gk-tag>
  </div>
</DemoCard>

## API

### Tag 屬性

| 屬性 | 型別 | 預設 |
|------|------|------|
| `type` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` |
| `variant` | 同 `type` | — |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `bordered` | `boolean` | `false` |
| `round` | `boolean` | `false` |
| `closable` | `boolean` | `false` |
| `checkable` | `boolean` | `false` |
| `checked` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `color` | `string` | — |

文件以 `type` 為準。`variant` 是別名；第一次渲染若兩個屬性都在，以 `type` 為準。`error` 對應 danger token。`color` 會設定宿主變數 `--gk-tag-color` 並覆蓋填色。

靜態標籤沒有點擊事件。可互動的是可關閉與可勾選。

### Tag 插槽

| 名稱 | 說明 |
|------|------|
| 預設 | 文字 |
| `icon` | 左側圖示 |

### Tag 事件

| 名稱 | 說明 |
|------|------|
| `close` | 按下 ×。會冒泡；`composed: true`。不會切換 `checked`。 |
| `update:checked` | 可勾選晶片切換。`detail: { checked: boolean }`。 |
| `check` | 與 `update:checked` 相同內容。 |

可勾選晶片在聚焦時可用空白鍵與 Enter 切換。元件會自行更新 `checked`。

### CSS Parts

| Part | 說明 |
|------|------|
| `base` | 晶片表面。可勾選時為 `role="checkbox"` |
| `icon` | 圖示插槽外層 |
| `content` | 文字 |
| `close` | × 按鈕 |
| `check-indicator` | 可勾選時存在；未勾選則隱藏。可自行加上勾選記號 |

### CSS 變數

| 名稱 | 說明 |
|------|------|
| `--gk-tag-color` | 由 `color` 設定，作為晶片填色 |

### 無障礙

- 只有 `checkable` 才有角色，此時為 `role="checkbox"` 與 `aria-checked`。
- × 是 `type="button"`。文件語言以 `zh` 開頭時 `aria-label` 為「關閉」，否則為 “Close”。
- `disabled` 會設定 `aria-disabled="true"`，並移出 Tab 順序。
- 焦點環：`0 0 0 2px color-mix(focus-ring 70%)`。
