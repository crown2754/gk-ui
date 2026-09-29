<script setup lang="ts">
const codes = {
  types: `<gk-badge value="3" aria-label="3 unread">
  <gk-avatar round size="lg">U</gk-avatar>
</gk-badge>
<gk-badge value="5" type="success"><gk-avatar round size="lg">S</gk-avatar></gk-badge>
<gk-badge value="2" type="warning"><gk-avatar round size="lg">W</gk-avatar></gk-badge>
<gk-badge value="1" type="error"><gk-avatar round size="lg">E</gk-avatar></gk-badge>
<gk-badge value="8" type="info"><gk-avatar round size="lg">I</gk-avatar></gk-badge>
<gk-badge value="9" type="primary"><gk-avatar round size="lg">P</gk-avatar></gk-badge>`,
  dot: `<gk-badge dot type="error" aria-label="New activity">
  <gk-button variant="secondary" aria-label="Notifications">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>
  </gk-button>
</gk-badge>
<gk-badge dot type="success" processing aria-label="Live">
  <gk-button variant="secondary" aria-label="Status">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>
  </gk-button>
</gk-badge>
<gk-badge value="12" type="primary" processing>
  <gk-button>Inbox</gk-button>
</gk-badge>`,
  max: `<gk-badge value="120"><gk-avatar round size="lg">M</gk-avatar></gk-badge>
<gk-badge value="0" show-zero type="info"><gk-avatar round size="lg">Z</gk-avatar></gk-badge>
<gk-badge value="0"><gk-avatar round size="lg">H</gk-avatar></gk-badge>`,
  solo: `<gk-badge value="Online" type="success"></gk-badge>
<gk-badge value="Review" type="warning"></gk-badge>
<gk-badge value="5" type="error"></gk-badge>
<gk-badge dot type="info" aria-label="Info"></gk-badge>
<gk-badge value="NEW" type="primary"></gk-badge>`,
  offset: `<gk-badge value="8" type="error" style="--gk-badge-offset-x: 4px; --gk-badge-offset-y: 2px">
  <gk-avatar round size="lg">O</gk-avatar>
</gk-badge>`,
};
</script>

# Badge

Badge is a count or status dot anchored to the top-right of a child, or a standalone pill when there is no child.

## Demos

<DemoCard title="Types" :code="codes.types">
  <template #description>
    Overlay <code>default</code> is danger red, the notification color. <code>primary</code> is brand fill with brand-on text. Warning uses brand-on text so the gold fill stays readable.
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:1.25rem 1.5rem;align-items:center;padding:0.35rem">
    <gk-badge value="3" aria-label="3 unread"><gk-avatar round size="lg" color="#f2ce5e">U</gk-avatar></gk-badge>
    <gk-badge value="5" type="success"><gk-avatar round size="lg" color="#d8f3e4">S</gk-avatar></gk-badge>
    <gk-badge value="2" type="warning"><gk-avatar round size="lg" color="#fde8c8">W</gk-avatar></gk-badge>
    <gk-badge value="1" type="error"><gk-avatar round size="lg" color="#f8d5dc">E</gk-avatar></gk-badge>
    <gk-badge value="8" type="info"><gk-avatar round size="lg" color="#d6e6fb">I</gk-avatar></gk-badge>
    <gk-badge value="9" type="primary"><gk-avatar round size="lg" color="#f2ce5e">P</gk-avatar></gk-badge>
  </div>
</DemoCard>

<DemoCard title="Dot, processing, on a button" :code="codes.dot">
  <template #description>
    <code>dot</code> is an 8×8 circle and ignores <code>value</code>. <code>processing</code> pulses a ring in the type color. Give a dot-only badge an <code>aria-label</code>.
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:1.25rem;align-items:center;padding:0.35rem">
    <gk-badge dot type="error" aria-label="New activity">
      <gk-button variant="secondary" aria-label="Notifications">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>
      </gk-button>
    </gk-badge>
    <gk-badge dot type="success" processing aria-label="Live">
      <gk-button variant="secondary" aria-label="Status">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>
      </gk-button>
    </gk-badge>
    <gk-badge value="12" type="primary" processing>
      <gk-button type="button">Inbox</gk-button>
    </gk-badge>
  </div>
