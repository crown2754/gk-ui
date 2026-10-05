import { css } from "lit";

export const transferStyles = css`
  :host {
    display: block;
    width: 100%;
    max-width: 720px;
    color: var(--gk-color-on-surface, rgb(31, 34, 37));
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    font-size: 14px;
  }

  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }

  [part="root"] {
    display: block;
  }

  [part="body"] {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  [part="source-panel"],
  [part="target-panel"] {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--gk-color-surface, #fff);
    border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
    border-radius: var(--gk-radius-md, 0.5rem);
  }

  [part="header"] {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-bottom: 1px solid var(--gk-color-divider, rgb(239, 239, 245));
  }

  [part="title"] {
    flex: 1;
    min-width: 0;
    font-weight: 600;
  }

  [part="count"] {
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
    font-size: 12px;
  }

  [part="search-wrap"] {
    padding: 8px 12px;
    border-bottom: 1px solid var(--gk-color-divider, rgb(239, 239, 245));
  }

  [part="search"] {
    box-sizing: border-box;
    width: 100%;
    height: 34px;
    padding: 0 12px;
    border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
    border-radius: var(--gk-radius-md, 0.5rem);
    background: var(--gk-color-surface, #fff);
    color: inherit;
    font: inherit;
  }

  :host([size="sm"]) [part="search"] {
    height: 28px;
    font-size: 13px;
  }
  :host([size="lg"]) [part="search"] {
    height: 40px;
    font-size: 15px;
  }

  [part="search"]:focus {
    outline: none;
    border-color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
    box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--gk-color-focus-ring, rgb(242, 206, 94)) 70%, transparent);
  }

  [part="list"] {
    margin: 0;
    padding: 4px;
    overflow: auto;
    min-height: 140px;
    max-height: 280px;
  }

  :host([size="sm"]) [part="list"] {
    max-height: 240px;
  }
  :host([size="lg"]) [part="list"] {
    max-height: 320px;
  }

  [part="item"] {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 34px;
    padding: 6px 8px;
    border-radius: var(--gk-radius-sm, 0.375rem);
    cursor: pointer;
  }

  :host([size="sm"]) [part="item"] {
    min-height: 28px;
    padding: 4px 8px;
    font-size: 13px;
  }
  :host([size="lg"]) [part="item"] {
    min-height: 40px;
    padding: 8px 10px;
    font-size: 15px;
  }

  [part="item"]:hover {
    background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 20%, transparent);
  }

  [part="item"][aria-selected="true"] {
    background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 18%, transparent);
  }

  [part="item"][aria-disabled="true"] {
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
    cursor: not-allowed;
    background: transparent;
  }

  [part="item"]:focus-visible,
  [part="button"]:focus-visible,
  [part="header"] > [part="checkbox"]:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--gk-color-focus-ring, rgb(242, 206, 94)) 70%, transparent);
  }

  [part="checkbox"] {
    box-sizing: border-box;
    width: 18px;
    height: 18px;
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 2px solid var(--gk-color-border, rgb(224, 224, 230));
    border-radius: var(--gk-radius-sm, 0.375rem);
    background: #fff;
    color: var(--gk-color-brand-on, rgb(31, 34, 37));
  }

  button[part="checkbox"] {
    cursor: pointer;
  }

  [part="item"][aria-selected="true"] [part="checkbox"],
  [part="checkbox"][aria-checked="true"],
  [part="checkbox"][aria-checked="mixed"] {
    border-color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
    background: var(--gk-color-brand, rgb(242, 206, 94));
  }

  [part="checkbox"] svg {
    width: 12px;
    height: 12px;
    fill: currentColor;
  }

  [part="label"] {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  [part="empty"] {
    padding: 32px 12px;
    text-align: center;
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
  }

  [part="actions"] {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  [part="button"] {
    box-sizing: border-box;
    min-width: 34px;
    height: 34px;
    padding: 0 10px;
    border-radius: var(--gk-radius-md, 0.5rem);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }

  :host([size="sm"]) [part="button"] {
    min-width: 28px;
    height: 28px;
    font-size: 13px;
  }
  :host([size="lg"]) [part="button"] {
    min-width: 40px;
    height: 40px;
    font-size: 15px;
  }

  [part="button"][data-variant="primary"] {
    border: 1px solid var(--gk-color-brand-pressed, rgb(201, 168, 58));
    background: var(--gk-color-brand, rgb(242, 206, 94));
    color: var(--gk-color-brand-on, rgb(31, 34, 37));
  }

  [part="button"][data-variant="primary"]:hover:not(:disabled) {
    background: var(--gk-color-brand-hover, rgb(246, 217, 122));
  }

  [part="button"][data-variant="outline"] {
    border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
    background: #fff;
    color: var(--gk-color-on-surface, rgb(31, 34, 37));
  }

  [part="button"][data-variant="outline"]:hover:not(:disabled) {
    background: var(--gk-color-button-default-hover, rgba(46, 51, 56, 0.09));
  }

  [part="button"]:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    [part="body"] {
      flex-direction: row;
      align-items: stretch;
    }

    [part="source-panel"],
    [part="target-panel"] {
      flex: 1 1 0;
      min-width: 200px;
    }

    [part="actions"] {
      flex-direction: column;
      justify-content: center;
      padding: 0 4px;
    }
  }
`;
