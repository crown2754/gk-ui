import { css } from "lit";

export const avatarStyles = css`
  :host {
    display: inline-flex;
    vertical-align: middle;
    flex-shrink: 0;
  }

  [part="base"] {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: var(--gk-avatar-size, 34px);
    height: var(--gk-avatar-size, 34px);
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    font-size: calc(var(--gk-avatar-size, 34px) * 0.4);
    font-weight: var(--gk-font-weight-medium, 500);
    line-height: 1;
    color: var(--gk-color-text, rgb(31, 34, 37));
    background: var(--gk-avatar-color, var(--gk-color-button-default, rgba(46, 51, 56, 0.05)));
    border-radius: var(--gk-radius-sm, 0.375rem);
  }

  :host([size="sm"]) {
    --gk-avatar-size: 28px;
  }

  :host([size="md"]),
  :host(:not([size])) {
    --gk-avatar-size: 34px;
  }

  :host([size="lg"]) {
    --gk-avatar-size: 40px;
  }

  :host([round]) [part="base"] {
    border-radius: 50%;
  }

  [part="image"] {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: var(--gk-avatar-object-fit, cover);
  }

  [part="content"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    max-height: 100%;
  }

  [part="content"] ::slotted(svg) {
    width: 60%;
    height: 60%;
  }
`;
