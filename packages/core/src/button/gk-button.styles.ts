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

  /* Appearance: secondary soft fill — only when NOT dashed/text */
  :host([secondary]:not([dashed]):not([text])) [part="base"] {
    box-shadow: none;
    border: 0;
  }

  :host([secondary]:not([dashed]):not([text])[variant="primary"]) [part="base"],
  :host([secondary]:not([dashed]):not([text]):not([variant])) [part="base"] {
    background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 16%, transparent);
    color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
  }

  :host([secondary]:not([dashed]):not([text])[variant="secondary"]) [part="base"] {
    background: color-mix(in srgb, var(--gk-color-text, rgb(31, 34, 37)) 16%, transparent);
    color: var(--gk-color-text, rgb(31, 34, 37));
  }

  :host([secondary]:not([dashed]):not([text])[variant="info"]) [part="base"] {
    background: color-mix(in srgb, var(--gk-color-info, #2080f0) 16%, transparent);
    color: var(--gk-color-info-pressed, #1060c9);
  }

  :host([secondary]:not([dashed]):not([text])[variant="success"]) [part="base"] {
    background: color-mix(in srgb, var(--gk-color-success, #18a058) 16%, transparent);
    color: var(--gk-color-success-pressed, #0c7a43);
  }

  :host([secondary]:not([dashed]):not([text])[variant="warning"]) [part="base"] {
    background: color-mix(in srgb, var(--gk-color-warning, #f0a020) 16%, transparent);
    color: var(--gk-color-warning-pressed, #c97c10);
  }

  :host([secondary]:not([dashed]):not([text])[variant="danger"]) [part="base"] {
    background: color-mix(in srgb, var(--gk-color-danger, #d03050) 16%, transparent);
    color: var(--gk-color-danger-pressed, #ab1f3f);
  }

  :host([secondary]:not([dashed]):not([text])[variant="ghost"]) [part="base"] {
    background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 16%, transparent);
    color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
  }

  :host([secondary]:not([dashed]):not([text])) [part="base"]:hover {
    filter: brightness(0.97);
    transform: translate(2px, -2px);
  }

  :host([secondary]:not([dashed]):not([text])) [part="base"]:active {
    filter: brightness(0.94);
    transform: translate(1px, -1px);
  }

  /* Appearance: dashed — only when NOT text */
  :host([dashed]:not([text])) [part="base"] {
    background: transparent;
    box-shadow: none;
    border-width: 1px;
    border-style: dashed;
  }

  :host([dashed]:not([text])[variant="primary"]) [part="base"],
  :host([dashed]:not([text]):not([variant])) [part="base"] {
    border-color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
    color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
  }

  :host([dashed]:not([text])[variant="secondary"]) [part="base"] {
    border-color: var(--gk-color-border, rgb(224, 224, 230));
    color: var(--gk-color-text, rgb(31, 34, 37));
  }

  :host([dashed]:not([text])[variant="info"]) [part="base"] {
    border-color: var(--gk-color-info, #2080f0);
    color: var(--gk-color-info, #2080f0);
  }

  :host([dashed]:not([text])[variant="success"]) [part="base"] {
    border-color: var(--gk-color-success, #18a058);
    color: var(--gk-color-success, #18a058);
  }

  :host([dashed]:not([text])[variant="warning"]) [part="base"] {
    border-color: var(--gk-color-warning, #f0a020);
    color: var(--gk-color-warning, #f0a020);
  }

  :host([dashed]:not([text])[variant="danger"]) [part="base"] {
    border-color: var(--gk-color-danger, #d03050);
    color: var(--gk-color-danger, #d03050);
  }

  :host([dashed]:not([text])[variant="ghost"]) [part="base"] {
    border-color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
    color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
  }

  :host([dashed]:not([text])) [part="base"]:hover,
  :host([dashed]:not([text])) [part="base"]:active {
    transform: none;
    box-shadow: none;
    background: color-mix(in srgb, currentColor 8%, transparent);
  }

  /* Appearance: text wins */
  :host([text]) [part="base"] {
    background: transparent;
    border: 0;
    box-shadow: none;
    padding-left: 0;
    padding-right: 0;
    height: auto;
  }

  :host([text][size="sm"]) [part="base"] {
    min-height: 28px;
  }

  :host([text][size="md"]) [part="base"],
  :host([text]:not([size])) [part="base"] {
    min-height: 34px;
  }

  :host([text][size="lg"]) [part="base"] {
    min-height: 40px;
  }

  :host([text][variant="primary"]) [part="base"],
  :host([text]:not([variant])) [part="base"] {
    color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
  }

  :host([text][variant="secondary"]) [part="base"] {
    color: var(--gk-color-text, rgb(31, 34, 37));
  }

  :host([text][variant="info"]) [part="base"] {
    color: var(--gk-color-info, #2080f0);
  }

  :host([text][variant="success"]) [part="base"] {
    color: var(--gk-color-success, #18a058);
  }

  :host([text][variant="warning"]) [part="base"] {
    color: var(--gk-color-warning, #f0a020);
  }

  :host([text][variant="danger"]) [part="base"] {
    color: var(--gk-color-danger, #d03050);
  }

  :host([text][variant="ghost"]) [part="base"] {
    color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
  }

  :host([text]) [part="base"]:hover,
  :host([text]) [part="base"]:active {
    transform: none;
    box-shadow: none;
    background: color-mix(in srgb, currentColor 8%, transparent);
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

  :host-context(gk-button-group) {
    display: inline-flex;
  }

  :host-context(gk-button-group) [part="base"] {
    border-radius: 0;
    transform: none;
    box-shadow: none;
  }

  :host-context(gk-button-group) [part="base"]:hover,
  :host-context(gk-button-group) [part="base"]:active,
  :host-context(gk-button-group)[secondary]:not([dashed]):not([text]) [part="base"]:hover,
  :host-context(gk-button-group)[secondary]:not([dashed]):not([text]) [part="base"]:active {
    transform: none;
    box-shadow: none;
  }

  :host-context(gk-button-group):first-child [part="base"] {
    border-start-start-radius: var(--gk-radius-sm, 0.375rem);
    border-end-start-radius: var(--gk-radius-sm, 0.375rem);
  }

  :host-context(gk-button-group):last-child [part="base"] {
    border-start-end-radius: var(--gk-radius-sm, 0.375rem);
    border-end-end-radius: var(--gk-radius-sm, 0.375rem);
  }

  :host-context(gk-button-group):not(:first-child) [part="base"] {
    border-inline-start: 1px solid var(--gk-color-border, rgb(224, 224, 230));
  }
`;
