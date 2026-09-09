# gk-ui Design Spec

**Date:** 2026-09-09  
**Status:** Approved for planning  
**Working name:** `gk-ui` (rename later allowed)

## Goal

Build a personal/team design system as a Vue- and Alpine-compatible UI library, published to npm. Core is Lit Web Components; start small with Button; ship docs with live demos.

## Product positioning

- **Not** a full Element Plus / Ant Design Vue clone in v1.
- Brand-forward visual system for consumer / marketing surfaces (distinct color and typography), expressed as design tokens.
- Dual runtime support via **Web Components**, not separate Vue/Alpine implementations of each component.

## Architecture

pnpm monorepo:

```
gkVue/
  packages/
    tokens/     → @gk-ui/tokens
    core/       → @gk-ui/core
  apps/
    docs/       → VitePress docs + demos
```

### Package responsibilities

| Package | Responsibility |
|---------|----------------|
| `@gk-ui/tokens` | Brand tokens only: color, font, space, radius, shadow. Ship CSS custom properties; optional TS constants. |
| `@gk-ui/core` | Lit custom elements (`gk-*`). Shadow DOM. Consume tokens via CSS variables. Expose `::part` and documented CSS variables for theming. |
| `apps/docs` | Install guides, Vue/Alpine usage, component API pages, live demos of real custom elements. |

### Consumption

- Any environment: import `@gk-ui/core` (and tokens CSS), use `<gk-button>`.
- **Vue 3:** treat `gk-` as custom elements via `app.config.compilerOptions.isCustomElement`.
- **Alpine.js:** place `<gk-button>` in HTML; bind attributes/events with Alpine as usual.

No `@gk-ui/vue` wrapper in v1 (YAGNI). Add later only if DX demands it.

### npm publish (v1 packages)

- Publish `@gk-ui/tokens` and `@gk-ui/core` (scoped). If the npm org is not available yet, use a temporary unscoped name and migrate later; decide at publish time without blocking scaffolding.
- Docs site deploy (GitHub Pages / Cloudflare Pages) is independent of package publish.

## Styling and theming

**Choice:** Shadow DOM + explicit theme API (CSS variables + `::part`).

- Host apps load `@gk-ui/tokens` CSS once.
- Components read `--gk-*` variables inside shadow roots (with sensible fallbacks).
- Customization: override CSS variables on `:root` / ancestor, and/or style `::part(...)`.
- Docs ship a **provisional brand token set** that can be replaced wholesale later.

## Button (`gk-button`) — first component

### API

| Name | Values / type | Default | Notes |
|------|---------------|---------|-------|
| `variant` | `primary` \| `secondary` \| `ghost` \| `danger` | `primary` | |
| `size` | `sm` \| `md` \| `lg` | `md` | |
| `type` | `button` \| `submit` \| `reset` | `button` | Align with native `<button>` |
| `disabled` | boolean | `false` | |
| `loading` | boolean | `false` | Show loading state; block activation |
| `href` | string \| unset | — | When set, behave as link (internal `<a>` or equivalent) |

- **Slot:** default slot for label / icon content.
- **Events:** standard `click`; do not perform the primary action when `disabled` or `loading`.

### Out of scope for Button v1

- Icon system, button groups, full form-library integration.
- Full a11y toolkit beyond basics: focusable, keyboard activation, disabled semantics.

## Docs site

VitePress app under `apps/docs`:

- Home: intro + install
- Guide: quick start, tokens, Vue usage, Alpine usage
- Components: Button (API table + interactive demos for variant / size / loading / disabled)
- Demos render real `<gk-button>`, not static screenshots

## Tooling and quality

- **Authoring:** Lit for Web Components.
- **Build (core):** Vite → ESM + `.d.ts` for npm consumers.
- **Dev:** pnpm workspaces; docs consume local packages (watch / HMR as practical).
- **Tests (lean):** Vitest + Web Component testing helpers for `gk-button` (variant / disabled / loading). No docs E2E in v1.
- **Versioning (later):** changesets or manual bumps before publish.

## Success criteria — milestone 1

1. `pnpm install` and run docs; Button demos visible.
2. Vue example page and Alpine example page both exercise Button.
3. `@gk-ui/core` builds installable artifacts (actual npm publish can be milestone 2).

## Non-goals (near term)

- Large component catalog.
- Separate Vue and Alpine component implementations.
- Dark mode as a product requirement (tokens may allow it later; not required for milestone 1).
- Vue wrapper package.

## Risks and decisions already settled

| Topic | Decision |
|-------|----------|
| Framework bridge | Web Components (Lit), not dual codebases |
| Style encapsulation | Shadow DOM + tokens + parts |
| Scope | Start with Button only; grow slowly |
| Repo shape | pnpm monorepo: tokens + core + docs |
| Name | Temporary `gk-ui` / `@gk-ui/*` |
