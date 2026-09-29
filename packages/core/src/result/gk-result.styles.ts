import { css } from "lit";

export const resultStyles = css`
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
    gap: 0.75rem;
    box-sizing: border-box;
    max-width: 24rem;
    margin: 0 auto;
    padding: 2.75rem 1.25rem;
  }

  [part="icon"] {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    margin-bottom: 0.15rem;
    border-radius: 50%;
    background: color-mix(in srgb, var(--gk-color-info, #2080f0) 16%, transparent);
    color: var(--gk-color-info-pressed, #1060c9);
  }

  [part="icon"][hidden] {
    display: none;
  }

  [part="icon"] svg,
  [part="icon"] ::slotted(svg) {
    width: 36px;
    height: 36px;
    display: block;
  }

  :host([status="success"]) [part="icon"] {
    background: color-mix(in srgb, var(--gk-color-success, #18a058) 16%, transparent);
    color: var(--gk-color-success-pressed, #0c7a43);
  }

  :host([status="info"]) [part="icon"],
  :host(:not([status])) [part="icon"] {
    background: color-mix(in srgb, var(--gk-color-info, #2080f0) 16%, transparent);
    color: var(--gk-color-info-pressed, #1060c9);
  }

  :host([status="warning"]) [part="icon"] {
    background: color-mix(in srgb, var(--gk-color-warning, #f0a020) 16%, transparent);
    color: var(--gk-color-warning-pressed, #c97c10);
  }

  :host([status="error"]) [part="icon"] {
    background: color-mix(in srgb, var(--gk-color-danger, #d03050) 16%, transparent);
    color: var(--gk-color-danger-pressed, #ab1f3f);
  }

  :host([status="404"]) [part="icon"] {
    background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 18%, transparent);
    color: color-mix(
      in srgb,
      var(--gk-color-brand, rgb(242, 206, 94)) 45%,
      var(--gk-color-text-muted, rgb(118, 124, 130))
    );
  }

  .gk-result__mark {
    font-family: var(--gk-font-family-display, Fraunces, Georgia, serif);
    font-size: 1.15rem;
    font-weight: var(--gk-font-weight-semibold, 600);
    line-height: 1;
    letter-spacing: 0.02em;
  }

  [part="title"] {
    margin: 0;
    font-family: var(--gk-font-family-display, Fraunces, Georgia, serif);
    font-size: 1.4rem;
    font-weight: var(--gk-font-weight-semibold, 600);
    line-height: 1.3;
    color: var(--gk-color-text, rgb(31, 34, 37));
  }

  [part="title"][hidden] {
    display: none;
  }

  [part="description"] {
    margin: 0;
    max-width: 24rem;
    font-size: 0.95rem;
    line-height: 1.5;
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
  }

  [part="description"][hidden] {
    display: none;
  }

  [part="extra"] {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.35rem;
  }

  [part="extra"][hidden] {
    display: none;
  }

  @media (max-width: 640px) {
    [part="root"] {
      padding: 2rem 1rem;
    }
  }
`;
