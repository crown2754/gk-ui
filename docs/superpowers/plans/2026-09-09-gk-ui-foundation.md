# gk-ui Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the `gk-ui` pnpm monorepo with `@gk-ui/tokens`, Lit-based `@gk-ui/core` (`gk-button`), and a VitePress docs site that demos Vue and Alpine usage.

**Architecture:** Design tokens ship as CSS custom properties. Components are Lit Web Components with Shadow DOM, consuming `--gk-*` variables and exposing `::part`. Docs import local workspace packages and render real custom elements. Vue and Alpine consume the same WC—no framework wrappers in this milestone.

**Tech Stack:** pnpm workspaces, TypeScript, Lit 3, Vite (library mode), Vitest + happy-dom, `@open-wc/testing`, VitePress 1.x, Vue 3 (docs demos only), Alpine.js (docs demos only).

## Global Constraints

- Package names: `@gk-ui/tokens`, `@gk-ui/core` (working name `gk-ui`; rename later allowed).
- Custom element prefix: `gk-` only.
- Styling: Shadow DOM + CSS variables + `::part`; no Light-DOM-only components.
- First component only: `gk-button` (no icon system, button group, or Vue wrapper package).
- Tests: Vitest unit tests for Button; no docs E2E.
- npm publish and docs hosting are out of scope for this plan (build artifacts must exist).
- Node: use current LTS; package manager: **pnpm** only.
- Spec reference: `docs/superpowers/specs/2026-09-09-gk-ui-design.md`.

---

## File Structure

```
gkVue/
  package.json                          # workspace root scripts
  pnpm-workspace.yaml
  .gitignore
  tsconfig.base.json                    # shared TS defaults
  packages/
    tokens/
      package.json                      # @gk-ui/tokens
      tokens.css                        # :root --gk-* variables
      index.ts                          # re-export path helper / token map (optional TS)
      package exports → tokens.css
    core/
      package.json                      # @gk-ui/core
      tsconfig.json
      tsconfig.build.json
      vite.config.ts                    # lib build + vitest
      src/
        index.ts                        # side-effect import registering elements
        button/
          gk-button.ts                  # Lit element
          gk-button.styles.ts           # css tagged template
      src/button/gk-button.test.ts
  apps/
    docs/
      package.json
      .vitepress/
        config.ts
        theme/
          index.ts                      # import tokens + core
      index.md
      guide/
        getting-started.md
        tokens.md
        vue.md
        alpine.md
      components/
        button.md
      public/                           # optional static assets
```

---

### Task 1: Monorepo root scaffolding

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `.gitignore`
- Create: `tsconfig.base.json`
- Create: `packages/tokens/.gitkeep` (temporary; removed in Task 2)
- Create: `packages/core/.gitkeep` (temporary; removed in Task 3)
- Create: `apps/docs/.gitkeep` (temporary; removed in Task 6)

**Interfaces:**
- Consumes: none
- Produces: pnpm workspace roots `packages/*` and `apps/*`; root scripts `build`, `test`, `docs:dev`

- [ ] **Step 1: Create workspace config files**

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - "packages/*"
  - "apps/*"
```

Create root `package.json`:

```json
{
  "name": "gk-ui-monorepo",
  "private": true,
  "packageManager": "pnpm@9.15.0",
  "scripts": {
    "build": "pnpm -r --filter @gk-ui/tokens --filter @gk-ui/core run build",
    "test": "pnpm --filter @gk-ui/core test",
    "docs:dev": "pnpm --filter @gk-ui/docs dev",
    "docs:build": "pnpm --filter @gk-ui/docs build"
  },
  "engines": {
    "node": ">=20"
  }
}
```

Create `.gitignore`:

```
node_modules
dist
.vitepress/cache
.vitepress/dist
*.local
.DS_Store
coverage
```

Create `tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "experimentalDecorators": true,
    "useDefineForClassFields": false
  }
}
```

Create placeholder dirs so workspace resolves:

```bash
mkdir packages\tokens packages\core apps\docs
echo. > packages\tokens\.gitkeep
echo. > packages\core\.gitkeep
echo. > apps\docs\.gitkeep
```

- [ ] **Step 2: Verify pnpm works**

Run: `pnpm -v`  
Expected: prints a version (install pnpm globally via `corepack enable` then `corepack prepare pnpm@9.15.0 --activate` if missing).

Run: `pnpm install`  
Expected: lockfile created; may warn about empty packages—OK until Task 2–3 add real `package.json` files. If install fails on empty packages, skip until after Task 2 Step 1 and re-run.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-workspace.yaml .gitignore tsconfig.base.json packages apps
git commit -m "chore: scaffold pnpm monorepo workspace"
```

