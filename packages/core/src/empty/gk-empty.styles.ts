import { css } from "lit";

export const emptyStyles = css`
  :host {
    display: block;
    max-width: 100%;
    color: var(--gk-color-text, rgb(31, 34, 37));
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
  }

  [part="root"] {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.65rem;
    box-sizing: border-box;
    max-width: 20rem;
    margin: 0 auto;
    padding: 1.75rem 1rem;
  }

  :host([size="large"]) [part="root"] {
    gap: 0.85rem;
    max-width: 22rem;
    padding: 2.75rem 1.25rem;
  }

  [part="image"] {
    width: 96px;
    height: 72px;
    margin-bottom: 0.15rem;
    color: color-mix(
      in srgb,
      var(--gk-color-brand, rgb(242, 206, 94)) 45%,
      var(--gk-color-text-muted, rgb(118, 124, 130))
    );
  }

  [part="image"][hidden] {
    display: none;
  }

  :host([size="large"]) [part="image"] {
    width: 128px;
    height: 96px;
  }

  [part="image"] svg,
  [part="image"] ::slotted(*) {
    display: block;
    width: 100%;
    height: 100%;
  }

  [part="title"] {
    margin: 0;
    font-family: var(--gk-font-family-display, Fraunces, Georgia, serif);
    font-size: 1.15rem;
    font-weight: var(--gk-font-weight-semibold, 600);
    line-height: 1.3;
    color: var(--gk-color-text, rgb(31, 34, 37));
  }

  [part="title"][hidden] {
    display: none;
  }

  :host([size="large"]) [part="title"] {
    font-size: 1.35rem;
  }

  [part="description"] {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.5;
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
  }

  [part="extra"] {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.45rem;
  }

  [part="extra"][hidden] {
    display: none;
  }
`;
