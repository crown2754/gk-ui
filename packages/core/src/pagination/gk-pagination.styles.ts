import { css } from "lit";

export const paginationStyles = css`
  :host {
    display: block;
    max-width: 100%;
    color: var(--gk-color-text, rgb(31, 34, 37));
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
  }

  :host([disabled]) {
    opacity: 0.55;
    pointer-events: none;
  }

  [part="root"] {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 0.65rem;
  }

  [part="total"] {
    margin-right: 0.15rem;
    font-size: 0.875rem;
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
  }

  [part="nav"] {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.3rem;
  }

  button {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 34px;
    height: 34px;
    margin: 0;
    padding: 0 0.45rem;
    border: 1px solid transparent;
    border-radius: var(--gk-radius-md, 0.5rem);
    background: transparent;
    color: var(--gk-color-text, rgb(31, 34, 37));
    font: inherit;
    font-size: 0.9rem;
    font-weight: var(--gk-font-weight-medium, 500);
    line-height: 1;
    cursor: pointer;
    user-select: none;
    transition:
      background 140ms ease,
      color 140ms ease,
      box-shadow 140ms ease;
  }

  button:hover:not(:disabled):not([aria-current="page"]) {
    background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 18%, transparent);
  }

  button[aria-current="page"] {
    background: var(--gk-color-brand, rgb(242, 206, 94));
    color: var(--gk-color-brand-on, rgb(31, 34, 37));
    font-weight: var(--gk-font-weight-semibold, 600);
  }

  button:focus-visible,
  [part="size-picker"]:focus-visible,
  [part="quick-jumper"] input:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--gk-color-focus-ring, rgb(242, 206, 94)) 70%, transparent);
  }

  button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  :host([disabled]) button:disabled {
    opacity: 1;
  }

  [part="ellipsis"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 28px;
    height: 34px;
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
    user-select: none;
  }

  .chev {
    width: 14px;
    height: 14px;
    display: block;
  }

  [part="size-picker"] {
    box-sizing: border-box;
    height: 34px;
    padding: 0 0.55rem;
    border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
    border-radius: var(--gk-radius-md, 0.5rem);
    background: var(--gk-color-surface, #fff);
    color: var(--gk-color-text, rgb(31, 34, 37));
    font: inherit;
    font-size: 0.875rem;
    cursor: pointer;
  }

  [part="quick-jumper"] {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.875rem;
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
  }

  [part="quick-jumper"] input {
    box-sizing: border-box;
    width: 52px;
    height: 34px;
    padding: 0 0.25rem;
    border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
    border-radius: var(--gk-radius-md, 0.5rem);
    background: var(--gk-color-surface, #fff);
    color: var(--gk-color-text, rgb(31, 34, 37));
    font: inherit;
    font-size: 0.875rem;
    text-align: center;
  }

  [part="quick-jumper"] input:focus-visible {
    border-color: color-mix(
      in srgb,
      var(--gk-color-brand-pressed, rgb(201, 168, 58)) 50%,
      var(--gk-color-border, rgb(224, 224, 230))
    );
  }

  :host([size="sm"]) button,
  :host([size="sm"]) [part="ellipsis"],
  :host([size="sm"]) [part="size-picker"],
  :host([size="sm"]) [part="quick-jumper"] input {
    height: 28px;
    font-size: 0.8125rem;
  }

  :host([size="sm"]) button {
    min-width: 28px;
  }

  :host([size="md"]) button,
  :host(:not([size])) button,
  :host([size="md"]) [part="ellipsis"],
  :host(:not([size])) [part="ellipsis"],
  :host([size="md"]) [part="size-picker"],
  :host(:not([size])) [part="size-picker"],
  :host([size="md"]) [part="quick-jumper"] input,
  :host(:not([size])) [part="quick-jumper"] input {
    height: 34px;
  }

  :host([size="lg"]) button,
  :host([size="lg"]) [part="ellipsis"],
  :host([size="lg"]) [part="size-picker"],
  :host([size="lg"]) [part="quick-jumper"] input {
    height: 40px;
    font-size: 1rem;
  }

  :host([size="lg"]) button {
    min-width: 40px;
  }
`;
