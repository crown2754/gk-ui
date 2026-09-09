import { css } from "lit";

export const buttonStyles = css`
  :host {
    display: inline-block;
    vertical-align: middle;
  }

  [part="base"] {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--gk-space-2, 0.5rem);
    margin: 0;
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    font-weight: var(--gk-font-weight-semibold, 600);
    line-height: var(--gk-line-height-tight, 1.25);
    text-decoration: none;
    border: 1px solid transparent;
    border-radius: var(--gk-radius-md, 0.5rem);
    cursor: pointer;
    box-shadow: var(--gk-shadow-sm, 0 1px 2px rgb(28 25 23 / 0.08));
    transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease,
      box-shadow 120ms ease, transform 120ms ease;
  }

  [part="base"]:focus-visible {
    outline: 2px solid var(--gk-color-focus-ring, #0f6e56);
    outline-offset: 2px;
  }

  :host([size="sm"]) [part="base"] {
    font-size: var(--gk-font-size-sm, 0.875rem);
    padding: var(--gk-space-1, 0.25rem) var(--gk-space-3, 0.75rem);
    min-height: 2rem;
  }

  :host([size="md"]) [part="base"],
  :host(:not([size])) [part="base"] {
    font-size: var(--gk-font-size-md, 1rem);
    padding: var(--gk-space-2, 0.5rem) var(--gk-space-4, 1rem);
    min-height: 2.5rem;
  }

  :host([size="lg"]) [part="base"] {
    font-size: var(--gk-font-size-lg, 1.125rem);
    padding: var(--gk-space-3, 0.75rem) var(--gk-space-5, 1.25rem);
    min-height: 3rem;
  }

  :host([variant="primary"]) [part="base"],
  :host(:not([variant])) [part="base"] {
    background: var(--gk-color-brand, #0f6e56);
    color: #fff;
  }

  :host([variant="primary"]) [part="base"]:hover,
  :host(:not([variant])) [part="base"]:hover {
    background: var(--gk-color-brand-hover, #0b5a46);
  }

  :host([variant="secondary"]) [part="base"] {
    background: var(--gk-color-surface-elevated, #fff);
    color: var(--gk-color-text, #1c1917);
    border-color: var(--gk-color-border, #d6d3d1);
  }

  :host([variant="ghost"]) [part="base"] {
    background: transparent;
    color: var(--gk-color-brand, #0f6e56);
    box-shadow: none;
  }

  :host([variant="danger"]) [part="base"] {
    background: var(--gk-color-danger, #b42318);
    color: #fff;
  }

  :host([variant="danger"]) [part="base"]:hover {
    background: var(--gk-color-danger-hover, #912018);
  }

  :host([disabled]) [part="base"],
  :host([loading]) [part="base"] {
    opacity: 0.55;
    cursor: not-allowed;
    pointer-events: none;
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
