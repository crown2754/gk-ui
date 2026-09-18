import { css } from "lit";

export const switchStyles = css`
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

  [part="track"] {
    box-sizing: border-box;
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    margin: 0;
    padding: 2px;
    border: 0;
    background: var(--gk-color-button-default, rgba(46, 51, 56, 0.05));
    border-radius: var(--gk-radius-sm, 0.375rem);
    cursor: pointer;
    transition: background-color 150ms ease;
  }

  [part="track"].round {
    border-radius: var(--gk-radius-pill, 9999px);
  }

  [part="track"]:focus-visible {
    outline: 2px solid var(--gk-color-focus-ring, rgb(242, 206, 94));
    outline-offset: 2px;
  }

  :host([size="sm"]) [part="track"] {
    width: 28px;
    height: 16px;
  }

  :host([size="md"]) [part="track"],
  :host(:not([size])) [part="track"] {
    width: 36px;
    height: 20px;
  }

  :host([size="lg"]) [part="track"] {
    width: 44px;
    height: 24px;
  }

  [part="thumb"] {
    display: block;
    border-radius: var(--gk-radius-sm, 0.375rem);
    background: #fff;
    box-shadow: var(--gk-shadow-sm, 0 1px 2px rgb(28 25 23 / 0.08));
    transform: translateX(0);
    transition: transform 150ms ease, background-color 150ms ease;
  }

  [part="track"].round [part="thumb"] {
    border-radius: var(--gk-radius-pill, 9999px);
  }

  :host([size="sm"]) [part="thumb"] {
    width: 12px;
    height: 12px;
  }

  :host([size="md"]) [part="thumb"],
  :host(:not([size])) [part="thumb"] {
    width: 16px;
    height: 16px;
  }

  :host([size="lg"]) [part="thumb"] {
    width: 20px;
    height: 20px;
  }

  :host([checked]) [part="track"] {
    background: var(--gk-color-brand, rgb(242, 206, 94));
  }

  :host([checked]) [part="thumb"] {
    background: var(--gk-color-brand-on, rgb(31, 34, 37));
  }

  :host([checked][size="sm"]) [part="thumb"] {
    transform: translateX(12px);
  }

  :host([checked][size="md"]) [part="thumb"],
  :host([checked]:not([size])) [part="thumb"] {
    transform: translateX(16px);
  }

  :host([checked][size="lg"]) [part="thumb"] {
    transform: translateX(20px);
  }

  [part="label"] {
    font-size: 14px;
    line-height: 1.4;
  }

  :host([size="lg"]) [part="label"] {
    font-size: 15px;
  }

  :host([disabled]) {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }

  :host([disabled]) [part="track"] {
    cursor: not-allowed;
  }
`;
