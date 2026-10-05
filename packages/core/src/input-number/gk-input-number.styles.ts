import { css } from "lit";

export const inputNumberStyles = css`
  :host {
    display: inline-block;
    vertical-align: middle;
    width: 11rem;
    max-width: 100%;
    color: var(--gk-color-on-surface, rgb(31, 34, 37));
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
  }

  :host([button-placement="both"]) {
    width: auto;
  }

  .field {
    display: inline-flex;
    align-items: stretch;
    gap: 4px;
    width: 100%;
  }

  [part="base"] {
    box-sizing: border-box;
    display: flex;
    align-items: stretch;
    width: 100%;
    min-width: 0;
    background: var(--gk-color-surface, #fff);
    border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
    border-radius: var(--gk-radius-md, 0.5rem);
    color: inherit;
    transition: border-color 150ms ease, box-shadow 150ms ease;
  }

  :host([button-placement="both"]) [part="base"] {
    flex: 1 1 auto;
    width: 11rem;
  }

  :host([size="sm"]) [part="base"],
  :host([size="sm"]) [part="increment"],
  :host([size="sm"]) [part="decrement"] {
    min-height: 28px;
    font-size: 14px;
  }

  :host([size="md"]) [part="base"],
  :host(:not([size])) [part="base"],
  :host([size="md"]) [part="increment"],
  :host([size="md"]) [part="decrement"],
  :host(:not([size])) [part="increment"],
  :host(:not([size])) [part="decrement"] {
    min-height: 34px;
    font-size: 14px;
  }

  :host([size="lg"]) [part="base"],
  :host([size="lg"]) [part="increment"],
  :host([size="lg"]) [part="decrement"] {
    min-height: 40px;
    font-size: 15px;
  }

  [part="base"]:hover {
    border-color: rgb(200, 200, 208);
  }

  [part="base"]:focus-within {
    border-color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
    box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--gk-color-focus-ring, rgb(242, 206, 94)) 70%, transparent);
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
    border-color: var(--gk-color-success, #18a058);
    box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--gk-color-success, #18a058) 70%, transparent);
  }
  :host([status="warning"]) [part="base"]:focus-within {
    border-color: var(--gk-color-warning, #f0a020);
    box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--gk-color-warning, #f0a020) 70%, transparent);
  }
  :host([status="error"]) [part="base"]:focus-within {
    border-color: var(--gk-color-danger, #d03050);
    box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--gk-color-danger, #d03050) 70%, transparent);
  }

  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }

  [part="input-wrap"] {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    gap: 8px;
  }

  :host([size="sm"]) [part="input-wrap"] {
    padding-inline: 10px;
  }
  :host([size="md"]) [part="input-wrap"],
  :host(:not([size])) [part="input-wrap"] {
    padding-inline: 12px;
  }
  :host([size="lg"]) [part="input-wrap"] {
    padding-inline: 14px;
  }

  [part="prefix"],
  [part="suffix"] {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    color: var(--gk-color-on-surface-muted, rgb(118, 124, 130));
    user-select: none;
  }

  [part="prefix"][hidden],
  [part="suffix"][hidden] {
    display: none;
  }

  [part="input"] {
    flex: 1;
    min-width: 0;
    width: 100%;
    border: 0;
    margin: 0;
    padding: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    outline: none;
  }

  :host([readonly]) [part="input"] {
    cursor: default;
  }

  :host(:not([button-placement="both"])) [part="controls"] {
    display: flex;
    flex-direction: column;
    flex: 0 0 22px;
    border-inline-start: 1px solid var(--gk-color-border, rgb(224, 224, 230));
  }

  :host(:not([button-placement="both"])) [part="increment"],
  :host(:not([button-placement="both"])) [part="decrement"] {
    flex: 1;
    min-height: 0;
    width: 22px;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--gk-color-on-surface-muted, rgb(118, 124, 130));
    cursor: pointer;
  }

  :host(:not([button-placement="both"])) [part="increment"] {
    border-bottom: 1px solid var(--gk-color-border, rgb(224, 224, 230));
  }

  :host([button-placement="both"]) [part="increment"],
  :host([button-placement="both"]) [part="decrement"] {
    box-sizing: border-box;
    flex: 0 0 28px;
    width: 28px;
    border: 1px solid transparent;
    border-radius: var(--gk-radius-md, 0.5rem);
    background: var(--gk-color-button-default, rgba(46, 51, 56, 0.05));
    color: var(--gk-color-on-surface, rgb(31, 34, 37));
    cursor: pointer;
    font: inherit;
  }

  [part="increment"]:hover:not(:disabled),
  [part="decrement"]:hover:not(:disabled) {
    background: rgba(46, 51, 56, 0.08);
  }

  [part="increment"]:active:not(:disabled),
  [part="decrement"]:active:not(:disabled) {
    background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 20%, transparent);
  }

  [part="increment"]:disabled,
  [part="decrement"]:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  [part="increment"] svg,
  [part="decrement"] svg {
    width: 14px;
    height: 14px;
    display: block;
    margin: 0 auto;
    fill: currentColor;
  }
`;
