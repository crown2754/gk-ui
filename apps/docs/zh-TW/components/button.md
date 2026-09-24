<script setup lang="ts">
const codes = {
  basic: `<gk-button variant="secondary">預設</gk-button>
<gk-button variant="primary">主要</gk-button>
<gk-button variant="info">資訊</gk-button>
<gk-button variant="success">成功</gk-button>
<gk-button variant="warning">警告</gk-button>
<gk-button variant="danger">危險</gk-button>
<gk-button variant="ghost">隱身</gk-button>`,
  size: `<gk-button size="sm">小</gk-button>
<gk-button size="md">中</gk-button>
<gk-button size="lg">大</gk-button>`,
  disabled: `<gk-button disabled>停用</gk-button>
<gk-button variant="primary" disabled>主要</gk-button>
<gk-button variant="danger" disabled>危險</gk-button>`,
  loading: `<gk-button loading>載入中</gk-button>
<gk-button variant="primary" loading>主要</gk-button>
<gk-button variant="info" loading>資訊</gk-button>`,
  ghost: `<gk-button variant="ghost">Ghost</gk-button>
<gk-button variant="ghost" size="lg">大型 Ghost</gk-button>`,
  tag: `<gk-button href="/zh-TW/guide/getting-started">快速開始</gk-button>
<gk-button variant="info" href="/zh-TW/components/button">按鈕文件</gk-button>`,
  secondaryMode: `<gk-button secondary>預設</gk-button>
<gk-button variant="primary" secondary>主要</gk-button>
<gk-button variant="info" secondary>資訊</gk-button>
<gk-button variant="success" secondary>成功</gk-button>
<gk-button variant="warning" secondary>警告</gk-button>
<gk-button variant="danger" secondary>危險</gk-button>`,
  dashed: `<gk-button dashed>預設</gk-button>
<gk-button variant="primary" dashed>主要</gk-button>
<gk-button variant="info" dashed>資訊</gk-button>
<gk-button variant="success" dashed>成功</gk-button>
<gk-button variant="warning" dashed>警告</gk-button>
<gk-button variant="danger" dashed>危險</gk-button>`,
  quaternary: `<gk-button quaternary>更多</gk-button>
<gk-button quaternary aria-label="更多操作">⋯</gk-button>`,
  textMode: `<gk-button text>預設</gk-button>
<gk-button variant="primary" text>主要</gk-button>
<gk-button variant="info" text>資訊</gk-button>
<gk-button variant="success" text>成功</gk-button>
<gk-button variant="warning" text>警告</gk-button>
<gk-button variant="danger" text>危險</gk-button>`,
  group: `<gk-button-group>
  <gk-button variant="secondary">左</gk-button>
  <gk-button variant="secondary">中</gk-button>
  <gk-button variant="secondary">右</gk-button>
</gk-button-group>
<gk-button-group>
  <gk-button variant="primary">Live a</gk-button>
  <gk-button variant="primary">Sufficient</gk-button>
  <gk-button variant="primary">Life</gk-button>
</gk-button-group>`,
};
</script>

# Button 按鈕

按鈕用來觸發動作。

## 示範

<DemoCard title="基礎" :code="codes.basic">
  <template #description>
    提供 <code>secondary</code>、<code>primary</code>、<code>info</code>、<code>success</code>、<code>warning</code>、<code>danger</code> 與 <code>ghost</code> 等類型。
  </template>
  <gk-button variant="secondary">預設</gk-button>
  <gk-button variant="primary">主要</gk-button>
  <gk-button variant="info">資訊</gk-button>
  <gk-button variant="success">成功</gk-button>
  <gk-button variant="warning">警告</gk-button>
  <gk-button variant="danger">危險</gk-button>
  <gk-button variant="ghost">隱身</gk-button>
</DemoCard>

<DemoCard title="次要樣式" :code="codes.secondaryMode">
  <template #description>
    次要樣式按鈕的填色比實心變體更淺。
  </template>
  <gk-button secondary>預設</gk-button>
  <gk-button variant="primary" secondary>主要</gk-button>
  <gk-button variant="info" secondary>資訊</gk-button>
  <gk-button variant="success" secondary>成功</gk-button>
  <gk-button variant="warning" secondary>警告</gk-button>
  <gk-button variant="danger" secondary>危險</gk-button>
</DemoCard>

<DemoCard title="尺寸" :code="codes.size">
  <template #description>
    尺寸可為 <code>sm</code>、<code>md</code> 與 <code>lg</code>。
  </template>
  <gk-button size="sm">小</gk-button>
  <gk-button size="md">中</gk-button>
  <gk-button size="lg">大</gk-button>
