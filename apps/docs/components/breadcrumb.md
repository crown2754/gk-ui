<script setup lang="ts">
const codes = {
  basic: `<gk-breadcrumb>
  <gk-breadcrumb-item href="/">Home</gk-breadcrumb-item>
  <gk-breadcrumb-item href="/products">Products</gk-breadcrumb-item>
  <gk-breadcrumb-item>Breadcrumb</gk-breadcrumb-item>
</gk-breadcrumb>`,
  href: `<gk-breadcrumb>
  <gk-breadcrumb-item href="/">Home</gk-breadcrumb-item>
  <gk-breadcrumb-item key="library">Library</gk-breadcrumb-item>
  <gk-breadcrumb-item>Current</gk-breadcrumb-item>
</gk-breadcrumb>`,
  separator: `<gk-breadcrumb>
  <span slot="separator">·</span>
  <gk-breadcrumb-item href="#org">Org</gk-breadcrumb-item>
  <gk-breadcrumb-item>Team</gk-breadcrumb-item>
</gk-breadcrumb>`,
  sizes: `<gk-breadcrumb size="sm">...</gk-breadcrumb>
<gk-breadcrumb size="md">...</gk-breadcrumb>
<gk-breadcrumb size="lg">...</gk-breadcrumb>`,
  wrap: `<gk-breadcrumb>
  <gk-breadcrumb-item href="#a">Organization</gk-breadcrumb-item>
  <gk-breadcrumb-item href="#b">Asia Pacific</gk-breadcrumb-item>
  <gk-breadcrumb-item href="#c">Taiwan</gk-breadcrumb-item>
  <gk-breadcrumb-item href="#d">Taipei office</gk-breadcrumb-item>
  <gk-breadcrumb-item href="#e">Specialists</gk-breadcrumb-item>
  <gk-breadcrumb-item>gk-ui Wave 5</gk-breadcrumb-item>
</gk-breadcrumb>`,
  header: `<header>
  <gk-breadcrumb>
    <gk-breadcrumb-item href="#console">Console</gk-breadcrumb-item>
    <gk-breadcrumb-item href="#orders">Orders</gk-breadcrumb-item>
    <gk-breadcrumb-item>#ORD-20481</gk-breadcrumb-item>
  </gk-breadcrumb>
  <h2>Order detail</h2>
</header>`,
};
</script>

# Breadcrumb

Horizontal location trail. Earlier items are links; the last item is the current page and is not a link. In Chinese this component is 麵包屑.

The separator is a **chevron**, not a slash. Text is 13 / 14 / 15px at `sm` / `md` / `lg`.

## Demos

<DemoCard title="Basic" :code="codes.basic">
  <template #description>
    The last item is <code>aria-current="page"</code>. Separators are hidden from assistive tech.
  </template>
  <gk-breadcrumb>
    <gk-breadcrumb-item href="/">Home</gk-breadcrumb-item>
    <gk-breadcrumb-item href="/products">Products</gk-breadcrumb-item>
    <gk-breadcrumb-item>Breadcrumb</gk-breadcrumb-item>
  </gk-breadcrumb>
</DemoCard>

<DemoCard title="Links and select" :code="codes.href">
  <template #description>
    An item with <code>href</code> is a normal link and does not emit <code>select</code>. Without <code>href</code>, the item is a button and emits <code>select</code> with <code>{ key, item }</code>.
  </template>
  <gk-breadcrumb>
    <gk-breadcrumb-item href="/">Home</gk-breadcrumb-item>
    <gk-breadcrumb-item key="library">Library</gk-breadcrumb-item>
    <gk-breadcrumb-item>Current</gk-breadcrumb-item>
  </gk-breadcrumb>
</DemoCard>

<DemoCard title="Custom separator" :code="codes.separator">
  <template #description>
    The <code>separator</code> slot replaces the chevron. Any other <code>separator</code> string is drawn as text.
  </template>
  <gk-breadcrumb>
    <span slot="separator">·</span>
    <gk-breadcrumb-item href="#org">Organization</gk-breadcrumb-item>
    <gk-breadcrumb-item href="#team">Team</gk-breadcrumb-item>
    <gk-breadcrumb-item>People</gk-breadcrumb-item>
  </gk-breadcrumb>
</DemoCard>

