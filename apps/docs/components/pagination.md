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

# Pagination

Pagination moves through a list or table. The active page is a solid brand fill with brand-on text, the same language as a primary Button. In Chinese this component is 分頁器, so it does not share the Tabs name 分頁.

## Demos

<DemoCard title="Basic" :code="codes.basic">
  <template #description>
    Inactive pages are transparent and pick up an 18% brand wash on hover. The current page uses <code>aria-current="page"</code>.
  </template>
  <gk-pagination page-count="5"></gk-pagination>
</DemoCard>

<DemoCard title="Many pages" :code="codes.many">
  <template #description>
    Ellipsis keeps the first page, the last page, and the pages around the current one. The total reads from <code>item-count</code>. The size picker and quick jumper match the control height.
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

<DemoCard title="Sizes" :code="codes.sizes">
  <template #description>
    <code>sm</code> / <code>md</code> / <code>lg</code> are 28 / 34 / 40, the same scale as Button.
  </template>
  <div style="display:grid;gap:0.85rem;width:100%">
    <gk-pagination size="sm" page-count="3"></gk-pagination>
    <gk-pagination size="md" page="2" page-count="3"></gk-pagination>
    <gk-pagination size="lg" page="3" page-count="3"></gk-pagination>
  </div>
</DemoCard>

<DemoCard title="Disabled" :code="codes.disabled">
  <template #description>
    <code>disabled</code> mutes the bar and sets <code>aria-disabled</code>. End buttons are also disabled when there is no previous or next page.
  </template>
  <gk-pagination page-count="2" disabled></gk-pagination>
</DemoCard>

<DemoCard title="Controlled" :code="codes.controlled">
  <template #description>
    <code>update:page</code> and <code>change</code> carry <code>{ page }</code>. <code>update:page-size</code> carries <code>{ pageSize }</code> and the page resets to 1. Arrow keys move the page when focus is on a page button.
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
    <p style="margin:0;font-size:0.875rem;color:var(--gk-color-text-muted, rgb(118, 124, 130))">Page {{ page }}, {{ pageSize }} / page</p>
  </div>
</DemoCard>

## API

### Pagination Props

| Prop | Type | Default |
|------|------|---------|
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

When `item-count` is set, the page count is `ceil(item-count / page-size)`. Otherwise `page-count` is used. `page` is clamped to `1…pageCount`. `page-sizes` accepts a comma list or a JSON array.

### Pagination Events

| Event | Detail |
|-------|--------|
| `update:page` | `{ page: number }` |
| `change` | `{ page: number }` |
| `update:page-size` | `{ pageSize: number }` |

Changing the page size resets the page to 1 and emits `update:page` when the page actually changes.

### CSS Parts

| Part | Description |
|------|-------------|
| `root` | `nav` landmark |
| `nav` | Page button group |
| `item` / `item-active` | Numbered page |
| `prev` / `next` | Chevron buttons |
| `ellipsis` | Static `…` |
| `size-picker` | Page-size select |
| `quick-jumper` | Go-to field |
| `total` | Total text |

### Accessibility

- The landmark label follows the document language: “Pagination” or 「分頁器」. Set `aria-label` on the host to override it.
- The active page has `aria-current="page"`.
- Previous / next are labeled. Disabled controls set `aria-disabled="true"`.
- The quick jumper input has its own label.
