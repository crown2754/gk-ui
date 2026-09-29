<script setup lang="ts">
const codes = {
  basic: `<gk-progress percentage="30"></gk-progress>
<gk-progress percentage="65"></gk-progress>`,
  status: `<gk-progress percentage="100" status="success"></gk-progress>
<gk-progress percentage="72" status="warning"></gk-progress>
<gk-progress percentage="40" status="error"></gk-progress>`,
  indicator: `<gk-progress percentage="48"></gk-progress>
<gk-progress percentage="48" show-indicator="false"></gk-progress>`,
  inside: `<gk-progress percentage="80" indicator-placement="inside"></gk-progress>`,
  circle: `<gk-progress type="circle" percentage="100" status="success"></gk-progress>`,
  sizes: `<gk-progress size="sm" percentage="55"></gk-progress>`,
  processing: `<gk-progress percentage="48" processing></gk-progress>`,
};
</script>

# Progress 進度條

上傳、任務與精簡儀表板用的確定進度。預設填色是**品牌金**，與主要按鈕同一套語言。成功、警告、錯誤使用語意色。預設不是 info 藍。

## 示範

<DemoCard title="直線" :code="codes.basic">
  <template #description>
    <code>type</code> 預設 <code>line</code>。軌道是中性灰，填色是品牌金。
  </template>
  <div style="display:grid;gap:14px;width:100%">
    <gk-progress percentage="30" label="上傳"></gk-progress>
    <gk-progress percentage="65" label="上傳"></gk-progress>
  </div>
</DemoCard>

<DemoCard title="狀態" :code="codes.status">
  <template #description>
    <code>success</code>、<code>warning</code>、<code>error</code> 會改填色。百分比到 100 不會自動改狀態。
  </template>
  <div style="display:grid;gap:14px;width:100%">
    <gk-progress percentage="100" status="success" label="完成"></gk-progress>
    <gk-progress percentage="72" status="warning" label="審核"></gk-progress>
    <gk-progress percentage="40" status="error" label="失敗"></gk-progress>
  </div>
</DemoCard>

<DemoCard title="百分比" :code="codes.indicator">
  <template #description>
    <code>show-indicator</code> 預設顯示百分比。設 <code>show-indicator="false"</code> 可隱藏。
  </template>
  <div style="display:grid;gap:14px;width:100%">
    <gk-progress percentage="48"></gk-progress>
    <gk-progress percentage="48" show-indicator="false" label="處理中"></gk-progress>
  </div>
</DemoCard>

<DemoCard title="軌道內文字" :code="codes.inside">
  <template #description>
    <code>indicator-placement="inside"</code> 只用於直線。軌道加高到 18px。達到 60% 以上時，文字落在填色上。
  </template>
  <gk-progress percentage="80" indicator-placement="inside" label="同步"></gk-progress>
</DemoCard>

<DemoCard title="圓形" :code="codes.circle">
  <template #description>
    直徑為 64 / 96 / 120。<code>indicator</code> 插槽可取代中央文字。
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:28px;align-items:center;width:100%">
    <gk-progress type="circle" percentage="45" label="載入"></gk-progress>
    <gk-progress type="circle" percentage="70" label="進行中"></gk-progress>
    <gk-progress type="circle" percentage="100" status="success" label="完成"></gk-progress>
    <gk-progress type="circle" percentage="25" status="error" label="失敗">
      <span slot="indicator">失敗</span>
    </gk-progress>
  </div>
</DemoCard>

<DemoCard title="尺寸" :code="codes.sizes">
  <template #description>
    直線高度 6 / 8 / 10。<code>height</code> 可覆寫。圓形筆畫預設 5 / 6 / 7，可用 <code>stroke-width</code> 覆寫。
  </template>
  <div style="display:grid;gap:14px;width:100%">
    <gk-progress size="sm" percentage="55"></gk-progress>
    <gk-progress size="md" percentage="55"></gk-progress>
    <gk-progress size="lg" percentage="55"></gk-progress>
  </div>
</DemoCard>

<DemoCard title="處理中閃光" :code="codes.processing">
  <template #description>
    <code>processing</code> 在填色上加一層閃光。<code>prefers-reduced-motion</code> 會關掉閃光與寬度過渡。不確定進度不在 v1。
  </template>
  <gk-progress percentage="48" processing label="上傳中"></gk-progress>
</DemoCard>

## API

### 屬性

| 屬性 | 型別 | 預設 |
|------|------|------|
| `type` | `'line' \| 'circle'` | `'line'` |
| `percentage` | `number` | `0` |
| `status` | `'default' \| 'success' \| 'error' \| 'warning'` | `'default'` |
| `show-indicator` | `boolean` | `true` |
| `indicator-placement` | `'outside' \| 'inside'` | `'outside'` |
| `height` | `number` | `0`（用尺寸預設） |
| `stroke-width` | `number` | `0`（用尺寸預設） |
| `processing` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `label` | `string` | `''` |

`percentage` 會夾在 0–100。非有限數值變成 0。v1 沒有事件，由應用綁定 `percentage`。

### 插槽

| 名稱 | 說明 |
|------|------|
| `indicator` | 取代百分比文字 |

### CSS parts

`root`、`track`、`fill`、`indicator`、`circle`、`trail`、`path`。

### 無障礙

- 宿主是 `role="progressbar"`，並帶 `aria-valuemin="0"`、`aria-valuemax="100"`、`aria-valuenow`。
- `label` 會寫入 `aria-label`。`label` 為空時，保留宿主上原有的 `aria-label`。
