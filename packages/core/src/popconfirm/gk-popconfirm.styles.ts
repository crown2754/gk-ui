import { css } from "lit";

export const popconfirmStyles = css`
  :host {
    display: inline-block;
    vertical-align: middle;
    max-width: 100%;
    color: var(--gk-color-text, rgb(31, 34, 37));
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
  }

  .gk-popconfirm__root {
    display: contents;
  }

  [part="trigger"] {
    display: inline-flex;
    max-width: 100%;
  }

  [part="mask"] {
    position: fixed;
    inset: 0;
    background: color-mix(in srgb, #000 40%, transparent);
    animation: gk-popconfirm-fade 160ms ease-out;
  }

  [part="panel"] {
    position: fixed;
    z-index: 4000;
    box-sizing: border-box;
    width: max-content;
    min-width: 200px;
    max-width: min(280px, calc(100vw - 24px));
    margin: 0;
    padding: 12px 14px;
    background: var(--gk-color-surface, #fff);
    color: var(--gk-color-text, rgb(31, 34, 37));
    border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
    border-radius: var(--gk-radius-md, 0.5rem);
    box-shadow: var(--gk-shadow-md, 0 4px 12px rgb(28 25 23 / 0.12));
    animation: gk-popconfirm-in 160ms ease-out;
  }

  [part="panel"][hidden] {
    display: none;
  }

  [part="panel"]:focus {
    outline: none;
  }

  [part="panel"][data-placement^="bottom"] {
    animation-name: gk-popconfirm-in-up;
  }

  [part="panel"][data-placement^="left"] {
    animation-name: gk-popconfirm-in-left;
  }

  [part="panel"][data-placement^="right"] {
    animation-name: gk-popconfirm-in-right;
  }

  [part="arrow"] {
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--gk-color-surface, #fff);
    border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
    transform: rotate(45deg);
  }

  [part="panel"][data-placement^="top"] [part="arrow"] {
    bottom: -5px;
    left: 50%;
    margin-left: -4px;
    border-top: none;
    border-left: none;
  }

  [part="panel"][data-placement^="bottom"] [part="arrow"] {
    top: -5px;
    left: 50%;
    margin-left: -4px;
    border-bottom: none;
    border-right: none;
  }

  [part="panel"][data-placement^="left"] [part="arrow"] {
    right: -5px;
    top: 50%;
    margin-top: -4px;
    border-bottom: none;
    border-left: none;
  }

  [part="panel"][data-placement^="right"] [part="arrow"] {
    left: -5px;
    top: 50%;
    margin-top: -4px;
    border-top: none;
    border-right: none;
  }

  [part="title"] {
    display: flex;
    align-items: flex-start;
    gap: 0.4rem;
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
    line-height: 1.35;
  }

  [part="icon"] {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin-top: 1px;
  }

  :host([type="warning"]) [part="icon"] {
    color: var(--gk-color-warning, #f0a020);
  }

  :host([type="error"]) [part="icon"] {
    color: var(--gk-color-danger, #d03050);
  }

  [part="icon"] svg {
    display: block;
    width: 16px;
    height: 16px;
  }

  [part="content"] {
    margin: 0.4rem 0 0;
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
    font-size: 0.8125rem;
    line-height: 1.45;
  }

  [part="footer"] {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  .gk-popconfirm__actions {
    display: contents;
  }

  [part="ok"],
  [part="cancel"] {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 34px;
    margin: 0;
    padding: 0 0.85rem;
    border-radius: var(--gk-radius-md, 0.5rem);
    border: 1px solid transparent;
    font: inherit;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1;
    cursor: pointer;
  }

  [part="ok"]:focus-visible,
  [part="cancel"]:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--gk-color-focus-ring, rgb(242, 206, 94)) 70%, transparent);
  }

  [part="cancel"] {
    background: var(--gk-color-surface, #fff);
    border-color: var(--gk-color-border, rgb(224, 224, 230));
    color: var(--gk-color-text, rgb(31, 34, 37));
  }

  [part="cancel"]:hover {
    background: rgba(46, 51, 56, 0.04);
  }

  [part="ok"] {
    background: var(--gk-color-brand, rgb(242, 206, 94));
    color: var(--gk-color-brand-on, rgb(31, 34, 37));
  }

  [part="ok"]:hover {
    background: var(--gk-color-brand-hover, rgb(246, 217, 122));
  }

  :host([type="warning"]) [part="ok"],
  :host([type="error"]) [part="ok"] {
    background: var(--gk-color-danger, #d03050);
    color: #fff;
  }

  :host([type="warning"]) [part="ok"]:hover,
  :host([type="error"]) [part="ok"]:hover {
    background: var(--gk-color-danger-hover, #de576d);
  }

  @keyframes gk-popconfirm-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes gk-popconfirm-in-up {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes gk-popconfirm-in-left {
    from {
      opacity: 0;
      transform: translateX(8px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes gk-popconfirm-in-right {
    from {
      opacity: 0;
      transform: translateX(-8px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes gk-popconfirm-fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    [part="panel"],
    [part="mask"] {
      animation: none;
    }
  }
`;
