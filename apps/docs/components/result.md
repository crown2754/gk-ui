<script setup lang="ts">
const codes = {
  success: `<gk-result
  status="success"
  title="Submitted"
  description="Your course was sent for review. We will reply within 1–2 business days."
>
  <gk-button slot="action">View course</gk-button>
  <gk-button slot="extra" variant="ghost">Back to list</gk-button>
</gk-result>`,
  strip: `<gk-result status="info" title="Notice"></gk-result>
<gk-result status="warning" title="Please check"></gk-result>
<gk-result status="error" title="Something failed"></gk-result>
<gk-result status="404" title="Page not found"></gk-result>`,
  missing: `<gk-result
  status="404"
  title="Page not found"
  description="This address may have moved. Go home, or search for what you need."
>
  <gk-button slot="action">Home</gk-button>
  <gk-button slot="extra" variant="ghost">Contact support</gk-button>
</gk-result>`,
  icon: `<gk-result status="info" title="Custom icon">
  <svg slot="icon" viewBox="0 0 24 24" aria-hidden="true"><!-- your glyph --></svg>
</gk-result>`,
};
</script>

# Result

Result is a centered outcome panel: success, info, warning, error, or a 404 state. Spacing follows Empty large. It is not an alert.

## Demos

<DemoCard title="Success" :code="codes.success">
  <template #description>
    The icon sits in a 16% semantic wash with a pressed-tone glyph. Actions use the same row as Empty: a primary Button and an optional ghost.
  </template>
  <div style="width:100%;border:1px dashed var(--gk-color-border, rgb(224, 224, 230));border-radius:0.75rem">
    <gk-result
      status="success"
      title="Submitted"
      description="Your course was sent for review. We will reply within 1–2 business days."
    >
      <gk-button slot="action" type="button">View course</gk-button>
      <gk-button slot="extra" variant="ghost" type="button">Back to list</gk-button>
    </gk-result>
  </div>
</DemoCard>

<DemoCard title="Info, warning, error, 404" :code="codes.strip">
  <template #description>
    <code>status</code> picks the icon and wash. 404 uses a soft brand circle and a Fraunces “404” mark.
  </template>
  <div style="width:100%;display:grid;gap:0.75rem;grid-template-columns:repeat(auto-fit,minmax(140px,1fr))">
    <div style="border:1px solid var(--gk-color-divider, rgb(239, 239, 245));border-radius:0.5rem">
      <gk-result status="info" title="Notice"></gk-result>
    </div>
    <div style="border:1px solid var(--gk-color-divider, rgb(239, 239, 245));border-radius:0.5rem">
      <gk-result status="warning" title="Please check"></gk-result>
    </div>
    <div style="border:1px solid var(--gk-color-divider, rgb(239, 239, 245));border-radius:0.5rem">
      <gk-result status="error" title="Something failed"></gk-result>
    </div>
    <div style="border:1px solid var(--gk-color-divider, rgb(239, 239, 245));border-radius:0.5rem">
      <gk-result status="404" title="Page not found"></gk-result>
    </div>
  </div>
</DemoCard>

<DemoCard title="404 panel" :code="codes.missing">
  <template #description>
    Result does not route. The action slot belongs to the app.
  </template>
  <div style="width:100%;border:1px dashed var(--gk-color-border, rgb(224, 224, 230));border-radius:0.75rem">
    <gk-result
      status="404"
      title="Page not found"
      description="This address may have moved. Go home, or search for what you need."
    >
      <gk-button slot="action" type="button">Home</gk-button>
      <gk-button slot="extra" variant="ghost" type="button">Contact support</gk-button>
    </gk-result>
  </div>
</DemoCard>

<DemoCard title="Custom icon" :code="codes.icon">
  <template #description>
    The <code>icon</code> slot replaces the built-in glyph. The title stays the accessible name, and the icon is <code>aria-hidden</code> when a title is present.
  </template>
  <gk-result status="info" title="Bring your own mark" description="The circle wash still follows the status.">
    <svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
      <path d="M12 3v18M3 12h18"></path>
    </svg>
  </gk-result>
</DemoCard>

## API

### Result Props

| Prop | Type | Default |
|------|------|---------|
| `status` | `'success' \| 'info' \| 'warning' \| 'error' \| '404'` | `'info'` |
| `title` | `string` | `''` |
| `description` | `string` | `''` |

### Result Slots

| Name | Description |
|------|-------------|
| `icon` | Replaces the status glyph |
| `extra` / `action` | Action row, usually `gk-button` |
| default | Extra body under the description |

### CSS Parts

| Part | Description |
|------|-------------|
| `root` | Centered column, Empty-large padding |
| `icon` | 72px circle. `aria-hidden` when a title is set |
| `title` | Fraunces heading |
| `description` | Muted supporting copy |
| `extra` | Action row |

There is no `role="alert"`. For a finished async task, the app may set `role="status"` on the host.

### Accessibility

- The title is an `h2` and the accessible name.
- The icon is decorative when a title is present.
- Action buttons bring their own names and focus rings.
