import { css } from "lit";

export const checkboxGroupStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--gk-space-2, 0.5rem);
  }

  :host([disabled]) {
    cursor: not-allowed;
    pointer-events: none;
  }
`;
