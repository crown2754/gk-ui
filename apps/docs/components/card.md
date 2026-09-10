<script setup lang="ts">
import { ref } from "vue";
import { withBase } from "vitepress";

const owl = withBase("/owl.png");
const closeStatus = ref("");

function onCardClose() {
  closeStatus.value = "gk-close fired";
}

const codes = {
  basic: `<gk-card title="Basic card">
  Card content goes in the default slot.
</gk-card>`,
  cover: `<gk-card cover="${owl}" title="Cover URL">
  Cover image from the cover attribute.
</gk-card>
<gk-card title="Cover slot">
  <img slot="cover" src="${owl}" alt="Owl" style="width:100%;max-height:180px;object-fit:cover;display:block" />
  Cover from the cover slot (wins over cover attribute).
</gk-card>`,
  size: `<gk-card size="sm" title="Small">Compact padding and title.</gk-card>
<gk-card size="md" title="Medium">Default size.</gk-card>
<gk-card size="lg" title="Large">Roomier padding and title.</gk-card>`,
  hoverable: `<gk-card title="Hoverable" hoverable>
  Hover for a subtle elevation nudge.
</gk-card>`,
  segmented: `<gk-card title="Segmented" segmented>
  Main content between header and footer.
  <div slot="footer">Footer region</div>
</gk-card>`,
  closable: `<gk-card title="Closable" closable>
  Close emits gk-close; the card stays mounted.
</gk-card>`,
};
</script>

# Card

Card groups related content with optional cover, header, footer, and actions.

## Demos

<DemoCard title="Basic" :code="codes.basic">
  <template #description>
    Use <code>title</code> for a simple header, or put custom markup in the <code>header</code> slot.
  </template>
  <gk-card title="Basic card">
    Card content goes in the default slot.
  </gk-card>
</DemoCard>

<DemoCard title="Cover" :code="codes.cover">
  <template #description>
    Set <code>cover</code> to an image URL for a built-in top image, or provide a <code>cover</code> slot (slot wins when present). Cover images use <code>object-fit: cover</code> with a max height.
  </template>
  <div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
    <gk-card :cover="owl" title="Cover URL">
      Cover image from the <code>cover</code> attribute.
    </gk-card>
    <gk-card title="Cover slot">
      <img
        slot="cover"
        :src="owl"
        alt="Owl"
        style="width:100%;max-height:180px;object-fit:cover;display:block"
      />
      Cover from the <code>cover</code> slot (wins over <code>cover</code> attribute).
    </gk-card>
  </div>
</DemoCard>

<DemoCard title="Size" :code="codes.size">
  <template #description>
    Density via <code>sm</code>, <code>md</code> (default), and <code>lg</code>.
  </template>
  <div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">
    <gk-card size="sm" title="Small">Compact padding and title.</gk-card>
    <gk-card size="md" title="Medium">Default size.</gk-card>
    <gk-card size="lg" title="Large">Roomier padding and title.</gk-card>
  </div>
</DemoCard>

<DemoCard title="Hoverable" :code="codes.hoverable">
  <template #description>
    Enable <code>hoverable</code> for a soft shadow and slight translate on hover.
  </template>
  <gk-card title="Hoverable" hoverable>
    Hover for a subtle elevation nudge.
  </gk-card>
</DemoCard>

<DemoCard title="Segmented" :code="codes.segmented">
  <template #description>
    <code>segmented</code> adds dividers between header, content, and footer when those regions exist.
  </template>
  <gk-card title="Segmented" segmented>
    Main content between header and footer.
    <div slot="footer">Footer region</div>
  </gk-card>
</DemoCard>

<DemoCard title="Closable" :code="codes.closable">
  <template #description>
    <code>closable</code> shows a close control that dispatches bubbling <code>gk-close</code>. The card does not hide itself — handle the event in the host.
  </template>
  <gk-card title="Closable" closable @gk-close="onCardClose">
    Close emits <code>gk-close</code>; the card stays mounted.
  </gk-card>
  <p style="margin:0.75rem 0 0;font-size:0.875rem;opacity:0.8">
    Status: {{ closeStatus || "—" }}
  </p>
</DemoCard>

## API

### Card Props

| Prop | Type | Default |
|------|------|---------|
| `title` | `string` | — |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `cover` | `string` | — |
| `hoverable` | `boolean` | `false` |
| `bordered` | `boolean` | `true` |
| `segmented` | `boolean` | `false` |
| `closable` | `boolean` | `false` |

### Card Slots

| Name | Description |
|------|-------------|
| `cover` | Custom cover (wins over `cover` attribute) |
| `header` | Custom header (wins over `title` attribute) |
| default | Main content |
| `footer` | Footer region |
| `action` | Top-right actions (beside close when both present) |

### Card Events

| Name | Description |
|------|-------------|
| `gk-close` | Close button activated; bubbles; `composed: true` |

### CSS Parts

| Part | Description |
|------|-------------|
| `base` | Outer article surface |
| `cover` | Cover region |
| `header` | Header row |
| `content` | Main content wrapper |
| `footer` | Footer region |
| `action` | Action area (slot + close) |
| `close` | Close button |
