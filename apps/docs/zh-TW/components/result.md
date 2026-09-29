<script setup lang="ts">
const codes = {
  success: `<gk-result
  status="success"
  title="提交成功"
  description="你的課程已送出審核，我們會在 1–2 個工作天內通知結果。"
>
  <gk-button slot="action">查看課程</gk-button>
  <gk-button slot="extra" variant="ghost">返回列表</gk-button>
</gk-result>`,
  strip: `<gk-result status="info" title="資訊提示"></gk-result>
<gk-result status="warning" title="請注意"></gk-result>
<gk-result status="error" title="發生錯誤"></gk-result>
<gk-result status="404" title="找不到頁面"></gk-result>`,
  missing: `<gk-result
  status="404"
  title="找不到頁面"
  description="這個網址可能已移動或刪除。試試回到首頁，或搜尋你需要的內容。"
>
  <gk-button slot="action">回到首頁</gk-button>
  <gk-button slot="extra" variant="ghost">聯絡支援</gk-button>
</gk-result>`,
  icon: `<gk-result status="info" title="自訂圖示">
  <svg slot="icon" viewBox="0 0 24 24" aria-hidden="true"></svg>
</gk-result>`,
};
</script>

# Result 結果

結果頁是置中的結果面板：成功、資訊、警告、錯誤，或 404。間距對齊 Empty 的 large。它不是警示。

## 示範

<DemoCard title="成功" :code="codes.success">
  <template #description>
    圖示是 16% 語意色軟底，字形用 pressed 色。動作列與 Empty 相同：一顆主按鈕，可再加 ghost。
  </template>
  <div style="width:100%;border:1px dashed var(--gk-color-border, rgb(224, 224, 230));border-radius:0.75rem">
    <gk-result
      status="success"
      title="提交成功"
      description="你的課程已送出審核，我們會在 1–2 個工作天內通知結果。"
    >
      <gk-button slot="action" type="button">查看課程</gk-button>
      <gk-button slot="extra" variant="ghost" type="button">返回列表</gk-button>
    </gk-result>
  </div>
</DemoCard>

<DemoCard title="資訊、警告、錯誤、404" :code="codes.strip">
  <template #description>
    <code>status</code> 決定圖示與底色。404 用品牌軟底圓，以及 Fraunces 的「404」。
  </template>
  <div style="width:100%;display:grid;gap:0.75rem;grid-template-columns:repeat(auto-fit,minmax(140px,1fr))">
    <div style="border:1px solid var(--gk-color-divider, rgb(239, 239, 245));border-radius:0.5rem">
      <gk-result status="info" title="資訊提示"></gk-result>
    </div>
    <div style="border:1px solid var(--gk-color-divider, rgb(239, 239, 245));border-radius:0.5rem">
      <gk-result status="warning" title="請注意"></gk-result>
    </div>
    <div style="border:1px solid var(--gk-color-divider, rgb(239, 239, 245));border-radius:0.5rem">
      <gk-result status="error" title="發生錯誤"></gk-result>
    </div>
    <div style="border:1px solid var(--gk-color-divider, rgb(239, 239, 245));border-radius:0.5rem">
      <gk-result status="404" title="找不到頁面"></gk-result>
    </div>
  </div>
</DemoCard>

<DemoCard title="404 面板" :code="codes.missing">
  <template #description>
    Result 不負責路由。動作插槽由應用程式決定。
  </template>
  <div style="width:100%;border:1px dashed var(--gk-color-border, rgb(224, 224, 230));border-radius:0.75rem">
    <gk-result
      status="404"
      title="找不到頁面"
      description="這個網址可能已移動或刪除。試試回到首頁，或搜尋你需要的內容。"
    >
      <gk-button slot="action" type="button">回到首頁</gk-button>
      <gk-button slot="extra" variant="ghost" type="button">聯絡支援</gk-button>
    </gk-result>
  </div>
</DemoCard>

<DemoCard title="自訂圖示" :code="codes.icon">
  <template #description>
    <code>icon</code> 插槽取代內建字形。有標題時圖示為 <code>aria-hidden</code>，標題才是可及名稱。
  </template>
  <gk-result status="info" title="換成你的符號" description="圓形軟底仍跟著 status。">
    <svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
      <path d="M12 3v18M3 12h18"></path>
    </svg>
  </gk-result>
</DemoCard>

## API

### Result 屬性

| 屬性 | 型別 | 預設 |
|------|------|------|
| `status` | `'success' \| 'info' \| 'warning' \| 'error' \| '404'` | `'info'` |
| `title` | `string` | `''` |
| `description` | `string` | `''` |

### Result 插槽

| 名稱 | 說明 |
|------|------|
| `icon` | 取代狀態圖示 |
| `extra` / `action` | 動作列，通常是 `gk-button` |
| 預設 | 說明下方的額外內容 |

### CSS Parts

| Part | 說明 |
|------|------|
| `root` | 置中直欄，間距對齊 Empty large |
| `icon` | 72px 圓。有標題時 `aria-hidden` |
| `title` | Fraunces 標題 |
| `description` | 次要說明 |
| `extra` | 動作列 |

沒有 `role="alert"`。非同步任務完成時，應用程式可自行在宿主上加 `role="status"`。

### 無障礙

- 標題是 `h2`，也是可及名稱。
- 有標題時圖示是裝飾。
- 動作按鈕自帶名稱與焦點環。
