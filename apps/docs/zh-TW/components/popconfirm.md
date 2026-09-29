<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);

function onOpen(event: CustomEvent<boolean>) {
  open.value = event.detail;
}

const codes = {
  basic: `<gk-popconfirm title="儲存此草稿？" content="稍後可從草稿繼續編輯。">
  <gk-button>儲存草稿</gk-button>
</gk-popconfirm>`,
  placements: `<gk-popconfirm placement="bottom" title="置於下方">...</gk-popconfirm>`,
  danger: `<gk-popconfirm type="error" title="確定刪除？" ok-text="刪除">
  <gk-button variant="danger">刪除項目</gk-button>
</gk-popconfirm>`,
  texts: `<gk-popconfirm title="發佈？" ok-text="發佈" cancel-text="先不要">...</gk-popconfirm>`,
  icon: `<gk-popconfirm type="warning" title="封存此檔案？">
  <gk-button variant="secondary" aria-label="封存">···</gk-button>
</gk-popconfirm>`,
  cancel: `<gk-popconfirm show-cancel="false" title="標為已讀？">...</gk-popconfirm>`,
  arrow: `<gk-popconfirm show-arrow="false" title="沒有箭頭">...</gk-popconfirm>`,
  controlled: `<gk-popconfirm :open="open" title="離開此頁？" @update:open="onOpen">...</gk-popconfirm>`,
};
</script>

# Popconfirm 確認浮層

錨在觸發器上的確認浮層。不是 Modal：預設沒有遮罩，面板用下拉選單的淺色表面。

面板 z-index 是 **4000**，與 Tooltip、Dropdown 相同。每多一層疊加 **10**。確定與取消按鈕高 34px。

## 示範

<DemoCard title="基本" :code="codes.basic">
  <template #description>
    點觸發器可開關。確定會發出 <code>confirm</code> 並關閉。取消、Esc、點外面會發出 <code>cancel</code>，detail 為 <code>{ reason }</code>。再點觸發器不會發 <code>cancel</code>。
  </template>
  <gk-popconfirm title="儲存此草稿？" content="稍後可從草稿繼續編輯。">
    <gk-button>儲存草稿</gk-button>
  </gk-popconfirm>
</DemoCard>

<DemoCard title="位置" :code="codes.placements">
  <template #description>
    <code>top</code>、<code>bottom</code>、<code>left</code>、<code>right</code>，以及 <code>-start</code>／<code>-end</code>。靠近視窗邊緣時會翻轉。
  </template>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:4.5rem 2rem;padding:4rem 1rem;width:100%">
    <gk-popconfirm placement="top" title="置於上方" content="預設位置。">
      <gk-button variant="secondary">上方</gk-button>
    </gk-popconfirm>
    <gk-popconfirm placement="bottom" title="置於下方">
      <gk-button variant="secondary">下方</gk-button>
    </gk-popconfirm>
    <gk-popconfirm placement="left" title="置於左側">
      <gk-button variant="secondary">左側</gk-button>
    </gk-popconfirm>
    <gk-popconfirm placement="right" title="置於右側">
      <gk-button variant="secondary">右側</gk-button>
    </gk-popconfirm>
  </div>
</DemoCard>

<DemoCard title="警告與刪除" :code="codes.danger">
  <template #description>
    <code>warning</code> 與 <code>error</code> 的確定按鈕是危險色，並顯示圖示。<code>error</code> 使用 <code>alertdialog</code>，初始焦點在取消。
  </template>
  <gk-popconfirm type="warning" title="封存此專案？" content="之後可從封存區還原。" ok-text="封存">
    <gk-button variant="secondary">封存</gk-button>
  </gk-popconfirm>
  <gk-popconfirm type="error" title="確定刪除？" content="此操作無法復原。" ok-text="刪除">
    <gk-button variant="danger">刪除項目</gk-button>
  </gk-popconfirm>
</DemoCard>

<DemoCard title="自訂文案" :code="codes.texts">
  <template #description>
    <code>ok-text</code>／<code>cancel-text</code> 留空時，依文件語言顯示 OK／Cancel 或 確定／取消。
  </template>
  <gk-popconfirm title="現在發佈？" content="頁面會公開。" ok-text="發佈" cancel-text="先不要">
    <gk-button>發佈</gk-button>
  </gk-popconfirm>
