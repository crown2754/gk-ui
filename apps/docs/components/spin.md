<script setup lang="ts">
import { nextTick, ref } from "vue";

const delayed = ref(false);

async function startDelay() {
  delayed.value = false;
  await nextTick();
  delayed.value = true;
}

const codes = {
  sizes: `<gk-spin size="sm"></gk-spin>
<gk-spin size="md" description="Loading…"></gk-spin>
<gk-spin size="lg" description="Fetching data"></gk-spin>`,
  tip: `<gk-spin description="Loading…">Course details stay in place.</gk-spin>`,
  wrap: `<gk-spin description="Loading…">
  <article>
    <h3>Course details</h3>
    <p>Content keeps its space and cannot be interacted with.</p>
  </article>
</gk-spin>`,
  idle: `<gk-spin show="false">
  <p>The mask is gone. This button works.</p>
  <gk-button>Continue</gk-button>
</gk-spin>`,
  delay: `<gk-spin :show="delayed" delay="400" description="Loading…">
  <p>Short requests never flash the spinner.</p>
</gk-spin>`,
};
</script>

# Spin

Spin is the block loading indicator: a brand ring by itself, or a soft white mask over content. Button loading and Message loading share the same stroke language; Spin owns the overlay.

## Demos

<DemoCard title="Sizes" :code="codes.sizes">
  <template #description>
    Diameters are <code>sm</code> 18, <code>md</code> 28, and <code>lg</code> 40. Stroke widths are 2 / 2.5 / 3. The track is 25% brand and the top edge is solid brand, rotating for 0.75s.
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:28px;align-items:flex-end">
    <gk-spin size="sm"></gk-spin>
    <gk-spin size="md" description="Loading…"></gk-spin>
    <gk-spin size="lg" description="Fetching data"></gk-spin>
  </div>
</DemoCard>

<DemoCard title="Wrap content" :code="codes.wrap">
  <template #description>
    With children and <code>show</code>, a mask of <code>color-mix(#fff 55%, transparent)</code> covers the box. Content stays in flow and loses pointer events.
  </template>
  <gk-spin description="Loading…" style="width:100%">
    <article style="padding:1.25rem;border:1px solid var(--gk-color-border, rgb(224, 224, 230));border-radius:0.5rem">
      <h3 style="margin:0 0 0.5rem;font-family:var(--gk-font-family-display, Fraunces, Georgia, serif)">Course details</h3>
      <p style="margin:0;color:var(--gk-color-text-muted, rgb(118, 124, 130))">Content keeps its space and cannot be interacted with.</p>
    </article>
  </gk-spin>
</DemoCard>

<DemoCard title="Idle" :code="codes.idle">
  <template #description>
    <code>:show="false"</code> or <code>show="false"</code> hides the mask. <code>spinning</code> is an alias of <code>show</code>.
  </template>
  <gk-spin show="false" style="width:100%">
    <article style="padding:1.25rem;border:1px solid var(--gk-color-border, rgb(224, 224, 230));border-radius:0.5rem">
      <h3 style="margin:0 0 0.5rem;font-family:var(--gk-font-family-display, Fraunces, Georgia, serif)">Finished</h3>
      <p style="margin:0 0 0.75rem;color:var(--gk-color-text-muted, rgb(118, 124, 130))">The spinner is hidden and the button can be used.</p>
      <gk-button type="button">Continue</gk-button>
    </article>
  </gk-spin>
</DemoCard>

<DemoCard title="Delay" :code="codes.delay">
  <template #description>
    <code>delay</code> is milliseconds before the spinner appears. If <code>show</code> turns off first, it never flashes. 300–500ms avoids a blink on fast requests. The default is 0.
  </template>
  <div style="display:grid;gap:12px;width:100%">
    <gk-spin :show="delayed" delay="400" description="Loading…" style="width:100%">
      <article style="padding:1.25rem;border:1px dashed var(--gk-color-border, rgb(224, 224, 230));border-radius:0.5rem">
        <p style="margin:0">The overlay waits 400ms. Toggle it off before that and it stays hidden.</p>
      </article>
    </gk-spin>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <gk-button type="button" @click="startDelay">Show after 400ms</gk-button>
      <gk-button type="button" variant="secondary" @click="delayed = false">Hide</gk-button>
    </div>
  </div>
</DemoCard>

<p>
  Nested loading in a dialog footer belongs to <a href="./modal">Modal</a>. Inline button spinners belong to <a href="./button">Button</a> <code>loading</code>, not Spin.
</p>

## API

### Spin Props

| Prop | Type | Default |
|------|------|---------|
| `show` | `boolean` | `true` |
| `spinning` | `boolean` | alias of `show` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `description` | `string` | `''` |
| `tip` | `string` | alias of `description` |
| `delay` | `number` | `0` |
| `stroke-width` | `number` | 2 / 2.5 / 3 by size |

Prefer `show` and `description`. There is no v1 event.

### Spin Slots

| Name | Description |
|------|-------------|
| default | Optional content to cover while spinning |

### CSS Parts

| Part | Description |
|------|-------------|
| `container` | Positions the mask. `aria-busy` while spinning |
| `content` | Slotted children |
| `mask` | Soft white overlay. Only when spinning over content |
| `spinner` | Status live region and ring |
| `tip` | Description, or a visually hidden “Loading” / 「載入中」 |

### Accessibility

- While the spinner is visible, the container is `aria-busy="true"` and the spinner is `role="status"` with `aria-live="polite"`.
- The announced text is `description` / `tip`, or 「載入中」 when the document language starts with `zh`, otherwise “Loading”.
- When idle, busy is removed and the spinner is `aria-hidden`.
- If `show` ends before `delay`, the status is never exposed.
