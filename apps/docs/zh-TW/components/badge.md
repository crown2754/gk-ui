<script setup lang="ts">
const codes = {
  types: `<gk-badge value="3" aria-label="3 則未讀">
  <gk-avatar round size="lg">U</gk-avatar>
</gk-badge>
<gk-badge value="9" type="primary"><gk-avatar round size="lg">P</gk-avatar></gk-badge>`,
  dot: `<gk-badge dot type="error" aria-label="有新動態">
  <gk-button variant="secondary" aria-label="通知">…</gk-button>
</gk-badge>
<gk-badge value="12" type="primary" processing>
  <gk-button>收件匣</gk-button>
</gk-badge>`,
  max: `<gk-badge value="120"><gk-avatar round size="lg">M</gk-avatar></gk-badge>
<gk-badge value="0" show-zero type="info"><gk-avatar round size="lg">Z</gk-avatar></gk-badge>
<gk-badge value="0"><gk-avatar round size="lg">H</gk-avatar></gk-badge>`,
  solo: `<gk-badge value="上線" type="success"></gk-badge>
<gk-badge value="審核中" type="warning"></gk-badge>
<gk-badge value="NEW" type="primary"></gk-badge>`,
  offset: `<gk-badge value="8" type="error" style="--gk-badge-offset-x: 4px; --gk-badge-offset-y: 2px">
  <gk-avatar round size="lg">O</gk-avatar>
</gk-badge>`,
};
</script>

# Badge 徽章

徽章可以疊在頭像、圖示或按鈕的右上角，沒有子元素時則是一顆行內狀態膠囊。

## 示範

<DemoCard title="類型" :code="codes.types">
  <template #description>
    疊加時 <code>default</code> 是通知紅。<code>primary</code> 為品牌實心與 brand-on。warning 用 brand-on 文字，避免淺金底上看不清。
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:1.25rem 1.5rem;align-items:center;padding:0.35rem">
    <gk-badge value="3" aria-label="3 則未讀"><gk-avatar round size="lg" color="#f2ce5e">U</gk-avatar></gk-badge>
    <gk-badge value="5" type="success"><gk-avatar round size="lg" color="#d8f3e4">S</gk-avatar></gk-badge>
    <gk-badge value="2" type="warning"><gk-avatar round size="lg" color="#fde8c8">W</gk-avatar></gk-badge>
    <gk-badge value="1" type="error"><gk-avatar round size="lg" color="#f8d5dc">E</gk-avatar></gk-badge>
    <gk-badge value="8" type="info"><gk-avatar round size="lg" color="#d6e6fb">I</gk-avatar></gk-badge>
    <gk-badge value="9" type="primary"><gk-avatar round size="lg" color="#f2ce5e">P</gk-avatar></gk-badge>
  </div>
</DemoCard>

<DemoCard title="圓點、處理中、按鈕上" :code="codes.dot">
  <template #description>
    <code>dot</code> 是 8×8 圓點，會忽略 <code>value</code>。<code>processing</code> 以類型色做脈衝。只有圓點時請在宿主上給 <code>aria-label</code>。
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:1.25rem;align-items:center;padding:0.35rem">
    <gk-badge dot type="error" aria-label="有新動態">
      <gk-button variant="secondary" aria-label="通知">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>
      </gk-button>
    </gk-badge>
    <gk-badge dot type="success" processing aria-label="連線中">
      <gk-button variant="secondary" aria-label="狀態">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>
      </gk-button>
    </gk-badge>
    <gk-badge value="12" type="primary" processing>
      <gk-button type="button">收件匣</gk-button>
    </gk-badge>
  </div>
</DemoCard>

<DemoCard title="上限與顯示 0" :code="codes.max">
  <template #description>
    數字大於 <code>max</code>（預設 99）會顯示 <code>99+</code>。<code>0</code> 預設隱藏，設 <code>show-zero</code> 才顯示。字串不會被 max 截斷。右側 H 是隱藏示範。
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:1.25rem;align-items:center;padding:0.35rem">
    <gk-badge value="120"><gk-avatar round size="lg">M</gk-avatar></gk-badge>
    <gk-badge value="0" show-zero type="info"><gk-avatar round size="lg">Z</gk-avatar></gk-badge>
    <gk-badge value="0"><gk-avatar round size="lg">H</gk-avatar></gk-badge>
  </div>
</DemoCard>

<DemoCard title="獨立徽章" :code="codes.solo">
  <template #description>
    沒有子元素時是行內膠囊。獨立的 <code>default</code> 是淺灰；疊加的 <code>default</code> 仍是通知紅。
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:0.65rem;align-items:center">
    <gk-badge value="上線" type="success"></gk-badge>
    <gk-badge value="審核中" type="warning"></gk-badge>
    <gk-badge value="5" type="error"></gk-badge>
    <gk-badge dot type="info" aria-label="資訊"></gk-badge>
    <gk-badge value="NEW" type="primary"></gk-badge>
  </div>
</DemoCard>

<DemoCard title="位移" :code="codes.offset">
  <template #description>
    用 <code>--gk-badge-offset-x</code>、<code>--gk-badge-offset-y</code> 從右上角微調，或傳 <code>offset</code>（<code>"4, -2"</code> 或 <code>[4, -2]</code>）。
  </template>
  <div style="padding:0.5rem">
    <gk-badge value="8" type="error" style="--gk-badge-offset-x: 4px; --gk-badge-offset-y: 2px">
      <gk-avatar round size="lg">O</gk-avatar>
    </gk-badge>
  </div>
</DemoCard>

## API

### Badge 屬性

| 屬性 | 型別 | 預設 |
|------|------|------|
| `value` | `number \| string` | — |
| `max` | `number` | `99` |
| `dot` | `boolean` | `false` |
| `type` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` |
| `show-zero` | `boolean` | `false` |
| `processing` | `boolean` | `false` |
| `offset` | `[number, number]` | — |

`max` 只在 `value` 為數字時生效。`value="120"` 這種屬性會當成數字。空值，或 `0` 且沒有 `show-zero`，不會渲染徽章。v1 沒有事件，點擊會落到子元素。

數字膠囊高 18px、最少寬 20px，水平內距 6px（超過一個字元時 7px），字元不會貼到膠囊邊緣或白環。

### Badge 插槽

| 名稱 | 說明 |
|------|------|
| 預設 | 被疊加的子元素。省略則為獨立膠囊 |

### CSS Parts

| Part | 說明 |
|------|------|
| `root` | 行內外層 |
| `wrapper` | 包住子元素的定位層 |
| `badge` / `sup` | 膠囊或圓點 |
| `dot` | `dot` 開啟時出現在同一個節點 |
| `value` | 文字 |

### CSS 變數

| 變數 | 預設 |
|------|------|
| `--gk-badge-offset-x` | `0px` |
| `--gk-badge-offset-y` | `0px` |
| `--gk-badge-z-index` | `1` |

### 無障礙

- 數字徽章會帶「3 則未讀」這類名稱；宿主已有 `aria-label` 時改由宿主命名。
- 只有圓點時請在宿主上提供 `aria-label`。未提供時元件退回「狀態」。
- 獨立文字徽章以可見文字為名稱。不會設定 `role="status"`。
- 純圖示按鈕的點擊區請保持至少 34px。
