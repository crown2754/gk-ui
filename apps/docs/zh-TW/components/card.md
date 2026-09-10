<script setup lang="ts">
import { ref } from "vue";
import { withBase } from "vitepress";

const owl = withBase("/owl.png");
const closeStatus = ref("");

function onCardClose() {
  closeStatus.value = "已觸發 gk-close";
}

const codes = {
  basic: `<gk-card title="基礎卡片">
  內容放在預設 slot。
</gk-card>`,
  cover: `<gk-card cover="${owl}" title="封面 URL">
  透過 cover 屬性設定封面圖。
</gk-card>
<gk-card title="封面 slot">
  <img slot="cover" src="${owl}" alt="貓頭鷹" style="width:100%;max-height:180px;object-fit:cover;display:block" />
  使用 cover slot（優先於 cover 屬性）。
</gk-card>`,
  size: `<gk-card size="sm" title="小">較緊湊的內距與標題。</gk-card>
<gk-card size="md" title="中">預設尺寸。</gk-card>
<gk-card size="lg" title="大">較寬鬆的內距與標題。</gk-card>`,
  hoverable: `<gk-card title="可懸停" hoverable>
  懸停時會有輕微浮起效果。
</gk-card>`,
  segmented: `<gk-card title="分段" segmented>
  標題、內容與頁尾之間會有分隔線。
  <div slot="footer">頁尾區域</div>
</gk-card>`,
  closable: `<gk-card title="可關閉" closable>
  關閉會發出 gk-close；卡片本身不會隱藏。
</gk-card>`,
};
</script>

# Card 卡片

卡片用來群組相關內容，可選封面、標題、頁尾與操作區。

## 示範

<DemoCard title="基礎" :code="codes.basic">
  <template #description>
    使用 <code>title</code> 顯示簡單標題，或在 <code>header</code> slot 放入自訂內容。
  </template>
  <gk-card title="基礎卡片">
    內容放在預設 slot。
  </gk-card>
</DemoCard>

<DemoCard title="封面" :code="codes.cover">
  <template #description>
    以 <code>cover</code> 屬性指定圖片 URL，或使用 <code>cover</code> slot（有 slot 時優先）。封面圖使用 <code>object-fit: cover</code> 並有最大高度限制。
  </template>
  <div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
    <gk-card :cover="owl" title="封面 URL">
      透過 <code>cover</code> 屬性設定封面圖。
    </gk-card>
    <gk-card title="封面 slot">
      <img
        slot="cover"
        :src="owl"
        alt="貓頭鷹"
        style="width:100%;max-height:180px;object-fit:cover;display:block"
      />
      使用 <code>cover</code> slot（優先於 <code>cover</code> 屬性）。
    </gk-card>
  </div>
</DemoCard>

<DemoCard title="尺寸" :code="codes.size">
  <template #description>
    密度可為 <code>sm</code>、<code>md</code>（預設）與 <code>lg</code>。
  </template>
  <div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">
    <gk-card size="sm" title="小">較緊湊的內距與標題。</gk-card>
    <gk-card size="md" title="中">預設尺寸。</gk-card>
    <gk-card size="lg" title="大">較寬鬆的內距與標題。</gk-card>
  </div>
</DemoCard>

<DemoCard title="可懸停" :code="codes.hoverable">
  <template #description>
    啟用 <code>hoverable</code> 後，懸停會有柔和陰影與輕微位移。
  </template>
  <gk-card title="可懸停" hoverable>
    懸停時會有輕微浮起效果。
  </gk-card>
</DemoCard>

<DemoCard title="分段" :code="codes.segmented">
  <template #description>
    <code>segmented</code> 會在標題、內容與頁尾（存在時）之間加上分隔線。
  </template>
  <gk-card title="分段" segmented>
    標題、內容與頁尾之間會有分隔線。
    <div slot="footer">頁尾區域</div>
  </gk-card>
</DemoCard>

<DemoCard title="可關閉" :code="codes.closable">
  <template #description>
    <code>closable</code> 會顯示關閉按鈕並發出可冒泡的 <code>gk-close</code>。卡片不會自行隱藏，需由宿主處理事件。
  </template>
  <gk-card title="可關閉" closable @gk-close="onCardClose">
    關閉會發出 <code>gk-close</code>；卡片本身不會隱藏。
  </gk-card>
  <p style="margin:0.75rem 0 0;font-size:0.875rem;opacity:0.8">
    狀態：{{ closeStatus || "—" }}
  </p>
</DemoCard>

## API

### Card Props

| Prop | 型別 | 預設值 |
|------|------|---------|
| `title` | `string` | — |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `cover` | `string` | — |
| `hoverable` | `boolean` | `false` |
| `bordered` | `boolean` | `true` |
| `segmented` | `boolean` | `false` |
| `closable` | `boolean` | `false` |

### Card Slots

| 名稱 | 說明 |
|------|-------------|
| `cover` | 自訂封面（優先於 `cover` 屬性） |
| `header` | 自訂標題列（優先於 `title` 屬性） |
| default | 主要內容 |
| `footer` | 頁尾區域 |
| `action` | 右上操作區（與關閉按鈕並存時並排） |

### Card Events

| 名稱 | 說明 |
|------|-------------|
| `gk-close` | 點擊關閉按鈕時觸發；bubbles；`composed: true` |

### CSS Parts

| Part | 說明 |
|------|-------------|
| `base` | 外層 article 表面 |
| `cover` | 封面區域 |
| `header` | 標題列 |
| `content` | 主要內容包裝 |
| `footer` | 頁尾區域 |
| `action` | 操作區（slot + 關閉） |
| `close` | 關閉按鈕 |
