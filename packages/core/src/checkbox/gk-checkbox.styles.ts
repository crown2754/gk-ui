import { css } from "lit";

export const checkboxStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    gap: var(--gk-space-2, 0.5rem);
    vertical-align: middle;
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    font-weight: var(--gk-font-weight-medium, 500);
    color: var(--gk-color-text, rgb(31, 34, 37));
    cursor: pointer;
  }

  [part="box"] {
    box-sizing: border-box;
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
    border-radius: var(--gk-radius-sm, 0.375rem);
    background: var(--gk-color-surface, #fff);
    color: var(--gk-color-brand-on, rgb(31, 34, 37));
    cursor: pointer;
    overflow: visible;
    transition: background-color 150ms ease, border-color 150ms ease;
  }

  [part="box"]:focus-visible {
    outline: 2px solid var(--gk-color-focus-ring, rgb(242, 206, 94));
    outline-offset: 2px;
  }

  :host([size="sm"]) [part="box"] {
    width: 14px;
    height: 14px;
  }

  :host([size="md"]) [part="box"],
  :host(:not([size])) [part="box"] {
    width: 16px;
    height: 16px;
  }

  :host([size="lg"]) [part="box"] {
    width: 20px;
    height: 20px;
  }

  :host([checked]) [part="box"],
  :host([indeterminate]) [part="box"] {
    background: var(--gk-color-brand, rgb(242, 206, 94));
    border-color: var(--gk-color-brand, rgb(242, 206, 94));
  }

  [part="indicator"] {
    display: block;
    width: 72%;
    height: 72%;
  }

  [part="indicator"] svg {
    display: block;
    width: 100%;
    height: 100%;
    fill: currentColor;
  }

  [part="label"] {
    font-size: 14px;
    line-height: 1.4;
  }

  :host([size="lg"]) [part="label"] {
    font-size: 15px;
  }

  :host([disabled]),
  :host([data-gk-group-disabled]) {
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Unchecked stays subdued. Checked and mixed keep the brand mark readable. */
  :host([disabled]:not([checked]):not([indeterminate])),
  :host([data-gk-group-disabled]:not([checked]):not([indeterminate])) {
    opacity: 0.5;
  }

  :host([disabled]) [part="box"],
  :host([data-gk-group-disabled]) [part="box"] {
    opacity: 1;
  }

  :host([disabled][checked]) [part="label"],
  :host([disabled][indeterminate]) [part="label"],
  :host([data-gk-group-disabled][checked]) [part="label"],
  :host([data-gk-group-disabled][indeterminate]) [part="label"] {
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
  }
`;