</DemoCard>

<DemoCard title="虛線" :code="codes.dashed">
  <template #description>
    虛線按鈕使用虛線邊框樣式。
  </template>
  <gk-button dashed>預設</gk-button>
  <gk-button variant="primary" dashed>主要</gk-button>
  <gk-button variant="info" dashed>資訊</gk-button>
  <gk-button variant="success" dashed>成功</gk-button>
  <gk-button variant="warning" dashed>警告</gk-button>
  <gk-button variant="danger" dashed>危險</gk-button>
</DemoCard>

<DemoCard title="文字樣式" :code="codes.textMode">
  <template #description>
    文字樣式按鈕在懸停前沒有背景或邊框。
  </template>
  <gk-button text>預設</gk-button>
  <gk-button variant="primary" text>主要</gk-button>
  <gk-button variant="info" text>資訊</gk-button>
  <gk-button variant="success" text>成功</gk-button>
  <gk-button variant="warning" text>警告</gk-button>
  <gk-button variant="danger" text>危險</gk-button>
</DemoCard>

<DemoCard title="Quaternary" :code="codes.quaternary">
  <template #description>
    <code>quaternary</code> 是安靜的透明按鈕（對齊 Naive quaternary），適合圖示或選單觸發器。
  </template>
  <gk-button quaternary>更多</gk-button>
  <gk-button quaternary aria-label="更多操作">⋯</gk-button>
</DemoCard>

<DemoCard title="停用" :code="codes.disabled">
  <template #description>
    按鈕可設為停用。
  </template>
  <gk-button disabled>停用</gk-button>
  <gk-button variant="primary" disabled>主要</gk-button>
  <gk-button variant="danger" disabled>危險</gk-button>
</DemoCard>

<DemoCard title="載入中" :code="codes.loading">
  <template #description>
    按鈕可顯示載入狀態。
  </template>
  <gk-button loading>載入中</gk-button>
  <gk-button variant="primary" loading>主要</gk-button>
  <gk-button variant="info" loading>資訊</gk-button>
</DemoCard>

<DemoCard title="Ghost" :code="codes.ghost">
  <template #description>
    Ghost 按鈕為透明背景。
  </template>
  <gk-button variant="ghost">Ghost</gk-button>
  <gk-button variant="ghost" size="lg">大型 Ghost</gk-button>
</DemoCard>

<DemoCard title="標籤／連結" :code="codes.tag">
  <template #description>
    透過 <code>href</code> 可把按鈕渲染成連結。
  </template>
  <gk-button href="/zh-TW/guide/getting-started">快速開始</gk-button>
  <gk-button variant="info" href="/zh-TW/components/button">按鈕文件</gk-button>
</DemoCard>

<DemoCard title="按鈕群組" :code="codes.group">
  <template #description>
    使用 <code>gk-button-group</code> 將相關按鈕分組。
  </template>
  <gk-button-group>
    <gk-button variant="secondary">左</gk-button>
    <gk-button variant="secondary">中</gk-button>
    <gk-button variant="secondary">右</gk-button>
  </gk-button-group>
  <gk-button-group>
    <gk-button variant="primary">Live a</gk-button>
    <gk-button variant="primary">Sufficient</gk-button>
    <gk-button variant="primary">Life</gk-button>
  </gk-button-group>
</DemoCard>

<DemoCard title="互動場">
  <template #description>
    自由組合屬性並即時預覽。
  </template>
  <ButtonDemo />
</DemoCard>

## API

### Button Props

| Prop | 型別 | 預設值 |
|------|------|---------|
| `variant` | `'primary' \| 'secondary' \| 'info' \| 'success' \| 'warning' \| 'danger' \| 'ghost'` | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` |
| `disabled` | `boolean` | `false` |
| `loading` | `boolean` | `false` |
| `secondary` | `boolean` | `false` |
| `dashed` | `boolean` | `false` |
| `text` | `boolean` | `false` |
| `quaternary` | `boolean` | `false` |
| `href` | `string` | — |

### Button Slots

| 名稱 | 說明 |
|------|-------------|
| default | 按鈕文字內容 |

### ButtonGroup

| 名稱 | 說明 |
|------|-------------|
| default | 分組的 `gk-button` 子元素 |

### CSS Parts

| Part | 說明 |
|------|-------------|
| `base` | 可互動元素（`button` 或 `a`） |
| `label` | 標籤容器 |
| `spinner` | 載入指示器 |
