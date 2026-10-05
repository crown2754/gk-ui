import { css } from "lit";

export const rateStyles = css`
  :host {
    display: inline-flex;
    vertical-align: middle;
    color: var(--gk-rate-color, var(--gk-color-brand, rgb(242, 206, 94)));
  }

  [part="root"] {
    display: inline-flex;
    align-items: center;
    gap: var(--gk-rate-gap, 4px);
  }

  :host([size="sm"]) {
    --gk-rate-glyph: 16px;
    --gk-rate-gap: 2px;
    --gk-rate-hit: 28px;
  }

  :host([size="md"]),
  :host(:not([size])) {
    --gk-rate-glyph: 22px;
    --gk-rate-gap: 4px;
    --gk-rate-hit: 28px;
  }

  :host([size="lg"]) {
    --gk-rate-glyph: 28px;
    --gk-rate-gap: 4px;
    --gk-rate-hit: 32px;
  }

  [part="item"] {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--gk-rate-glyph);
    min-height: var(--gk-rate-hit);
  }

  [part="icon"] {
    position: relative;
    width: var(--gk-rate-glyph);
    height: var(--gk-rate-glyph);
    pointer-events: none;
  }

  [part="icon"] svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  [part="empty"] {
    fill: rgba(46, 51, 56, 0.16);
  }

  .fill {
    position: absolute;
    inset: 0;
    fill: currentColor;
  }

  :host([data-preview]) {
    color: var(--gk-color-brand-hover, rgb(246, 217, 122));
  }

  [part="half"],
  [part="full"] {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  [part="half"] {
    left: 0;
    width: 50%;
  }

  button[part="full"] {
    left: 50%;
    width: 50%;
  }

  :host(:not([allow-half])) button[part="full"] {
    left: 0;
    width: 100%;
  }

  [part="half"]:focus-visible,
  [part="full"]:focus-visible,
  [part="root"]:focus-visible {
    outline: 2px solid
      color-mix(in srgb, var(--gk-color-focus-ring, rgb(242, 206, 94)) 70%, transparent);
    outline-offset: 2px;
  }

  :host([readonly]) [part="half"],
  :host([readonly]) [part="full"] {
    cursor: default;
  }

  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }
`;
