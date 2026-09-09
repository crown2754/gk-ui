import { css } from "lit";

export const avatarGroupStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
  }

  .gk-avatar-group__row {
    display: inline-flex;
    align-items: center;
  }

  ::slotted(gk-avatar:not(:first-child)) {
    margin-inline-start: -8px;
  }

  ::slotted([slot="overflow"]) {
    margin-inline-start: -8px;
  }
`;
