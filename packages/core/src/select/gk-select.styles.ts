import { css } from "lit";

export const selectStyles = css`
  :host {
    display: inline-block;
    vertical-align: middle;
    max-width: 100%;
    min-width: 10rem;
  }

  ::slotted(gk-option) {
    display: none;
  }

  ::slotted(gk-option-group) {
    display: none;
  }

  [part="base"] {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    gap: var(--gk-space-2, 0.5rem);
    width: 100%;
    margin: 0;
    background: var(--gk-color-surface, #fff);
    color: var(--gk-color-on-surface, rgb(31, 34, 37));
    border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
    color-scheme: light;
    border-radius: var(--gk-radius-sm, 0.375rem);
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    font-weight: var(--gk-font-weight-medium, 500);
    transition: border-color 150ms ease, box-shadow 150ms ease;
    cursor: pointer;
  }

  :host([size="sm"]) [part="base"] {
    min-height: 28px;
    padding: 0 10px;
    font-size: 14px;
  }

  :host([size="md"]) [part="base"],
  :host(:not([size])) [part="base"] {
    min-height: 34px;
    padding: 0 14px;
    font-size: 14px;
  }

  :host([size="lg"]) [part="base"] {
    min-height: 40px;
    padding: 0 18px;
    font-size: 15px;
  }

  [part="base"]:focus-visible,
  :host([open]) [part="base"] {
    outline: 2px solid var(--gk-color-focus-ring, rgb(242, 206, 94));
    outline-offset: 2px;
    border-color: var(--gk-color-focus-ring, rgb(242, 206, 94));
  }

  :host([status="success"]) [part="base"] {
    border-color: var(--gk-color-success, #18a058);
  }
  :host([status="warning"]) [part="base"] {
    border-color: var(--gk-color-warning, #f0a020);
  }
  :host([status="error"]) [part="base"] {
    border-color: var(--gk-color-danger, #d03050);
  }

  :host([status="success"][open]) [part="base"],
  :host([status="success"]) [part="base"]:focus-visible {
    outline-color: var(--gk-color-success, #18a058);
  }
  :host([status="warning"][open]) [part="base"],
  :host([status="warning"]) [part="base"]:focus-visible {
    outline-color: var(--gk-color-warning, #f0a020);
  }
  :host([status="error"][open]) [part="base"],
  :host([status="error"]) [part="base"]:focus-visible {
    outline-color: var(--gk-color-danger, #d03050);
  }

  :host([disabled]) [part="base"] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  [part="value"] {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    pointer-events: none;
  }

  :host([multiple]) [part="value"] {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    white-space: normal;
  }

  [part="tag"] {
    display: inline-flex;
    max-width: 100%;
    padding: 1px 6px;
    border-radius: var(--gk-radius-sm, 0.375rem);
    background: color-mix(
      in srgb,
      var(--gk-color-brand, rgb(242, 206, 94)) 24%,
      transparent
    );
    color: var(--gk-color-brand-on, rgb(31, 34, 37));
    font-size: 0.875em;
    line-height: 1.4;
  }

  [part="value"][data-empty] {
    color: var(--gk-color-on-surface-muted, rgb(118, 124, 130));
  }

  [part="suffix"] {
    display: inline-flex;
    align-items: center;
    gap: var(--gk-space-1, 0.25rem);
    flex-shrink: 0;
    color: var(--gk-color-on-surface-muted, rgb(118, 124, 130));
  }

  [part="clear"] {
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
    opacity: 0.7;
    line-height: 1;
  }

  [part="clear"]:hover {
    opacity: 1;
  }

  :host([disabled]) [part="clear"] {
    pointer-events: none;
  }

  [part="clear"] svg,
  [part="suffix"] > svg {
    display: block;
    width: 1em;
    height: 1em;
    fill: currentColor;
  }
`;

export const SELECT_LISTBOX_STYLE_ID = "gk-select-listbox-style";

export const selectListboxCssText = `
.gk-select-listbox {
  position: fixed;
  z-index: 4000;
  box-sizing: border-box;
  margin: 0;
  padding: 4px;
  background: var(--gk-color-surface-elevated, #fff);
  color: var(--gk-color-on-surface, rgb(31, 34, 37));
  border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
  border-radius: var(--gk-radius-sm, 0.375rem);
  box-shadow: 0 4px 16px color-mix(in srgb, #000 12%, transparent);
  font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
  font-size: 14px;
  max-height: 16rem;
  overflow: auto;
}
.gk-select-listbox input[data-filter] {
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 4px;
  padding: 6px 8px;
  border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
  border-radius: var(--gk-radius-sm, 0.375rem);
  background: var(--gk-color-surface, #fff);
  color: inherit;
  font: inherit;
}
.gk-select-listbox input[data-filter]:focus {
  outline: 2px solid var(--gk-color-focus-ring, rgb(242, 206, 94));
  outline-offset: 1px;
}
.gk-select-listbox [role="option"] {
  box-sizing: border-box;
  padding: 6px 10px;
  border-radius: var(--gk-radius-sm, 0.375rem);
  cursor: pointer;
  color: var(--gk-color-on-surface, rgb(31, 34, 37));
}
.gk-select-listbox [role="option"][aria-selected="true"],
.gk-select-listbox [role="option"].is-active {
  background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 22%, transparent);
  color: var(--gk-color-brand-on, rgb(31, 34, 37));
}
.gk-select-listbox [role="option"]:hover:not([aria-disabled="true"]) {
  background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 22%, transparent);
  color: var(--gk-color-brand-on, rgb(31, 34, 37));
}
.gk-select-listbox [role="option"][aria-disabled="true"] {
  opacity: 0.45;
  cursor: not-allowed;
}
.gk-select-listbox__checkbox {
  display: inline-flex;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--gk-color-border, rgb(190, 194, 198));
  border-radius: 3px;
  font-size: 12px;
  line-height: 1;
  vertical-align: -3px;
}
.gk-select-listbox [role="option"][aria-selected="true"] .gk-select-listbox__checkbox {
  border-color: var(--gk-color-brand, rgb(242, 206, 94));
  background: var(--gk-color-brand, rgb(242, 206, 94));
  color: var(--gk-color-brand-on, rgb(31, 34, 37));
}
.gk-select-listbox__group {
  padding: 6px 10px 4px;
  color: var(--gk-color-on-surface-muted, rgb(118, 124, 130));
  font-size: 12px;
  font-weight: 600;
}
.gk-select-listbox__empty {
  padding: 8px 10px;
  color: var(--gk-color-on-surface-muted, rgb(118, 124, 130));
}
.gk-select-listbox__loading {
  padding: 8px 10px;
  color: var(--gk-color-on-surface-muted, rgb(118, 124, 130));
}
`;
