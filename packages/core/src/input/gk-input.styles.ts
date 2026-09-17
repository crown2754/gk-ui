import { css } from "lit";

export const inputStyles = css`
  :host {
    display: inline-block;
    vertical-align: middle;
    max-width: 100%;
  }

  :host([type="textarea"]) {
    display: block;
    width: 100%;
  }

  [part="base"] {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    gap: var(--gk-space-2, 0.5rem);
    width: 100%;
    margin: 0;
    background: var(--gk-color-surface, #fff);
    color: var(--gk-color-text, rgb(31, 34, 37));
    border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
    border-radius: var(--gk-radius-sm, 0.375rem);
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    font-weight: var(--gk-font-weight-medium, 500);
    transition: border-color 150ms ease, box-shadow 150ms ease;
  }

  :host([type="textarea"]) [part="base"] {
    align-items: flex-start;
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

  :host([type="textarea"][size="sm"]) [part="base"],
  :host([type="textarea"][size="md"]) [part="base"],
  :host([type="textarea"]:not([size])) [part="base"],
  :host([type="textarea"][size="lg"]) [part="base"] {
    min-height: unset;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  :host([round]:not([type="textarea"])) [part="base"] {
    border-radius: var(--gk-radius-pill, 9999px);
  }

  :host([round][type="textarea"]) [part="base"] {
    border-radius: var(--gk-radius-md, 0.5rem);
  }

  [part="base"]:focus-within {
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

  :host([status="success"]) [part="base"]:focus-within {
    outline-color: var(--gk-color-success, #18a058);
  }
  :host([status="warning"]) [part="base"]:focus-within {
    outline-color: var(--gk-color-warning, #f0a020);
  }
  :host([status="error"]) [part="base"]:focus-within {
    outline-color: var(--gk-color-danger, #d03050);
  }

  :host([disabled]) [part="base"] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  [part="prefix"],
  [part="suffix"] {
    display: inline-flex;
    align-items: center;
    gap: var(--gk-space-1, 0.25rem);
    flex-shrink: 0;
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
  }

  [part="input"] {
    flex: 1;
    min-width: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    line-height: 1.4;
    outline: none;
  }

  textarea[part="input"] {
    resize: vertical;
    min-height: 4.5em;
  }

  [part="clear"],
  [part="password-toggle"] {
    flex-shrink: 0;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: 1em;
    line-height: 1;
    opacity: 0.7;
  }

  [part="clear"]:hover,
  [part="password-toggle"]:hover {
    opacity: 1;
  }

  :host([disabled]) [part="clear"],
  :host([disabled]) [part="password-toggle"] {
    pointer-events: none;
  }

  [part="clear"] svg,
  [part="password-toggle"] svg {
    display: block;
    width: 1em;
    height: 1em;
    fill: currentColor;
  }
`;
