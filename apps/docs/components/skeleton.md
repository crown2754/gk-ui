<script setup lang="ts">
import { ref } from "vue";

const loading = ref(true);

const codes = {
  text: `<gk-skeleton text rows="4"></gk-skeleton>`,
  avatar: `<gk-skeleton avatar text rows="3"></gk-skeleton>`,
  shapes: `<gk-skeleton button></gk-skeleton>
<gk-skeleton button animated="false"></gk-skeleton>
<gk-skeleton image></gk-skeleton>`,
  swap: `<gk-skeleton :loading="loading" image avatar text rows="2" height="100">
  <article>Real card</article>
</gk-skeleton>`,
  repeat: `<gk-skeleton avatar text rows="2" repeat="3"></gk-skeleton>`,
  template: `<gk-skeleton>
  <div slot="template"><!-- custom bones while loading --></div>
  <p>Loaded copy.</p>
</gk-skeleton>`,
};
</script>

# Skeleton

Skeleton is a quiet placeholder while content loads. The shimmer is neutral gray, not a brand sweep.

## Demos

<DemoCard title="Text rows" :code="codes.text">
  <template #description>
    <code>rows</code> sets the line count. The last line is about 62% wide. With no shape props, text rows are the default.
  </template>
  <gk-skeleton text rows="4" style="width:100%"></gk-skeleton>
</DemoCard>

<DemoCard title="Avatar and text" :code="codes.avatar">
  <template #description>
    The avatar bone is a 40px circle with a 12px gap before the lines.
  </template>
  <gk-skeleton avatar text rows="3" style="width:100%"></gk-skeleton>
</DemoCard>

<DemoCard title="Button, image, animation off" :code="codes.shapes">
  <template #description>
    Button bones match Button md (34×96). <code>animated="false"</code> is a flat gray block. Set <code>--gk-skeleton-highlight</code> only if an app wants a different sweep; the default highlight is white at 55% and is not brand tinted.
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;width:100%">
    <gk-skeleton button></gk-skeleton>
    <gk-skeleton button animated="false"></gk-skeleton>
    <span style="font-size:0.85rem;color:var(--gk-color-text-muted, rgb(118, 124, 130))">Left: shimmer. Right: static.</span>
  </div>
  <gk-skeleton image style="width:100%"></gk-skeleton>
</DemoCard>

<DemoCard title="Loading false" :code="codes.swap">
  <template #description>
    <code>loading="false"</code> unmounts the bones and shows the default slot. <code>prefers-reduced-motion: reduce</code> turns the sweep off.
  </template>
  <div style="width:100%;display:grid;gap:0.75rem">
    <gk-skeleton :loading="loading" image avatar text rows="2" height="100">
      <article style="display:grid;gap:0.75rem">
        <div style="height:100px;border-radius:0.5rem;background:linear-gradient(145deg,#f2ce5e33,#e8e8f0)"></div>
        <div style="display:flex;gap:12px;align-items:center">
          <gk-avatar round size="lg" color="#f2ce5e">知</gk-avatar>
          <div>
            <strong style="font-family:Fraunces, Georgia, serif">Knowledge card</strong>
            <p style="margin:0.2rem 0 0;color:var(--gk-color-text-muted, rgb(118, 124, 130))">The default slot is the real content.</p>
          </div>
        </div>
      </article>
    </gk-skeleton>
    <gk-button type="button" variant="secondary" @click="loading = !loading">{{ loading ? "Show content" : "Show skeleton" }}</gk-button>
  </div>
</DemoCard>

<DemoCard title="Repeat" :code="codes.repeat">
  <template #description>
    <code>repeat</code> duplicates the whole placeholder block. Each text group still shortens its last line.
  </template>
  <gk-skeleton avatar text rows="2" repeat="3" style="width:100%"></gk-skeleton>
</DemoCard>

<DemoCard title="Template slot" :code="codes.template">
  <template #description>
    Put a custom layout in the <code>template</code> slot. It replaces the built-in bones while <code>loading</code> is true.
  </template>
  <gk-skeleton style="width:100%">
    <div slot="template" style="display:grid;gap:10px">
      <div style="height:13px;width:70%;border-radius:0.375rem;background:rgba(46,51,56,0.07)"></div>
      <div style="height:13px;width:40%;border-radius:0.375rem;background:rgba(46,51,56,0.07)"></div>
    </div>
    <p style="margin:0">Loaded copy.</p>
  </gk-skeleton>
</DemoCard>

## API

### Skeleton Props

| Prop | Type | Default |
|------|------|---------|
| `loading` | `boolean` | `true` |
| `animated` | `boolean` | `true` |
| `repeat` | `number` | `1` |
| `text` | `boolean` | `false` (text rows are used when no other shape is set) |
| `rows` | `number` | `3` |
| `avatar` | `boolean` | `false` |
| `button` | `boolean` | `false` |
| `image` | `boolean` | `false` |
| `round` | `boolean` | `false` |
| `sharp` | `boolean` | `false` |
| `width` / `height` | `string \| number` | — |

Combine `image`, `avatar`, and `text` for a card placeholder. `width` and `height` size the image, button, or plain rectangle. `height="100"` is `100px`.

### Skeleton Slots

| Name | Description |
|------|-------------|
| default | Real content, shown when `loading` is false |
| `template` | Custom placeholder, shown instead of built-in bones while loading |

### CSS Parts

| Part | Description |
|------|-------------|
| `root` | Block wrapper |
| `content` | Default slot container |
| `avatar` / `text` / `line` / `button` / `image` | Shape bones |
| `bone` | Every placeholder block |

### CSS variables

| Variable | Default |
|----------|---------|
| `--gk-skeleton-base` | `rgba(46, 51, 56, 0.07)` |
| `--gk-skeleton-highlight` | `rgba(255, 255, 255, 0.55)` |

### Accessibility

- While loading, the host sets `aria-busy="true"` and a visually hidden “Loading” / 「載入中」.
- Bones are `aria-hidden="true"`.
- When loading finishes, busy is cleared and the bones are unmounted.