---

### Task 2: `@gk-ui/tokens` package

**Files:**
- Delete: `packages/tokens/.gitkeep`
- Create: `packages/tokens/package.json`
- Create: `packages/tokens/tokens.css`
- Create: `packages/tokens/index.ts`
- Create: `packages/tokens/tsconfig.json`

**Interfaces:**
- Consumes: none
- Produces:
  - CSS file export `@gk-ui/tokens/tokens.css` defining `--gk-color-*`, `--gk-font-*`, `--gk-space-*`, `--gk-radius-*`, `--gk-shadow-*`, `--gk-font-family-*`
  - Package name `@gk-ui/tokens` version `0.0.1`
  - TS export `tokens` object mirroring key CSS variable names as string values (the CSS variable name, e.g. `'--gk-color-brand'`)

- [ ] **Step 1: Create package manifest and CSS tokens**

`packages/tokens/package.json`:

```json
{
  "name": "@gk-ui/tokens",
  "version": "0.0.1",
  "description": "Design tokens for gk-ui",
  "type": "module",
  "exports": {
    ".": {
      "types": "./index.ts",
      "default": "./index.ts"
    },
    "./tokens.css": "./tokens.css"
  },
  "files": ["tokens.css", "index.ts"],
  "scripts": {
    "build": "node -e \"console.log('@gk-ui/tokens: CSS package, nothing to bundle')\""
  }
}
```

`packages/tokens/tokens.css` (provisional brand: deep teal + coral; replace wholesale later):

```css
:root {
  /* Color */
  --gk-color-brand: #0f6e56;
  --gk-color-brand-hover: #0b5a46;
  --gk-color-accent: #e85d4c;
  --gk-color-accent-hover: #d14a3a;
  --gk-color-danger: #b42318;
  --gk-color-danger-hover: #912018;
  --gk-color-surface: #f7f4ef;
  --gk-color-surface-elevated: #ffffff;
  --gk-color-text: #1c1917;
  --gk-color-text-muted: #57534e;
  --gk-color-border: #d6d3d1;
  --gk-color-focus-ring: #0f6e56;

  /* Typography */
  --gk-font-family-sans: "Source Sans 3", "Segoe UI", sans-serif;
  --gk-font-family-display: "Fraunces", Georgia, serif;
  --gk-font-size-sm: 0.875rem;
  --gk-font-size-md: 1rem;
  --gk-font-size-lg: 1.125rem;
  --gk-font-weight-medium: 500;
  --gk-font-weight-semibold: 600;
  --gk-line-height-tight: 1.25;

  /* Space */
  --gk-space-1: 0.25rem;
  --gk-space-2: 0.5rem;
  --gk-space-3: 0.75rem;
  --gk-space-4: 1rem;
  --gk-space-5: 1.25rem;
  --gk-space-6: 1.5rem;

  /* Radius */
  --gk-radius-sm: 0.375rem;
  --gk-radius-md: 0.5rem;
  --gk-radius-lg: 0.75rem;
  --gk-radius-pill: 9999px;

  /* Shadow */
  --gk-shadow-sm: 0 1px 2px rgb(28 25 23 / 0.08);
  --gk-shadow-md: 0 4px 12px rgb(28 25 23 / 0.12);
}
```

`packages/tokens/index.ts`:

```ts
/** CSS custom property names for gk-ui tokens (values are the variable names). */
export const tokens = {
  colorBrand: "--gk-color-brand",
  colorBrandHover: "--gk-color-brand-hover",
  colorAccent: "--gk-color-accent",
  colorDanger: "--gk-color-danger",
  colorText: "--gk-color-text",
  colorSurface: "--gk-color-surface",
  fontFamilySans: "--gk-font-family-sans",
  fontFamilyDisplay: "--gk-font-family-display",
  space2: "--gk-space-2",
  space3: "--gk-space-3",
  space4: "--gk-space-4",
  radiusMd: "--gk-radius-md",
  shadowSm: "--gk-shadow-sm",
} as const;

export type TokenName = (typeof tokens)[keyof typeof tokens];
```

`packages/tokens/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["index.ts"]
}
```

Delete `packages/tokens/.gitkeep` if present.

- [ ] **Step 2: Install and smoke-check**

