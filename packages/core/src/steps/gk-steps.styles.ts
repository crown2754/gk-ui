import { css } from "lit";

export const stepsStyles = css`
  :host {
    display: block;
    width: 100%;
    max-width: 100%;
    color: var(--gk-color-text, rgb(31, 34, 37));
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    --gk-step-circle: 28px;
  }

  :host([size="sm"]) {
    --gk-step-circle: 24px;
  }

  :host([size="lg"]) {
    --gk-step-circle: 32px;
  }

  [part="list"] {
    display: flex;
    align-items: flex-start;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  :host([direction="vertical"]) [part="list"] {
    flex-direction: column;
  }

  .gk-steps__generated {
    display: contents;
  }
`;

export const stepStyles = css`
  :host {
    display: flex;
    position: relative;
    flex: 1 1 0;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
    color: var(--gk-color-text, rgb(31, 34, 37));
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    --gk-step-circle: 28px;
  }

  :host([size="sm"]) {
    --gk-step-circle: 24px;
  }

  :host([size="lg"]) {
    --gk-step-circle: 32px;
  }

  :host([direction="vertical"]) {
    flex: none;
    flex-direction: row;
    align-items: flex-start;
    gap: 0.75rem;
    width: 100%;
    padding-bottom: 1.25rem;
  }

  :host([direction="vertical"][tail]) {
    padding-bottom: 0;
  }

  :host([clickable]) {
    cursor: pointer;
  }

  :host([clickable]:focus-visible) {
    outline: none;
  }

  :host([clickable]:focus-visible) [part="indicator"] {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--gk-color-focus-ring, rgb(242, 206, 94)) 70%, transparent);
  }

  :host([clickable]:hover) [part="indicator"] {
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 20%, transparent);
  }

  [part="head"] {
    display: flex;
    align-items: center;
    width: 100%;
  }

  :host([direction="vertical"]) [part="head"] {
    flex-direction: column;
    align-items: center;
    align-self: stretch;
    position: relative;
    width: var(--gk-step-circle);
  }

  [part="indicator"] {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--gk-step-circle);
    height: var(--gk-step-circle);
    border-radius: var(--gk-radius-pill, 9999px);
    border: 2px solid transparent;
    background: rgba(46, 51, 56, 0.08);
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
    font-size: 0.8125rem;
    font-weight: 600;
    line-height: 1;
    transition: background 160ms ease, color 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
  }

  :host([size="lg"]) [part="indicator"] {
    font-size: 0.9rem;
  }

  [part="indicator"] svg {
    width: 14px;
    height: 14px;
    display: block;
  }

  :host([size="lg"]) [part="indicator"] svg {
    width: 16px;
    height: 16px;
  }

  :host([data-status="wait"]) [part="indicator"] {
    background: rgba(46, 51, 56, 0.06);
    border-color: var(--gk-color-border, rgb(224, 224, 230));
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
  }

  :host([data-status="process"]) [part="indicator"] {
    background: var(--gk-color-brand, rgb(242, 206, 94));
    border-color: var(--gk-color-brand, rgb(242, 206, 94));
    color: var(--gk-color-brand-on, rgb(31, 34, 37));
  }

  :host([data-status="finish"]) [part="indicator"] {
    background: color-mix(in srgb, var(--gk-color-success, #18a058) 16%, transparent);
    border-color: transparent;
    color: var(--gk-color-success, #18a058);
  }

  :host([data-status="error"]) [part="indicator"] {
    background: color-mix(in srgb, var(--gk-color-danger, #d03050) 14%, transparent);
    border-color: transparent;
    color: var(--gk-color-danger, #d03050);
  }

  [part="connector"] {
    flex: 1;
    height: 2px;
    min-width: 12px;
    margin: 0 0.5rem;
    background: var(--gk-color-border, rgb(224, 224, 230));
  }

  :host([data-status="finish"]) [part="connector"] {
    background: color-mix(
      in srgb,
      var(--gk-color-success, #18a058) 55%,
      var(--gk-color-border, rgb(224, 224, 230))
    );
  }

  :host([tail]) [part="connector"] {
    display: none;
  }

  :host([direction="vertical"]) [part="connector"] {
    position: absolute;
    top: calc(var(--gk-step-circle) + 4px);
    bottom: -1.25rem;
    left: 50%;
    width: 2px;
    height: auto;
    min-width: 0;
    margin: 0;
    transform: translateX(-50%);
  }

  :host([direction="vertical"][tail]) [part="connector"] {
    display: none;
  }

  [part="main"] {
    min-width: 0;
    margin-top: 0.55rem;
    padding-inline-end: 0.75rem;
  }

  :host([direction="vertical"]) [part="main"] {
    flex: 1;
    margin-top: 0.15rem;
    padding-inline-end: 0;
  }

  [part="title"] {
    margin: 0;
    color: var(--gk-color-text, rgb(31, 34, 37));
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.3;
  }

  :host([size="sm"]) [part="title"] {
    font-size: 0.8125rem;
  }

  :host([size="lg"]) [part="title"] {
    font-size: 0.9375rem;
  }

  :host([data-status="wait"]) [part="title"] {
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
    font-weight: 500;
  }

  :host([data-status="error"]) [part="title"] {
    color: var(--gk-color-danger, #d03050);
  }

  [part="description"] {
    margin: 0.25rem 0 0;
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
    font-size: 0.75rem;
    line-height: 1.4;
  }

  [part="description"][hidden] {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    [part="indicator"] {
      transition: none;
    }
  }
`;
