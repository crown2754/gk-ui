# Button Appearance Modes & Button Group Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Naive-style boolean `secondary` / `dashed` / `text` on `gk-button`, plus a horizontal `gk-button-group`, with EN/zh-TW docs demos.

**Architecture:** Keep the existing solid `variant` system. Appearance modifiers are reflected boolean attributes with CSS precedence `text` > `dashed` > `secondary` > solid. Group is a separate Lit host that flushes slotted `gk-button` edges and disables standalone hover nudge via `:host-context(gk-button-group)`.

**Tech Stack:** Lit 3, Vitest + `@open-wc/testing`, VitePress docs, pnpm workspace `@gk-ui/core`.

## Global Constraints

- Appearance precedence: `text` > `dashed` > `secondary` > solid (from spec).
- Keep existing `variant="secondary"` gray solid type; do not remove it.
- Button group v1: horizontal only; no size/variant inheritance; no vertical mode.
- Tests: `corepack pnpm --filter @gk-ui/core test`
- Docs build: `corepack pnpm docs:build`
- Commit after each task; do not push unless asked.

## File map

| File | Responsibility |
|------|----------------|
| `packages/core/src/button/gk-button.ts` | Add `secondary` / `dashed` / `text` boolean props |
| `packages/core/src/button/gk-button.styles.ts` | Appearance CSS + group context overrides |
| `packages/core/src/button/gk-button.test.ts` | Reflect + precedence tests |
| `packages/core/src/button/gk-button-group.ts` | New `gk-button-group` element |
| `packages/core/src/button/gk-button-group.styles.ts` | Group layout / radius flush |
| `packages/core/src/button/gk-button-group.test.ts` | Slot render test |
| `packages/core/src/index.ts` | Export + side-effect import |
| `packages/core/package.json` | `sideEffects` entry for group file |
| `apps/docs/components/button.md` | EN demos + API |
| `apps/docs/zh-TW/components/button.md` | zh-TW demos + API |

---

### Task 1: Boolean appearance props on `gk-button`

**Files:**
- Modify: `packages/core/src/button/gk-button.ts`
- Modify: `packages/core/src/button/gk-button.styles.ts`
- Modify: `packages/core/src/button/gk-button.test.ts`

**Interfaces:**
- Consumes: existing `GkButton` / `variant` / solid styles
- Produces: reflected booleans `secondary`, `dashed`, `text` on `GkButton`

- [ ] **Step 1: Write failing tests**

Append to `packages/core/src/button/gk-button.test.ts`:

```ts
  it("reflects secondary, dashed, and text attributes", async () => {
    const el = await fixture<GkButton>(
      html`<gk-button secondary dashed text>Go</gk-button>`,
    );
    expect(el.secondary).toBe(true);
    expect(el.dashed).toBe(true);
    expect(el.text).toBe(true);
    expect(el.hasAttribute("secondary")).toBe(true);
    expect(el.hasAttribute("dashed")).toBe(true);
    expect(el.hasAttribute("text")).toBe(true);
  });

  it("keeps text attribute when dashed and secondary are also set (precedence via attrs)", async () => {
    const el = await fixture<GkButton>(
      html`<gk-button variant="info" secondary dashed text>Go</gk-button>`,
    );
    // CSS precedence is text > dashed > secondary; attrs all present for styling hooks
    expect(el.hasAttribute("text")).toBe(true);
    expect(el.hasAttribute("dashed")).toBe(true);
    expect(el.hasAttribute("secondary")).toBe(true);
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `corepack pnpm --filter @gk-ui/core test`

Expected: FAIL (property / attribute not defined)

- [ ] **Step 3: Add properties on `GkButton`**

In `packages/core/src/button/gk-button.ts`, after the `loading` property, add:

```ts
  @property({ type: Boolean, reflect: true })
  secondary = false;

  @property({ type: Boolean, reflect: true })
  dashed = false;

  @property({ type: Boolean, reflect: true })
  text = false;
```

- [ ] **Step 4: Add appearance styles**

In `packages/core/src/button/gk-button.styles.ts`, after solid variant blocks and **before** disabled rules, add CSS that implements:

1. Boolean `secondary` soft fills per variant (≈16% alpha background, solid variant color text; no hard border). Cover: default/unset primary, `primary`, `secondary` (gray), `info`, `success`, `warning`, `danger`, `ghost`.
2. Boolean `dashed`: transparent background, `1px dashed` border in variant color, matching text color. Disable the offset box-shadow (set `box-shadow: none`) for dashed/text so borders read cleanly.
3. Boolean `text`: transparent background/border, `box-shadow: none`, horizontal padding `0`, height slightly tighter optional (`height: auto; min-height` or keep size heights), color from variant.
4. Precedence via selector specificity / order:

```css
  /* secondary soft — only when NOT dashed/text */
  :host([secondary]:not([dashed]):not([text])) [part="base"] { /* ... */ }

  /* dashed — only when NOT text */
  :host([dashed]:not([text])) [part="base"] { /* ... */ }

  /* text wins */
  :host([text]) [part="base"] { /* ... */ }
