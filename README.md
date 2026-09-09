# gk-ui

Brand-forward Web Components (Lit) with design tokens. Vue and Alpine consume the same `<gk-*>` elements.

## Packages

- `@gk-ui/tokens` — CSS custom properties
- `@gk-ui/core` — Lit components (`gk-button`)

## Develop

```bash
pnpm install
pnpm test
pnpm build
pnpm docs:dev
```

Docs languages: English (`/`) and 繁體中文 (`/zh-TW/`). Switch from the nav language menu.

On Windows when `pnpm` is not on PATH, prefix commands with `corepack` (e.g. `corepack pnpm install`). Root `package.json` scripts invoke `corepack pnpm` internally so `pnpm build`, `pnpm test`, and `pnpm docs:build` work without a global `pnpm` shim.

## Spec

See `docs/superpowers/specs/2026-09-09-gk-ui-design.md`.
