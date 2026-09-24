import { css } from "lit";

export const radioStyles = css`
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

  [part="control"] {
    box-sizing: border-box;
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    border: 2px solid var(--gk-color-border, rgb(224, 224, 230));
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    transition: border-color 150ms ease;
  }

  [part="control"]:focus-visible {
    outline: 2px solid var(--gk-color-focus-ring, rgb(242, 206, 94));
    outline-offset: 2px;
  }

  :host([size="sm"]) [part="control"] {
    width: 16px;
    height: 16px;
  }

  :host([size="md"]) [part="control"],
  :host(:not([size])) [part="control"] {
    width: 18px;
    height: 18px;
  }

  :host([size="lg"]) [part="control"] {
    width: 22px;
    height: 22px;
  }

  /* Selected: white fill + deep-gold ring + deep-gold center (never solid yellow). */
  :host([checked]) [part="control"] {
    background: #fff;
    border-color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
  }

  [part="dot"] {
    display: block;
    width: 38%;
    height: 38%;
    border-radius: 50%;
    background: var(--gk-color-brand-pressed, rgb(201, 168, 58));
    transform: scale(0);
    transition: transform 150ms ease;
  }

  :host([checked]) [part="dot"] {
    transform: scale(1);
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

  /* Unchecked stays subdued. Checked keeps the white + deep-gold mark. */
  :host([disabled]:not([checked])),
  :host([data-gk-group-disabled]:not([checked])) {
    opacity: 0.5;
  }

  :host([disabled]) [part="control"],
  :host([data-gk-group-disabled]) [part="control"] {
    opacity: 1;
  }

  :host([disabled][checked]) [part="label"],
  :host([data-gk-group-disabled][checked]) [part="label"] {
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
  }
`;
