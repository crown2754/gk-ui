import { css } from "lit";

export const formItemStyles = css`
  :host {
    display: block;
    min-width: 0;
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
  }

  :host-context(gk-form[inline]) {
    width: auto;
    flex: 0 1 auto;
  }

  [part="row"] {
    display: grid;
    align-items: start;
  }

  :host([data-placement="left"]) [part="row"] {
    grid-template-columns: var(--gk-form-label-width, max-content) minmax(0, 1fr);
    column-gap: 12px;
  }

  :host([data-placement="top"]) [part="row"] {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 6px;
  }

  [part="label"] {
    display: flex;
    align-items: center;
    justify-content: var(--gk-form-label-justify, flex-end);
    min-height: var(--gk-form-control-height, 34px);
    font-size: 14px;
    font-weight: 600;
    color: var(--gk-color-text, rgb(31, 34, 37));
    text-align: var(--gk-form-label-align, right);
  }

  :host([data-placement="top"]) [part="label"] {
    justify-content: flex-start;
    min-height: 0;
    text-align: left;
  }

  :host([data-placement="top"]) [part="label"][data-empty] {
    display: none;
  }

  :host([data-show-label="false"]) [part="label"] {
    display: none;
  }

  [part="mark"] {
    margin-inline-end: 4px;
    color: var(--gk-color-danger, #d03050);
  }

  [part="control"] {
    min-width: 0;
  }

  :host([data-placement="left"]) [part="meta"] {
    grid-column: 2;
  }

  [part="feedback-row"] {
    margin-top: 4px;
  }

  :host([data-show-feedback]) [part="feedback-row"] {
    min-height: 1.25rem;
  }

  [part="feedback-row"][hidden] {
    display: none;
  }

  [part="help"],
  [part="feedback"],
  [part="extra"] {
    font-size: 13px;
    line-height: 1.25rem;
  }

  [part="help"],
  [part="extra"] {
    color: var(--gk-color-on-surface-muted, rgb(118, 124, 130));
  }

  [part="feedback"][data-status="error"] {
    color: var(--gk-color-danger, #d03050);
  }
  [part="feedback"][data-status="warning"] {
    color: var(--gk-color-warning, #f0a020);
  }
  [part="feedback"][data-status="success"] {
    color: var(--gk-color-success, #18a058);
  }
`;
