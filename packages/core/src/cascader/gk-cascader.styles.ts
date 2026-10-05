import { css } from "lit";

export const cascaderStyles = css`
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

  [part="panel"] {
    position: fixed;
    display: none;
    box-sizing: border-box;
    max-width: min(100vw - 32px, 100%);
    max-height: 280px;
    margin: 0;
    overflow: auto;
    background: var(--gk-color-surface, #fff);
    border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
    border-radius: var(--gk-radius-md, 0.5rem);
    box-shadow: var(--gk-shadow-md, 0 4px 12px rgb(28 25 23 / 0.12));
  }

  :host([open]) [part="panel"] {
    display: flex;
  }

  [part="column"] {
    box-sizing: border-box;
    flex: 0 0 var(--gk-cascader-column, 160px);
    width: var(--gk-cascader-column, 160px);
    max-height: 280px;
    margin: 0;
    padding: 4px;
    overflow-y: auto;
    list-style: none;
  }

  [part="column"] + [part="column"] {
    border-inline-start: 1px solid var(--gk-color-border, rgb(224, 224, 230));
  }

  @media (max-width: 767px) {
    [part="column"] {
      flex-basis: 148px;
      width: 148px;
    }
  }

  [part="option"] {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 10px;
    border-radius: var(--gk-radius-sm, 0.375rem);
    cursor: pointer;
    font-size: 14px;
  }

  [part="option"]:hover,
  [part="option"][data-active] {
    background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 20%, transparent);
  }

  [part="option"][aria-selected="true"] {
    background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 28%, transparent);
    font-weight: 600;
  }

  [part="option"][aria-disabled="true"] {
    opacity: 0.45;
    cursor: not-allowed;
  }

  [part="option"] svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    fill: currentColor;
  }

  [part="empty"] {
    padding: 16px;
    color: var(--gk-color-on-surface-muted, rgb(118, 124, 130));
    text-align: center;
  }
`;
