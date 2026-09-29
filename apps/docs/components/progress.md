<script setup lang="ts">
const codes = {
  basic: `<gk-progress percentage="30"></gk-progress>
<gk-progress percentage="65"></gk-progress>`,
  status: `<gk-progress percentage="100" status="success"></gk-progress>
<gk-progress percentage="72" status="warning"></gk-progress>
<gk-progress percentage="40" status="error"></gk-progress>`,
  indicator: `<gk-progress percentage="48"></gk-progress>
<gk-progress percentage="48" show-indicator="false"></gk-progress>`,
  inside: `<gk-progress percentage="80" indicator-placement="inside"></gk-progress>`,
  circle: `<gk-progress type="circle" percentage="70"></gk-progress>
<gk-progress type="circle" percentage="100" status="success"></gk-progress>
<gk-progress type="circle" percentage="25" status="error">
  <span slot="indicator">Failed</span>
</gk-progress>`,
  sizes: `<gk-progress size="sm" percentage="55"></gk-progress>
<gk-progress size="md" percentage="55"></gk-progress>
<gk-progress size="lg" percentage="55"></gk-progress>`,
  processing: `<gk-progress percentage="48" processing></gk-progress>`,
};
</script>

# Progress

Determinate progress for uploads, tasks, and compact dashboards. In Chinese this component is 進度條.

The default fill is **brand gold**, the same language as a primary Button. Success, warning, and error use the semantic colors. Info blue is not the default.

## Demos

<DemoCard title="Line" :code="codes.basic">
  <template #description>
    <code>type</code> defaults to <code>line</code>. The track is neutral; the fill is brand.
  </template>
  <div style="display:grid;gap:14px;width:100%">
    <gk-progress percentage="30" label="Upload"></gk-progress>
    <gk-progress percentage="65" label="Upload"></gk-progress>
  </div>
</DemoCard>

<DemoCard title="Status" :code="codes.status">
  <template #description>
    <code>success</code>, <code>warning</code>, and <code>error</code> recolor the fill. Reaching 100% does not change status by itself.
  </template>
  <div style="display:grid;gap:14px;width:100%">
    <gk-progress percentage="100" status="success" label="Complete"></gk-progress>
    <gk-progress percentage="72" status="warning" label="Review"></gk-progress>
    <gk-progress percentage="40" status="error" label="Failed"></gk-progress>
  </div>
</DemoCard>

<DemoCard title="Indicator" :code="codes.indicator">
  <template #description>
    <code>show-indicator</code> defaults to true and renders the percentage. Set <code>show-indicator="false"</code> to hide it.
  </template>
  <div style="display:grid;gap:14px;width:100%">
    <gk-progress percentage="48"></gk-progress>
    <gk-progress percentage="48" show-indicator="false" label="Processing"></gk-progress>
  </div>
</DemoCard>

<DemoCard title="Inside label" :code="codes.inside">
  <template #description>
    <code>indicator-placement="inside"</code> is for lines. The track grows to 18px. At 60% and above the label sits on the fill.
  </template>
  <gk-progress percentage="80" indicator-placement="inside" label="Sync"></gk-progress>
</DemoCard>

<DemoCard title="Circle" :code="codes.circle">
  <template #description>
    Circle diameters are 64 / 96 / 120. The <code>indicator</code> slot replaces the center label.
  </template>
  <div style="display:flex;flex-wrap:wrap;gap:28px;align-items:center;width:100%">
    <gk-progress type="circle" percentage="45" label="Load"></gk-progress>
    <gk-progress type="circle" percentage="70" label="Running"></gk-progress>
    <gk-progress type="circle" percentage="100" status="success" label="Done"></gk-progress>
    <gk-progress type="circle" percentage="25" status="error" label="Failed">
      <span slot="indicator">Failed</span>
    </gk-progress>
  </div>
</DemoCard>

<DemoCard title="Sizes" :code="codes.sizes">
  <template #description>
    Line thickness is 6 / 8 / 10. <code>height</code> overrides it. Circle stroke defaults to 5 / 6 / 7 unless <code>stroke-width</code> is set.
  </template>
  <div style="display:grid;gap:14px;width:100%">
    <gk-progress size="sm" percentage="55"></gk-progress>
    <gk-progress size="md" percentage="55"></gk-progress>
    <gk-progress size="lg" percentage="55"></gk-progress>
  </div>
</DemoCard>

<DemoCard title="Processing" :code="codes.processing">
  <template #description>
    <code>processing</code> adds a shimmer on the fill. <code>prefers-reduced-motion</code> turns the shimmer and the width transition off. Indeterminate progress is not in v1.
  </template>
  <gk-progress percentage="48" processing label="Uploading"></gk-progress>
</DemoCard>

## API

### Props

| Prop | Type | Default |
|------|------|---------|
| `type` | `'line' \| 'circle'` | `'line'` |
| `percentage` | `number` | `0` |
| `status` | `'default' \| 'success' \| 'error' \| 'warning'` | `'default'` |
| `show-indicator` | `boolean` | `true` |
| `indicator-placement` | `'outside' \| 'inside'` | `'outside'` |
| `height` | `number` | `0` (use the size preset) |
| `stroke-width` | `number` | `0` (use the size preset) |
| `processing` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `label` | `string` | `''` |

`percentage` is clamped to 0–100. A non-finite value becomes 0. There is no event in v1; bind `percentage` from the app.

### Slots

| Name | Description |
|------|-------------|
| `indicator` | Replaces the percentage label |

### CSS parts

`root`, `track`, `fill`, `indicator`, `circle`, `trail`, `path`.

### Accessibility

- The host is `role="progressbar"` with `aria-valuemin="0"`, `aria-valuemax="100"`, and `aria-valuenow`.
- `label` is copied to `aria-label`. An existing `aria-label` on the host is kept when `label` is empty.
