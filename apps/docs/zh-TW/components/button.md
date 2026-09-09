# Button 按鈕

按鈕用來觸發動作。

## 示範

<DemoCard title="基礎">
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

<DemoCard title="尺寸">
  <template #description>
    尺寸可為 <code>sm</code>、<code>md</code> 與 <code>lg</code>。
  </template>
  <gk-button size="sm">小</gk-button>
  <gk-button size="md">中</gk-button>
  <gk-button size="lg">大</gk-button>
</DemoCard>

<DemoCard title="停用">
  <template #description>
    按鈕可設為停用。
  </template>
  <gk-button disabled>停用</gk-button>
  <gk-button variant="primary" disabled>主要</gk-button>
  <gk-button variant="danger" disabled>危險</gk-button>
</DemoCard>

<DemoCard title="載入中">
  <template #description>
    按鈕可顯示載入狀態。
  </template>
  <gk-button loading>載入中</gk-button>
  <gk-button variant="primary" loading>主要</gk-button>
  <gk-button variant="info" loading>資訊</gk-button>
</DemoCard>

<DemoCard title="Ghost">
  <template #description>
    Ghost 按鈕為透明背景。
  </template>
  <gk-button variant="ghost">Ghost</gk-button>
  <gk-button variant="ghost" size="lg">大型 Ghost</gk-button>
</DemoCard>

<DemoCard title="標籤／連結">
  <template #description>
    透過 <code>href</code> 可把按鈕渲染成連結。
  </template>
  <gk-button href="/zh-TW/guide/getting-started">快速開始</gk-button>
  <gk-button variant="info" href="/zh-TW/components/button">按鈕文件</gk-button>
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
| `href` | `string` | — |

### Button Slots

| 名稱 | 說明 |
|------|-------------|
| default | 按鈕文字內容 |

### CSS Parts

| Part | 說明 |
|------|-------------|
| `base` | 可互動元素（`button` 或 `a`） |
| `label` | 標籤容器 |
| `spinner` | 載入指示器 |
