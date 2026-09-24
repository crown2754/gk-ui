<script setup lang="ts">
const codes = {
  placements: `<gk-tooltip content="儲存目前編輯" placement="top"><gk-button>上方</gk-button></gk-tooltip>`,
  arrow: `<gk-tooltip content="有箭頭"><gk-button>箭頭</gk-button></gk-tooltip>
<gk-tooltip arrow="false" content="無箭頭"><gk-button>無箭頭</gk-button></gk-tooltip>`,
  long: `<gk-tooltip content="較長的提示會在 240px 內換行。"><gk-button>長文</gk-button></gk-tooltip>`,
  disabled: `<gk-tooltip disabled content="不會出現"><gk-button>停用</gk-button></gk-tooltip>`,
  focus: `<gk-tooltip trigger="focus" content="僅鍵盤"><gk-button>聚焦</gk-button></gk-tooltip>`,
};
</script>

# Tooltip 提示

輕量的 hover／focus 提示。不是對話框：沒有遮罩、沒有焦點陷阱，也不會移走焦點。

預設是深色 tip（`--gk-color-on-surface` 底、`--gk-color-surface` 字），最大寬 240px、內距 6px 10px、圓角 `--gk-radius-sm`、陰影 `--gk-shadow-md`、z-index **4000**。顯示延遲預設 200ms，隱藏 100ms。

## 範例

<DemoCard title="位置" :code="codes.placements">
  <template #description>
    <code>top</code>、<code>bottom</code>、<code>left</code>、<code>right</code>，以及 <code>-start</code>／<code>-end</code>。靠近視窗邊緣時會翻轉。
  </template>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:3.5rem 2rem;padding:3rem 1rem;width:100%">
    <gk-tooltip content="儲存目前編輯" placement="top"><gk-button>上方</gk-button></gk-tooltip>
    <gk-tooltip content="展開進階選項" placement="bottom"><gk-button variant="secondary">下方</gk-button></gk-tooltip>
    <gk-tooltip content="返回上一頁" placement="left"><gk-button variant="secondary">左側</gk-button></gk-tooltip>
    <gk-tooltip content="開啟篩選面板" placement="right"><gk-button>右側</gk-button></gk-tooltip>
  </div>
</DemoCard>

<DemoCard title="箭頭" :code="codes.arrow">
  <template #description>
    <code>arrow</code>（別名 <code>show-arrow</code>）預設開啟。設 <code>arrow="false"</code> 可隱藏 8px 三角。
  </template>
  <gk-tooltip content="已存於本機"><gk-button variant="secondary">有箭頭</gk-button></gk-tooltip>
  <gk-tooltip content="沒有指標" arrow="false"><gk-button variant="secondary">無箭頭</gk-button></gk-tooltip>
</DemoCard>

<DemoCard title="長文換行" :code="codes.long">
  <template #description>
    文字在 240px 內換行，不會把字縮到難以閱讀。
  </template>
  <gk-tooltip content="篩選只套用在目前看板。離開這個畫面後會重置。">
    <gk-button variant="secondary">長提示</gk-button>
  </gk-tooltip>
</DemoCard>

<DemoCard title="停用" :code="codes.disabled">
  <template #description>
    <code>disabled</code> 時不會出現提示。
  </template>
  <gk-tooltip disabled content="你不會看到這段">
    <gk-button variant="secondary">停用</gk-button>
  </gk-tooltip>
</DemoCard>

<DemoCard title="僅聚焦" :code="codes.focus">
  <template #description>
    <code>trigger</code> 可為 <code>hover</code>、<code>focus</code> 或 <code>hover focus</code>（預設）。Esc 會隱藏提示且不移動焦點。<code>update:show</code> 帶出下一個布林值。
  </template>
  <gk-tooltip content="鍵盤聚焦時顯示" trigger="focus" delay="0">
    <gk-button variant="secondary">用 Tab 移到我</gk-button>
  </gk-tooltip>
</DemoCard>

## Alpine

```html
<gk-tooltip content="儲存" placement="top">
  <button type="button">儲存</button>
</gk-tooltip>
```

## API

### 屬性

| 屬性 | 型別 | 預設 |
|------|------|------|
| `content` | `string` | `''` |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` 與 `-start`／`-end` | `'top'` |
| `trigger` | `'hover' \| 'focus' \| 'hover focus'` | `'hover focus'` |
| `arrow`／`show-arrow` | `boolean` | `true` |
| `delay` | `number \| 'show,hide'` | 顯示 `200`／隱藏 `100` |
| `disabled` | `boolean` | `false` |
| `show` | `boolean` | `false` |

### Slots

| 名稱 | 說明 |
|------|------|
| default | 觸發器 |
| `content` | 提示內容。未提供時使用 `content` 屬性 |

### 事件

| 名稱 | 內容 |
|------|------|
| `update:show` | 下一個 `boolean` |

### CSS parts

`trigger`、`tip`、`arrow`。

顯示時 tip 為 `role="tooltip"`，並在觸發器上設定 `aria-describedby`。tip 以 `position: fixed` 留在 Shadow 內（z-index 4000），因此 `::part(tip)` 可用，也不會被未建立包含塊的 `overflow: hidden` 祖先裁切。

### 位置

偏好的一側放不下時，主軸會翻轉（上 ↔ 下、左 ↔ 右）。start／end 對齊保留，再以約 8–10px 間距夾在視窗內。
