import { css } from "lit";

export const formStyles = css`
  :host {
    display: block;
    color: var(--gk-color-text, rgb(31, 34, 37));
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
  }

  [part="root"] {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  :host([size="sm"]) [part="root"] {
    gap: 12px;
  }

  :host([size="lg"]) [part="root"] {
    gap: 20px;
  }

  :host([inline]) [part="root"] {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
  }
`;
