import { css } from "lit";

export const breadcrumbStyles = css`
  :host {
    display: block;
    max-width: 100%;
    color: var(--gk-color-text, rgb(31, 34, 37));
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    font-size: 0.875rem;
    line-height: 1.4;
    --gk-breadcrumb-sep: 12px;
  }

  :host([size="sm"]) {
    font-size: 0.8125rem;
  }

  :host([size="lg"]) {
    font-size: 0.9375rem;
    --gk-breadcrumb-sep: 14px;
  }

  [part="list"] {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.15rem 0;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  [part="item"] {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    min-width: 0;
    max-width: 100%;
  }

  [part="link"] {
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
    text-decoration: none;
    padding: 0.15rem 0.35rem;
    margin: -0.15rem -0.35rem;
    border: 0;
    border-radius: var(--gk-radius-sm, 0.375rem);
    background: none;
    font: inherit;
    line-height: inherit;
    cursor: pointer;
    transition: color 140ms ease, text-decoration-color 140ms ease;
  }

  [part="link"]:hover {
    color: var(--gk-color-text, rgb(31, 34, 37));
    text-decoration: underline;
    text-decoration-color: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 70%, transparent);
    text-underline-offset: 3px;
  }

  [part="link"]:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--gk-color-focus-ring, rgb(242, 206, 94)) 70%, transparent);
  }

  [part="link"][aria-disabled="true"] {
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed;
    text-decoration: none;
  }

  [part="current"] {
    color: var(--gk-color-text, rgb(31, 34, 37));
    font-weight: 600;
    padding: 0.15rem 0.2rem;
  }

  [part="separator"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0 0.15rem;
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
    opacity: 0.7;
  }

  [part="separator"] svg {
    width: var(--gk-breadcrumb-sep, 12px);
    height: var(--gk-breadcrumb-sep, 12px);
    display: block;
  }
`;

export const breadcrumbItemStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    max-width: 100%;
    min-width: 0;
    font: inherit;
    color: inherit;
  }

  .gk-breadcrumb-item__row {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    max-width: 100%;
    min-width: 0;
  }

  [part="link"] {
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
    text-decoration: none;
    padding: 0.15rem 0.35rem;
    margin: -0.15rem -0.35rem;
    border: 0;
    border-radius: var(--gk-radius-sm, 0.375rem);
    background: none;
    font: inherit;
    line-height: inherit;
    cursor: pointer;
    transition: color 140ms ease, text-decoration-color 140ms ease;
  }

  [part="link"]:hover {
    color: var(--gk-color-text, rgb(31, 34, 37));
    text-decoration: underline;
    text-decoration-color: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 70%, transparent);
    text-underline-offset: 3px;
  }

  [part="link"]:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--gk-color-focus-ring, rgb(242, 206, 94)) 70%, transparent);
  }

  :host([disabled]) [part="link"] {
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed;
  }

  [part="current"] {
    color: var(--gk-color-text, rgb(31, 34, 37));
    font-weight: 600;
    padding: 0.15rem 0.2rem;
  }

  [part="separator"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0 0.15rem;
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
    opacity: 0.7;
  }

  [part="separator"] svg {
    width: var(--gk-breadcrumb-sep, 12px);
    height: var(--gk-breadcrumb-sep, 12px);
    display: block;
  }
`;
