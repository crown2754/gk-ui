import { css } from "lit";

export const progressStyles = css`
  :host {
    display: block;
    width: 100%;
    max-width: 100%;
    color: var(--gk-color-text, rgb(31, 34, 37));
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
  }

  :host([type="circle"]) {
    display: inline-block;
    width: auto;
    vertical-align: middle;
  }

  [part="root"] {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
  }

  :host([type="circle"]) [part="root"] {
    display: inline-flex;
    position: relative;
    width: auto;
    align-items: center;
    justify-content: center;
  }

  [part="track"] {
    position: relative;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    background: rgba(46, 51, 56, 0.09);
    border-radius: var(--gk-radius-pill, 9999px);
  }

  [part="fill"] {
    height: 100%;
    border-radius: inherit;
    background: var(--gk-color-brand, rgb(242, 206, 94));
    transition: width 250ms ease;
    position: relative;
    overflow: hidden;
  }

  :host([status="success"]) [part="fill"] {
    background: var(--gk-color-success, #18a058);
  }

  :host([status="error"]) [part="fill"] {
    background: var(--gk-color-danger, #d03050);
  }

  :host([status="warning"]) [part="fill"] {
    background: var(--gk-color-warning, #f0a020);
  }

  :host([processing]) [part="fill"]::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent);
    animation: gk-progress-shimmer 1.4s linear infinite;
  }

  [part="indicator"] {
    flex-shrink: 0;
    min-width: 2.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    text-align: end;
    color: var(--gk-color-text, rgb(31, 34, 37));
  }

  :host([status="success"]) [part="indicator"] {
    color: var(--gk-color-success, #18a058);
  }

  :host([status="error"]) [part="indicator"] {
    color: var(--gk-color-danger, #d03050);
  }

  :host([status="warning"]) [part="indicator"] {
    color: var(--gk-color-warning-pressed, #c97c10);
  }

  [part="indicator"][data-placement="inside"] {
    position: absolute;
    inset: 0 10px 0 auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 0;
    font-size: 0.75rem;
    pointer-events: none;
    color: var(--gk-color-text, rgb(31, 34, 37));
  }

  :host([status="default"]) [part="indicator"][data-placement="inside"][data-on-fill="true"],
  :host(:not([status])) [part="indicator"][data-placement="inside"][data-on-fill="true"] {
    color: var(--gk-color-brand-on, rgb(31, 34, 37));
  }

  :host([status="success"]) [part="indicator"][data-placement="inside"][data-on-fill="true"],
  :host([status="error"]) [part="indicator"][data-placement="inside"][data-on-fill="true"],
  :host([status="warning"]) [part="indicator"][data-placement="inside"][data-on-fill="true"] {
    color: #fff;
  }

  [part="circle"] {
    display: block;
    transform: rotate(-90deg);
  }

  [part="trail"] {
    fill: none;
    stroke: rgba(46, 51, 56, 0.09);
    stroke-linecap: round;
  }

  [part="path"] {
    fill: none;
    stroke: var(--gk-color-brand, rgb(242, 206, 94));
    stroke-linecap: round;
    transition: stroke-dashoffset 250ms ease;
  }

  :host([status="success"]) [part="path"] {
    stroke: var(--gk-color-success, #18a058);
  }

  :host([status="error"]) [part="path"] {
    stroke: var(--gk-color-danger, #d03050);
  }

  :host([status="warning"]) [part="path"] {
    stroke: var(--gk-color-warning, #f0a020);
  }

  [part="indicator"][data-placement="center"] {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 0;
    font-size: 0.95rem;
    line-height: 1.2;
    text-align: center;
  }

  :host([size="sm"]) [part="indicator"][data-placement="center"] {
    font-size: 0.75rem;
  }

  :host([size="lg"]) [part="indicator"][data-placement="center"] {
    font-size: 1.15rem;
  }

  @keyframes gk-progress-shimmer {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(100%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    [part="fill"],
    [part="path"] {
      transition: none;
    }

    :host([processing]) [part="fill"]::after {
      animation: none;
    }
  }
`;
