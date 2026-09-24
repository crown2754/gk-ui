<script setup lang="ts">
import { ref } from "vue";

const last = ref("");

function onSelect(event: CustomEvent<{ key: string }>) {
  last.value = event.detail.key;
}

const codes = {
  basic: `<gk-dropdown label="更多操作" variant="primary" @select="onSelect">
  <gk-dropdown-item key="edit" shortcut="⌘E">編輯</gk-dropdown-item>
  <gk-dropdown-item key="copy" shortcut="⌘C">複製連結</gk-dropdown-item>
  <gk-dropdown-item key="archive" disabled>封存（不可用）</gk-dropdown-item>
  <gk-dropdown-item type="divider"></gk-dropdown-item>
  <gk-dropdown-item key="delete" shortcut="⌫" danger>刪除</gk-dropdown-item>
</gk-dropdown>`,
  danger: `<gk-dropdown label="更多">
  <gk-dropdown-item type="divider"></gk-dropdown-item>
  <gk-dropdown-item key="delete" danger>刪除</gk-dropdown-item>
</gk-dropdown>`,
  shortcuts: `<gk-dropdown-item key="edit" shortcut="⌘E">編輯</gk-dropdown-item>`,
  disabled: `<gk-dropdown-item key="archive" disabled>封存</gk-dropdown-item>`,
  placement: `<gk-dropdown label="位置" placement="bottom-end"></gk-dropdown>`,
  icon: `<gk-dropdown>
  <gk-button slot="trigger" quaternary aria-label="更多操作">⋯</gk-button>
  <gk-dropdown-item key="edit">編輯</gk-dropdown-item>
</gk-dropdown>`,
  text: `<gk-dropdown label="更多操作"></gk-dropdown>`,
};
</script>

# Dropdown 下拉選單

動作選單，不是表單選擇器。選單沿用 Select 清單的淡洗：白底、1px 邊框、`--gk-radius-sm`（6px）、懸停 22% 品牌色。危險列使用危險色文字與淡危險底。z-index 為 **4000**。

## 範例

<DemoCard title="文字與箭頭" :code="codes.basic">
  <template #description>
    內建觸發器是文字加箭頭。<code>variant="primary"</code> 是核准示意裡的品牌黃底；預設 variant 是下方的描邊尺寸列。選取後送出 <code>select</code>，內容為 <code>{ key, item }</code>，並關閉選單。
  </template>
  <gk-dropdown label="更多操作" variant="primary" @select="onSelect">
    <gk-dropdown-item key="edit" shortcut="⌘E">編輯</gk-dropdown-item>
    <gk-dropdown-item key="copy" shortcut="⌘C">複製連結</gk-dropdown-item>
    <gk-dropdown-item key="archive" disabled>封存（不可用）</gk-dropdown-item>
    <gk-dropdown-item type="divider"></gk-dropdown-item>
    <gk-dropdown-item key="delete" shortcut="⌫" danger>刪除</gk-dropdown-item>
  </gk-dropdown>
  <p style="margin:0;font-size:0.875rem;opacity:0.8">上次的 key：{{ last || "（無）" }}</p>
</DemoCard>

<DemoCard title="危險與分隔線" :code="codes.danger">
  <template #description>
    <code>type="divider"</code> 是分隔線。<code>danger</code> 會把該列畫成危險色。
  </template>
  <gk-dropdown label="更多">
    <gk-dropdown-item key="edit">編輯</gk-dropdown-item>
    <gk-dropdown-item key="copy">複製連結</gk-dropdown-item>
    <gk-dropdown-item type="divider"></gk-dropdown-item>
    <gk-dropdown-item key="delete" danger>刪除</gk-dropdown-item>
  </gk-dropdown>
</DemoCard>

<DemoCard title="快捷鍵提示" :code="codes.shortcuts">
  <template #description>
    <code>shortcut</code> 是右側的淡色提示，不會真的註冊鍵盤快捷鍵。
  </template>
  <gk-dropdown label="含快捷鍵">
    <gk-dropdown-item key="edit" shortcut="⌘E">編輯</gk-dropdown-item>
    <gk-dropdown-item key="copy" shortcut="⌘C">複製連結</gk-dropdown-item>
    <gk-dropdown-item key="delete" shortcut="⌫" danger>刪除</gk-dropdown-item>
  </gk-dropdown>
</DemoCard>

<DemoCard title="停用項目" :code="codes.disabled">
  <template #description>
    <code>disabled</code> 項目變淡且無法選取。方向鍵會跳過它。
  </template>
  <gk-dropdown label="含停用列">
    <gk-dropdown-item key="edit">編輯</gk-dropdown-item>
    <gk-dropdown-item key="archive" disabled>封存（不可用）</gk-dropdown-item>
    <gk-dropdown-item key="download">下載</gk-dropdown-item>
  </gk-dropdown>
