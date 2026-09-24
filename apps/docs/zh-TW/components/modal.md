<script setup lang="ts">
import { ref } from "vue";

const basic = ref(false);
const widths = ref(false);
const width = ref("md");
const dialog = ref(false);
const danger = ref(false);
const formOpen = ref(false);
const formName = ref("");
const loadingOpen = ref(false);
const loading = ref(false);
const locked = ref(false);
const maskLocked = ref(false);
const outer = ref(false);
const inner = ref(false);

function confirmSave() {
  loading.value = true;
  window.setTimeout(() => {
    loading.value = false;
    loadingOpen.value = false;
  }, 900);
}

const codes = {
  basic: `<gk-button @click="basic = true">開啟對話框</gk-button>
<gk-modal :open="basic" title="儲存變更？" @update:open="basic = $event.detail">
  <p>尚未儲存的編輯會寫入工作區。</p>
</gk-modal>`,
  width: `<gk-modal :open="open" :width="width" title="寬度">...</gk-modal>`,
  dialog: `<gk-modal preset="dialog" title="發佈？" :open="open" @confirm="open = false"></gk-modal>`,
  danger: `<gk-modal title="刪除專案？" width="sm" :open="open">
  <gk-button slot="footer" variant="danger">刪除</gk-button>
</gk-modal>`,
  form: `<gk-modal preset="card" title="編輯資料" :open="open"><gk-input placeholder="名稱"></gk-input></gk-modal>`,
  loading: `<gk-modal preset="dialog" :loading="loading" title="發佈中" @confirm="confirmSave"></gk-modal>`,
  locked: `<gk-modal :closable="false" title="必須完成" :open="open"></gk-modal>`,
  mask: `<gk-modal :mask-closable="false" title="遮罩不關閉" :open="open"></gk-modal>`,
  nested: `<gk-modal :open="outer" title="第一層"></gk-modal>
<gk-modal :open="inner" title="第二層"></gk-modal>`,
};
</script>

# Modal 對話框

置中對話框，蓋在 40% 黑色遮罩上。開啟時焦點留在面板內。

遮罩 z-index **3990**，面板 **4000**。第二層各 **+10**。Esc 與遮罩點擊只作用於最上層；關閉後焦點回到前一層面板。

## 範例

<DemoCard title="基本" :code="codes.basic">
  <template #description>
    <code>open</code> 為受控屬性。關閉時送出 <code>update:open</code>（<code>detail: false</code>）與 <code>close</code>。
  </template>
  <gk-button @click="basic = true">開啟對話框</gk-button>
  <gk-modal :open="basic" title="儲存變更？" @update:open="basic = $event.detail">
    <p style="margin:0">尚未儲存的編輯會寫入工作區，稍後可以還原。</p>
    <div slot="footer" style="display:flex;gap:0.75rem;justify-content:flex-end;width:100%">
      <gk-button variant="secondary" @click="basic = false">取消</gk-button>
      <gk-button @click="basic = false">儲存</gk-button>
    </div>
  </gk-modal>
</DemoCard>

<DemoCard title="寬度預設" :code="codes.width">
  <template #description>
    <code>sm</code> 400 / <code>md</code> 520 / <code>lg</code> 720。數字視為像素。≤640px 時左右各留 16px，<code>max-height: 85vh</code>。
  </template>
  <gk-button size="sm" variant="secondary" @click="width = 'sm'; widths = true">sm · 400</gk-button>
  <gk-button @click="width = 'md'; widths = true">md · 520</gk-button>
  <gk-button size="lg" variant="secondary" @click="width = 'lg'; widths = true">lg · 720</gk-button>
  <gk-modal :open="widths" :width="width" :title="'寬度 ' + width" @update:open="widths = $event.detail">
    <p style="margin:0">目前寬度：{{ width }}</p>
  </gk-modal>
</DemoCard>

<DemoCard title="確認對話框" :code="codes.dialog">
  <template #description>
    <code>preset="dialog"</code> 會畫取消與確認。確認送出 <code>confirm</code>，不會自己關閉。
  </template>
  <gk-button @click="dialog = true">確認</gk-button>
  <gk-modal preset="dialog" title="發佈變更？" cancel-text="取消" confirm-text="確認" :open="dialog" @confirm="dialog = false" @update:open="dialog = $event.detail">
    <p style="margin:0">主要動作會送出 <code>confirm</code>。</p>
  </gk-modal>
</DemoCard>

<DemoCard title="危險確認" :code="codes.danger">
  <template #description>
    無法復原的動作請在 <code>footer</code> 放入 danger 按鈕。
  </template>
  <gk-button variant="danger" @click="danger = true">刪除</gk-button>
  <gk-modal title="刪除專案？" width="sm" :open="danger" @update:open="danger = $event.detail">
    <p style="margin:0">「攤位簡介」將永久刪除。</p>
    <div slot="footer" style="display:flex;gap:0.75rem;justify-content:flex-end;width:100%">
      <gk-button variant="ghost" @click="danger = false">取消</gk-button>
      <gk-button variant="danger" @click="danger = false">刪除</gk-button>
    </div>
  </gk-modal>
</DemoCard>

