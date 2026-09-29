import { css } from "lit";

export const skeletonStyles = css`
  :host {
    --gk-skeleton-base: rgba(46, 51, 56, 0.07);
    --gk-skeleton-highlight: rgba(255, 255, 255, 0.55);
    display: block;
    width: 100%;
    position: relative;
    box-sizing: border-box;
  }

  :host([button]:not([text]):not([avatar]):not([image])) {
    display: inline-block;
    width: auto;
    vertical-align: middle;
  }

  [part="root"] {
    display: block;
    width: 100%;
  }

  [part="content"][hidden],
  [part="placeholder"][hidden] {
    display: none;
  }

  .sr {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .gk-skeleton__stack {
    display: grid;
    gap: 12px;
  }

  .gk-skeleton__block {
    display: grid;
    gap: 12px;
  }

  .gk-skeleton__row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: flex-start;
  }

  .gk-skeleton__text {
    flex: 1;
    min-width: 0;
  }

  [part~="bone"] {
    position: relative;
    overflow: hidden;
    background: var(--gk-skeleton-base);
    border-radius: var(--gk-radius-sm, 0.375rem);
  }

  [part~="bone"].is-animated::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--gk-skeleton-highlight) 45%,
      var(--gk-skeleton-highlight) 55%,
      transparent 100%
    );
    transform: translateX(-120%);
    animation: gk-skeleton-shimmer 1.5s linear infinite;
  }

  [part~="line"] {
    height: 13px;
    width: 100%;
    margin-bottom: 10px;
  }

  [part~="line"]:last-child {
    width: 62%;
    margin-bottom: 0;
  }

  [part~="avatar"] {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  [part~="button"] {
    width: 96px;
    height: 34px;
    border-radius: var(--gk-radius-md, 0.5rem);
  }

  [part~="image"] {
    width: 100%;
    height: 140px;
    border-radius: var(--gk-radius-md, 0.5rem);
  }

  :host([round]) [part~="bone"] {
    border-radius: var(--gk-radius-pill, 9999px);
  }

  :host([round]) [part~="avatar"] {
    border-radius: 50%;
  }

  :host([sharp]) [part~="bone"] {
    border-radius: 0;
  }

  @keyframes gk-skeleton-shimmer {
    100% {
      transform: translateX(120%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    [part~="bone"].is-animated::after {
      animation: none;
      display: none;
    }
  }
`;
