import { css } from "lit";

export const messageStyles = css`
  :host {
    display: block;
    pointer-events: auto;
  }

  [part="base"] {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--gk-space-2, 0.5rem);
    min-width: 180px;
    max-width: min(420px, 90vw);
    padding: var(--gk-space-2, 0.5rem) var(--gk-space-3, 0.75rem);
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    font-size: var(--gk-font-size-sm, 0.875rem);
    border-radius: var(--gk-radius-md, 0.5rem);
    box-shadow: 0 4px 16px color-mix(in srgb, #000 12%, transparent);
    background: var(--gk-color-surface, #fff);
    color: var(--gk-color-text, rgb(31, 34, 37));
  }

  :host([type="info"]) [part="base"] {
    color: var(--gk-color-info-pressed, #1060c9);
  }
  :host([type="success"]) [part="base"] {
    color: var(--gk-color-success-pressed, #0c7a43);
  }
  :host([type="warning"]) [part="base"] {
    color: var(--gk-color-warning-pressed, #a35c00);
  }
  :host([type="error"]) [part="base"] {
    color: var(--gk-color-danger-pressed, #d03050);
  }
  :host([type="loading"]) [part="base"],
  :host([type="default"]) [part="base"],
  :host(:not([type])) [part="base"] {
    color: var(--gk-color-text, rgb(31, 34, 37));
  }

  [part="icon"] {
    display: inline-flex;
    flex-shrink: 0;
    width: 1.25em;
    height: 1.25em;
  }
  [part="icon"][hidden] {
    display: none;
  }
  [part="icon"] svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }

  .gk-message__spinner {
    box-sizing: border-box;
    width: 1.1em;
    height: 1.1em;
    border: 2px solid color-mix(in srgb, currentColor 25%, transparent);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: gk-message-spin 0.7s linear infinite;
  }

  @keyframes gk-message-spin {
    to {
      transform: rotate(360deg);
    }
  }

  [part="content"] {
    flex: 1;
    min-width: 0;
    line-height: 1.4;
  }

  [part="close"] {
    flex-shrink: 0;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: 1.1em;
    line-height: 1;
    opacity: 0.7;
  }
  [part="close"]:hover {
    opacity: 1;
  }
`;