```

Use token colors already in file (`--gk-color-brand`, `--gk-color-info`, etc.). Example secondary primary:

```css
  :host([secondary]:not([dashed]):not([text])[variant="primary"]) [part="base"],
  :host([secondary]:not([dashed]):not([text]):not([variant])) [part="base"] {
    background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 16%, transparent);
    color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
    box-shadow: none;
  }
```

If `color-mix` is undesirable for older targets, use fixed `rgba(...)` approximations matching tokens.

For dashed/text hover: keep a subtle color/background change; either keep small translate or disable translate when `[dashed]` / `[text]` for cleaner borders.

- [ ] **Step 5: Run tests to verify they pass**

Run: `corepack pnpm --filter @gk-ui/core test`

Expected: PASS (all tests)

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/button/gk-button.ts packages/core/src/button/gk-button.styles.ts packages/core/src/button/gk-button.test.ts
git commit -m "feat(button): add secondary, dashed, and text appearance modes"
```

---

### Task 2: `gk-button-group`

**Files:**
- Create: `packages/core/src/button/gk-button-group.styles.ts`
- Create: `packages/core/src/button/gk-button-group.ts`
- Create: `packages/core/src/button/gk-button-group.test.ts`
- Modify: `packages/core/src/index.ts`
- Modify: `packages/core/package.json` (`sideEffects`)
- Modify: `packages/core/src/button/gk-button.styles.ts` (host-context)

**Interfaces:**
- Consumes: slotted `gk-button` children
- Produces: `GkButtonGroup` custom element tag `gk-button-group`; export from `@gk-ui/core`

- [ ] **Step 1: Write failing group test**

Create `packages/core/src/button/gk-button-group.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-button.js";
import "./gk-button-group.js";
import type { GkButtonGroup } from "./gk-button-group.js";

describe("gk-button-group", () => {
  it("renders slotted gk-button children", async () => {
    const el = await fixture<GkButtonGroup>(html`
      <gk-button-group>
        <gk-button>One</gk-button>
        <gk-button>Two</gk-button>
      </gk-button-group>
    `);
    const buttons = el.querySelectorAll("gk-button");
    expect(buttons.length).toBe(2);
    expect(el.shadowRoot?.querySelector("slot")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter @gk-ui/core test`

Expected: FAIL (cannot find module / custom element missing)

- [ ] **Step 3: Implement group styles + element**

Create `packages/core/src/button/gk-button-group.styles.ts`:

```ts
import { css } from "lit";

export const buttonGroupStyles = css`
  :host {
    display: inline-flex;
    vertical-align: middle;
  }

  ::slotted(gk-button) {
    position: relative;
  }

  ::slotted(gk-button:not(:first-child)) {
    margin-inline-start: -1px;
  }
`;
```

Create `packages/core/src/button/gk-button-group.ts`:

```ts
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { buttonGroupStyles } from "./gk-button-group.styles.js";

@customElement("gk-button-group")
export class GkButtonGroup extends LitElement {
  static styles = buttonGroupStyles;

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-button-group": GkButtonGroup;
  }
}
```

In `gk-button.styles.ts`, add group context overrides so joined edges work and hover nudge does not break the strip:

```css
  :host-context(gk-button-group) {
    display: inline-flex;
  }

  :host-context(gk-button-group) [part="base"] {
    border-radius: 0;
    transform: none;
    box-shadow: none;
  }

  :host-context(gk-button-group) [part="base"]:hover,
  :host-context(gk-button-group) [part="base"]:active {
    transform: none;
    box-shadow: none;
  }

  :host-context(gk-button-group):first-child [part="base"] {
    border-start-start-radius: var(--gk-radius-sm, 0.375rem);
    border-end-start-radius: var(--gk-radius-sm, 0.375rem);
  }

  :host-context(gk-button-group):last-child [part="base"] {
    border-start-end-radius: var(--gk-radius-sm, 0.375rem);
    border-end-end-radius: var(--gk-radius-sm, 0.375rem);
  }
```

Note: `:first-child` / `:last-child` on `:host-context(...)` apply to the `gk-button` host relative to its parent group — this is correct for light-DOM children.

For solid buttons inside a group, add a `1px solid` divider border using a muted border color so adjacent fills remain distinguishable (especially same-variant neighbors). Prefer left border on non-first children via:

```css
  :host-context(gk-button-group):not(:first-child) [part="base"] {
    border-inline-start: 1px solid var(--gk-color-border, rgb(224, 224, 230));
  }
```

