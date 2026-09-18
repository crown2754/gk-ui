import { css } from "lit";

export const radioGroupStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--gk-space-2, 0.5rem);
  }

  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }
`;
