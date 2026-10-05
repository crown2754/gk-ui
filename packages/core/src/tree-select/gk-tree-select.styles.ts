import { css } from "lit";

export const treeSelectStyles = css`
  :host {
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    max-width: 22rem;
    color: var(--gk-color-on-surface, rgb(31, 34, 37));
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    font-size: 14px;
  }

  [part="trigger"] {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    background: var(--gk-color-surface, #fff);
    border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
    border-radius: var(--gk-radius-md, 0.5rem);
    cursor: pointer;
    outline: none;
  }

  :host([size="sm"]) [part="trigger"] {
    min-height: 28px;
    padding: 0 10px;
  }
  :host([size="md"]) [part="trigger"],
  :host(:not([size])) [part="trigger"] {
    min-height: 34px;
    padding: 0 12px;
  }
  :host([size="lg"]) [part="trigger"] {
    min-height: 40px;
    padding: 0 14px;
    font-size: 15px;
  }

  [part="trigger"]:hover {
    border-color: rgb(200, 200, 208);
  }

  [part="trigger"]:focus-visible,
  :host([open]) [part="trigger"] {
    border-color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
    box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--gk-color-focus-ring, rgb(242, 206, 94)) 70%, transparent);
  }

  :host([status="success"]) [part="trigger"] {
    border-color: var(--gk-color-success, #18a058);
  }
  :host([status="warning"]) [part="trigger"] {
    border-color: var(--gk-color-warning, #f0a020);
  }
  :host([status="error"]) [part="trigger"] {
    border-color: var(--gk-color-danger, #d03050);
  }

  :host([status="success"]) [part="trigger"]:focus-visible,
  :host([status="success"][open]) [part="trigger"] {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--gk-color-success, #18a058) 70%, transparent);
  }
  :host([status="warning"]) [part="trigger"]:focus-visible,
  :host([status="warning"][open]) [part="trigger"] {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--gk-color-warning, #f0a020) 70%, transparent);
  }
  :host([status="error"]) [part="trigger"]:focus-visible,
  :host([status="error"][open]) [part="trigger"] {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--gk-color-danger, #d03050) 70%, transparent);
  }

  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }

  [part="value"],
  [part="placeholder"] {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  [part="placeholder"] {
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
  }

  [part="suffix"] {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
    color: var(--gk-color-on-surface-muted, rgb(118, 124, 130));
  }

  [part="clear"] {
    display: inline-flex;
    border: 0;
    padding: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }

  [part="clear"] svg,
  [part="chevron"] {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }

  [part="chevron"] {
    transition: transform 160ms ease;
  }

  :host([open]) [part="chevron"] {
    transform: rotate(180deg);
  }

  @media (prefers-reduced-motion: reduce) {
    [part="chevron"] {
      transition: none;
    }
  }
`;

export const TREE_PANEL_STYLE_ID = "gk-tree-select-panel-style";

export const treeSelectPanelCssText = `
.gk-tree-select-panel {
  position: fixed;
  z-index: 4000;
  box-sizing: border-box;
  max-width: min(320px, calc(100vw - 32px));
  max-height: 280px;
  margin: 0;
  padding: 4px;
  overflow: auto;
  background: var(--gk-color-surface, #fff);
  color: var(--gk-color-on-surface, rgb(31, 34, 37));
  border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
  border-radius: var(--gk-radius-md, 0.5rem);
  box-shadow: var(--gk-shadow-md, 0 4px 12px rgb(28 25 23 / 0.12));
  font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
  font-size: 14px;
}
.gk-tree-select-panel [part="tree"] {
  margin: 0;
  padding: 0;
}
.gk-tree-select-panel [part="node"] {
  display: flex;
  align-items: center;
  gap: 2px;
  min-height: 34px;
  padding: 4px 8px;
  border-radius: var(--gk-radius-sm, 0.375rem);
  cursor: pointer;
  user-select: none;
}
.gk-tree-select-panel[data-size="sm"] [part="node"] { min-height: 32px; }
.gk-tree-select-panel[data-size="lg"] [part="node"] { min-height: 36px; }
.gk-tree-select-panel [part="node"]:hover,
.gk-tree-select-panel [part="node"][data-active] {
  background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 20%, transparent);
}
.gk-tree-select-panel [part="node"][aria-selected="true"] {
  background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 28%, transparent);
  font-weight: 600;
  color: var(--gk-color-brand-on, rgb(31, 34, 37));
}
.gk-tree-select-panel [part="node"][aria-disabled="true"] {
  color: var(--gk-color-text-muted, rgb(118, 124, 130));
  cursor: not-allowed;
  background: transparent;
}
.gk-tree-select-panel [part="indent"] {
  display: inline-block;
  flex: none;
  height: 1px;
}
.gk-tree-select-panel [part="switcher"] {
  width: 28px;
  height: 28px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: var(--gk-radius-sm, 0.375rem);
  background: transparent;
  color: var(--gk-color-text-muted, rgb(118, 124, 130));
  cursor: pointer;
}
.gk-tree-select-panel [part="switcher"][data-leaf] {
  visibility: hidden;
  pointer-events: none;
}
.gk-tree-select-panel [part="switcher"] svg {
  width: 12px;
  height: 12px;
  fill: currentColor;
  transition: transform 150ms ease;
}
.gk-tree-select-panel [part="switcher"][data-expanded] svg {
  transform: rotate(90deg);
}
.gk-tree-select-panel [part="label"] {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.gk-tree-select-panel [part="empty"] {
  padding: 24px 12px;
  text-align: center;
  color: var(--gk-color-text-muted, rgb(118, 124, 130));
}
@media (prefers-reduced-motion: reduce) {
  .gk-tree-select-panel [part="switcher"] svg { transition: none; }
}
`;
