<script setup lang="ts">
const codes = {
  basic: `<gk-breadcrumb>
  <gk-breadcrumb-item href="/">首頁</gk-breadcrumb-item>
  <gk-breadcrumb-item href="/products">產品</gk-breadcrumb-item>
  <gk-breadcrumb-item>Breadcrumb</gk-breadcrumb-item>
</gk-breadcrumb>`,
  href: `<gk-breadcrumb>
  <gk-breadcrumb-item href="/">首頁</gk-breadcrumb-item>
  <gk-breadcrumb-item key="library">元件庫</gk-breadcrumb-item>
  <gk-breadcrumb-item>目前頁</gk-breadcrumb-item>
</gk-breadcrumb>`,
  separator: `<gk-breadcrumb>
  <span slot="separator">·</span>
  <gk-breadcrumb-item href="#org">組織</gk-breadcrumb-item>
  <gk-breadcrumb-item>團隊</gk-breadcrumb-item>
</gk-breadcrumb>`,
  sizes: `<gk-breadcrumb size="sm">...</gk-breadcrumb>
<gk-breadcrumb size="md">...</gk-breadcrumb>
<gk-breadcrumb size="lg">...</gk-breadcrumb>`,
  wrap: `<gk-breadcrumb>
  <gk-breadcrumb-item href="#a">組織</gk-breadcrumb-item>
  <gk-breadcrumb-item href="#b">亞太區</gk-breadcrumb-item>
  <gk-breadcrumb-item>gk-ui Wave 5</gk-breadcrumb-item>
</gk-breadcrumb>`,
  header: `<gk-breadcrumb>
  <gk-breadcrumb-item href="#console">控制台</gk-breadcrumb-item>
  <gk-breadcrumb-item href="#orders">訂單</gk-breadcrumb-item>
  <gk-breadcrumb-item>#ORD-20481</gk-breadcrumb-item>
</gk-breadcrumb>`,
};
</script>

# Breadcrumb 麵包屑

水平位置路徑。前面的項目是連結，最後一項是目前頁面，不是連結。

分隔符是 **chevron**，不是斜線。字級 `sm` / `md` / `lg` 為 13 / 14 / 15px。

## 示範

<DemoCard title="基本" :code="codes.basic">
  <template #description>
    最後一項為 <code>aria-current="page"</code>。分隔符對輔助科技隱藏。
  </template>
  <gk-breadcrumb>
    <gk-breadcrumb-item href="/">首頁</gk-breadcrumb-item>
    <gk-breadcrumb-item href="/products">產品</gk-breadcrumb-item>
    <gk-breadcrumb-item>Breadcrumb</gk-breadcrumb-item>
  </gk-breadcrumb>
</DemoCard>

<DemoCard title="連結與 select" :code="codes.href">
  <template #description>
    有 <code>href</code> 的項目是一般連結，不發出 <code>select</code>。沒有 <code>href</code> 時是按鈕，並發出 <code>select</code>，detail 為 <code>{ key, item }</code>。
  </template>
  <gk-breadcrumb>
    <gk-breadcrumb-item href="/">首頁</gk-breadcrumb-item>
    <gk-breadcrumb-item key="library">元件庫</gk-breadcrumb-item>
    <gk-breadcrumb-item>目前頁</gk-breadcrumb-item>
  </gk-breadcrumb>
</DemoCard>

<DemoCard title="自訂分隔符" :code="codes.separator">
  <template #description>
    <code>separator</code> 插槽會取代 chevron。<code>separator</code> 設成其他字串時，則以文字繪製。
  </template>
  <gk-breadcrumb>
    <span slot="separator">·</span>
    <gk-breadcrumb-item href="#org">組織</gk-breadcrumb-item>
    <gk-breadcrumb-item href="#team">團隊</gk-breadcrumb-item>
    <gk-breadcrumb-item>成員</gk-breadcrumb-item>
  </gk-breadcrumb>
</DemoCard>

