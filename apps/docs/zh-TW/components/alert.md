<script setup lang="ts">
import { ref } from "vue";

const alertVisible = ref(true);

function onAlertClose() {
  alertVisible.value = false;
}

const codes = {
  basic: `<gk-alert type="default" title="預設">中性的行內回饋。</gk-alert>
<gk-alert type="info" title="資訊">提供使用者補充說明。</gk-alert>
<gk-alert type="success" title="成功">操作已完成。</gk-alert>
<gk-alert type="warning" title="警告">需要注意的事項。</gk-alert>
<gk-alert type="error" title="錯誤">發生錯誤。</gk-alert>`,
  bordered: `<gk-alert bordered type="info" title="有邊框">
  柔和底色再加上邊框。
</gk-alert>`,
  closable: `<!-- 宿主：const alertVisible = ref(true); function onAlertClose() { alertVisible.value = false } -->
<gk-alert
  v-if="alertVisible"
  type="success"
  title="可關閉"
  closable
  @gk-close="onAlertClose"
>
  關閉會發出 gk-close；請由宿主隱藏或移除警示。
</gk-alert>`,
  icon: `<gk-alert type="info" title="自訂圖示">
  <svg slot="icon" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2 2 7l10 5 10-5-10-5Zm0 9.2L4.2 7.4 12 3.5l7.8 3.9L12 11.2Zm0 2.1 8-4v7.2c0 1.1-3.6 2.5-8 2.5s-8-1.4-8-2.5V9.3l8 4Z"/>
  </svg>
  icon slot 會覆寫內建類型圖示。
</gk-alert>`,
  noIcon: `<gk-alert type="warning" title="無圖示" :show-icon="false">
  show-icon 為 false 時隱藏圖示欄。
</gk-alert>`,
};
</script>

# Alert 警示

警示用於行內回饋，支援語意類型、可選邊框、內建圖示，以及與 Card 相同的關閉行為（只發出 `gk-close`）。

## 示範

<DemoCard title="基礎" :code="codes.basic">
  <template #description>
    類型：<code>default</code>、<code>info</code>、<code>success</code>、<code>warning</code>、<code>error</code>。各類型會套用對應色彩與內建圖示。
  </template>
  <div style="display:grid;gap:0.75rem">
    <gk-alert type="default" title="預設">中性的行內回饋。</gk-alert>
    <gk-alert type="info" title="資訊">提供使用者補充說明。</gk-alert>
    <gk-alert type="success" title="成功">操作已完成。</gk-alert>
    <gk-alert type="warning" title="警告">需要注意的事項。</gk-alert>
    <gk-alert type="error" title="錯誤">發生錯誤。</gk-alert>
  </div>
</DemoCard>

<DemoCard title="有邊框" :code="codes.bordered">
  <template #description>
    加上 <code>bordered</code> 會在柔和底色外再顯示邊框（預設只有底色）。
  </template>
  <gk-alert bordered type="info" title="有邊框">
    柔和底色再加上邊框。
  </gk-alert>
</DemoCard>

<DemoCard title="可關閉" :code="codes.closable">
  <template #description>
    <code>closable</code> 會顯示關閉按鈕並發出可冒泡的 <code>gk-close</code>。警示不會自行隱藏，需由宿主處理事件。
  </template>
  <gk-alert
    v-if="alertVisible"
    type="success"
    title="可關閉"
    closable
    @gk-close="onAlertClose"
  >
    關閉會發出 <code>gk-close</code>；請由宿主隱藏或移除警示。
  </gk-alert>
  <p v-if="!alertVisible" style="margin:0;font-size:0.875rem;opacity:0.8">
    警示已關閉（重新整理頁面可重設示範）。
  </p>
</DemoCard>

<DemoCard title="圖示" :code="codes.icon">
  <template #description>
    在 <code>icon</code> slot 放入內容即可覆寫內建類型圖示。
  </template>
  <gk-alert type="info" title="自訂圖示">
    <svg
      slot="icon"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M12 2 2 7l10 5 10-5-10-5Zm0 9.2L4.2 7.4 12 3.5l7.8 3.9L12 11.2Zm0 2.1 8-4v7.2c0 1.1-3.6 2.5-8 2.5s-8-1.4-8-2.5V9.3l8 4Z"
      />
    </svg>
    <code>icon</code> slot 會覆寫內建類型圖示。
  </gk-alert>
</DemoCard>

<DemoCard title="無圖示" :code="codes.noIcon">
  <template #description>
    綁定 <code>:show-icon="false"</code> 可隱藏圖示欄。
  </template>
  <gk-alert type="warning" title="無圖示" :show-icon="false">
    <code>show-icon</code> 為 false 時隱藏圖示欄。
  </gk-alert>
</DemoCard>

## API

### Alert Props

| Prop | 型別 | 預設值 |
|------|------|---------|
| `type` | `'default' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'default'` |
| `title` | `string` | — |
| `bordered` | `boolean` | `false` |
| `closable` | `boolean` | `false` |
| `show-icon` | `boolean` | `true` |

### Alert Slots

| 名稱 | 說明 |
|------|-------------|
| default | 主要內容 |
| `icon` | 有內容時覆寫內建類型圖示 |

### Alert Events

| 名稱 | 說明 |
|------|-------------|
| `gk-close` | 點擊關閉按鈕時觸發；bubbles；`composed: true` |

### CSS Parts

| Part | 說明 |
|------|-------------|
| `base` | 外層表面 |
| `icon` | 圖示欄 |
| `body` | 標題與內容包裝 |
| `title` | 標題列 |
| `content` | 預設 slot 包裝 |
| `close` | 關閉按鈕 |
