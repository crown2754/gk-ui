<script setup lang="ts">
import { ref } from "vue";

const closableTags = ref([
  { id: "knowledge", text: "Knowledge", type: "primary", round: false, bordered: false },
  { id: "a", text: "Tag A", type: "info", round: true, bordered: false },
  { id: "remove", text: "Removable", type: "default", round: false, bordered: true },
]);

const filters = ref([
  { key: "all", label: "All", checked: true },
  { key: "design", label: "Design", checked: true },
  { key: "dev", label: "Engineering", checked: false },
  { key: "marketing", label: "Marketing", checked: false },
]);

function removeTag(id: string) {
  closableTags.value = closableTags.value.filter((tag) => tag.id !== id);
}

function onFilter(key: string, event: CustomEvent<{ checked: boolean }>) {
  const item = filters.value.find((filter) => filter.key === key);
  if (item) item.checked = event.detail.checked;
}

const codes = {
  types: `<gk-tag>Default</gk-tag>
<gk-tag type="primary">Primary</gk-tag>
<gk-tag type="success">Success</gk-tag>
<gk-tag type="warning">Warning</gk-tag>
<gk-tag type="error">Error</gk-tag>
<gk-tag type="info">Info</gk-tag>`,
  bordered: `<gk-tag bordered>Default</gk-tag>
<gk-tag type="primary" bordered>Primary</gk-tag>
<gk-tag type="success" bordered>Success</gk-tag>
<gk-tag type="warning" bordered>Warning</gk-tag>
<gk-tag type="error" bordered>Error</gk-tag>
<gk-tag type="info" bordered>Info</gk-tag>`,
  round: `<gk-tag type="primary" round>Course</gk-tag>
<gk-tag type="info" round>Live</gk-tag>
<gk-tag type="success" round>Published</gk-tag>
<gk-tag bordered round>Draft</gk-tag>`,
  sizes: `<gk-tag size="sm" type="primary">sm 22</gk-tag>
<gk-tag size="md" type="primary">md 24</gk-tag>
<gk-tag size="lg" type="primary">lg 28</gk-tag>`,
  closable: `<!-- host: remove the tag when close fires -->
<gk-tag type="primary" closable @close="removeTag('knowledge')">Knowledge</gk-tag>`,
  icon: `<gk-tag type="success">
  <svg slot="icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M6.5 11.2 3.3 8l1.1-1.1 2.1 2.1 5-5L12.6 5.1z"/></svg>
  Verified
</gk-tag>`,
  checkable: `<gk-tag checkable checked @update:checked="onFilter('design', $event)">Design</gk-tag>
<gk-tag checkable @check="onFilter('dev', $event)">Engineering</gk-tag>`,
  disabled: `<gk-tag disabled>Disabled</gk-tag>
<gk-tag type="primary" disabled>Primary</gk-tag>
<gk-tag type="error" disabled closable checkable>Error</gk-tag>`,
};
</script>

# Tag

Tag is a compact chip for status, category, and removable or checkable filters. Semantic colors use the same soft wash as Message. Checked filters use a 22% brand wash.

## Demos

<DemoCard title="Types" :code="codes.types">
  <template #description>
    <code>default</code> is a quiet gray fill. <code>primary</code> is solid brand with on-brand text. Success, warning, error, and info use a 16% wash and pressed-tone text.
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
    <gk-tag>Default</gk-tag>
    <gk-tag type="primary">Primary</gk-tag>
    <gk-tag type="success">Success</gk-tag>
    <gk-tag type="warning">Warning</gk-tag>
    <gk-tag type="error">Error</gk-tag>
    <gk-tag type="info">Info</gk-tag>
  </div>
</DemoCard>

<DemoCard title="Bordered" :code="codes.bordered">
  <template #description>
    <code>bordered</code> keeps the soft fill and adds a 1px type-colored border. Bordered primary switches from a solid fill to an 18% brand wash.
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
    <gk-tag bordered>Default</gk-tag>
    <gk-tag type="primary" bordered>Primary</gk-tag>
    <gk-tag type="success" bordered>Success</gk-tag>
    <gk-tag type="warning" bordered>Warning</gk-tag>
    <gk-tag type="error" bordered>Error</gk-tag>
    <gk-tag type="info" bordered>Info</gk-tag>
  </div>
</DemoCard>

<DemoCard title="Round" :code="codes.round">
  <template #description>
    <code>round</code> uses the pill radius.
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
    <gk-tag type="primary" round>Course</gk-tag>
    <gk-tag type="info" round>Live</gk-tag>
    <gk-tag type="success" round>Published</gk-tag>
    <gk-tag bordered round>Draft</gk-tag>
  </div>
