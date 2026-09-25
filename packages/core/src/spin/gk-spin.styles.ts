import { css } from "lit";

export const spinStyles = css`
  :host {
    display: inline-block;
    position: relative;
    vertical-align: middle;
    color: var(--gk-color-text, rgb(31, 34, 37));
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
  }

  :host([data-has-content]) {
    display: block;
  }

  [part="container"] {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  :host([data-has-content]) [part="container"] {
    display: block;
  }

  [part="content"] {
    min-width: 0;
  }

  :host([data-spinning]) [part="content"] {
    pointer-events: none;
    user-select: none;
  }

  [part="mask"] {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, #fff 55%, transparent);
  }

  [part="spinner"] {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.65rem;
  }

  [part="spinner"][hidden] {
    display: none;
  }

  .gk-spin__ring {
    box-sizing: border-box;
    width: 28px;
    height: 28px;
    border: 2.5px solid color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 25%, transparent);
    border-top-color: var(--gk-color-brand, rgb(242, 206, 94));
    border-radius: 50%;
    animation: gk-spin 0.75s linear infinite;
  }

  :host([size="sm"]) .gk-spin__ring {
    width: 18px;
    height: 18px;
    border-width: 2px;
  }

  :host([size="md"]) .gk-spin__ring,
  :host(:not([size])) .gk-spin__ring {
    width: 28px;
    height: 28px;
    border-width: 2.5px;
  }

  :host([size="lg"]) .gk-spin__ring {
    width: 40px;
    height: 40px;
    border-width: 3px;
  }

  [part="tip"] {
    margin: 0;
    max-width: 12rem;
    font-size: 0.875rem;
    line-height: 1.4;
    text-align: center;
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
  }

  [part="tip"].sr {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }

  @keyframes gk-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .gk-spin__ring {
      animation-duration: 1.6s;
    }
  }
`;
