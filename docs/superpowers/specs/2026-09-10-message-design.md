# Message Design

**Date:** 2026-09-10  
**Status:** Approved for planning  
**Scope:** Add Message (Feedback toast) to `@gk-ui/core`: `gk-message`, `gk-message-provider`, and imperative `gkMessage` API; VitePress demos (EN + zh-TW)

## Goal

Ship a Naive-inspired global Message: lightweight toasts from a provider-managed stack, invoked via an imperative API (`info` / `success` / `warning` / `error` / `loading` / `create` / `destroyAll`), with placement, duration, closable, keep-alive-on-hover, max stack size, and manual `destroy`.

Distinct from `gk-alert`: Alert is inline and only emits `gk-close`; Message owns its lifecycle and removes itself from the provider queue on timeout, close, or `destroy()`.

## Decisions

| Topic | Decision |
|-------|----------|
| Architecture | Provider + imperative API (approach 1): `gk-message-provider` owns queue/portal; `gk-message` is the visual item; `gkMessage` is the JS helper |
| Content | v1 **plain text string only** (no HTML / VNode) |
| Closable lifecycle | Close control **removes** the message from the provider list (not Alert’s emit-only pattern) |
| Types | `default` \| `info` \| `success` \| `warning` \| `error` \| `loading` |
| Placement | `top` \| `top-left` \| `top-right` \| `bottom` \| `bottom-left` \| `bottom-right`; default `top` |
| Duration | Provider default `3000` ms; per-call override; `0` = no auto-dismiss; `loading` defaults to `0` |
| Provider defaults | Also: `closable`, `keepAliveOnHover`, `max` (optional cap; drop oldest when exceeded) |
| API discovery | `gkMessage` targets the **nearest active provider** registered in the document (or an explicitly passed provider); docs wrap demos in `<gk-message-provider>` |
| Icons | Built-in SVGs aligned with Alert semantics; `loading` uses a CSS spinner; no custom icon function in v1 |
| Nav | Components alphabetical: … **Card → Message** (insert Message after Card) |
| Out of scope | Notification, theme overrides, custom icon renderers, Vue-only `useMessage`, HTML content |

## API

### `gk-message-provider`

| Name | Type | Default | Notes |
|------|------|---------|-------|
| `placement` | `'top' \| 'top-left' \| 'top-right' \| 'bottom' \| 'bottom-left' \| 'bottom-right'` | `'top'` | Fixed stack position |
| `duration` | `number` | `3000` | Default auto-dismiss ms; `0` = none |
| `closable` | `boolean` | `false` | Default for new messages |
| `keep-alive-on-hover` | `boolean` | `false` | Pause timer while pointer is over the message |
| `max` | `number` \| unset | — | Max concurrent messages; when exceeded, remove oldest first |

**Slots:** `default` — application / page content (provider does not replace children).

**Behavior:** Renders a fixed-position message container portaled to `document.body` (owned/cleaned up by the provider instance). Stacks messages according to `placement`.

### Imperative API — `gkMessage`

Exported from `@gk-ui/core`. Requires an ancestor (or registered) `gk-message-provider`.

| Method | Signature | Notes |
|--------|-----------|-------|
| `create` | `(content: string, options?: GkMessageOptions) => GkMessageReactive` | Generic create |
| `info` | `(content: string, options?: GkMessageOptions) => GkMessageReactive` | `type: 'info'` |
| `success` | `(content: string, options?: GkMessageOptions) => GkMessageReactive` | `type: 'success'` |
| `warning` | `(content: string, options?: GkMessageOptions) => GkMessageReactive` | `type: 'warning'` |
| `error` | `(content: string, options?: GkMessageOptions) => GkMessageReactive` | `type: 'error'` |
| `loading` | `(content: string, options?: GkMessageOptions) => GkMessageReactive` | `type: 'loading'`; default `duration: 0` |
| `destroyAll` | `() => void` | Dismiss all messages on the target provider |

**`GkMessageOptions` (per call, optional):** `type`, `duration`, `closable`, `keepAliveOnHover`, `showIcon` (default `true`).

**`GkMessageReactive`:** at minimum `{ destroy: () => void }` (may expose mirrored fields for debugging; v1 only requires `destroy`).

If no provider is available, the API should no-op or throw a clear error (prefer **throw** with a short message so misuse is obvious in demos).

### `gk-message` (visual item)

Primarily rendered by the provider; may be usable standalone for docs snapshots.

| Name | Type | Default | Notes |
|------|------|---------|-------|
| `type` | Message type union | `'default'` | Color / icon / spinner |
| `closable` | `boolean` | `false` | Shows close control |
| `show-icon` | `boolean` | `true` | Icon / spinner column |

**Content:** text via property/attribute or light DOM text — provider sets content when creating instances.

**Parts:** `base`, `icon`, `content`, `close`

**Events:** optional `gk-close` when close activated (provider still removes the item); bubbles/composed for consistency with other gk events.

## Visual / tokens

- Compact horizontal toast: icon | content | close; softer elevation / shadow than Card; soft fill from semantic tokens (reuse Alert-like `--gk-color-*` mapping).
- `default`: neutral / brand-tinted without a strong semantic icon (or minimal info-style).
- `loading`: spinning indicator; no auto-dismiss by default.
- Placement container: centered top/bottom stacks vs left/right aligned corner stacks (Naive-like).

## Docs

### Message pages (EN + zh-TW)

- Basic (trigger buttons → `gkMessage.info` / etc.)
- Types (including `loading`)
- Closable
- Duration (`0` and short ms)
- Placement (provider `placement` variants)
- Manual destroy / `destroyAll`

Demos must wrap interactive examples in `<gk-message-provider>` (page-level or per DemoCard).

Sidebar: insert **Message** after **Card** for both locales.

## Tests

- Provider reflects `placement`, `duration`, `closable`, `keep-alive-on-hover`, `max`
- `gkMessage.success('…')` appends a message; auto-removes after duration (fake timers)
- `duration: 0` stays until `destroy()` or close
- `loading` defaults to non-auto-dismiss
- `destroy()` / `destroyAll()` clear messages
- `max` drops oldest when exceeded
- `keepAliveOnHover`: timer pauses while hovered (when enabled)
- No provider → API throws
- Export `gk-message`, `gk-message-provider`, `gkMessage` (and types) from `@gk-ui/core`

## Success criteria

1. Message demos live in EN + zh-TW with working imperative API  
2. Placement, loading, destroy, and max behave as specified  
3. `pnpm test` (core) and `pnpm docs:build` pass  
4. Public exports include Message surface  
5. Distinct from Alert: Message removes itself; Alert only emits `gk-close`