Run: `pnpm install`  
Expected: `@gk-ui/tokens` linked in workspace.

Run: `pnpm --filter @gk-ui/tokens build`  
Expected: prints `@gk-ui/tokens: CSS package, nothing to bundle`

- [ ] **Step 3: Commit**

```bash
git add packages/tokens
git commit -m "feat(tokens): add provisional brand CSS custom properties"
```

---

### Task 3: `@gk-ui/core` package scaffold (build + test harness)

**Files:**
- Delete: `packages/core/.gitkeep`
- Create: `packages/core/package.json`
- Create: `packages/core/tsconfig.json`
- Create: `packages/core/tsconfig.build.json`
- Create: `packages/core/vite.config.ts`
- Create: `packages/core/src/index.ts`
- Create: `packages/core/src/button/gk-button.ts` (minimal stub registering the element)
- Create: `packages/core/src/button/gk-button.styles.ts` (empty styles placeholder)

**Interfaces:**
- Consumes: `@gk-ui/tokens` (peer/runtime dependency for consumers; core styles reference `--gk-*` by name with fallbacks, does not import CSS into Shadow DOM as a file requirement—docs/host load tokens)
- Produces:
  - Package `@gk-ui/core@0.0.1`
  - Entry `src/index.ts` that imports `./button/gk-button.js` (side-effect registration)
  - Vite lib build outputting `dist/index.js` (ESM) + `dist/index.d.ts`
  - Script `test` → Vitest
  - Custom element tag `gk-button` registered (stub OK until Task 4)

- [ ] **Step 1: Create package.json and configs**

`packages/core/package.json`:

```json
{
  "name": "@gk-ui/core",
  "version": "0.0.1",
  "description": "Lit Web Components for gk-ui",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "sideEffects": [
    "./dist/index.js",
    "./src/index.ts",
    "./src/button/gk-button.ts"
  ],
  "scripts": {
    "build": "vite build && tsc -p tsconfig.build.json",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "lit": "^3.2.1"
  },
  "devDependencies": {
    "@open-wc/testing": "^4.0.0",
    "happy-dom": "^15.11.7",
    "typescript": "^5.7.2",
    "vite": "^6.0.3",
    "vite-plugin-dts": "^4.3.0",
    "vitest": "^2.1.8"
  },
  "peerDependencies": {
    "@gk-ui/tokens": "workspace:^"
  },
  "peerDependenciesMeta": {
    "@gk-ui/tokens": {
      "optional": true
    }
  }
}
```

`packages/core/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",
    "types": ["vitest/globals"]
  },
  "include": ["src/**/*.ts", "vite.config.ts"]
}
```

`packages/core/tsconfig.build.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "emitDeclarationOnly": true,
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.test.ts"]
}
```

`packages/core/vite.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: [/^lit/],
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 2: Add stub `gk-button` and entry**

`packages/core/src/button/gk-button.styles.ts`:

```ts
import { css } from "lit";

export const buttonStyles = css`
  :host {
    display: inline-block;
  }
`;
```

`packages/core/src/button/gk-button.ts`:

```ts
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { buttonStyles } from "./gk-button.styles.js";

export type GkButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type GkButtonSize = "sm" | "md" | "lg";
export type GkButtonType = "button" | "submit" | "reset";

@customElement("gk-button")
export class GkButton extends LitElement {
  static styles = buttonStyles;

  @property({ reflect: true })
  variant: GkButtonVariant = "primary";

  @property({ reflect: true })
  size: GkButtonSize = "md";

  @property({ reflect: true })
  type: GkButtonType = "button";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  loading = false;

  @property({ reflect: true })
  href?: string;

