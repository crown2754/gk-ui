# Button

`<gk-button>` — primary actions for marketing and product surfaces.

## Interactive demo

<ButtonDemo />

## Variants

<p style="display:flex;gap:.5rem;flex-wrap:wrap;">
  <gk-button variant="primary">Primary</gk-button>
  <gk-button variant="secondary">Secondary</gk-button>
  <gk-button variant="ghost">Ghost</gk-button>
  <gk-button variant="danger">Danger</gk-button>
</p>

## API

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` |
| `disabled` | `boolean` | `false` |
| `loading` | `boolean` | `false` |
| `href` | `string` | — |

**Slot:** default label content.  
**Parts:** `base`, `label`, `spinner`.
