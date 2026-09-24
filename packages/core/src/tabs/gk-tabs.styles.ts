import { css } from "lit";

const focusRing = css`
  outline: none;
  box-shadow: 0 0 0 2px
    color-mix(in srgb, var(--gk-color-focus-ring, rgb(242, 206, 94)) 70%, transparent);
`;

export const tabsStyles = css`
  :host {
    display: block;
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    color: var(--gk-color-text, rgb(31, 34, 37));
  }

  [part="tablist"] {
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    align-items: stretch;
    gap: 0.15rem;
    overflow-x: auto;
    scrollbar-width: thin;
    border-bottom: 1px solid var(--gk-color-divider, rgb(239, 239, 245));
  }

  [part="tab"] {
    appearance: none;
    position: relative;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    height: 34px;
    margin: 0;
    padding: 0 0.9rem;
    border: 0;
    border-radius: var(--gk-radius-sm, 0.375rem);
    background: transparent;
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
    font: inherit;
    font-weight: var(--gk-font-weight-medium, 500);
    font-size: 0.95rem;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    transition:
      color 150ms ease,
      background 150ms ease;
  }

  :host([size="sm"]) [part="tab"] {
    height: 28px;
    padding: 0 0.7rem;
    font-size: 0.875rem;
  }

  :host([size="md"]) [part="tab"],
  :host(:not([size])) [part="tab"] {
    height: 34px;
  }

  :host([size="lg"]) [part="tab"] {
    height: 40px;
    padding: 0 1.05rem;
    font-size: 1.05rem;
  }

  [part="tab"]:hover:not([aria-selected="true"]):not([aria-disabled="true"]) {
    color: var(--gk-color-text, rgb(31, 34, 37));
  }

  [part="tab"][aria-selected="true"] {
    color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
    font-weight: var(--gk-font-weight-semibold, 600);
  }

  [part="tab"][aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  [part="tab"]:focus-visible {
    ${focusRing}
    z-index: 1;
  }

  [part="tab"] ::slotted(*) {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  [part="indicator"] {
    position: absolute;
    left: 0;
    bottom: -1px;
    height: 2px;
    width: 0;
    border-radius: 1px;
    background: var(--gk-color-brand, rgb(242, 206, 94));
    pointer-events: none;
    transition:
      transform 180ms ease,
      width 180ms ease;
  }

  :host(:not([animated])) [part="indicator"] {
    transition: none;
  }

  :host([type="segment"]) [part="tablist"] {
    width: fit-content;
    max-width: 100%;
    gap: 2px;
    padding: 3px;
    border-bottom: 0;
    border-radius: var(--gk-radius-md, 0.5rem);
    background: var(--gk-color-button-default, rgba(46, 51, 56, 0.05));
  }

  :host([type="segment"]) [part="tab"] {
    height: 30px;
    border-radius: calc(var(--gk-radius-md, 0.5rem) - 2px);
  }

  :host([type="segment"][size="sm"]) [part="tab"] {
    height: 26px;
  }

  :host([type="segment"][size="lg"]) [part="tab"] {
    height: 36px;
  }

  :host([type="segment"]) [part="tab"]:hover:not([aria-selected="true"]):not([aria-disabled="true"]) {
    background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 12%, transparent);
    color: var(--gk-color-text, rgb(31, 34, 37));
  }

  :host([type="segment"]) [part="tab"][aria-selected="true"] {
    background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 22%, transparent);
    color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
  }

  :host([type="segment"]) [part="indicator"] {
    display: none;
  }

  [part="panels"] {
    display: block;
  }

  [part="panel"] {
    padding: 0.75rem 0.15rem 0.5rem;
    font-size: 0.95rem;
    color: var(--gk-color-text, rgb(31, 34, 37));
  }

  [part="panel"][hidden] {
    display: none;
  }

  :host([animated]) [part="panel"]:not([hidden]) {
    animation: gk-tabs-fade 180ms ease;
  }

  [part="panel"] ::slotted(gk-tab-pane) {
    display: block;
  }

  @keyframes gk-tabs-fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    [part="indicator"],
    [part="panel"] {
      transition: none;
      animation: none;
    }
  }
`;