  render() {
    return html`<button part="base" type=${this.type} ?disabled=${this.disabled || this.loading}>
      <slot></slot>
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-button": GkButton;
  }
}
```

`packages/core/src/index.ts`:

```ts
export { GkButton } from "./button/gk-button.js";
export type { GkButtonVariant, GkButtonSize, GkButtonType } from "./button/gk-button.js";
```

Note: exporting the class causes the module to evaluate and register `@customElement("gk-button")`. Keep a side-effect import pattern: ensure consumers `import '@gk-ui/core'` load this module. Optionally add `import './button/gk-button.js'` at top of `index.ts` if tree-shaking ever drops registration—prefer explicit:

```ts
import "./button/gk-button.js";
export { GkButton } from "./button/gk-button.js";
export type { GkButtonVariant, GkButtonSize, GkButtonType } from "./button/gk-button.js";
```

Use the explicit import form above as the final `index.ts`.

- [ ] **Step 3: Install deps and verify build**

Run: `pnpm install`  
Expected: lit and vite installed under `packages/core`.

Run: `pnpm --filter @gk-ui/core build`  
Expected: `packages/core/dist/index.js` and `packages/core/dist/index.d.ts` (or `.d.ts` next to emitted files) exist. If `vite-plugin-dts` was listed but unused, `tsc -p tsconfig.build.json` alone must emit declarations—prefer that path (already in build script). If build fails on decorator settings, confirm `experimentalDecorators: true` and `useDefineForClassFields: false` in base config.

- [ ] **Step 4: Commit**

```bash
git add packages/core pnpm-lock.yaml
git commit -m "feat(core): scaffold Lit package with stub gk-button"
```

---

### Task 4: `gk-button` behavior tests (TDD) — disabled / loading / variant

**Files:**
- Create: `packages/core/src/button/gk-button.test.ts`
- Modify: `packages/core/src/button/gk-button.ts` (click guard + activation helper)

**Interfaces:**
- Consumes: `GkButton` from Task 3
- Produces:
  - `private handleClick(event: Event): void` that calls `event.preventDefault()` and `event.stopImmediatePropagation()` when `disabled` or `loading`
  - Attribute reflection for `variant`, `disabled`, `loading` (already stubbed)
  - Tests covering: default variant, disabled blocks host click listeners, loading blocks host click listeners

- [ ] **Step 1: Write failing tests**

`packages/core/src/button/gk-button.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-button.js";
import type { GkButton } from "./gk-button.js";

describe("gk-button", () => {
  it("defaults variant to primary", async () => {
    const el = await fixture<GkButton>(html`<gk-button>Save</gk-button>`);
    expect(el.variant).toBe("primary");
    expect(el.getAttribute("variant")).toBe("primary");
  });

  it("does not notify host click listeners when disabled", async () => {
    const el = await fixture<GkButton>(html`<gk-button disabled>Save</gk-button>`);
    const spy = vi.fn();
    el.addEventListener("click", spy);
    el.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it("does not notify host click listeners when loading", async () => {
    const el = await fixture<GkButton>(html`<gk-button loading>Save</gk-button>`);
    const spy = vi.fn();
    el.addEventListener("click", spy);
    el.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it("notifies host click listeners when enabled", async () => {
    const el = await fixture<GkButton>(html`<gk-button>Save</gk-button>`);
    const spy = vi.fn();
    el.addEventListener("click", spy);
    el.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run tests — expect failures on click guards**

Run: `pnpm --filter @gk-ui/core test`  
Expected: FAIL on disabled/loading tests (native `el.click()` still bubbles to host because stub only disables inner `<button>`, not host-level synthetic click). Default variant test may PASS already.

- [ ] **Step 3: Implement click guarding**

Update `packages/core/src/button/gk-button.ts` to intercept clicks in the capture phase on the host:

```ts
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { buttonStyles } from "./gk-button.styles.js";

export type GkButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type GkButtonSize = "sm" | "md" | "lg";
export type GkButtonType = "button" | "submit" | "reset";

@customElement("gk-button")
export class GkButton extends LitElement {
  static styles = buttonStyles;

  @property({ reflect: true })
  variant: GkButtonVariant = "primary";

  @property({ reflect: true })
  size: GkButtonSize = "md";

  @property({ reflect: true })
  type: GkButtonType = "button";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  loading = false;

  @property({ reflect: true })
  href?: string;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this.handleClick, true);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick, true);
    super.disconnectedCallback();
  }

  private handleClick = (event: Event) => {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  render() {
    const inactive = this.disabled || this.loading;
    if (this.href) {
      return html`
        <a
          part="base"
          href=${this.href}
          aria-disabled=${inactive ? "true" : "false"}
          tabindex=${inactive ? -1 : 0}
        >
          <slot></slot>
        </a>
      `;
    }
    return html`
      <button part="base" type=${this.type} ?disabled=${inactive} aria-busy=${this.loading ? "true" : "false"}>
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-button": GkButton;
  }
}
```

- [ ] **Step 4: Run tests — expect PASS**

Run: `pnpm --filter @gk-ui/core test`  
Expected: all 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/button
git commit -m "feat(core): guard gk-button clicks when disabled or loading"
```

---

### Task 5: Button visuals — sizes, variants, loading UI, `::part`

**Files:**
- Modify: `packages/core/src/button/gk-button.styles.ts`
- Modify: `packages/core/src/button/gk-button.ts` (loading indicator in template)
- Modify: `packages/core/src/button/gk-button.test.ts` (size + href smoke tests)

**Interfaces:**
- Consumes: CSS variables `--gk-color-brand`, `--gk-color-brand-hover`, `--gk-color-accent`, `--gk-color-danger`, `--gk-color-danger-hover`, `--gk-color-text`, `--gk-color-border`, `--gk-color-surface-elevated`, `--gk-font-family-sans`, `--gk-font-size-*`, `--gk-space-*`, `--gk-radius-md`, `--gk-shadow-sm`, `--gk-color-focus-ring` (with hex fallbacks identical to provisional tokens)
- Produces:
  - `part="base"` on interactive element
  - `part="label"` wrapping slot
  - `part="spinner"` when `loading`
  - Host attributes `variant` / `size` drive styles via `:host([variant="..."])` and `:host([size="..."])`

- [ ] **Step 1: Add size and href tests**

Append to `packages/core/src/button/gk-button.test.ts`:

```ts
  it("reflects size attribute", async () => {
    const el = await fixture<GkButton>(html`<gk-button size="lg">Go</gk-button>`);
    expect(el.size).toBe("lg");
    expect(el.getAttribute("size")).toBe("lg");
  });

  it("renders an anchor when href is set", async () => {
    const el = await fixture<GkButton>(html`<gk-button href="/docs">Docs</gk-button>`);
    await el.updateComplete;
    const anchor = el.shadowRoot?.querySelector("a[part='base']");
    expect(anchor).toBeTruthy();
    expect(anchor?.getAttribute("href")).toBe("/docs");
  });
```

Run: `pnpm --filter @gk-ui/core test`  
Expected: PASS (behavior already implemented in Task 4). If FAIL, fix `href` render branch before styling.

- [ ] **Step 2: Implement full styles and loading markup**

Replace `packages/core/src/button/gk-button.styles.ts` with:

```ts
import { css } from "lit";

export const buttonStyles = css`
  :host {
    display: inline-block;
    vertical-align: middle;
  }

  [part="base"] {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--gk-space-2, 0.5rem);
    margin: 0;
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    font-weight: var(--gk-font-weight-semibold, 600);
    line-height: var(--gk-line-height-tight, 1.25);
    text-decoration: none;
    border: 1px solid transparent;
    border-radius: var(--gk-radius-md, 0.5rem);
    cursor: pointer;
    box-shadow: var(--gk-shadow-sm, 0 1px 2px rgb(28 25 23 / 0.08));
    transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease,
      box-shadow 120ms ease, transform 120ms ease;
  }

  [part="base"]:focus-visible {
    outline: 2px solid var(--gk-color-focus-ring, #0f6e56);
    outline-offset: 2px;
  }

  :host([size="sm"]) [part="base"] {
    font-size: var(--gk-font-size-sm, 0.875rem);
    padding: var(--gk-space-1, 0.25rem) var(--gk-space-3, 0.75rem);
    min-height: 2rem;
  }

  :host([size="md"]) [part="base"],
  :host(:not([size])) [part="base"] {
    font-size: var(--gk-font-size-md, 1rem);
    padding: var(--gk-space-2, 0.5rem) var(--gk-space-4, 1rem);
    min-height: 2.5rem;
  }

  :host([size="lg"]) [part="base"] {
    font-size: var(--gk-font-size-lg, 1.125rem);
    padding: var(--gk-space-3, 0.75rem) var(--gk-space-5, 1.25rem);
    min-height: 3rem;
  }

  :host([variant="primary"]) [part="base"],
  :host(:not([variant])) [part="base"] {
    background: var(--gk-color-brand, #0f6e56);
    color: #fff;
  }

  :host([variant="primary"]) [part="base"]:hover,
  :host(:not([variant])) [part="base"]:hover {
    background: var(--gk-color-brand-hover, #0b5a46);
  }

  :host([variant="secondary"]) [part="base"] {
    background: var(--gk-color-surface-elevated, #fff);
    color: var(--gk-color-text, #1c1917);
    border-color: var(--gk-color-border, #d6d3d1);
  }

  :host([variant="ghost"]) [part="base"] {
    background: transparent;
    color: var(--gk-color-brand, #0f6e56);
    box-shadow: none;
  }

  :host([variant="danger"]) [part="base"] {
    background: var(--gk-color-danger, #b42318);
    color: #fff;
  }

  :host([variant="danger"]) [part="base"]:hover {
    background: var(--gk-color-danger-hover, #912018);
  }

  :host([disabled]) [part="base"],
  :host([loading]) [part="base"] {
    opacity: 0.55;
    cursor: not-allowed;
    pointer-events: none;
  }

  [part="spinner"] {
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: gk-spin 0.7s linear infinite;
  }

  @keyframes gk-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
```

Update `render()` label/spinner structure in `gk-button.ts` (keep click handler and properties unchanged):

```ts
  private renderContent() {
    return html`
      ${this.loading ? html`<span part="spinner" aria-hidden="true"></span>` : null}
      <span part="label"><slot></slot></span>
    `;
  }

  render() {
    const inactive = this.disabled || this.loading;
    if (this.href) {
      return html`
        <a
          part="base"
          href=${this.href}
          aria-disabled=${inactive ? "true" : "false"}
          tabindex=${inactive ? -1 : 0}
        >
          ${this.renderContent()}
        </a>
      `;
    }
    return html`
      <button
        part="base"
        type=${this.type}
        ?disabled=${inactive}
        aria-busy=${this.loading ? "true" : "false"}
      >
        ${this.renderContent()}
      </button>
    `;
  }
```

- [ ] **Step 3: Re-run tests and build**

Run: `pnpm --filter @gk-ui/core test`  
Expected: all PASS.

Run: `pnpm --filter @gk-ui/core build`  
Expected: `dist/index.js` rebuilt successfully.

- [ ] **Step 4: Commit**

```bash
git add packages/core/src/button
git commit -m "feat(core): style gk-button variants, sizes, and loading state"
```

---

### Task 6: VitePress docs app scaffold

**Files:**
- Delete: `apps/docs/.gitkeep`
- Create: `apps/docs/package.json`
- Create: `apps/docs/.vitepress/config.ts`
- Create: `apps/docs/.vitepress/theme/index.ts`
- Create: `apps/docs/index.md`

**Interfaces:**
- Consumes: workspace `@gk-ui/tokens`, `@gk-ui/core` (via `workspace:*`)
- Produces: package `@gk-ui/docs` with scripts `dev` / `build` / `preview`; theme imports tokens CSS + registers core elements; VitePress nav stubs for Guide + Components

- [ ] **Step 1: Create docs package and theme wiring**

`apps/docs/package.json`:

```json
{
  "name": "@gk-ui/docs",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vitepress dev",
    "build": "vitepress build",
    "preview": "vitepress preview"
  },
  "dependencies": {
    "@gk-ui/core": "workspace:*",
    "@gk-ui/tokens": "workspace:*",
    "alpinejs": "^3.14.8",
    "vue": "^3.5.13"
  },
  "devDependencies": {
    "vitepress": "^1.5.0",
    "typescript": "^5.7.2"
  }
}
```

`apps/docs/.vitepress/config.ts`:

```ts
import { defineConfig } from "vitepress";

export default defineConfig({
  title: "gk-ui",
  description: "Brand-forward Web Components for Vue and Alpine",
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Components", link: "/components/button" },
    ],
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Getting started", link: "/guide/getting-started" },
          { text: "Tokens", link: "/guide/tokens" },
          { text: "Vue", link: "/guide/vue" },
          { text: "Alpine", link: "/guide/alpine" },
        ],
      },
      {
        text: "Components",
        items: [{ text: "Button", link: "/components/button" }],
      },
    ],
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith("gk-"),
      },
    },
  },
});
```

`apps/docs/.vitepress/theme/index.ts`:

```ts
import DefaultTheme from "vitepress/theme";
import "@gk-ui/tokens/tokens.css";
import "@gk-ui/core";
import type { Theme } from "vitepress";

const theme: Theme = {
  extends: DefaultTheme,
};

export default theme;
```

`apps/docs/index.md`:

```md
---
layout: home
hero:
  name: gk-ui
  text: Brand-forward Web Components
  tagline: One component core for Vue and Alpine — start with Button.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: Button
      link: /components/button
---
```

- [ ] **Step 2: Install and verify docs boot**

Run: `pnpm install`  
Run: `pnpm --filter @gk-ui/core build`  
Run: `pnpm docs:dev`  
Expected: VitePress starts (URL printed, usually `http://localhost:5173`). Open home—title `gk-ui` visible. Stop with Ctrl+C after smoke check.

If Vite cannot resolve `@gk-ui/core` to source during docs, add to `apps/docs/.vitepress/config.ts`:

```ts
  vite: {
    optimizeDeps: {
      exclude: ["@gk-ui/core"],
    },
    server: {
      fs: { allow: ["../.."] },
    },
  },
```

And point dependency to source via package `exports` development condition **or** alias:

```ts
  vite: {
    resolve: {
      alias: {
        "@gk-ui/core": new URL("../../../packages/core/src/index.ts", import.meta.url).pathname,
      },
    },
  },
```

On Windows, prefer `path.resolve` instead of `fileURLToPath` pathname quirks:

```ts
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "../../..");

// inside defineConfig:
vite: {
  resolve: {
    alias: {
      "@gk-ui/core": path.join(root, "packages/core/src/index.ts"),
      "@gk-ui/tokens/tokens.css": path.join(root, "packages/tokens/tokens.css"),
    },
  },
},
```

Bake the Windows-safe alias into `config.ts` from the start so docs always use source.

- [ ] **Step 3: Commit**

```bash
git add apps/docs pnpm-lock.yaml
git commit -m "feat(docs): scaffold VitePress with tokens and core wired"
```

---

### Task 7: Guide pages — getting started, tokens, Vue, Alpine

**Files:**
- Create: `apps/docs/guide/getting-started.md`
- Create: `apps/docs/guide/tokens.md`
- Create: `apps/docs/guide/vue.md`
- Create: `apps/docs/guide/alpine.md`
- Modify: `apps/docs/.vitepress/theme/index.ts` (register Alpine on client for Alpine guide demos)

**Interfaces:**
- Consumes: `<gk-button>` custom element; Alpine `data` API
- Produces: four guide pages with at least one live `<gk-button>` demo each on Vue and Alpine pages

- [ ] **Step 1: Write guide markdown**

`apps/docs/guide/getting-started.md`:

```md
# Getting started

## Install

```bash
pnpm add @gk-ui/core @gk-ui/tokens
```

## Use

```js
import "@gk-ui/tokens/tokens.css";
import "@gk-ui/core";
```

```html
<gk-button variant="primary">Continue</gk-button>
```

## Live demo

<gk-button>Primary</gk-button>
<gk-button variant="secondary">Secondary</gk-button>
```

`apps/docs/guide/tokens.md`:

```md
# Tokens

Load once in your app:

```js
import "@gk-ui/tokens/tokens.css";
```

Override any `--gk-*` variable on `:root` or a parent:

```css
:root {
  --gk-color-brand: #084c3a;
}
```

Components read these variables inside Shadow DOM (with fallbacks).
```

`apps/docs/guide/vue.md`:

```md
# Vue

Tell Vue that `gk-*` tags are custom elements:

```ts
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("gk-");
app.mount("#app");
```

This docs site already sets `isCustomElement` in VitePress config.

## Demo

<gk-button variant="primary" size="lg">Vue + gk-button</gk-button>
```

`apps/docs/guide/alpine.md`:

```md
# Alpine.js

Web Components work in plain HTML. Bind with Alpine as usual (host listeners are compatible with `gk-button` click guarding).

## Demo

<div x-data="{ count: 0 }">
  <p>Count: <span x-text="count"></span></p>
  <gk-button x-on:click="count = count + 1">Increment</gk-button>
</div>
```
- [ ] **Step 2: Initialize Alpine in the VitePress theme (client only)**

Update `apps/docs/.vitepress/theme/index.ts`:

```ts
import DefaultTheme from "vitepress/theme";
import "@gk-ui/tokens/tokens.css";
import "@gk-ui/core";
import type { Theme } from "vitepress";

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp() {
    if (typeof window === "undefined") return;
    void import("alpinejs").then((mod) => {
      const Alpine = mod.default;
      window.Alpine = Alpine;
      Alpine.start();
    });
  },
};

export default theme;
```

Add ambient type in `apps/docs/alpine-global.d.ts`:

```ts
import type Alpine from "alpinejs";

declare global {
  interface Window {
    Alpine: typeof Alpine;
  }
}

export {};
```

- [ ] **Step 3: Manual verify**

Run: `pnpm docs:dev`  
Check `/guide/getting-started`, `/guide/vue`, `/guide/alpine`—buttons render with brand styles; Alpine counter increments.  
Stop server when done.

- [ ] **Step 4: Commit**

```bash
git add apps/docs
git commit -m "docs: add getting started, tokens, Vue, and Alpine guides"
```

---

### Task 8: Button component docs page (API + interactive demos)

**Files:**
- Create: `apps/docs/components/button.md`
- Create: `apps/docs/components/button.demo.vue` (optional small Vue SFC for interactive controls)

**Interfaces:**
- Consumes: `gk-button` props `variant`, `size`, `loading`, `disabled`
- Produces: docs page with API table and interactive demo controlling those four props

- [ ] **Step 1: Create interactive Vue demo component**

`apps/docs/components/button.demo.vue`:

```vue
<script setup lang="ts">
import { ref } from "vue";

const variant = ref<"primary" | "secondary" | "ghost" | "danger">("primary");
const size = ref<"sm" | "md" | "lg">("md");
const loading = ref(false);
const disabled = ref(false);
</script>

<template>
  <div style="display: grid; gap: 1rem; max-width: 28rem;">
    <label>
      Variant
      <select v-model="variant">
        <option value="primary">primary</option>
        <option value="secondary">secondary</option>
        <option value="ghost">ghost</option>
        <option value="danger">danger</option>
      </select>
    </label>
    <label>
      Size
      <select v-model="size">
        <option value="sm">sm</option>
        <option value="md">md</option>
        <option value="lg">lg</option>
      </select>
    </label>
    <label><input v-model="loading" type="checkbox" /> loading</label>
    <label><input v-model="disabled" type="checkbox" /> disabled</label>

    <gk-button :variant="variant" :size="size" :loading="loading" :disabled="disabled">
      Button
    </gk-button>
  </div>
</template>
```

Register in theme so markdown can use it:

Update `apps/docs/.vitepress/theme/index.ts` `enhanceApp`:

```ts
import ButtonDemo from "../../components/button.demo.vue";

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("ButtonDemo", ButtonDemo);
    if (typeof window === "undefined") return;
    void import("alpinejs").then((mod) => {
      const Alpine = mod.default;
      window.Alpine = Alpine;
      Alpine.start();
    });
  },
};
```

- [ ] **Step 2: Write `button.md`**

`apps/docs/components/button.md`:

```md
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
```

- [ ] **Step 3: Verify**

Run: `pnpm docs:dev`  
Open `/components/button`—interactive controls change the live button; all four variants visible.

- [ ] **Step 4: Commit**

```bash
git add apps/docs
git commit -m "docs: add Button API page with interactive demo"
```

---

### Task 9: Milestone 1 verification

**Files:**
- Modify: none required unless verification finds gaps
- Optional Create: `README.md` at repo root with install / docs / test commands

**Interfaces:**
- Consumes: all prior tasks
- Produces: evidence that success criteria 1–3 pass

- [ ] **Step 1: Run full test + build**

```bash
pnpm install
pnpm --filter @gk-ui/core test
pnpm build
pnpm docs:build
```

Expected:
- tests PASS
- `packages/core/dist/index.js` exists
- `packages/tokens/tokens.css` exists
- docs build succeeds (output under `apps/docs/.vitepress/dist`)

- [ ] **Step 2: Add root README**

`README.md`:

```md
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

## Spec

See `docs/superpowers/specs/2026-09-09-gk-ui-design.md`.
```

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add root README for monorepo workflows"
```

- [ ] **Step 4: Confirm milestone checklist**

- [x] Docs run locally and show Button demos  
- [x] Vue guide + Alpine guide exercise Button  
- [x] `@gk-ui/core` produces installable `dist` artifacts  

(npm publish intentionally deferred.)

---

## Spec coverage self-review

| Spec requirement | Task |
|------------------|------|
| pnpm monorepo tokens + core + docs | 1, 2, 3, 6 |
| `@gk-ui/tokens` CSS variables | 2 |
| Lit WC Shadow DOM + parts + CSS vars | 3, 4, 5 |
| `gk-button` API (variant/size/type/disabled/loading/href/slot) | 4, 5 |
| Click blocked when disabled/loading | 4 |
| VitePress docs + live demos | 6, 7, 8 |
| Vue `isCustomElement` + Alpine usage pages | 6, 7 |
| Vitest button tests | 4, 5 |
| Vite ESM + `.d.ts` build | 3, 9 |
| No Vue wrapper / no E2E / no publish | honored (omitted) |

**Placeholder scan:** none.  
**Type consistency:** `GkButtonVariant` / `GkButtonSize` / `GkButtonType` match docs API table and demo Vue types.
