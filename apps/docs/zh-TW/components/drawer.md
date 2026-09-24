<script setup lang="ts">
import { ref } from "vue";

const right = ref(false);
const left = ref(false);
const top = ref(false);
const bottom = ref(false);
const filters = ref(false);
const bare = ref(false);

const codes = {
  right: `<gk-drawer :open="open" title="詳情" placement="right"></gk-drawer>`,
  left: `<gk-drawer placement="left" title="導覽" :open="open"></gk-drawer>`,
  top: `<gk-drawer placement="top" height="32vh" title="通知" :open="open"></gk-drawer>`,
  bottom: `<gk-drawer placement="bottom" title="底部" :open="open"></gk-drawer>`,
  footer: `<gk-drawer :open="open" title="篩選"><gk-button slot="footer">套用</gk-button></gk-drawer>`,
  form: `<gk-drawer :open="open" title="篩選"><gk-input placeholder="關鍵字"></gk-input></gk-drawer>`,
  mask: `<gk-drawer show-mask="false" :open="open" title="預覽"></gk-drawer>`,
};
</script>

# Drawer 抽屜

貼邊面板，用來放篩選、詳情與設定。遮罩語言與對話框相同：40% 黑、遮罩 z-index **3990**、面板 **4000**。開啟時鎖定頁面捲動並困住焦點。

## 範例

<DemoCard title="右側" :code="codes.right">
  <template #description>
    預設 <code>placement</code> 是 <code>right</code>。<code>width</code> 預設 400。
  </template>
  <gk-button @click="right = true">開啟右側</gk-button>
  <gk-drawer title="詳情" :open="right" @update:open="right = $event.detail">
    <p style="margin:0">側欄內容在 body 內捲動。</p>
  </gk-drawer>
</DemoCard>

<DemoCard title="左側" :code="codes.left">
  <template #description>
    <code>placement="left"</code>。視窗 ≤640px 時，左右抽屜寬度為 <code>calc(100% - 48px)</code>。
  </template>
  <gk-button variant="secondary" @click="left = true">開啟左側</gk-button>
  <gk-drawer placement="left" title="導覽" width="320" :open="left" @update:open="left = $event.detail">
    <p style="margin:0">較窄的導覽面板。</p>
  </gk-drawer>
</DemoCard>

<DemoCard title="頂部" :code="codes.top">
  <template #description>
    頂部維持較矮的高度，讓下方內容仍被暗示。<code>height</code> 預設 <code>40vh</code>。
  </template>
  <gk-button variant="secondary" @click="top = true">開啟頂部</gk-button>
  <gk-drawer placement="top" height="32vh" title="通知" :open="top" @update:open="top = $event.detail">
    <p style="margin:0">較短的橫幅抽屜。</p>
  </gk-drawer>
</DemoCard>

<DemoCard title="底部" :code="codes.bottom">
  <template #description>
    底部使用較大的上圓角，與小螢幕日期選擇的底部表單同一語彙。
  </template>
  <gk-button variant="secondary" @click="bottom = true">開啟底部</gk-button>
  <gk-drawer placement="bottom" title="快速動作" :open="bottom" @update:open="bottom = $event.detail">
    <p style="margin:0">底部表單內容。</p>
  </gk-drawer>
</DemoCard>

<DemoCard title="含頁尾" :code="codes.footer">
  <template #description>
    <code>footer</code> slot 使用與對話框相同、靠右的動作列。
  </template>
  <gk-button @click="filters = true">篩選</gk-button>
  <gk-drawer title="篩選" :open="filters" @update:open="filters = $event.detail">
    <p style="margin:0 0 0.75rem">選擇要留下的項目。</p>
    <gk-input placeholder="關鍵字"></gk-input>
    <div slot="footer" style="display:flex;gap:0.75rem;justify-content:flex-end;width:100%">
      <gk-button variant="secondary" @click="filters = false">重設</gk-button>
      <gk-button @click="filters = false">套用</gk-button>
    </div>
  </gk-drawer>
</DemoCard>

<DemoCard title="表單篩選" :code="codes.form">
  <template #description>
    內容可捲動。欄位沿用 Input 的 34px 高度。
  </template>
  <gk-button variant="secondary" @click="filters = true">開啟篩選</gk-button>
</DemoCard>

<DemoCard title="無遮罩" :code="codes.mask">
  <template #description>
    <code>show-mask="false"</code> 不畫遮罩，並將 <code>aria-modal</code> 設為 <code>false</code>。<code>closable</code> 時 Esc 仍可關閉。
  </template>
  <gk-button variant="secondary" @click="bare = true">預覽</gk-button>
  <gk-drawer show-mask="false" title="預覽" width="280" :open="bare" @update:open="bare = $event.detail">
    <p style="margin:0">面板後面沒有暗色遮罩。</p>
  </gk-drawer>
</DemoCard>

## Alpine

```html
<div x-data="{ open: false }">
  <gk-button type="button" x-on:click="open = true">篩選</gk-button>
  <gk-drawer title="篩選" x-bind:open="open" x-on:update:open="open = $event.detail">
    <p>貼邊面板</p>
  </gk-drawer>
</div>
```

## API

### 屬性

| 屬性 | 型別 | 預設 |
|------|------|------|
| `open` | `boolean` | `false` |
| `title` | `string` | `''` |
| `placement` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` |
| `width` | `number \| string` | `400` |
| `height` | `number \| string` | `40vh` |
| `closable` | `boolean` | `true` |
| `mask-closable` | `boolean` | `true` |
| `show-mask` | `boolean` | `true` |

`width` 用於左右，`height` 用於上下。純數字視為像素。

### Slots

| 名稱 | 說明 |
|------|------|
| default | 內容 |
| `header` | 額外標頭 |
| `footer` | 動作 |

### 事件

| 名稱 | 內容 |
|------|------|
| `update:open` | 關閉時為 `false` |
| `close` | 被關閉 |

### CSS parts

`mask`、`panel`、`header`、`title`、`close`、`body`、`footer`。

面板以 180ms、自邊緣 12px 的位移進入。它與對話框共用阻擋堆疊，後開啟的對話框或抽屜會再高 10 階 z-index。
