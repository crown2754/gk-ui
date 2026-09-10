<script setup lang="ts">
import { withBase } from "vitepress";

const owl = withBase("/owl.png");
const logo2 =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%232080f0' width='100' height='100'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%23fff'/%3E%3Cpath fill='%23fff' d='M20 88c4-22 20-32 30-32s26 10 30 32'/%3E%3C/svg%3E";
const logo3 =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f0a020' width='100' height='100'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%23fff'/%3E%3Cpath fill='%23fff' d='M20 88c4-22 20-32 30-32s26 10 30 32'/%3E%3C/svg%3E";

const codes = {
  size: `<gk-avatar size="sm" round src="${owl}" alt="貓頭鷹"></gk-avatar>
<gk-avatar size="md" round src="${owl}" alt="貓頭鷹"></gk-avatar>
<gk-avatar size="lg" round src="${owl}" alt="貓頭鷹"></gk-avatar>
<gk-avatar size="48" round src="${owl}" alt="貓頭鷹"></gk-avatar>`,
  shape: `<gk-avatar src="${owl}" alt="貓頭鷹"></gk-avatar>
<gk-avatar round src="${owl}" alt="貓頭鷹"></gk-avatar>
<gk-avatar round>AB</gk-avatar>`,
  color: `<gk-avatar color="#18a058">GK</gk-avatar>
<gk-avatar color="#2080f0" round>UI</gk-avatar>
<gk-avatar color="#d03050" round>ER</gk-avatar>`,
  icon: `<gk-avatar round color="#18a058">
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"/>
  </svg>
</gk-avatar>
<gk-avatar color="#2080f0">
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2 2 7l10 5 10-5-10-5Zm0 9.2L4.2 7.4 12 3.5l7.8 3.9L12 11.2Zm0 2.1 8-4v7.2c0 1.1-3.6 2.5-8 2.5s-8-1.4-8-2.5V9.3l8 4Z"/>
  </svg>
</gk-avatar>`,
  fallback: `<gk-avatar src="/broken-avatar.png" alt="遺失">FB</gk-avatar>
<gk-avatar round src="/broken-avatar.png" color="#18a058">NA</gk-avatar>`,
  group: `<gk-avatar-group max="3" size="md">
  <gk-avatar round src="${owl}" alt="貓頭鷹"></gk-avatar>
  <gk-avatar round src="${logo2}" alt="B"></gk-avatar>
  <gk-avatar round src="${logo3}" alt="C"></gk-avatar>
  <gk-avatar round color="#18a058">D</gk-avatar>
  <gk-avatar round color="#2080f0">E</gk-avatar>
  <gk-avatar round slot="overflow" color="rgba(46, 51, 56, 0.12)">+2</gk-avatar>
</gk-avatar-group>`,
};
</script>

# Avatar 頭像

頭像用來顯示使用者圖片、縮寫或圖示。可搭配 `gk-avatar-group` 做重疊排列與溢出顯示。

## 示範

<DemoCard title="尺寸" :code="codes.size">
  <template #description>
    支援具名尺寸 <code>sm</code>、<code>md</code>、<code>lg</code>，或以 <code>size="48"</code> 指定像素。直式照片預設使用 <code>object-fit: cover</code>。
  </template>
  <gk-avatar size="sm" round :src="owl" alt="貓頭鷹"></gk-avatar>
  <gk-avatar size="md" round :src="owl" alt="貓頭鷹"></gk-avatar>
  <gk-avatar size="lg" round :src="owl" alt="貓頭鷹"></gk-avatar>
  <gk-avatar size="48" round :src="owl" alt="貓頭鷹"></gk-avatar>
</DemoCard>

<DemoCard title="形狀" :code="codes.shape">
  <template #description>
    預設為小圓角；加上 <code>round</code> 則為圓形。
  </template>
  <gk-avatar :src="owl" alt="貓頭鷹"></gk-avatar>
  <gk-avatar round :src="owl" alt="貓頭鷹"></gk-avatar>
  <gk-avatar round>AB</gk-avatar>
