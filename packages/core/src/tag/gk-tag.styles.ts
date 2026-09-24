import { css } from "lit";

export const tagStyles = css`
  :host {
    display: inline-flex;
    vertical-align: middle;
    max-width: 100%;
    color: var(--gk-color-text, rgb(31, 34, 37));
  }

  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }

  [part="base"] {
    box-sizing: border-box;
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    max-width: 100%;
    height: 24px;
    padding: 0 8px;
    border: 1px solid transparent;
    border-radius: var(--gk-radius-sm, 0.375rem);
    background: var(--gk-color-button-default, rgba(46, 51, 56, 0.05));
    color: var(--gk-color-text, rgb(31, 34, 37));
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    font-size: 13px;
    font-weight: var(--gk-font-weight-medium, 500);
    line-height: 1;
    user-select: none;
    transition:
      background 140ms ease,
      color 140ms ease,
      box-shadow 140ms ease,
      border-color 140ms ease;
  }

  :host([size="sm"]) [part="base"] {
    height: 22px;
    padding: 0 6px;
    font-size: 12px;
  }

  :host([size="md"]) [part="base"],
  :host(:not([size])) [part="base"] {
    height: 24px;
    padding: 0 8px;
    font-size: 13px;
  }

  :host([size="lg"]) [part="base"] {
    height: 28px;
    padding: 0 10px;
    font-size: 14px;
  }

  :host([round]) [part="base"] {
    border-radius: var(--gk-radius-pill, 9999px);
  }

  :host([type="default"]) [part="base"],
  :host(:not([type])) [part="base"] {
    background: var(--gk-color-button-default, rgba(46, 51, 56, 0.05));
    color: var(--gk-color-text, rgb(31, 34, 37));
  }

  :host([type="primary"]) [part="base"] {
    background: var(--gk-color-brand, rgb(242, 206, 94));
    color: var(--gk-color-brand-on, rgb(31, 34, 37));
  }

  :host([type="success"]) [part="base"] {
    background: color-mix(in srgb, var(--gk-color-success, #18a058) 16%, transparent);
    color: var(--gk-color-success-pressed, #0c7a43);
  }

  :host([type="warning"]) [part="base"] {
    background: color-mix(in srgb, var(--gk-color-warning, #f0a020) 16%, transparent);
    color: var(--gk-color-warning-pressed, #c97c10);
  }

  :host([type="error"]) [part="base"] {
    background: color-mix(in srgb, var(--gk-color-danger, #d03050) 16%, transparent);
    color: var(--gk-color-danger-pressed, #ab1f3f);
  }

  :host([type="info"]) [part="base"] {
    background: color-mix(in srgb, var(--gk-color-info, #2080f0) 16%, transparent);
    color: var(--gk-color-info-pressed, #1060c9);
  }

  :host([bordered]) [part="base"] {
    border-color: var(--gk-color-border, rgb(224, 224, 230));
  }

  :host([bordered][type="primary"]) [part="base"] {
    background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 18%, transparent);
    color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
    border-color: color-mix(
      in srgb,
      var(--gk-color-brand-pressed, rgb(201, 168, 58)) 45%,
      transparent
    );
  }

  :host([bordered][type="success"]) [part="base"] {
    border-color: color-mix(in srgb, var(--gk-color-success, #18a058) 40%, transparent);
  }

  :host([bordered][type="warning"]) [part="base"] {
    border-color: color-mix(in srgb, var(--gk-color-warning, #f0a020) 40%, transparent);
  }

  :host([bordered][type="error"]) [part="base"] {
    border-color: color-mix(in srgb, var(--gk-color-danger, #d03050) 40%, transparent);
  }

  :host([bordered][type="info"]) [part="base"] {
    border-color: color-mix(in srgb, var(--gk-color-info, #2080f0) 40%, transparent);
  }

  :host([checkable]) [part="base"] {
    cursor: pointer;
  }

  :host([checkable]:not([disabled]):not([checked]):hover) [part="base"] {
    background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 18%, transparent);
  }

  :host([checkable][checked]:not([type="primary"])) [part="base"] {
    background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 22%, transparent);
    color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
    border-color: transparent;
  }

  :host([color]) [part="base"] {
    background: var(--gk-tag-color);
  }

  :host([checkable]:not([disabled])) [part="base"]:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--gk-color-focus-ring, rgb(242, 206, 94)) 70%, transparent);
  }

  [part="icon"] {
    display: inline-flex;
    flex-shrink: 0;
    width: 0.95em;
    height: 0.95em;
  }

  [part="icon"][hidden] {
    display: none;
  }

  [part="icon"] ::slotted(*) {
    display: block;
    width: 100%;
    height: 100%;
  }

  [part="content"] {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  [part="check-indicator"] {
    display: none;
  }

  [part="close"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin: 0 -2px 0 2px;
    padding: 0;
    width: 1.1em;
    height: 1.1em;
    border: 0;
    border-radius: var(--gk-radius-pill, 9999px);
    background: transparent;
    color: inherit;
    opacity: 0.65;
    cursor: pointer;
    font: inherit;
    line-height: 1;
  }

  [part="close"]:hover {
    opacity: 1;
    background: color-mix(in srgb, currentColor 12%, transparent);
  }

  [part="close"]:focus-visible {
    outline: none;
    opacity: 1;
    box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--gk-color-focus-ring, rgb(242, 206, 94)) 70%, transparent);
  }
`;
