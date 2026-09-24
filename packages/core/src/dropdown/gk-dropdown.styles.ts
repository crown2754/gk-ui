import { css } from "lit";

export const dropdownStyles = css`
  :host {
    display: inline-block;
    vertical-align: middle;
    max-width: 100%;
    --gk-dropdown-item-min-height: 34px;
  }

  :host([size="sm"]) {
    --gk-dropdown-item-min-height: 28px;
  }

  :host([size="lg"]) {
    --gk-dropdown-item-min-height: 40px;
  }

  [part="trigger"] {
    display: inline-flex;
    max-width: 100%;
  }

  .gk-dropdown__fallback {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    margin: 0;
    height: 34px;
    padding: 0 0.9rem;
    border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
    border-radius: var(--gk-radius-md, 0.5rem);
    background: var(--gk-color-surface, #fff);
    color: var(--gk-color-on-surface, rgb(31, 34, 37));
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1;
    cursor: pointer;
    transition: border-color 160ms ease, box-shadow 160ms ease;
  }

  :host([size="sm"]) .gk-dropdown__fallback {
    height: 28px;
    padding: 0 0.75rem;
    font-size: 0.875rem;
  }

  :host([size="lg"]) .gk-dropdown__fallback {
    height: 40px;
    padding: 0 1.05rem;
    font-size: 1.05rem;
  }

  :host([open]) .gk-dropdown__fallback,
  .gk-dropdown__fallback:focus-visible {
    outline: none;
    border-color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--gk-color-focus-ring, rgb(242, 206, 94)) 70%, transparent);
  }

  :host([disabled]) .gk-dropdown__fallback {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .gk-dropdown__chevron {
    width: 12px;
    height: 12px;
    transition: transform 160ms ease;
  }

  :host([open]) .gk-dropdown__chevron {
    transform: rotate(180deg);
  }

  [part="menu"] {
    position: fixed;
    z-index: 4000;
    box-sizing: border-box;
    min-width: 11.5rem;
    margin: 0;
    padding: 0.35rem;
    list-style: none;
    background: var(--gk-color-surface, #fff);
    color: var(--gk-color-on-surface, rgb(31, 34, 37));
    border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
    border-radius: var(--gk-radius-md, 0.5rem);
    box-shadow: var(--gk-shadow-md, 0 4px 12px rgb(28 25 23 / 0.12));
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    max-height: 16rem;
    overflow: auto;
    animation: gk-dropdown-in 160ms ease-out;
  }

  [part="menu"][hidden] {
    display: none;
  }

  @keyframes gk-dropdown-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
`;

export const dropdownItemStyles = css`
  :host {
    display: block;
  }

  :host([type="divider"]) {
    display: block;
  }

  [part="item"] {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-sizing: border-box;
    min-height: var(--gk-dropdown-item-min-height, 34px);
    padding: 0.5rem 0.65rem;
    border: 0;
    border-radius: calc(var(--gk-radius-md, 0.5rem) - 1px);
    background: transparent;
    color: var(--gk-color-on-surface, rgb(31, 34, 37));
    font: inherit;
    font-size: 0.95rem;
    text-align: start;
    width: 100%;
    cursor: pointer;
  }

  [part="item"]:hover,
  :host([active]) [part="item"] {
    background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 22%, transparent);
  }

  [part="item"]:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--gk-color-focus-ring, rgb(242, 206, 94)) 70%, transparent);
  }

  :host([danger]) [part="item"] {
    color: var(--gk-color-danger, #d03050);
  }

  :host([danger]) [part="item"]:hover,
  :host([danger][active]) [part="item"] {
    background: color-mix(in srgb, var(--gk-color-danger, #d03050) 12%, transparent);
  }

  :host([disabled]) [part="item"] {
    color: var(--gk-color-on-surface-muted, rgb(118, 124, 130));
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  [part="label"] {
    flex: 1;
    min-width: 0;
  }

  [part="shortcut"] {
    margin-inline-start: auto;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    color: var(--gk-color-on-surface-muted, rgb(118, 124, 130));
  }

  [part="divider"] {
    height: 1px;
    margin: 0.35rem 0.25rem;
    background: var(--gk-color-divider, rgb(239, 239, 245));
  }
`;
