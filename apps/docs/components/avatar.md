<script setup lang="ts">
const logo =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23208a5a' width='100' height='100'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%23fff'/%3E%3Cpath fill='%23fff' d='M20 88c4-22 20-32 30-32s26 10 30 32'/%3E%3C/svg%3E";
const logo2 =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%232080f0' width='100' height='100'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%23fff'/%3E%3Cpath fill='%23fff' d='M20 88c4-22 20-32 30-32s26 10 30 32'/%3E%3C/svg%3E";
const logo3 =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f0a020' width='100' height='100'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%23fff'/%3E%3Cpath fill='%23fff' d='M20 88c4-22 20-32 30-32s26 10 30 32'/%3E%3C/svg%3E";

const codes = {
  size: `<gk-avatar size="sm">SM</gk-avatar>
<gk-avatar size="md">MD</gk-avatar>
<gk-avatar size="lg">LG</gk-avatar>
<gk-avatar size="48">48</gk-avatar>`,
  shape: `<gk-avatar>AB</gk-avatar>
<gk-avatar round>AB</gk-avatar>
<gk-avatar round src="${logo}" alt="User"></gk-avatar>`,
  color: `<gk-avatar color="#18a058">GK</gk-avatar>
<gk-avatar color="#2080f0" round>UI</gk-avatar>
<gk-avatar color="#d03050" round>ER</gk-avatar>`,
  icon: `<gk-avatar round color="#18a058">
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"/>
  </svg>
</gk-avatar>
<gk-avatar color="#2080f0">
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2 2 7l10 5 10-5-10-5Zm0 9.2L4.2 7.4 12 3.5l7.8 3.9L12 11.2Zm0 2.1 8-4v7.2c0 1.1-3.6 2.5-8 2.5s-8-1.4-8-2.5V9.3l8 4Z"/>
  </svg>
</gk-avatar>`,
  fallback: `<gk-avatar src="/broken-avatar.png" alt="Missing">FB</gk-avatar>
<gk-avatar round src="/broken-avatar.png" color="#18a058">NA</gk-avatar>`,
  group: `<gk-avatar-group max="3" size="md">
  <gk-avatar round src="${logo}" alt="A"></gk-avatar>
  <gk-avatar round src="${logo2}" alt="B"></gk-avatar>
  <gk-avatar round src="${logo3}" alt="C"></gk-avatar>
  <gk-avatar round color="#18a058">D</gk-avatar>
  <gk-avatar round color="#2080f0">E</gk-avatar>
  <gk-avatar round slot="overflow" color="rgba(46, 51, 56, 0.12)">+2</gk-avatar>
</gk-avatar-group>`,
};
</script>

# Avatar

Avatar displays a user image, initials, or icon. Pair with `gk-avatar-group` for overlapping stacks and overflow.

## Demos

<DemoCard title="Size" :code="codes.size">
  <template #description>
    Named sizes <code>sm</code>, <code>md</code>, <code>lg</code>, or a custom pixel value via <code>size="48"</code>.
  </template>
  <gk-avatar size="sm">SM</gk-avatar>
  <gk-avatar size="md">MD</gk-avatar>
  <gk-avatar size="lg">LG</gk-avatar>
  <gk-avatar size="48">48</gk-avatar>
</DemoCard>

<DemoCard title="Shape" :code="codes.shape">
  <template #description>
    Default corners use a small radius. Set <code>round</code> for a circle.
  </template>
  <gk-avatar>AB</gk-avatar>
  <gk-avatar round>AB</gk-avatar>
  <gk-avatar round :src="logo" alt="User"></gk-avatar>
</DemoCard>

<DemoCard title="Color" :code="codes.color">
  <template #description>
    Use <code>color</code> as the background when showing initials or icons.
  </template>
  <gk-avatar color="#18a058">GK</gk-avatar>
  <gk-avatar color="#2080f0" round>UI</gk-avatar>
  <gk-avatar color="#d03050" round>ER</gk-avatar>
</DemoCard>

<DemoCard title="Icon" :code="codes.icon">
  <template #description>
    Put any icon (inline SVG, emoji, etc.) in the default slot. There is no built-in icon set.
  </template>
  <gk-avatar round color="#18a058">
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"/>
    </svg>
  </gk-avatar>
  <gk-avatar color="#2080f0">
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2 2 7l10 5 10-5-10-5Zm0 9.2L4.2 7.4 12 3.5l7.8 3.9L12 11.2Zm0 2.1 8-4v7.2c0 1.1-3.6 2.5-8 2.5s-8-1.4-8-2.5V9.3l8 4Z"/>
    </svg>
  </gk-avatar>
</DemoCard>

<DemoCard title="Fallback" :code="codes.fallback">
  <template #description>
    When <code>src</code> fails to load, the default slot (e.g. initials) is shown instead.
  </template>
  <gk-avatar src="/broken-avatar.png" alt="Missing">FB</gk-avatar>
  <gk-avatar round src="/broken-avatar.png" color="#18a058">NA</gk-avatar>
</DemoCard>

<DemoCard title="Avatar Group" :code="codes.group">
  <template #description>
    <code>max</code> limits visible avatars. Put a custom <code>+N</code> control in the <code>overflow</code> slot (here 5 avatars, <code>max="3"</code> → <code>+2</code>). The group also reflects remaining count as <code>rest</code>.
  </template>
  <gk-avatar-group max="3" size="md">
    <gk-avatar round :src="logo" alt="A"></gk-avatar>
    <gk-avatar round :src="logo2" alt="B"></gk-avatar>
    <gk-avatar round :src="logo3" alt="C"></gk-avatar>
    <gk-avatar round color="#18a058">D</gk-avatar>
    <gk-avatar round color="#2080f0">E</gk-avatar>
    <gk-avatar round slot="overflow" color="rgba(46, 51, 56, 0.12)">+2</gk-avatar>
  </gk-avatar-group>
</DemoCard>

## API

### Avatar Props

| Prop | Type | Default |
|------|------|---------|
| `src` | `string` | — |
| `alt` | `string` | `''` |
| `size` | `'sm' \| 'md' \| 'lg' \| \`${number}\`` | `'md'` |
| `round` | `boolean` | `false` |
| `color` | `string` | — |
| `object-fit` | `string` | `'cover'` |

### Avatar Slots

| Name | Description |
|------|-------------|
| default | Initials, icon, or fallback content when there is no image |

### Avatar CSS Parts

| Part | Description |
|------|-------------|
| `base` | Outer surface |
| `image` | `<img>` when `src` loads |
| `content` | Wrapper around the default slot |

### AvatarGroup Props

| Prop | Type | Default |
|------|------|---------|
| `max` | `number` | — |
| `size` | `'sm' \| 'md' \| 'lg' \| \`${number}\`` | — |
| `rest` | `number` (reflected) | `0` |

When `size` is set on the group, it is applied to child avatars for consistent overlap.

### AvatarGroup Slots

| Name | Description |
|------|-------------|
| default | `gk-avatar` children |
| overflow | Custom overflow UI (e.g. `+N`); shown when `rest > 0` |
