# gk-ui

Brand-forward Web Components (Lit) with design tokens. Vue and Alpine consume the same `<gk-*>` elements.

## Packages

- `@gk-ui/tokens` — CSS custom properties
- `@gk-ui/core` — Lit components (`gk-button`)

## Develop

```bash
pnpm install
pnpm --filter @gk-ui/core test
pnpm build
pnpm docs:dev
```

**Windows note:** If `pnpm` is not on PATH, use `corepack pnpm` (for example `corepack pnpm install`, `corepack pnpm --filter @gk-ui/core test`). Root scripts such as `build` and `docs:build` nest a bare `pnpm` call; if those fail with “‘pnpm’ is not recognized”, either put `pnpm` on PATH (`corepack enable`, may need admin) or run the filters directly:

```bash
corepack pnpm -r --filter @gk-ui/tokens --filter @gk-ui/core run build
corepack pnpm --filter @gk-ui/docs build
```

## Spec

See `docs/superpowers/specs/2026-09-09-gk-ui-design.md`.
