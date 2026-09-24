import { css } from "lit";

export const modalStyles = css`
  :host {
    display: contents;
  }

  [part="mask"] {
    position: fixed;
    inset: 0;
    background: color-mix(in srgb, #000 40%, transparent);
    animation: gk-overlay-fade 180ms ease-out;
  }

  [part="panel"] {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 4000;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: min(var(--gk-modal-width, 520px), calc(100vw - 32px));
    max-height: 85vh;
    margin: 0;
    background: var(--gk-color-surface, #fff);
    color: var(--gk-color-on-surface, rgb(31, 34, 37));
    border-radius: var(--gk-radius-lg, 0.75rem);
    box-shadow:
      var(--gk-shadow-md, 0 4px 12px rgb(28 25 23 / 0.12)),
      0 12px 32px color-mix(in srgb, var(--gk-color-on-surface, rgb(31, 34, 37)) 18%, transparent);
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    animation: gk-modal-in 180ms ease-out;
  }

  [part="panel"]:focus {
    outline: none;
  }

  [part="header"] {
    display: flex;
    align-items: center;
    gap: var(--gk-space-3, 0.75rem);
    padding: var(--gk-space-4, 1rem) var(--gk-space-5, 1.25rem);
    border-bottom: 1px solid var(--gk-color-divider, rgb(239, 239, 245));
    flex-shrink: 0;
  }

  [part="title"] {
    flex: 1;
    margin: 0;
    font-family: var(--gk-font-family-display, Fraunces, Georgia, serif);
    font-size: 1.15rem;
    font-weight: 600;
    line-height: var(--gk-line-height-tight, 1.25);
  }

  [part="close"] {
    width: 28px;
    height: 28px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: var(--gk-radius-md, 0.5rem);
    background: transparent;
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
    font-size: 1.15rem;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  [part="close"]:hover {
    background: color-mix(in srgb, var(--gk-color-on-surface, rgb(31, 34, 37)) 8%, transparent);
    color: var(--gk-color-on-surface, rgb(31, 34, 37));
  }

  [part="close"]:focus-visible,
  [part="footer"] button:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--gk-color-focus-ring, rgb(242, 206, 94)) 70%, transparent);
  }

  [part="body"] {
    padding: var(--gk-space-5, 1.25rem);
    overflow: auto;
    font-size: 0.95rem;
    line-height: 1.45;
  }

  [part="panel"][data-preset="dialog"] [part="body"] {
    padding: var(--gk-space-4, 1rem) var(--gk-space-5, 1.25rem);
  }

  [part="panel"][data-preset="card"] [part="body"] {
    padding: var(--gk-space-6, 1.5rem);
  }

  [part="footer"] {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: var(--gk-space-3, 0.75rem);
    padding: var(--gk-space-4, 1rem) var(--gk-space-5, 1.25rem);
    border-top: 1px solid var(--gk-color-divider, rgb(239, 239, 245));
    flex-shrink: 0;
  }

  [part="footer"][hidden] {
    display: none;
  }

  [part="cancel"],
  [part="confirm"] {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    height: 34px;
    padding: 0 1rem;
    border-radius: var(--gk-radius-md, 0.5rem);
    border: 1px solid transparent;
    font: inherit;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
  }

  [part="cancel"] {
    background: var(--gk-color-surface, #fff);
    border-color: var(--gk-color-border, rgb(224, 224, 230));
    color: var(--gk-color-on-surface, rgb(31, 34, 37));
  }

  [part="confirm"] {
    background: var(--gk-color-brand, rgb(242, 206, 94));
    color: var(--gk-color-brand-on, rgb(31, 34, 37));
  }

  [part="confirm"]:hover:not(:disabled) {
    background: var(--gk-color-brand-hover, rgb(246, 217, 122));
  }

  [part="confirm"][data-variant="danger"] {
    background: var(--gk-color-danger, #d03050);
    color: #fff;
  }

  [part="confirm"][data-variant="danger"]:hover:not(:disabled) {
    background: var(--gk-color-danger-hover, #de576d);
  }

  [part="confirm"][data-variant="danger"] [part="spinner"] {
    border-color: color-mix(in srgb, #fff 25%, transparent);
    border-top-color: #fff;
  }

  [part="cancel"]:disabled,
  [part="confirm"]:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  [part="spinner"] {
    width: 14px;
    height: 14px;
    border: 2px solid color-mix(in srgb, var(--gk-color-brand-on, rgb(31, 34, 37)) 25%, transparent);
    border-top-color: var(--gk-color-brand-on, rgb(31, 34, 37));
    border-radius: 50%;
    animation: gk-modal-spin 0.7s linear infinite;
  }

  @keyframes gk-overlay-fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes gk-modal-in {
    from {
      opacity: 0;
      transform: translate(-50%, calc(-50% + 10px));
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }

  @keyframes gk-modal-spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 640px) {
    [part="panel"] {
      width: calc(100vw - 32px);
      max-height: 85vh;
    }

    [part="footer"] {
      flex-wrap: wrap;
    }
  }
`;
