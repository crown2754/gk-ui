<script setup lang="ts">
const codes = {
  basic: `<gk-empty></gk-empty>`,
  custom: `<gk-empty description="沒有符合的課程"></gk-empty>`,
  title: `<gk-empty
  title="還沒有課程"
  description="建立第一門課，開始累積你的好知識內容。"
  size="large"
>
  <gk-button slot="action">新增課程</gk-button>
  <gk-button slot="extra" variant="ghost">了解更多</gk-button>
</gk-empty>`,
  large: `<gk-empty size="large" title="這裡是空的" description="large 會加大留白與插畫。"></gk-empty>`,
  svg: `<gk-empty description="自訂插畫">
  <svg slot="image" viewBox="0 0 128 96" aria-hidden="true"><!-- 你的插畫 --></svg>
</gk-empty>`,
  table: `<gk-empty description="搜尋無結果，試試其他關鍵字">
  <gk-button slot="action">清除篩選</gk-button>
</gk-empty>`,
};
</script>

# Empty 空狀態

空狀態是列表、表格、搜尋結果與初次使用面板的安靜占位。它不是警示。

## 示範

<DemoCard title="基礎" :code="codes.basic">
  <template #description>
    沒有 <code>description</code> 時，依 <code>document.documentElement.lang</code>：中文為「暫無資料」，英文為 “No data”。插畫是裝飾。
  </template>
  <div style="width:100%;border:1px dashed var(--gk-color-border, rgb(224, 224, 230));border-radius:0.75rem">
    <gk-empty></gk-empty>
  </div>
</DemoCard>

<DemoCard title="自訂說明" :code="codes.custom">
  <template #description>
    可傳 <code>description</code>，或用 <code>description</code> 插槽覆寫文字。
  </template>
  <gk-empty>
    <span slot="description">沒有符合的課程，試試更短的關鍵字。</span>
  </gk-empty>
</DemoCard>

<DemoCard title="標題與動作" :code="codes.title">
  <template #description>
    <code>title</code> 是較強的一行。<code>action</code> 與 <code>extra</code> 都在同一個動作列，通常放 md 34 的品牌主按鈕，可再加 ghost。
  </template>
  <div style="width:100%;border:1px dashed var(--gk-color-border, rgb(224, 224, 230));border-radius:0.75rem">
    <gk-empty
      size="large"
      title="還沒有課程"
      description="建立第一門課，開始累積你的好知識內容。"
    >
      <gk-button slot="action" type="button">新增課程</gk-button>
      <gk-button slot="extra" variant="ghost" type="button">了解更多</gk-button>
    </gk-empty>
  </div>
</DemoCard>

<DemoCard title="較大" :code="codes.large">
  <template #description>
    <code>size="large"</code> 加大留白（約 44px）與插畫（128×96，預設為 96×72）。
  </template>
  <gk-empty size="large" title="這裡是空的" description="large 會加大留白與插畫。"></gk-empty>
</DemoCard>

<DemoCard title="自訂插畫" :code="codes.svg">
  <template #description>
    <code>image</code> 插槽（別名 <code>icon</code>）會取代內建線稿。<code>:show-icon="false"</code> 在沒有替代圖時隱藏預設插畫。
  </template>
  <gk-empty description="換成你的 SVG。">
    <svg slot="image" viewBox="0 0 128 96" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
      <path d="M40 70V34l24-12 24 12v36"></path>
      <path d="M40 34l24 12 24-12"></path>
      <path d="M64 46v36"></path>
    </svg>
  </gk-empty>
</DemoCard>

<DemoCard title="表格中" :code="codes.table">
  <template #description>
    把 Empty 放進表格內容區。元件維持置中直欄，不會把動作按鈕拉成全寬。
  </template>
  <div style="width:100%;border:1px solid var(--gk-color-border, rgb(224, 224, 230));border-radius:0.5rem;overflow:hidden">
    <div style="display:grid;grid-template-columns:1.4fr 1fr 0.8fr;gap:8px;padding:0.65rem 1rem;background:#fafafc;border-bottom:1px solid var(--gk-color-divider, rgb(239, 239, 245));font-size:0.75rem;font-weight:600;letter-spacing:0.04em;color:var(--gk-color-text-muted, rgb(118, 124, 130))">
      <span>名稱</span><span>狀態</span><span>更新</span>
    </div>
    <gk-empty description="搜尋無結果，試試其他關鍵字">
      <gk-button slot="action" type="button">清除篩選</gk-button>
    </gk-empty>
  </div>
</DemoCard>

## API

### Empty 屬性

| 屬性 | 型別 | 預設 |
|------|------|------|
| `description` | `string` | 依文件語言：「暫無資料」/ “No data” |
| `title` | `string` | `''` |
| `size` | `'default' \| 'large'` | `'default'` |
| `show-icon` | `boolean` | `true` |

若頁面語言與 `documentElement.lang` 不同，請自行傳 `description`。`show-icon="false"` 會隱藏內建插畫。

### Empty 插槽

| 名稱 | 說明 |
|------|------|
| `image` / `icon` | 自訂插畫，取代內建 SVG |
| `title` | 取代 `title` 屬性 |
| `description` | 取代說明文字 |
| `extra` / `action` | 動作，通常是 `gk-button` |
| 預設 | 說明下方的額外內容 |

### CSS Parts

| Part | 說明 |
|------|------|
| `root` | 置中直欄 |
| `image` | 插畫，`aria-hidden="true"` |
| `title` | 標題 |
| `description` | 說明 |
| `extra` | 動作列 |

沒有 `role="alert"`。空狀態是占位，不是錯誤。

### 無障礙

- 插畫為 `aria-hidden`。不要只靠圖，請保留說明文字。
- 標題與說明是一般文字。
- 動作按鈕自帶名稱與焦點環。Empty 不會加上 alert 角色。