<DemoCard title="Sizes" :code="codes.sizes">
  <template #description>
    <code>sm</code> 13px, <code>md</code> 14px (default), <code>lg</code> 15px. The chevron grows slightly at <code>lg</code>.
  </template>
  <div style="display:grid;gap:10px;width:100%">
    <gk-breadcrumb size="sm">
      <gk-breadcrumb-item href="#home">Home</gk-breadcrumb-item>
      <gk-breadcrumb-item href="#settings">Settings</gk-breadcrumb-item>
      <gk-breadcrumb-item>Account</gk-breadcrumb-item>
    </gk-breadcrumb>
    <gk-breadcrumb size="md">
      <gk-breadcrumb-item href="#home">Home</gk-breadcrumb-item>
      <gk-breadcrumb-item href="#settings">Settings</gk-breadcrumb-item>
      <gk-breadcrumb-item>Account</gk-breadcrumb-item>
    </gk-breadcrumb>
    <gk-breadcrumb size="lg">
      <gk-breadcrumb-item href="#home">Home</gk-breadcrumb-item>
      <gk-breadcrumb-item href="#settings">Settings</gk-breadcrumb-item>
      <gk-breadcrumb-item>Account</gk-breadcrumb-item>
    </gk-breadcrumb>
  </div>
</DemoCard>

<DemoCard title="Long trail" :code="codes.wrap">
  <template #description>
    The trail wraps. Separators stay with the item they follow. Collapsing with <code>max-items</code> is a follow-up and is not in v1.
  </template>
  <div style="max-width:420px">
    <gk-breadcrumb>
      <gk-breadcrumb-item href="#a">Organization</gk-breadcrumb-item>
      <gk-breadcrumb-item href="#b">Asia Pacific</gk-breadcrumb-item>
      <gk-breadcrumb-item href="#c">Taiwan</gk-breadcrumb-item>
      <gk-breadcrumb-item href="#d">Taipei office</gk-breadcrumb-item>
      <gk-breadcrumb-item href="#e">Specialists</gk-breadcrumb-item>
      <gk-breadcrumb-item>gk-ui Wave 5</gk-breadcrumb-item>
    </gk-breadcrumb>
  </div>
</DemoCard>

<DemoCard title="In a page header" :code="codes.header">
  <template #description>
    Place the trail above the page title.
  </template>
  <div style="width:100%">
    <gk-breadcrumb>
      <gk-breadcrumb-item href="#console">Console</gk-breadcrumb-item>
      <gk-breadcrumb-item href="#orders">Orders</gk-breadcrumb-item>
      <gk-breadcrumb-item>#ORD-20481</gk-breadcrumb-item>
    </gk-breadcrumb>
    <h2 style="margin:8px 0 0;font-size:1.25rem">Order detail</h2>
    <p style="margin:4px 0 0;color:var(--gk-color-text-muted, rgb(118, 124, 130))">The trail sits above the heading as the location path.</p>
  </div>
</DemoCard>

## Alpine

```html
<gk-breadcrumb>
  <gk-breadcrumb-item href="/">Home</gk-breadcrumb-item>
  <gk-breadcrumb-item>Current</gk-breadcrumb-item>
</gk-breadcrumb>
```

## API

### Breadcrumb props

| Prop | Type | Default |
|------|------|---------|
| `separator` | `string` | `'chevron'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `items` | `{ label, href?, key?, disabled? }[]` | — |

Slotted `gk-breadcrumb-item` children win over `items`. `separator="chevron"` draws the icon; any other string is text. The `separator` slot wins over both.

`max-items` collapsed overflow is not implemented in v1.

### Breadcrumb item props

| Prop | Type | Default |
|------|------|---------|
| `href` | `string` | `''` |
| `key` | `string` | `''` |
| `disabled` | `boolean` | `false` |

### Slots

| Name | Description |
|------|-------------|
| default | `gk-breadcrumb-item` children, or the item label |
| `separator` | Custom separator node. Cloned between items |

### Events

| Name | Detail |
|------|--------|
| `select` | `{ key, item }` when an item without `href` is activated. Links navigate natively and do not emit `select`. |

### CSS parts

`root`, `list`, `item` (data API), `link`, `separator`, `current`.

### Accessibility

- The root is a `nav`. The accessible name follows the document language: “Breadcrumb” or 「麵包屑」. Set `aria-label` on the host to override it.
- Slotted trails use `role="list"`. The data API renders an `ol`.
- The current item has `aria-current="page"` and is not a link.
- Separators are `aria-hidden="true"`.
- Prior links use a soft underline in brand at 70% and a focus ring at 70% of `--gk-color-focus-ring`.