</DemoCard>

<DemoCard title="位置" :code="codes.placement">
  <template #description>
    預設位置是 <code>bottom-start</code>。快超出視窗時會翻轉，與 Tooltip 使用同一個計算。
  </template>
  <div style="display:flex;justify-content:flex-end;width:100%">
    <gk-dropdown label="靠右展開" placement="bottom-end">
      <gk-dropdown-item key="view">檢視</gk-dropdown-item>
      <gk-dropdown-item key="rename">重新命名</gk-dropdown-item>
    </gk-dropdown>
  </div>
</DemoCard>

<DemoCard title="觸發器尺寸" :code="codes.text">
  <template #description>
    沒有 <code>trigger</code> slot 時，描邊按鈕顯示 <code>label</code> 與箭頭。高度跟著 <code>size</code>：28／34／40。預設尺寸是 <code>md</code>。
  </template>
  <gk-dropdown label="小" size="sm">
    <gk-dropdown-item key="view">檢視</gk-dropdown-item>
    <gk-dropdown-item key="rename">重新命名</gk-dropdown-item>
  </gk-dropdown>
  <gk-dropdown label="中">
    <gk-dropdown-item key="view">檢視</gk-dropdown-item>
  </gk-dropdown>
  <gk-dropdown label="大" size="lg">
    <gk-dropdown-item key="view">檢視</gk-dropdown-item>
  </gk-dropdown>
</DemoCard>

<DemoCard title="圖示／quaternary 觸發" :code="codes.icon">
  <template #description>
    觸發器可換成任意 slot，包含 <code>gk-button quaternary</code>。選單外觀不變。Button 原本只有 <code>text</code>、<code>dashed</code>、<code>secondary</code>，這次補上 <code>quaternary</code> 以對齊這個安靜的圖示觸發器。
  </template>
  <gk-dropdown>
    <gk-button slot="trigger" quaternary aria-label="更多操作">⋯</gk-button>
    <gk-dropdown-item key="edit">編輯</gk-dropdown-item>
    <gk-dropdown-item key="copy">複製連結</gk-dropdown-item>
    <gk-dropdown-item type="divider"></gk-dropdown-item>
    <gk-dropdown-item key="delete" danger>刪除</gk-dropdown-item>
  </gk-dropdown>
</DemoCard>

## Alpine

```html
<div x-data="{ key: '' }">
  <gk-dropdown label="更多" x-on:select="key = $event.detail.key">
    <gk-dropdown-item key="edit">編輯</gk-dropdown-item>
    <gk-dropdown-item key="copy">複製</gk-dropdown-item>
  </gk-dropdown>
  <span x-text="key"></span>
</div>
```

## API

### Dropdown 屬性

| 屬性 | 型別 | 預設 |
|------|------|------|
| `label` | `string` | `''` |
| `placement` | 位置字串 | `'bottom-start'` |
| `trigger` | `'click' \| 'hover' \| 'manual'` | `'click'` |
| `disabled` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `variant` | `'default' \| 'primary'` | `'default'` |
| `open` | `boolean` | `false` |

### 項目屬性

| 屬性 | 型別 | 預設 |
|------|------|------|
| `key` | `string` | `''` |
| `label` | `string` | `''` |
| `shortcut` | `string` | `''` |
| `type` | `'item' \| 'divider'` | `'item'` |
| `disabled` | `boolean` | `false` |
| `danger` | `boolean` | `false` |

### Slots

| 名稱 | 說明 |
|------|------|
| `trigger` | 自訂觸發器。未提供時為文字＋箭頭按鈕 |
| default | `gk-dropdown-item` |

### 事件

| 名稱 | 內容 |
|------|------|
| `select` | `{ key, item }` |
| `update:open` | 下一個 `boolean` |
| `open`／`close` | 選單開啟或關閉 |

### 鍵盤

上／下移動作用中項目，Home／End 跳到兩端，Enter 選取，Esc 關閉。點外面也會關閉。觸發器有 `aria-haspopup="menu"` 與 `aria-expanded`。項目是 `menuitem`，分隔線是 `separator`。

### CSS parts

`gk-dropdown`：`trigger`、`menu`。`gk-dropdown-item`：`item`、`label`、`shortcut`、`divider`。

選單圓角使用 `--gk-radius-sm`（0.375rem，6px），與 Select 清單相同。規格在「6px」旁寫了 `--gk-radius-md`，但該權杖是 0.5rem，因此以核准示意的 6px 與 Select 淡洗為準。
