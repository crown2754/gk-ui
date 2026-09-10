import { css } from "lit";

export const alertStyles = css`
  :host {
    display: block;
  }

  [part="base"] {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: var(--gk-space-3, 0.75rem);
    padding: var(--gk-space-3, 0.75rem) var(--gk-space-4, 1rem);
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    color: var(--gk-color-text, rgb(31, 34, 37));
    border-radius: var(--gk-radius-md, 0.5rem);
  }

  :host([type="default"]) [part="base"],
  :host(:not([type])) [part="base"] {
    background: color-mix(
      in srgb,
      var(--gk-color-brand, rgb(242, 206, 94)) 14%,
      transparent
    );
    color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
  }

  :host([type="info"]) [part="base"] {
    background: color-mix(
      in srgb,
      var(--gk-color-info, #2080f0) 14%,
      transparent
    );
    color: var(--gk-color-info-pressed, #1060c9);
  }

  :host([type="success"]) [part="base"] {
    background: color-mix(
      in srgb,
      var(--gk-color-success, #18a058) 14%,
      transparent
    );
    color: var(--gk-color-success-pressed, #0c7a43);
  }

  :host([type="warning"]) [part="base"] {
    background: color-mix(
      in srgb,
      var(--gk-color-warning, #f0a020) 14%,
      transparent
    );
    color: var(--gk-color-warning-pressed, #c97c10);
  }

  :host([type="error"]) [part="base"] {
    background: color-mix(
      in srgb,
      var(--gk-color-danger, #d03050) 14%,
      transparent
    );
    color: var(--gk-color-danger-pressed, #ab1f3f);
  }

  :host([bordered]) [part="base"] {
    border: 1px solid currentColor;
  }

  [part="icon"] {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 1.25em;
    height: 1.25em;
    font-size: 1.25rem;
    line-height: 1;
  }

  [part="icon"] svg {
    display: block;
    width: 1em;
    height: 1em;
    fill: currentColor;
  }

  [part="body"] {
    flex: 1;
    min-width: 0;
  }

  [part="title"] {
    font-weight: var(--gk-font-weight-medium, 500);
    line-height: 1.4;
    margin-bottom: var(--gk-space-1, 0.25rem);
  }

  [part="content"] {
    line-height: 1.5;
    opacity: 0.85;
  }

  button[part="close"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin: 0;
    padding: 0;
    width: 1.5rem;
    height: 1.5rem;
    font-size: 1.125rem;
    line-height: 1;
    color: inherit;
    background: transparent;
    border: 0;
    border-radius: var(--gk-radius-sm, 0.375rem);
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 150ms ease, background-color 150ms ease;
  }

  button[part="close"]:hover {
    opacity: 1;
    background: color-mix(in srgb, currentColor 8%, transparent);
  }

  button[part="close"]:focus-visible {
    outline: 2px solid var(--gk-color-focus-ring, rgb(242, 206, 94));
    outline-offset: 2px;
    opacity: 1;
  }
`;