Adjust if dashed buttons already define borders.

- [ ] **Step 4: Export from package entry**

Update `packages/core/src/index.ts`:

```ts
import "./button/gk-button.js";
import "./button/gk-button-group.js";
export { GkButton } from "./button/gk-button.js";
export type { GkButtonVariant, GkButtonSize, GkButtonType } from "./button/gk-button.js";
export { GkButtonGroup } from "./button/gk-button-group.js";
```

Add `"./src/button/gk-button-group.ts"` (and dist counterpart if listed) to `sideEffects` in `packages/core/package.json`.

- [ ] **Step 5: Run tests**

Run: `corepack pnpm --filter @gk-ui/core test`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/button/gk-button-group.ts packages/core/src/button/gk-button-group.styles.ts packages/core/src/button/gk-button-group.test.ts packages/core/src/button/gk-button.styles.ts packages/core/src/index.ts packages/core/package.json
git commit -m "feat(button): add gk-button-group"
```

---

### Task 3: Docs demos (EN + zh-TW)

**Files:**
- Modify: `apps/docs/components/button.md`
- Modify: `apps/docs/zh-TW/components/button.md`

**Interfaces:**
- Consumes: `secondary` / `dashed` / `text` attrs; `gk-button-group`
- Produces: DemoCard sections with `:code` strings

- [ ] **Step 1: Extend EN `codes` and demos**

In `apps/docs/components/button.md` `codes` object, add:

```ts
  secondaryMode: `<gk-button secondary>Default</gk-button>
<gk-button variant="primary" secondary>Primary</gk-button>
<gk-button variant="info" secondary>Info</gk-button>
<gk-button variant="success" secondary>Success</gk-button>
<gk-button variant="warning" secondary>Warning</gk-button>
<gk-button variant="danger" secondary>Danger</gk-button>`,
  dashed: `<gk-button dashed>Default</gk-button>
<gk-button variant="primary" dashed>Primary</gk-button>
<gk-button variant="info" dashed>Info</gk-button>
<gk-button variant="success" dashed>Success</gk-button>
<gk-button variant="warning" dashed>Warning</gk-button>
<gk-button variant="danger" dashed>Danger</gk-button>`,
  textMode: `<gk-button text>Default</gk-button>
<gk-button variant="primary" text>Primary</gk-button>
<gk-button variant="info" text>Info</gk-button>
<gk-button variant="success" text>Success</gk-button>
<gk-button variant="warning" text>Warning</gk-button>
<gk-button variant="danger" text>Danger</gk-button>`,
  group: `<gk-button-group>
  <gk-button variant="secondary">Left</gk-button>
  <gk-button variant="secondary">Middle</gk-button>
  <gk-button variant="secondary">Right</gk-button>
</gk-button-group>
<gk-button-group>
  <gk-button variant="primary">Live a</gk-button>
  <gk-button variant="primary">Sufficient</gk-button>
  <gk-button variant="primary">Life</gk-button>
</gk-button-group>`,
```

Insert DemoCards after Basic (Secondary), and after Size or before Ghost as fits Naive order: Secondary → Dashed → Text near mid-page; Button group before Playground.

Update API table with:

| `secondary` | `boolean` | `false` |
| `dashed` | `boolean` | `false` |
| `text` | `boolean` | `false` |

Add:

### ButtonGroup

| Name | Description |
|------|-------------|
| default | Grouped `gk-button` children |

- [ ] **Step 2: Mirror zh-TW page**

Same structure in `apps/docs/zh-TW/components/button.md` with Chinese titles/descriptions (次要樣式 / 虛線 / 文字按鈕 / 按鈕群組).

- [ ] **Step 3: Build docs**

Run: `corepack pnpm docs:build`

Expected: `build complete` with exit code 0

- [ ] **Step 4: Commit**

```bash
git add apps/docs/components/button.md apps/docs/zh-TW/components/button.md
git commit -m "docs(button): demos for secondary, dashed, text, and button-group"
```

---

## Spec coverage checklist

| Spec item | Task |
|-----------|------|
| Boolean `secondary` | Task 1 |
| Boolean `dashed` / `text` | Task 1 |
| Precedence text > dashed > secondary | Task 1 CSS selectors |
| Keep `variant="secondary"` | Task 1 (untouched solid rule) |
| `gk-button-group` horizontal flush | Task 2 |
| Neutralize hover nudge in group | Task 2 `:host-context` |
| Docs EN + zh-TW | Task 3 |
| Tests reflect + group slot | Tasks 1–2 |
| Export group | Task 2 |
| Out of scope tertiary/vertical | Not planned |

## Plan self-review

- No TBD/placeholder steps.
- Property names consistent: `secondary`, `dashed`, `text`, `GkButtonGroup`, tag `gk-button-group`.
- All spec success criteria mapped to tasks.
