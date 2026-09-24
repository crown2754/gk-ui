import { css } from "lit";

export const drawerStyles = css`
  :host {
    display: contents;
  }

  [part="mask"] {
    position: fixed;
    inset: 0;
    background: color-mix(in srgb, #000 40%, transparent);
    animation: gk-overlay-fade 180ms ease-out;
  }

  [part="panel"] {
    position: fixed;
    z-index: 4000;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    max-width: 100%;
    max-height: 100%;
    margin: 0;
    background: var(--gk-color-surface, #fff);
    color: var(--gk-color-on-surface, rgb(31, 34, 37));
    box-shadow: var(--gk-shadow-md, 0 4px 12px rgb(28 25 23 / 0.12));
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
  }

  [part="panel"]:focus {
    outline: none;
  }

  [part="panel"][data-placement="right"],
  [part="panel"][data-placement="left"] {
    top: 0;
    bottom: 0;
    width: var(--gk-drawer-width, 400px);
  }

  [part="panel"][data-placement="right"] {
    right: 0;
    animation: gk-drawer-right 180ms ease-out;
  }

  [part="panel"][data-placement="left"] {
    left: 0;
    animation: gk-drawer-left 180ms ease-out;
  }

  [part="panel"][data-placement="top"],
  [part="panel"][data-placement="bottom"] {
    left: 0;
    right: 0;
    height: var(--gk-drawer-height, 40vh);
  }

  [part="panel"][data-placement="bottom"] {
    bottom: 0;
    border-radius: var(--gk-radius-lg, 0.75rem) var(--gk-radius-lg, 0.75rem) 0 0;
    animation: gk-drawer-bottom 180ms ease-out;
  }

  [part="panel"][data-placement="top"] {
    top: 0;
    border-radius: 0 0 var(--gk-radius-lg, 0.75rem) var(--gk-radius-lg, 0.75rem);
    animation: gk-drawer-top 180ms ease-out;
  }

  [part="header"] {
    display: flex;
    align-items: center;
    gap: var(--gk-space-3, 0.75rem);
    padding: var(--gk-space-4, 1rem) var(--gk-space-5, 1.25rem);
    border-bottom: 1px solid var(--gk-color-divider, rgb(239, 239, 245));
    flex-shrink: 0;
  }

  [part="title"] {
    flex: 1;
    margin: 0;
    font-family: var(--gk-font-family-display, Fraunces, Georgia, serif);
    font-size: 1.15rem;
    font-weight: 600;
  }

  [part="close"] {
    width: 28px;
    height: 28px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: var(--gk-radius-md, 0.5rem);
    background: transparent;
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
    font-size: 1.15rem;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  [part="close"]:hover {
    background: color-mix(in srgb, var(--gk-color-on-surface, rgb(31, 34, 37)) 8%, transparent);
    color: var(--gk-color-on-surface, rgb(31, 34, 37));
  }

  [part="close"]:focus-visible,
  [part="footer"] :focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--gk-color-focus-ring, rgb(242, 206, 94)) 70%, transparent);
  }

  [part="body"] {
    padding: var(--gk-space-5, 1.25rem);
    overflow: auto;
    flex: 1;
    font-size: 0.95rem;
  }

  [part="footer"] {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: var(--gk-space-3, 0.75rem);
    padding: var(--gk-space-4, 1rem) var(--gk-space-5, 1.25rem);
    border-top: 1px solid var(--gk-color-divider, rgb(239, 239, 245));
    flex-shrink: 0;
  }

  [part="footer"][hidden] {
    display: none;
  }

  @keyframes gk-overlay-fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes gk-drawer-right {
    from { opacity: 0; transform: translateX(12px); }
    to { opacity: 1; transform: none; }
  }

  @keyframes gk-drawer-left {
    from { opacity: 0; transform: translateX(-12px); }
    to { opacity: 1; transform: none; }
  }

  @keyframes gk-drawer-bottom {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: none; }
  }

  @keyframes gk-drawer-top {
    from { opacity: 0; transform: translateY(-12px); }
    to { opacity: 1; transform: none; }
  }

  @media (max-width: 640px) {
    [part="panel"][data-placement="left"],
    [part="panel"][data-placement="right"] {
      width: calc(100% - 48px);
    }
  }
`;
