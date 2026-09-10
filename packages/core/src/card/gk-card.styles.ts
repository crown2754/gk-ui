import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;
  }

  [part="base"] {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    color: var(--gk-color-text, rgb(31, 34, 37));
    background: var(--gk-color-surface-elevated, rgb(255, 255, 255));
    border-radius: var(--gk-radius-md, 0.5rem);
    transition: transform 150ms ease, box-shadow 150ms ease;
  }

  :host([bordered]) [part="base"] {
    border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
  }

  :host([hoverable]) [part="base"]:hover {
    transform: translate(1px, -1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  [part="cover"] {
    overflow: hidden;
  }

  [part="cover"] img {
    display: block;
    width: 100%;
    max-height: 180px;
    object-fit: cover;
  }

  [part="header"] {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gk-space-3, 0.75rem);
  }

  .gk-card__header-main {
    flex: 1;
    min-width: 0;
  }

  .gk-card__title {
    font-weight: var(--gk-font-weight-medium, 500);
    line-height: 1.4;
  }

  [part="action"] {
    display: flex;
    align-items: center;
    gap: var(--gk-space-2, 0.5rem);
    flex-shrink: 0;
  }

  button[part="close"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
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

  :host([size="sm"]) [part="header"],
  :host([size="sm"]) [part="content"],
  :host([size="sm"]) [part="footer"] {
    padding: var(--gk-space-3, 0.75rem);
  }

  :host([size="sm"]) .gk-card__title {
    font-size: 14px;
  }

  :host([size="md"]) [part="header"],
  :host([size="md"]) [part="content"],
  :host([size="md"]) [part="footer"],
  :host(:not([size])) [part="header"],
  :host(:not([size])) [part="content"],
  :host(:not([size])) [part="footer"] {
    padding: var(--gk-space-4, 1rem);
  }

  :host([size="md"]) .gk-card__title,
  :host(:not([size])) .gk-card__title {
    font-size: 16px;
  }

  :host([size="lg"]) [part="header"],
  :host([size="lg"]) [part="content"],
  :host([size="lg"]) [part="footer"] {
    padding: var(--gk-space-5, 1.25rem);
  }

  :host([size="lg"]) .gk-card__title {
    font-size: 18px;
  }

  :host([segmented]) [part="header"] + [part="content"],
  :host([segmented]) [part="content"] + [part="footer"] {
    border-top: 1px solid var(--gk-color-border, rgb(224, 224, 230));
  }

  :host([segmented]) [part="cover"] + [part="header"] {
    border-top: 1px solid var(--gk-color-border, rgb(224, 224, 230));
  }
`;
