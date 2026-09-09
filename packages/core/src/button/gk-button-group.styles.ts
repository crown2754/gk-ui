import { css } from "lit";

export const buttonGroupStyles = css`
  :host {
    display: inline-flex;
    vertical-align: middle;
  }

  ::slotted(gk-button) {
    position: relative;
  }

  ::slotted(gk-button:not(:first-child)) {
    margin-inline-start: -1px;
  }
`;