</DemoCard>

<DemoCard title="Sizes" :code="codes.sizes">
  <template #description>
    Chip heights are tighter than Button: <code>sm</code> 22, <code>md</code> 24, <code>lg</code> 28.
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
    <gk-tag size="sm" type="primary">sm 22</gk-tag>
    <gk-tag size="md" type="primary">md 24</gk-tag>
    <gk-tag size="lg" type="primary">lg 28</gk-tag>
  </div>
</DemoCard>

<DemoCard title="Closable" :code="codes.closable">
  <template #description>
    The × button emits <code>close</code> and does not remove the tag. The accessible name is “Close”, or 「關閉」 when the document language is Chinese.
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
    <gk-tag
      v-for="tag in closableTags"
      :key="tag.id"
      :type="tag.type"
      :round="tag.round"
      :bordered="tag.bordered"
      closable
      @close="removeTag(tag.id)"
    >
      {{ tag.text }}
    </gk-tag>
  </div>
</DemoCard>

<DemoCard title="Icon" :code="codes.icon">
  <template #description>
    The <code>icon</code> slot sits before the label.
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
    <gk-tag type="success">
      <svg slot="icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M6.5 11.2 3.3 8l1.1-1.1 2.1 2.1 5-5L12.6 5.1z" fill="currentColor"/></svg>
      Verified
    </gk-tag>
    <gk-tag type="warning" bordered>
      <svg slot="icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5 14.5 13H1.5L8 1.5zm0 3.2-.9 4.6h1.8L8 4.7zm0 6.3a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8z" fill="currentColor"/></svg>
      Notice
    </gk-tag>
  </div>
</DemoCard>

<DemoCard title="Checkable filters" :code="codes.checkable">
  <template #description>
    <code>checkable</code> exposes <code>role="checkbox"</code>. Checked chips use a 22% brand wash and pressed brand text. Unchecked hover is an 18% wash. <code>type="primary"</code> stays solid when checked.
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
    <gk-tag
      v-for="filter in filters"
      :key="filter.key"
      checkable
      :checked="filter.checked"
      @update:checked="onFilter(filter.key, $event)"
    >
      {{ filter.label }}
    </gk-tag>
    <gk-tag checkable disabled>Archived</gk-tag>
  </div>
</DemoCard>

<DemoCard title="Disabled" :code="codes.disabled">
  <template #description>
    <code>disabled</code> sets opacity to 0.5 and blocks close, check, and the focus ring.
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
    <gk-tag disabled>Disabled</gk-tag>
    <gk-tag type="primary" disabled>Primary</gk-tag>
    <gk-tag type="error" disabled>Error</gk-tag>
  </div>
</DemoCard>

## API

### Tag Props

| Prop | Type | Default |
|------|------|---------|
| `type` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` |
| `variant` | same as `type` | — |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `bordered` | `boolean` | `false` |
| `round` | `boolean` | `false` |
| `closable` | `boolean` | `false` |
| `checkable` | `boolean` | `false` |
| `checked` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `color` | `string` | — |

Prefer `type`. `variant` is an alias; if both attributes are present on the first render, `type` wins. `error` uses the danger token. `color` sets the host variable `--gk-tag-color` and overrides the fill.

A static tag does not emit a click event. Closable and checkable tags are the interactive cases.

### Tag Slots

| Name | Description |
|------|-------------|
| default | Label |
| `icon` | Leading icon |

### Tag Events

| Name | Description |
|------|-------------|
| `close` | × pressed. Bubbles; `composed: true`. Does not toggle `checked`. |
| `update:checked` | Checkable chip toggled. `detail: { checked: boolean }`. |
| `check` | Same payload as `update:checked`. |

Space and Enter toggle a focused checkable tag. The component updates `checked` itself.

### CSS Parts

| Part | Description |
|------|-------------|
| `base` | Chip surface. `role="checkbox"` when checkable |
| `icon` | Icon slot wrapper |
| `content` | Label |
| `close` | × button |
| `check-indicator` | Present when checkable, hidden unless checked. Style it to add a custom mark |

### CSS Variables

| Name | Description |
|------|-------------|
| `--gk-tag-color` | Set from the `color` prop. Used as the chip fill |

### Accessibility

- No role until `checkable`, which sets `role="checkbox"` and `aria-checked`.
- The × control is `type="button"` with `aria-label="Close"` (「關閉」 when `lang` starts with `zh`).
- `disabled` sets `aria-disabled="true"` and removes the chip from the tab order.
- Focus-visible uses a soft ring: `0 0 0 2px color-mix(focus-ring 70%)`.
