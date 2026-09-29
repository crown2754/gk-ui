<script setup lang="ts">
import { ref } from "vue";

const step = ref(1);

function onStep(event: CustomEvent<{ current: number }>) {
  step.value = event.detail.current;
}

const codes = {
  basic: `<gk-steps current="1">
  <gk-step title="填寫資料"></gk-step>
  <gk-step title="確認付款"></gk-step>
  <gk-step title="完成"></gk-step>
</gk-steps>`,
  description: `<gk-steps current="2">
  <gk-step title="選擇方案" description="已選專案版年繳"></gk-step>
  <gk-step title="帳務資訊" description="發票與聯絡人"></gk-step>
  <gk-step title="付款方式" description="信用卡或轉帳"></gk-step>
  <gk-step title="完成訂閱" description="寄送確認信"></gk-step>
</gk-steps>`,
  vertical: `<gk-steps direction="vertical" current="1">
  <gk-step title="建立專案" description="名稱與可見性已設定"></gk-step>
  <gk-step title="邀請成員" description="加入協作者與權限"></gk-step>
  <gk-step title="同步儲存庫" description="連接 Git remote"></gk-step>
</gk-steps>`,
  error: `<gk-steps current="1" status="error">
  <gk-step title="上傳檔案"></gk-step>
  <gk-step title="驗證內容" description="格式不符，請修正"></gk-step>
  <gk-step title="發佈"></gk-step>
</gk-steps>`,
  clickable: `<gk-steps clickable :current="step" @update:current="onStep">...</gk-steps>`,
  sizes: `<gk-steps size="sm" current="1">...</gk-steps>`,
  icon: `<gk-step title="開始"><span slot="icon">★</span></gk-step>`,
};
</script>

# Steps 步驟條

精靈、導覽與結帳用的有序進度。**完成**是成功綠勾，**進行中**維持品牌金，金色只代表「你在這裡」。

## 示範

<DemoCard title="水平" :code="codes.basic">
  <template #description>
    <code>current</code> 從 0 起算。較早的步驟是完成，目前步驟是進行中，後面的步驟等待。
  </template>
  <gk-steps current="1" style="width:100%">
    <gk-step title="填寫資料"></gk-step>
    <gk-step title="確認付款"></gk-step>
    <gk-step title="完成"></gk-step>
  </gk-steps>
</DemoCard>

<DemoCard title="含說明" :code="codes.description">
  <template #description>
    <code>description</code> 在標題下方。也可以用插槽。
  </template>
  <gk-steps current="2" style="width:100%">
    <gk-step title="選擇方案" description="已選專案版年繳"></gk-step>
    <gk-step title="帳務資訊" description="發票與聯絡人"></gk-step>
    <gk-step title="付款方式" description="信用卡或轉帳"></gk-step>
    <gk-step title="完成訂閱" description="寄送確認信"></gk-step>
  </gk-steps>
</DemoCard>

<DemoCard title="垂直" :code="codes.vertical">
  <template #description>
    <code>direction="vertical"</code> 讓說明有更多空間。連接線在標題旁垂直延伸。
  </template>
  <gk-steps direction="vertical" current="1">
    <gk-step title="建立專案" description="名稱與可見性已設定"></gk-step>
    <gk-step title="邀請成員" description="加入協作者與權限"></gk-step>
    <gk-step title="同步儲存庫" description="連接 Git remote"></gk-step>
  </gk-steps>
</DemoCard>

<DemoCard title="錯誤" :code="codes.error">
  <template #description>
    <code>status="error"</code> 套在目前步驟。較早的步驟仍是完成。切換步驟不會自動清掉明確的錯誤狀態，請在應用裡把 <code>status</code> 設回 <code>process</code>。
  </template>
  <gk-steps current="1" status="error" style="width:100%">
    <gk-step title="上傳檔案"></gk-step>
    <gk-step title="驗證內容" description="格式不符，請修正"></gk-step>
    <gk-step title="發佈"></gk-step>
  </gk-steps>
</DemoCard>

<DemoCard title="可返回" :code="codes.clickable">
  <template #description>
    <code>clickable</code> 時，只有較早的步驟可以啟動。目前步驟與後面的步驟不會發出 <code>update:current</code>。Enter 與空白鍵可啟動聚焦的步驟。
  </template>
  <gk-steps clickable :current="step" style="width:100%" @update:current="onStep">
    <gk-step title="步驟一"></gk-step>
    <gk-step title="步驟二"></gk-step>
    <gk-step title="步驟三"></gk-step>
  </gk-steps>
</DemoCard>

<DemoCard title="尺寸" :code="codes.sizes">
  <template #description>
    圓圈在 <code>sm</code> / <code>md</code> / <code>lg</code> 為 24 / 28 / 32。
  </template>
  <div style="display:grid;gap:18px;width:100%">
    <gk-steps size="sm" current="1">
      <gk-step title="開始"></gk-step>
      <gk-step title="進行"></gk-step>
      <gk-step title="結束"></gk-step>
    </gk-steps>
    <gk-steps size="lg" current="1">
      <gk-step title="開始"></gk-step>
      <gk-step title="進行"></gk-step>
      <gk-step title="結束"></gk-step>
    </gk-steps>
  </div>
</DemoCard>

<DemoCard title="自訂圖示" :code="codes.icon">
  <template #description>
    在步驟上使用 <code>icon</code> 插槽，可取代數字、勾或錯誤標記。
  </template>
  <gk-steps current="1" style="width:100%">
    <gk-step title="開始">
      <span slot="icon">★</span>
    </gk-step>
    <gk-step title="審核"></gk-step>
    <gk-step title="送出"></gk-step>
  </gk-steps>
</DemoCard>

## API

### Steps 屬性

| 屬性 | 型別 | 預設 |
|------|------|------|
| `current` | `number` | `0` |
| `status` | `'wait' \| 'process' \| 'finish' \| 'error'` | `'process'` |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `clickable` | `boolean` | `false` |
| `items` | `{ title, description?, status?, key? }[]` | — |

有插槽的 `gk-step` 時，優先於 `items`。步驟自己的 `status` 會覆寫由 `current` 推導的狀態。

### Step 屬性

| 屬性 | 型別 | 預設 |
|------|------|------|
| `title` | `string` | `''` |
| `description` | `string` | `''` |
| `status` | `'wait' \| 'process' \| 'finish' \| 'error' \| ''` | `''` |

### 插槽

| 名稱 | 說明 |
|------|------|
| default | `gk-step` |
| `icon` | 取代指示圖示 |
| `title` | 標題 |
| `description` | 說明 |

### 事件

| 名稱 | Detail |
|------|--------|
| `update:current` | 可到達的步驟被啟動時為 `{ current }` |
| `change` | `{ current }`，與 `update:current` 同時 |

### CSS parts

`root`、`list`、`item`、`indicator`、`connector`、`title`、`description`。

### 無障礙

- 根節點是 `nav`。名稱依文件語言：「Steps」或「步驟」。可在宿主上用 `aria-label` 覆寫。
- 每個步驟是 `listitem`。名稱包含序號、狀態與標題，例如「步驟 2，進行中：付款」。
- 目前步驟有 `aria-current="step"`。
- 指示與連接線為 `aria-hidden`。
