<script setup lang="ts">
import { gkMessage } from "@gk-ui/core";

function showInfo() {
  gkMessage.info("資訊訊息");
}

function showSuccess() {
  gkMessage.success("儲存成功");
}

function showWarning() {
  gkMessage.warning("請檢查輸入內容");
}

function showError() {
  gkMessage.error("發生錯誤");
}

function showDefault() {
  gkMessage.create("預設訊息");
}

function showLoading() {
  const h = gkMessage.loading("載入中…");
  window.setTimeout(() => h.destroy(), 2000);
}

function showClosable() {
  gkMessage.info("可手動關閉", { closable: true, duration: 0 });
}

function showShortDuration() {
  gkMessage.success("一秒後消失", { duration: 1000 });
}

function showPersistent() {
  gkMessage.warning("不會自動關閉", { duration: 0, closable: true });
}

function showBottomRight() {
  gkMessage.info("右下角位置");
}

function destroyAll() {
  gkMessage.destroyAll();
}

const codes = {
  basic: `<gk-message-provider>
  <gk-button @click="() => gkMessage.info('資訊訊息')">資訊</gk-button>
  <gk-button @click="() => gkMessage.success('儲存成功')">成功</gk-button>
  <gk-button @click="() => gkMessage.warning('請檢查輸入內容')">警告</gk-button>
  <gk-button @click="() => gkMessage.error('發生錯誤')">錯誤</gk-button>
</gk-message-provider>`,
  types: `<gk-message-provider>
  <gk-button @click="() => gkMessage.create('預設訊息')">預設</gk-button>
  <gk-button @click="() => gkMessage.info('資訊訊息')">資訊</gk-button>
  <gk-button @click="() => gkMessage.success('儲存成功')">成功</gk-button>
  <gk-button @click="() => gkMessage.warning('請檢查輸入內容')">警告</gk-button>
  <gk-button @click="() => gkMessage.error('發生錯誤')">錯誤</gk-button>
  <gk-button @click="() => {
    const h = gkMessage.loading('載入中…');
    window.setTimeout(() => h.destroy(), 2000);
  }">載入中（2 秒）</gk-button>
</gk-message-provider>`,
  closable: `<gk-message-provider>
  <gk-button @click="() => gkMessage.info('可手動關閉', { closable: true, duration: 0 })">
    可關閉訊息
  </gk-button>
</gk-message-provider>`,
  duration: `<gk-message-provider>
  <gk-button @click="() => gkMessage.success('一秒後消失', { duration: 1000 })">
    1 秒
  </gk-button>
  <gk-button @click="() => gkMessage.warning('不會自動關閉', { duration: 0, closable: true })">
    持續時間 0
  </gk-button>
</gk-message-provider>`,
  placement: `<gk-message-provider placement="bottom-right">
  <gk-button @click="() => gkMessage.info('右下角位置')">
    右下角
  </gk-button>
</gk-message-provider>`,
  destroyAll: `<gk-message-provider>
  <gk-button @click="() => gkMessage.info('資訊訊息')">資訊</gk-button>
  <gk-button @click="() => gkMessage.success('儲存成功')">成功</gk-button>
  <gk-button @click="() => gkMessage.warning('請檢查輸入內容')">警告</gk-button>
  <gk-button @click="() => gkMessage.destroyAll()">全部銷毀</gk-button>
</gk-message-provider>`,
};
</script>

# Message 訊息

訊息以命令式 API 顯示全域 toast 回饋。請以 `<gk-message-provider>` 包住應用（或各示範），再呼叫 `gkMessage`；可用 `destroy()` / `destroyAll()` 管理生命週期。與 Alert 不同，Message 會自行從佇列移除。

## 示範

<DemoCard title="基礎" :code="codes.basic">
  <template #description>
    觸發 <code>gkMessage.info</code>、<code>success</code>、<code>warning</code>、<code>error</code>。需要已連線的 <code>gk-message-provider</code>。
  </template>
  <gk-message-provider>
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
      <gk-button variant="info" @click="showInfo">資訊</gk-button>
      <gk-button variant="success" @click="showSuccess">成功</gk-button>
      <gk-button variant="warning" @click="showWarning">警告</gk-button>
      <gk-button variant="danger" @click="showError">錯誤</gk-button>
    </div>
  </gk-message-provider>
</DemoCard>

<DemoCard title="類型" :code="codes.types">
  <template #description>
    類型：<code>default</code>、<code>info</code>、<code>success</code>、<code>warning</code>、<code>error</code>、<code>loading</code>。Loading 預設不會自動關閉；此示範會在 2 秒後 <code>destroy()</code>。
  </template>
  <gk-message-provider>
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
      <gk-button @click="showDefault">預設</gk-button>
      <gk-button variant="info" @click="showInfo">資訊</gk-button>
      <gk-button variant="success" @click="showSuccess">成功</gk-button>
      <gk-button variant="warning" @click="showWarning">警告</gk-button>
      <gk-button variant="danger" @click="showError">錯誤</gk-button>
      <gk-button variant="primary" @click="showLoading">載入中（2 秒）</gk-button>
    </div>
  </gk-message-provider>
