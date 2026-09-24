import { css } from "lit";

export const tooltipStyles = css`
  :host {
    display: inline-flex;
    vertical-align: middle;
    max-width: 100%;
  }

  [part="trigger"] {
    display: inline-flex;
    max-width: 100%;
  }

  [part="tip"] {
    position: fixed;
    z-index: 4000;
    box-sizing: border-box;
    max-width: 240px;
    margin: 0;
    padding: 6px 10px;
    background: var(--gk-color-on-surface, rgb(31, 34, 37));
    color: var(--gk-color-surface, #fff);
    border-radius: var(--gk-radius-sm, 0.375rem);
    box-shadow: var(--gk-shadow-md, 0 4px 12px rgb(28 25 23 / 0.12));
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.35;
    text-align: center;
    pointer-events: none;
    animation: gk-tooltip-in 180ms ease-out;
  }

  [part="arrow"] {
    position: absolute;
    width: 8px;
    height: 8px;
    background: inherit;
    transform: rotate(45deg);
  }

  [part="tip"][data-placement^="top"] [part="arrow"] {
    top: calc(100% - 4px);
    left: 50%;
    margin-left: -4px;
  }

  [part="tip"][data-placement^="bottom"] [part="arrow"] {
    bottom: calc(100% - 4px);
    left: 50%;
    margin-left: -4px;
  }

  [part="tip"][data-placement^="left"] [part="arrow"] {
    left: calc(100% - 4px);
    top: 50%;
    margin-top: -4px;
  }

  [part="tip"][data-placement^="right"] [part="arrow"] {
    right: calc(100% - 4px);
    top: 50%;
    margin-top: -4px;
  }

  @keyframes gk-tooltip-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  [part="tip"][data-placement^="bottom"] {
    animation-name: gk-tooltip-in-down;
  }

  @keyframes gk-tooltip-in-down {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
`;