</DemoCard>

<DemoCard title="顏色" :code="codes.color">
  <template #description>
    顯示縮寫或圖示時，可用 <code>color</code> 設定背景色。
  </template>
  <gk-avatar color="#18a058">GK</gk-avatar>
  <gk-avatar color="#2080f0" round>UI</gk-avatar>
  <gk-avatar color="#d03050" round>ER</gk-avatar>
</DemoCard>

<DemoCard title="圖示" :code="codes.icon">
  <template #description>
    在預設 slot 放入任意圖示（inline SVG、emoji 等）。元件不內建圖示庫。
  </template>
  <gk-avatar round color="#18a058">
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"/>
    </svg>
  </gk-avatar>
  <gk-avatar color="#2080f0">
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2 2 7l10 5 10-5-10-5Zm0 9.2L4.2 7.4 12 3.5l7.8 3.9L12 11.2Zm0 2.1 8-4v7.2c0 1.1-3.6 2.5-8 2.5s-8-1.4-8-2.5V9.3l8 4Z"/>
    </svg>
  </gk-avatar>
</DemoCard>

<DemoCard title="失敗回退" :code="codes.fallback">
  <template #description>
    當 <code>src</code> 載入失敗時，改顯示預設 slot（例如縮寫）。
  </template>
  <gk-avatar src="/broken-avatar.png" alt="遺失">FB</gk-avatar>
  <gk-avatar round src="/broken-avatar.png" color="#18a058">NA</gk-avatar>
</DemoCard>

<DemoCard title="頭像群組" :code="codes.group">
  <template #description>
    <code>max</code> 限制可見頭像數。溢出可用 <code>overflow</code> slot 自訂（此例 5 顆、<code>max="3"</code> → <code>+2</code>）。群組也會反映剩餘數量 <code>rest</code>。
  </template>
  <gk-avatar-group max="3" size="md">
    <gk-avatar round :src="owl" alt="貓頭鷹"></gk-avatar>
    <gk-avatar round :src="logo2" alt="B"></gk-avatar>
    <gk-avatar round :src="logo3" alt="C"></gk-avatar>
    <gk-avatar round color="#18a058">D</gk-avatar>
    <gk-avatar round color="#2080f0">E</gk-avatar>
    <gk-avatar round slot="overflow" color="rgba(46, 51, 56, 0.12)">+2</gk-avatar>
  </gk-avatar-group>
</DemoCard>

## API

### Avatar Props

| Prop | 型別 | 預設值 |
|------|------|---------|
| `src` | `string` | — |
| `alt` | `string` | `''` |
| `size` | `'sm' \| 'md' \| 'lg' \| \`${number}\`` | `'md'` |
| `round` | `boolean` | `false` |
| `color` | `string` | — |
| `object-fit` | `string` | `'cover'` |

### Avatar Slots

| 名稱 | 說明 |
|------|-------------|
| default | 無圖片時的縮寫、圖示或回退內容 |

### Avatar CSS Parts

| Part | 說明 |
|------|-------------|
| `base` | 外層表面 |
| `image` | `src` 載入成功時的 `<img>` |
| `content` | 預設 slot 的包裝 |

### AvatarGroup Props

| Prop | 型別 | 預設值 |
|------|------|---------|
| `max` | `number` | — |
| `size` | `'sm' \| 'md' \| 'lg' \| \`${number}\`` | — |
| `rest` | `number`（reflect） | `0` |

群組設定 `size` 時，會套用到子頭像以保持重疊一致。

### AvatarGroup Slots

| 名稱 | 說明 |
|------|-------------|
| default | `gk-avatar` 子元素 |
| overflow | 自訂溢出 UI（例如 `+N`）；`rest > 0` 時顯示 |