</DemoCard>

<DemoCard title="Max and show zero" :code="codes.max">
  <template #description>
    Numbers above <code>max</code> (default 99) render as <code>99+</code>. <code>0</code> is hidden unless <code>show-zero</code> is set. Strings are not clamped.
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:1.25rem;align-items:center;padding:0.35rem">
    <gk-badge value="120"><gk-avatar round size="lg">M</gk-avatar></gk-badge>
    <gk-badge value="0" show-zero type="info"><gk-avatar round size="lg">Z</gk-avatar></gk-badge>
    <gk-badge value="0"><gk-avatar round size="lg">H</gk-avatar></gk-badge>
  </div>
</DemoCard>

<DemoCard title="Standalone" :code="codes.solo">
  <template #description>
    With no child, the badge is an inline pill. Standalone <code>default</code> is a soft gray chip; overlay <code>default</code> stays danger red.
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:0.65rem;align-items:center">
    <gk-badge value="Online" type="success"></gk-badge>
    <gk-badge value="Review" type="warning"></gk-badge>
    <gk-badge value="5" type="error"></gk-badge>
    <gk-badge dot type="info" aria-label="Info"></gk-badge>
    <gk-badge value="NEW" type="primary"></gk-badge>
  </div>
</DemoCard>

<DemoCard title="Offset" :code="codes.offset">
  <template #description>
    Nudge from the top-right anchor with <code>--gk-badge-offset-x</code> and <code>--gk-badge-offset-y</code>, or the <code>offset</code> property (<code>"4, -2"</code> or <code>[4, -2]</code>).
  </template>
  <div style="padding:0.5rem">
    <gk-badge value="8" type="error" style="--gk-badge-offset-x: 4px; --gk-badge-offset-y: 2px">
      <gk-avatar round size="lg">O</gk-avatar>
    </gk-badge>
  </div>
</DemoCard>

## API

### Badge Props

| Prop | Type | Default |
|------|------|---------|
| `value` | `number \| string` | — |
| `max` | `number` | `99` |
| `dot` | `boolean` | `false` |
| `type` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` |
| `show-zero` | `boolean` | `false` |
| `processing` | `boolean` | `false` |
| `offset` | `[number, number]` | — |

`max` applies only when `value` is a number. Numeric attributes such as `value="120"` are treated as numbers. Empty `value`, or `0` without `show-zero`, removes the badge node. There is no event in v1; clicks pass through to the child.

Count pills are 18px tall, at least 20px wide, with 6px of horizontal padding (7px when the label is wider than one character) so glyphs stay clear of the pill edge and the white ring.

### Badge Slots

| Name | Description |
|------|-------------|
| default | Child to overlay. Omit it for a standalone pill |

### CSS Parts

| Part | Description |
|------|-------------|
| `root` | Inline wrapper |
| `wrapper` | Positioning context around the child |
| `badge` / `sup` | The pill or dot |
| `dot` | Present on the same node when `dot` is set |
| `value` | Label text |

### CSS variables

| Variable | Default |
|----------|---------|
| `--gk-badge-offset-x` | `0px` |
| `--gk-badge-offset-y` | `0px` |
| `--gk-badge-z-index` | `1` |

### Accessibility

- Numeric badges expose a short name such as “3 unread” / 「3 則未讀」 unless the host already has `aria-label`.
- Dot-only badges need an accessible name on the host (`aria-label`). The component falls back to “Status” / 「狀態」.
- Standalone text is the accessible name. Badge does not set `role="status"`.
- Icon-only children should keep a hit target of at least 34px.