<DemoCard title="尺寸" :code="codes.sizes">
  <template #description>
    <code>sm</code> 13px、<code>md</code> 14px（預設）、<code>lg</code> 15px。<code>lg</code> 的 chevron 略大。
  </template>
  <div style="display:grid;gap:10px;width:100%">
    <gk-breadcrumb size="sm">
      <gk-breadcrumb-item href="#home">首頁</gk-breadcrumb-item>
      <gk-breadcrumb-item href="#settings">設定</gk-breadcrumb-item>
      <gk-breadcrumb-item>帳戶</gk-breadcrumb-item>
    </gk-breadcrumb>
    <gk-breadcrumb size="md">
      <gk-breadcrumb-item href="#home">首頁</gk-breadcrumb-item>
      <gk-breadcrumb-item href="#settings">設定</gk-breadcrumb-item>
      <gk-breadcrumb-item>帳戶</gk-breadcrumb-item>
    </gk-breadcrumb>
    <gk-breadcrumb size="lg">
      <gk-breadcrumb-item href="#home">首頁</gk-breadcrumb-item>
      <gk-breadcrumb-item href="#settings">設定</gk-breadcrumb-item>
      <gk-breadcrumb-item>帳戶</gk-breadcrumb-item>
    </gk-breadcrumb>
  </div>
</DemoCard>

<DemoCard title="長路徑換行" :code="codes.wrap">
  <template #description>
    路徑會換行，分隔符跟著前一項。以 <code>max-items</code> 折疊中間項目是後續項目，v1 尚未實作。
  </template>
  <div style="max-width:420px">
    <gk-breadcrumb>
      <gk-breadcrumb-item href="#a">組織</gk-breadcrumb-item>
      <gk-breadcrumb-item href="#b">亞太區</gk-breadcrumb-item>
      <gk-breadcrumb-item href="#c">台灣</gk-breadcrumb-item>
      <gk-breadcrumb-item href="#d">台北辦公室</gk-breadcrumb-item>
      <gk-breadcrumb-item href="#e">專案</gk-breadcrumb-item>
      <gk-breadcrumb-item>gk-ui Wave 5</gk-breadcrumb-item>
    </gk-breadcrumb>
  </div>
</DemoCard>

<DemoCard title="頁首" :code="codes.header">
  <template #description>
    麵包屑放在頁面標題上方，作為位置路徑。
  </template>
  <div style="width:100%">
    <gk-breadcrumb>
      <gk-breadcrumb-item href="#console">控制台</gk-breadcrumb-item>
      <gk-breadcrumb-item href="#orders">訂單</gk-breadcrumb-item>
      <gk-breadcrumb-item>#ORD-20481</gk-breadcrumb-item>
    </gk-breadcrumb>
    <h2 style="margin:8px 0 0;font-size:1.25rem">訂單詳情</h2>
    <p style="margin:4px 0 0;color:var(--gk-color-text-muted, rgb(118, 124, 130))">麵包屑置於頁面標題上方，作為位置路徑。</p>
  </div>
</DemoCard>

## Alpine

```html
<gk-breadcrumb>
  <gk-breadcrumb-item href="/">首頁</gk-breadcrumb-item>
  <gk-breadcrumb-item>目前頁</gk-breadcrumb-item>
</gk-breadcrumb>
```

## API

### Breadcrumb 屬性

| 屬性 | 型別 | 預設 |
|------|------|------|
| `separator` | `string` | `'chevron'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `items` | `{ label, href?, key?, disabled? }[]` | — |

有插槽的 `gk-breadcrumb-item` 時，優先於 `items`。`separator="chevron"` 畫圖示；其他字串當文字。`separator` 插槽優先於兩者。

v1 沒有 `max-items` 折疊。

### 項目屬性

| 屬性 | 型別 | 預設 |
|------|------|------|
| `href` | `string` | `''` |
| `key` | `string` | `''` |
| `disabled` | `boolean` | `false` |

### 插槽

| 名稱 | 說明 |
|------|------|
| default | `gk-breadcrumb-item`，或項目文字 |
| `separator` | 自訂分隔節點，會複製到項目之間 |

### 事件

| 名稱 | Detail |
|------|--------|
| `select` | 沒有 `href` 的項目被啟動時為 `{ key, item }`。有連結的項目交給瀏覽器，不發 `select`。 |

### CSS parts

`root`、`list`、`item`（資料 API）、`link`、`separator`、`current`。

### 無障礙

- 根節點是 `nav`。名稱依文件語言：「Breadcrumb」或「麵包屑」。可在宿主上用 `aria-label` 覆寫。
- 插槽路徑使用 `role="list"`。資料 API 渲染 `ol`。
- 目前頁有 `aria-current="page"`，且不是連結。
- 分隔符為 `aria-hidden="true"`。
- 先前項目 hover 為品牌色 70% 的底線，焦點環為 `--gk-color-focus-ring` 的 70%。