<DemoCard title="表單內容" :code="codes.form">
  <template #description>
    <code>preset="card"</code> 是留白較多的內容殼。欄位放在預設 slot。
  </template>
  <gk-button variant="secondary" @click="formOpen = true">編輯資料</gk-button>
  <gk-modal preset="card" title="編輯資料" :open="formOpen" @update:open="formOpen = $event.detail">
    <gk-input placeholder="顯示名稱" :value="formName" @input="formName = $event.detail?.value ?? $event.target?.value ?? formName"></gk-input>
    <div slot="footer" style="display:flex;gap:0.75rem;justify-content:flex-end;width:100%">
      <gk-button variant="secondary" @click="formOpen = false">取消</gk-button>
      <gk-button @click="formOpen = false">儲存</gk-button>
    </div>
  </gk-modal>
</DemoCard>

<DemoCard title="載入中確認" :code="codes.loading">
  <template #description>
    <code>loading</code> 會在對話框主按鈕顯示旋轉圖示，並忽略確認點擊。
  </template>
  <gk-button @click="loadingOpen = true">發佈</gk-button>
  <gk-modal
    preset="dialog"
    title="發佈中"
    cancel-text="取消"
    confirm-text="發佈"
    :open="loadingOpen"
    :loading="loading"
    @confirm="confirmSave"
    @update:open="loadingOpen = $event.detail"
  >
    <p style="margin:0">正在上傳資產…</p>
  </gk-modal>
</DemoCard>

<DemoCard title="不可關閉" :code="codes.locked">
  <template #description>
    <code>closable="false"</code> 會藏起關閉鈕，也不回應 Esc。
  </template>
  <gk-button variant="secondary" @click="locked = true">開啟鎖定</gk-button>
  <gk-modal :closable="false" title="必須完成" :open="locked">
    <p style="margin:0 0 0.75rem">完成此步驟才能繼續。</p>
    <gk-button @click="locked = false">繼續</gk-button>
  </gk-modal>
</DemoCard>

<DemoCard title="遮罩不可關閉" :code="codes.mask">
  <template #description>
    <code>mask-closable="false"</code> 保留遮罩，但點遮罩不會關。仍可按 Esc 或關閉鈕（若 <code>closable</code>）。
  </template>
  <gk-button variant="secondary" @click="maskLocked = true">開啟</gk-button>
  <gk-modal :mask-closable="false" title="遮罩保持" :open="maskLocked" @update:open="maskLocked = $event.detail">
    <p style="margin:0">點暗色遮罩不會關閉。</p>
  </gk-modal>
</DemoCard>

<DemoCard title="巢狀對話框" :code="codes.nested">
  <template #description>
    允許第二層。遮罩 4000、面板 4010。只有最上層接收 Esc 與遮罩點擊，關閉後焦點回到前一層面板。
  </template>
  <gk-button @click="outer = true">開啟第一層</gk-button>
  <gk-modal title="第一層" :open="outer" @update:open="outer = $event.detail">
    <p style="margin:0 0 0.75rem">這一層會留在下面。</p>
    <gk-button variant="secondary" @click="inner = true">再開一層</gk-button>
  </gk-modal>
  <gk-modal title="第二層" width="sm" :open="inner" @update:open="inner = $event.detail">
    <p style="margin:0">Esc 只會關閉這一層。</p>
  </gk-modal>
</DemoCard>

## Alpine

```html
<div x-data="{ open: false }">
  <gk-button type="button" x-on:click="open = true">開啟</gk-button>
  <gk-modal title="你好" x-bind:open="open" x-on:update:open="open = $event.detail">
    <p>Alpine 可以驅動同一個元素。</p>
  </gk-modal>
</div>
```

屬性字串 `"false"` 會視為關閉，因此 Alpine 的屬性綁定可用。

## API

### 屬性

| 屬性 | 型別 | 預設 |
|------|------|------|
| `open` | `boolean` | `false` |
| `title` | `string` | `''` |
| `closable` | `boolean` | `true` |
| `mask-closable` | `boolean` | `true` |
| `preset` | `'dialog' \| 'card' \| ''` | `''` |
| `width` | `number \| 'sm' \| 'md' \| 'lg'` | `'md'`（520px） |
| `loading` | `boolean` | `false` |
| `confirm-text` | `string` | `'Confirm'` |
| `cancel-text` | `string` | `'Cancel'` |

`confirm-text`／`cancel-text` 是內建對話框頁尾的文字。放入 `footer` slot 會取代那組按鈕。

### Slots

| 名稱 | 說明 |
|------|------|
| default | 內容 |
| `header` | 標題旁的額外標頭 |
| `footer` | 動作。有內容時取代 dialog 預設按鈕 |

### 事件

| 名稱 | 內容 |
|------|------|
| `update:open` | 關閉時為 `false` |
| `close` | 被關閉（Esc、遮罩、關閉鈕、取消） |
| `confirm` | 對話框主要動作，不會自動關閉 |

### CSS parts

`mask`、`panel`、`header`、`title`、`close`、`body`、`footer`，以及 dialog 預設按鈕的 `cancel`／`confirm`／`spinner`。

進出場為 180ms 透明度加 10px 位移。面板以 `position: fixed` 留在元件 Shadow 內，因此 `::part` 可用，不像 Select／Date Picker 那樣 portal 到 `document.body`。

### 堆疊

| 層級 | 遮罩 | 面板 |
|------|------|------|
| 0 | 3990 | 4000 |
| 1 | 4000 | 4010 |

抽屜與此共用阻擋堆疊，後開啟的對話框會蓋在抽屜之上。