</DemoCard>

<DemoCard title="圖示觸發" :code="codes.icon">
  <template #description>
    觸發器可以是圖示按鈕。點擊區請維持至少 34px。
  </template>
  <gk-popconfirm type="warning" title="封存此檔案？" content="封存後仍可在封存區找到。">
    <gk-button variant="secondary" aria-label="封存">···</gk-button>
  </gk-popconfirm>
</DemoCard>

<DemoCard title="沒有取消" :code="codes.cancel">
  <template #description>
    <code>show-cancel="false"</code> 只留確定。點外面與 Esc 仍會關閉。
  </template>
  <gk-popconfirm show-cancel="false" title="標為已讀？" content="這則討論會離開收件匣。">
    <gk-button variant="secondary">標為已讀</gk-button>
  </gk-popconfirm>
</DemoCard>

<DemoCard title="隱藏箭頭" :code="codes.arrow">
  <template #description>
    <code>show-arrow</code> 預設開啟。設 <code>show-arrow="false"</code> 可隱藏 8px 箭頭。
  </template>
  <gk-popconfirm show-arrow="false" title="沒有箭頭" content="靠近視窗邊緣時仍會翻轉。">
    <gk-button variant="secondary">無箭頭</gk-button>
  </gk-popconfirm>
</DemoCard>

<DemoCard title="受控" :code="codes.controlled">
  <template #description>
    <code>open</code> 與 <code>show</code> 是別名。<code>update:open</code> 與 <code>update:show</code> 帶出下一個布林值。<code>mask</code> 預設關閉；只有需要 40% 遮罩與鎖定捲動時才打開。確定按鈕的非同步載入是後續項目，請在應用裡組合。
  </template>
  <gk-popconfirm
    :open="open"
    title="離開此頁？"
    content="未儲存的筆記會留在本機。"
    @update:open="onOpen"
  >
    <gk-button>離開</gk-button>
  </gk-popconfirm>
  <gk-button variant="secondary" @click="open = !open">{{ open ? "從外面關閉" : "從外面打開" }}</gk-button>
</DemoCard>

## Alpine

```html
<gk-popconfirm title="儲存此草稿？" content="稍後可從草稿繼續編輯。">
  <button type="button">儲存草稿</button>
</gk-popconfirm>
```

## API

### 屬性

| 屬性 | 型別 | 預設 |
|------|------|------|
| `open` / `show` | `boolean` | `false` |
| `title` | `string` | `''` |
| `content` / `message` | `string` | `''` |
| `placement` | 與 Tooltip 相同 | `'top'` |
| `trigger` | `'click' \| 'manual'` | `'click'` |
| `type` | `'default' \| 'warning' \| 'error'` | `'default'` |
| `ok-text` | `string` | `''`（OK／確定） |
| `cancel-text` | `string` | `''`（Cancel／取消） |
| `show-cancel` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `show-arrow` | `boolean` | `true` |
| `mask` | `boolean` | `false` |

v1 以點擊開啟。`trigger="manual"` 時只由 `open`／`show` 控制。Hover 不會打開確認。

### 插槽

| 名稱 | 說明 |
|------|------|
| default | 觸發器 |
| `title` | 標題 |
| `content` | 說明 |
| `footer` / `action` | 取代預設的確定與取消 |

### 事件

| 名稱 | Detail |
|------|--------|
| `update:open` / `update:show` | 下一個 `boolean` |
| `open` / `close` | — |
| `confirm` | 按下確定後關閉 |
| `cancel` | `{ reason: 'cancel' \| 'outside' \| 'escape' }` |

### CSS parts

`trigger`、`panel`、`arrow`、`icon`、`title`、`content`、`footer`、`ok`、`cancel`、`mask`。

### 無障礙

- 面板是 `role="dialog"`。`type="error"` 使用 `role="alertdialog"`。
- 只有 `mask` 開啟時 `aria-modal` 為 `true`。
- 標題與內容以 `aria-labelledby`、`aria-describedby` 關聯。
- 觸發器有 `aria-haspopup="dialog"` 與 `aria-expanded`。
- 一般確認聚焦確定。警告與錯誤在有取消按鈕時聚焦取消。
- Tab 在面板內循環。Esc 只關閉最上層，並把焦點還給觸發器。
