<script setup lang="ts">
const codes = {
  basic: `<gk-empty description="No data"></gk-empty>`,
  custom: `<gk-empty description="No matching courses"></gk-empty>`,
  title: `<gk-empty
  title="No courses yet"
  description="Create the first course and start collecting what you know."
  size="large"
>
  <gk-button slot="action">New course</gk-button>
  <gk-button slot="extra" variant="ghost">Learn more</gk-button>
</gk-empty>`,
  large: `<gk-empty size="large" title="Nothing here" description="Large adds padding and a bigger illustration."></gk-empty>`,
  svg: `<gk-empty description="Custom art">
  <svg slot="image" viewBox="0 0 128 96" aria-hidden="true"><!-- your illustration --></svg>
</gk-empty>`,
  table: `<div class="table">
  <div class="head">Name · Status · Updated</div>
  <gk-empty description="No results. Try another keyword.">
    <gk-button slot="action">Clear filters</gk-button>
  </gk-empty>
</div>`,
};
</script>

# Empty

Empty is a quiet placeholder for lists, tables, search results, and first-run panels. It is not an alert.

## Demos

<DemoCard title="Basic" :code="codes.basic">
  <template #description>
    With no <code>description</code>, English pages read “No data” and Chinese pages read 「暫無資料」, based on <code>document.documentElement.lang</code>. The illustration is decorative.
  </template>
  <div style="width:100%;border:1px dashed var(--gk-color-border, rgb(224, 224, 230));border-radius:0.75rem">
    <gk-empty description="No data"></gk-empty>
  </div>
</DemoCard>

<DemoCard title="Custom description" :code="codes.custom">
  <template #description>
    Pass <code>description</code>, or replace the text with the <code>description</code> slot.
  </template>
  <gk-empty>
    <span slot="description">No matching courses. Try a shorter query.</span>
  </gk-empty>
</DemoCard>

<DemoCard title="Title and actions" :code="codes.title">
  <template #description>
    <code>title</code> is the stronger line. <code>action</code> and <code>extra</code> are the same action row — usually a primary Button at the md 34 height, plus an optional ghost.
  </template>
  <div style="width:100%;border:1px dashed var(--gk-color-border, rgb(224, 224, 230));border-radius:0.75rem">
    <gk-empty
      size="large"
      title="No courses yet"
      description="Create the first course and start collecting what you know."
    >
      <gk-button slot="action" type="button">New course</gk-button>
      <gk-button slot="extra" variant="ghost" type="button">Learn more</gk-button>
    </gk-empty>
  </div>
</DemoCard>

<DemoCard title="Large" :code="codes.large">
  <template #description>
    <code>size="large"</code> increases padding (about 44px) and the illustration (128×96, from 96×72).
  </template>
  <gk-empty size="large" title="Nothing here" description="Large adds padding and a bigger illustration."></gk-empty>
</DemoCard>

<DemoCard title="Custom illustration" :code="codes.svg">
  <template #description>
    The <code>image</code> slot (alias <code>icon</code>) replaces the built-in line art. <code>:show-icon="false"</code> hides the default art when you do not pass a replacement.
  </template>
  <gk-empty description="Bring your own SVG.">
    <svg slot="image" viewBox="0 0 128 96" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
      <path d="M40 70V34l24-12 24 12v36"></path>
      <path d="M40 34l24 12 24-12"></path>
      <path d="M64 46v36"></path>
    </svg>
  </gk-empty>
</DemoCard>

<DemoCard title="In a table" :code="codes.table">
  <template #description>
    Drop Empty inside the table body. The component stays a centered column and does not force the action button to full width.
  </template>
  <div style="width:100%;border:1px solid var(--gk-color-border, rgb(224, 224, 230));border-radius:0.5rem;overflow:hidden">
    <div style="display:grid;grid-template-columns:1.4fr 1fr 0.8fr;gap:8px;padding:0.65rem 1rem;background:#fafafc;border-bottom:1px solid var(--gk-color-divider, rgb(239, 239, 245));font-size:0.75rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:var(--gk-color-text-muted, rgb(118, 124, 130))">
      <span>Name</span><span>Status</span><span>Updated</span>
    </div>
    <gk-empty description="No results. Try another keyword.">
      <gk-button slot="action" type="button">Clear filters</gk-button>
    </gk-empty>
  </div>
</DemoCard>

## API

### Empty Props

| Prop | Type | Default |
|------|------|---------|
| `description` | `string` | 「暫無資料」 / “No data” by document language |
| `title` | `string` | `''` |
| `size` | `'default' \| 'large'` | `'default'` |
| `show-icon` | `boolean` | `true` |

Set `description` yourself when the surrounding page language and `documentElement.lang` differ. `show-icon="false"` hides the built-in illustration.

### Empty Slots

| Name | Description |
|------|-------------|
| `image` / `icon` | Custom illustration. Replaces the built-in SVG |
| `title` | Replaces the `title` prop |
| `description` | Replaces the description text |
| `extra` / `action` | Actions, usually `gk-button` |
| default | Extra body under the description |

### CSS Parts

| Part | Description |
|------|-------------|
| `root` | Centered column |
| `image` | Illustration. `aria-hidden="true"` |
| `title` | Heading |
| `description` | Supporting text |
| `extra` | Action row |

There is no `role="alert"`. Empty is a placeholder, not an error.

### Accessibility

- The illustration is `aria-hidden`. Do not rely on it alone; keep a description.
- Title and description are normal text.
- Action buttons bring their own names and focus rings. Empty does not add an alert role.
