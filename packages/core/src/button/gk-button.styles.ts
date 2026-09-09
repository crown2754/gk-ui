import { css } from "lit";

export const buttonStyles = css`
  :host {
    display: inline-block;
    vertical-align: middle;
  }

  [part="base"] {
    position: relative;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--gk-space-2, 0.5rem);
    margin: 0;
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    font-weight: var(--gk-font-weight-medium, 500);
    line-height: 1;
    text-decoration: none;
    border: 0;
    border-radius: var(--gk-radius-sm, 0.375rem);
    cursor: pointer;
    box-shadow: 0 0 var(--gk-button-shadow, #999);
    transition: transform 150ms ease, box-shadow 150ms ease, background-color 150ms ease,
      color 150ms ease;
  }

  [part="base"]:hover {
    transform: translate(2px, -2px);
    box-shadow: -2px 2px var(--gk-button-shadow, #999);
  }

  [part="base"]:active {
    transform: translate(1px, -1px);
    box-shadow: -1px 1px var(--gk-button-shadow, #999);
  }

  [part="base"]:focus-visible {
    outline: 2px solid var(--gk-color-focus-ring, rgb(242, 206, 94));
    outline-offset: 2px;
  }

  /* Size scale aligned with Naive UI small / medium / large */
  :host([size="sm"]) [part="base"] {
    height: 28px;
    padding: 0 10px;
    font-size: 14px;
  }

  :host([size="md"]) [part="base"],
  :host(:not([size])) [part="base"] {
    height: 34px;
    padding: 0 14px;
    font-size: 14px;
  }

  :host([size="lg"]) [part="base"] {
    height: 40px;
    padding: 0 18px;
    font-size: 15px;
  }

  :host([variant="secondary"]) [part="base"] {
    --gk-button-shadow: #c2c2c2;
    background: var(--gk-color-button-default, rgba(46, 51, 56, 0.05));
    color: var(--gk-color-text, rgb(31, 34, 37));
  }

  :host([variant="primary"]) [part="base"],
  :host(:not([variant])) [part="base"] {
    --gk-button-shadow: var(--gk-color-brand-pressed, rgb(201, 168, 58));
    background: var(--gk-color-brand, rgb(242, 206, 94));
    color: var(--gk-color-brand-on, rgb(31, 34, 37));
  }

  :host([variant="info"]) [part="base"] {
    --gk-button-shadow: var(--gk-color-info-pressed, #1060c9);
    background: var(--gk-color-info, #2080f0);
    color: #fff;
  }

  :host([variant="success"]) [part="base"] {
    --gk-button-shadow: var(--gk-color-success-pressed, #0c7a43);
    background: var(--gk-color-success, #18a058);
    color: #fff;
  }

  :host([variant="warning"]) [part="base"] {
    --gk-button-shadow: var(--gk-color-warning-pressed, #c97c10);
    background: var(--gk-color-warning, #f0a020);
    color: #fff;
  }

  :host([variant="danger"]) [part="base"] {
    --gk-button-shadow: var(--gk-color-danger-pressed, #ab1f3f);
    background: var(--gk-color-danger, #d03050);
    color: #fff;
  }

  :host([variant="ghost"]) [part="base"] {
    --gk-button-shadow: var(--gk-color-border, rgb(224, 224, 230));
    background: transparent;
    color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
    box-shadow: 0 0 var(--gk-button-shadow, rgb(224, 224, 230));
  }

  :host([disabled]) [part="base"],
  :host([loading]) [part="base"] {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
    transform: none;
    box-shadow: 0 0 var(--gk-button-shadow, #999);
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