</DemoCard>

<DemoCard title="可關閉" :code="codes.closable">
  <template #description>
    單次呼叫傳入 <code>{ closable: true }</code>（或在 provider 上設定 <code>closable</code>）。關閉會從佇列移除該訊息。
  </template>
  <gk-message-provider>
    <gk-button variant="info" @click="showClosable">可關閉訊息</gk-button>
  </gk-message-provider>
</DemoCard>

<DemoCard title="持續時間" :code="codes.duration">
  <template #description>
    可覆寫單次呼叫的持續時間。Provider 預設為 <code>3000</code> ms；<code>0</code> 表示不自動關閉。
  </template>
  <gk-message-provider>
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
      <gk-button variant="success" @click="showShortDuration">1 秒</gk-button>
      <gk-button variant="warning" @click="showPersistent">持續時間 0</gk-button>
    </div>
  </gk-message-provider>
</DemoCard>

<DemoCard title="位置" :code="codes.placement">
  <template #description>
    僅在此示範的 provider 上設定 <code>placement</code>。可選：<code>top</code>、<code>top-left</code>、<code>top-right</code>、<code>bottom</code>、<code>bottom-left</code>、<code>bottom-right</code>。
  </template>
  <gk-message-provider placement="bottom-right">
    <gk-button variant="info" @click="showBottomRight">右下角</gk-button>
  </gk-message-provider>
</DemoCard>

<DemoCard title="全部銷毀" :code="codes.destroyAll">
  <template #description>
    <code>gkMessage.destroyAll()</code> 會關閉作用中 provider 上的所有訊息。
  </template>
  <gk-message-provider>
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
      <gk-button variant="info" @click="showInfo">資訊</gk-button>
      <gk-button variant="success" @click="showSuccess">成功</gk-button>
      <gk-button variant="warning" @click="showWarning">警告</gk-button>
      <gk-button @click="destroyAll">全部銷毀</gk-button>
    </div>
  </gk-message-provider>
</DemoCard>

## API

### `gk-message-provider` Props

| Prop | 型別 | 預設值 |
|------|------|---------|
| `placement` | `'top' \| 'top-left' \| 'top-right' \| 'bottom' \| 'bottom-left' \| 'bottom-right'` | `'top'` |
| `duration` | `number` | `3000` |
| `closable` | `boolean` | `false` |
| `keep-alive-on-hover` | `boolean` | `false` |
| `max` | `number` | — |

### `gk-message-provider` Slots

| 名稱 | 說明 |
|------|-------------|
| default | 應用／頁面內容 |

### `gkMessage`

從 `@gk-ui/core` 匯入。需要已連線的 `<gk-message-provider>`。

| 方法 | 簽名 | 說明 |
|--------|-----------|-------|
| `create` | `(content: string, options?: GkMessageOptions) => GkMessageReactive` | 通用建立 |
| `info` | `(content: string, options?: GkMessageOptions) => GkMessageReactive` | `type: 'info'` |
| `success` | `(content: string, options?: GkMessageOptions) => GkMessageReactive` | `type: 'success'` |
| `warning` | `(content: string, options?: GkMessageOptions) => GkMessageReactive` | `type: 'warning'` |
| `error` | `(content: string, options?: GkMessageOptions) => GkMessageReactive` | `type: 'error'` |
| `loading` | `(content: string, options?: GkMessageOptions) => GkMessageReactive` | `type: 'loading'`；預設 `duration: 0` |
| `destroyAll` | `() => void` | 關閉作用中 provider 的全部訊息 |

**`GkMessageOptions`：** `type`、`duration`、`closable`、`keepAliveOnHover`、`showIcon`（預設 `true`）。

**`GkMessageReactive`：** `{ destroy: () => void }`。

### `gk-message` Props

| Prop | 型別 | 預設值 |
|------|------|---------|
| `type` | `'default' \| 'info' \| 'success' \| 'warning' \| 'error' \| 'loading'` | `'default'` |
| `content` | `string` | `''` |
| `closable` | `boolean` | `false` |
| `show-icon` | `boolean` | `true` |

### `gk-message` Events

| 名稱 | 說明 |
|------|-------------|
| `gk-close` | 點擊關閉時觸發；bubbles；`composed: true` |

### CSS Parts (`gk-message`)

| Part | 說明 |
|------|-------------|
| `base` | 外層表面 |
| `icon` | 圖示／轉圈欄 |
| `content` | 文字內容 |
| `close` | 關閉按鈕 |
