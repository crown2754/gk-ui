import { css } from "lit";

export const badgeStyles = css`
  :host {
    --gk-badge-offset-x: 0px;
    --gk-badge-offset-y: 0px;
    --gk-badge-z-index: 1;
    display: inline-flex;
    vertical-align: middle;
    max-width: 100%;
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
  }

  :host(:focus-visible) {
    outline: none;
    border-radius: var(--gk-radius-md, 0.5rem);
    box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--gk-color-focus-ring, rgb(242, 206, 94)) 70%, transparent);
  }

  [part="root"],
  [part="wrapper"] {
    display: inline-flex;
    position: relative;
    max-width: 100%;
    vertical-align: middle;
  }

  :host([standalone]) [part="wrapper"] {
    position: static;
  }

  [part~="badge"] {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    right: 0;
    z-index: var(--gk-badge-z-index, 1);
    transform: translate(
      calc(50% + var(--gk-badge-offset-x, 0px)),
      calc(-50% + var(--gk-badge-offset-y, 0px))
    );
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 18px;
    padding: 0 6px;
    border-radius: var(--gk-radius-pill, 9999px);
    background: var(--gk-color-danger, #d03050);
    color: #fff;
    font-size: 12px;
    font-weight: var(--gk-font-weight-semibold, 600);
    font-variant-numeric: tabular-nums;
    line-height: 1;
    white-space: nowrap;
    box-shadow: 0 0 0 1px #fff;
    user-select: none;
  }

  :host(:not([standalone])) [part~="badge"] {
    pointer-events: none;
  }

  [part~="badge"][data-wide] {
    padding: 0 7px;
  }

  :host([standalone]) [part~="badge"] {
    position: relative;
    top: auto;
    right: auto;
    transform: none;
    box-shadow: none;
    vertical-align: middle;
  }

  [part="value"] {
    display: block;
    max-width: 4.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :host([dot]) [part~="badge"] {
    width: 8px;
    min-width: 8px;
    height: 8px;
    padding: 0;
  }

  :host([dot]:not([standalone])) [part~="badge"] {
    box-shadow: 0 0 0 1.5px #fff;
  }

  :host([type="default"]) [part~="badge"],
  :host(:not([type])) [part~="badge"] {
    --gk-badge-accent: var(--gk-color-danger, #d03050);
    background: var(--gk-badge-accent);
    color: #fff;
  }

  :host([standalone][type="default"]) [part~="badge"],
  :host([standalone]:not([type])) [part~="badge"] {
    --gk-badge-accent: var(--gk-color-text-muted, rgb(118, 124, 130));
    background: var(--gk-color-button-default, rgba(46, 51, 56, 0.08));
    color: var(--gk-color-text, rgb(31, 34, 37));
  }

  :host([type="primary"]) [part~="badge"] {
    --gk-badge-accent: var(--gk-color-brand, rgb(242, 206, 94));
    background: var(--gk-badge-accent);
    color: var(--gk-color-brand-on, rgb(31, 34, 37));
  }

  :host([type="success"]) [part~="badge"] {
    --gk-badge-accent: var(--gk-color-success, #18a058);
    background: var(--gk-badge-accent);
    color: #fff;
  }

  :host([type="warning"]) [part~="badge"] {
    --gk-badge-accent: var(--gk-color-warning, #f0a020);
    background: var(--gk-badge-accent);
    color: var(--gk-color-brand-on, rgb(31, 34, 37));
  }

  :host([type="error"]) [part~="badge"] {
    --gk-badge-accent: var(--gk-color-danger, #d03050);
    background: var(--gk-badge-accent);
    color: #fff;
  }

  :host([type="info"]) [part~="badge"] {
    --gk-badge-accent: var(--gk-color-info, #2080f0);
    background: var(--gk-badge-accent);
    color: #fff;
  }

  :host([processing]) [part~="badge"]::after {
    content: "";
    position: absolute;
    inset: -3px;
    border-radius: inherit;
    border: 1.5px solid var(--gk-badge-accent, var(--gk-color-danger, #d03050));
    opacity: 0.35;
    animation: gk-badge-pulse 1.4s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes gk-badge-pulse {
    0% {
      transform: scale(0.85);
      opacity: 0.55;
    }
    70% {
      transform: scale(1.35);
      opacity: 0;
    }
    100% {
      transform: scale(1.35);
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :host([processing]) [part~="badge"]::after {
      animation: none;
    }
  }
`;
