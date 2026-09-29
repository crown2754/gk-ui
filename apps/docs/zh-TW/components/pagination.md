<script setup lang="ts">
import { ref } from "vue";

const page = ref(5);
const pageSize = ref(10);

function onPage(event: CustomEvent<{ page: number }>) {
  page.value = event.detail.page;
}

function onSize(event: CustomEvent<{ pageSize: number }>) {
  pageSize.value = event.detail.pageSize;
  page.value = 1;
}

const codes = {
  basic: `<gk-pagination page-count="5"></gk-pagination>`,
  many: `<gk-pagination
  page="5"
  item-count="128"
  page-size="10"
  show-total
  show-size-picker
  show-quick-jumper
></gk-pagination>`,
  sizes: `<gk-pagination size="sm" page-count="3"></gk-pagination>
<gk-pagination size="md" page="2" page-count="3"></gk-pagination>
<gk-pagination size="lg" page="3" page-count="3"></gk-pagination>`,
  disabled: `<gk-pagination page-count="2" disabled></gk-pagination>`,
  controlled: `<gk-pagination
  :page="page"
  :page-size="pageSize"
  item-count="128"
  show-size-picker
  show-quick-jumper
  @update:page="onPage"
  @update:page-size="onSize"
></gk-pagination>`,
};
</script>

# Pagination 分頁器

分頁器用來翻列表或表格。目前頁是品牌實心與 brand-on，和 primary Button 同一套。中文名稱是「分頁器」，不要寫成「分頁」，以免和 Tabs 分頁混淆。

## 示範

<DemoCard title="基礎" :code="codes.basic">
  <template #description>
    未選頁是透明底，hover 為 18% 品牌洗色。目前頁帶 <code>aria-current="page"</code>。
  </template>
  <gk-pagination page-count="5"></gk-pagination>
</DemoCard>

<DemoCard title="很多頁" :code="codes.many">
  <template #description>
    省略號保留第一頁、最後一頁，以及目前頁左右的頁碼。總筆數來自 <code>item-count</code>。每頁筆數與前往欄的高度跟按鈕一致。
  </template>
  <gk-pagination
    page="5"
    item-count="128"
    page-size="10"
    show-total
    show-size-picker
    show-quick-jumper
    style="width:100%"
  ></gk-pagination>
</DemoCard>

<DemoCard title="尺寸" :code="codes.sizes">
  <template #description>
    <code>sm</code> / <code>md</code> / <code>lg</code> 是 28 / 34 / 40，與 Button 相同。
  </template>
  <div style="display:grid;gap:0.85rem;width:100%">
    <gk-pagination size="sm" page-count="3"></gk-pagination>
    <gk-pagination size="md" page="2" page-count="3"></gk-pagination>
    <gk-pagination size="lg" page="3" page-count="3"></gk-pagination>
  </div>
</DemoCard>

<DemoCard title="停用" :code="codes.disabled">
  <template #description>
    <code>disabled</code> 會把整列變淡並設定 <code>aria-disabled</code>。沒有上一頁或下一頁時，兩端按鈕也會停用。
  </template>
  <gk-pagination page-count="2" disabled></gk-pagination>
</DemoCard>

<DemoCard title="受控" :code="codes.controlled">
  <template #description>
    <code>update:page</code> 與 <code>change</code> 的 detail 是 <code>{ page }</code>。<code>update:page-size</code> 是 <code>{ pageSize }</code>，並把頁碼重設為 1。焦點在頁碼按鈕時，左右方向鍵可換頁。
  </template>
  <div style="width:100%;display:grid;gap:0.75rem">
    <gk-pagination
      :page="page"
      :page-size="pageSize"
      item-count="128"
      show-total
      show-size-picker
      show-quick-jumper
      @update:page="onPage"
      @update:page-size="onSize"
    ></gk-pagination>
    <p style="margin:0;font-size:0.875rem;color:var(--gk-color-text-muted, rgb(118, 124, 130))">第 {{ page }} 頁，每頁 {{ pageSize }} 筆</p>
  </div>
</DemoCard>

## API

### Pagination 屬性

| 屬性 | 型別 | 預設 |
|------|------|------|
| `page` | `number` | `1` |
| `page-size` | `number` | `10` |
| `item-count` | `number` | — |
| `page-count` | `number` | — |
| `page-sizes` | `number[]` | `[10, 20, 30, 50]` |
| `show-size-picker` | `boolean` | `false` |
| `show-quick-jumper` | `boolean` | `false` |
| `show-total` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled` | `boolean` | `false` |
| `page-slot` | `number` | `7` |

有 `item-count` 時，頁數是 `ceil(item-count / page-size)`。否則用 `page-count`。`page` 會夾在 `1…pageCount`。`page-sizes` 可寫逗號清單或 JSON 陣列。

### Pagination 事件

| 事件 | Detail |
|------|--------|
| `update:page` | `{ page: number }` |
| `change` | `{ page: number }` |
| `update:page-size` | `{ pageSize: number }` |

每頁筆數改變時會回到第 1 頁；頁碼真的變了才會再送 `update:page`。

### CSS Parts

| Part | 說明 |
|------|------|
| `root` | `nav` 地標 |
| `nav` | 頁碼按鈕群 |
| `item` / `item-active` | 數字頁 |
| `prev` / `next` | 上一頁 / 下一頁 |
| `ellipsis` | 靜態 `…` |
| `size-picker` | 每頁筆數 |
| `quick-jumper` | 前往欄 |
| `total` | 總筆數 |

### 無障礙

- 地標名稱依文件語言：「Pagination」或「分頁器」。可在宿主上用 `aria-label` 覆寫。
- 目前頁為 `aria-current="page"`。
- 上一頁 / 下一頁有名稱。停用控制項為 `aria-disabled="true"`。
- 前往輸入框自帶標籤。
