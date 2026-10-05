import { css } from "lit";

export const uploadStyles = css`
  :host {
    display: block;
    position: relative;
    width: 100%;
    max-width: 28rem;
    color: var(--gk-color-on-surface, rgb(31, 34, 37));
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    font-size: 14px;
  }

  :host([list-type="picture-card"]) {
    max-width: 36rem;
  }

  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }

  [part="root"] {
    display: grid;
    gap: 8px;
  }

  [part="trigger"] {
    justify-self: start;
  }

  button[part="trigger"] {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin: 0;
    padding: 0 14px;
    border: 1px solid var(--gk-color-brand-pressed, rgb(201, 168, 58));
    border-radius: var(--gk-radius-md, 0.5rem);
    background: var(--gk-color-brand, rgb(242, 206, 94));
    color: var(--gk-color-brand-on, rgb(31, 34, 37));
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }

  :host([size="sm"]) button[part="trigger"] {
    height: 28px;
    font-size: 14px;
  }
  :host([size="md"]) button[part="trigger"],
  :host(:not([size])) button[part="trigger"] {
    height: 34px;
  }
  :host([size="lg"]) button[part="trigger"] {
    height: 40px;
    font-size: 15px;
  }

  button[part="trigger"]:hover {
    background: var(--gk-color-brand-hover, rgb(246, 217, 122));
  }

  button[part="trigger"]:focus-visible,
  [part~="dragger"]:focus-visible,
  [part~="add"]:focus-visible,
  [part="remove"]:focus-visible,
  [part="retry"]:focus-visible,
  [part="preview"]:focus-visible {
    outline: none;
    border-color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
    box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--gk-color-focus-ring, rgb(242, 206, 94)) 70%, transparent);
  }

  button[part="trigger"][aria-disabled="true"],
  [part~="dragger"][aria-disabled="true"],
  [part~="add"][aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button[part="trigger"] svg,
  [part="add"] svg,
  [part="remove"] svg,
  [part="preview"] svg,
  [part="status-icon"] svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
    flex-shrink: 0;
  }

  [part~="dragger"] {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 28px 20px;
    border: 1px dashed var(--gk-color-border, rgb(224, 224, 230));
    border-radius: var(--gk-radius-md, 0.5rem);
    background: rgba(46, 51, 56, 0.02);
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
    text-align: center;
    cursor: pointer;
  }

  [part~="dragger"]:hover,
  [part~="dragger"][data-dragover] {
    border-color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
    background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 18%, transparent);
    color: var(--gk-color-on-surface, rgb(31, 34, 37));
  }

  [part~="dragger"] [part="dragger-icon"] {
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border-radius: var(--gk-radius-md, 0.5rem);
    background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 28%, transparent);
    color: var(--gk-color-brand-on, rgb(31, 34, 37));
  }

  [part~="dragger"] [part="dragger-icon"] svg {
    width: 22px;
    height: 22px;
    fill: currentColor;
  }

  [part~="dragger"] [part="dragger-title"] {
    color: var(--gk-color-on-surface, rgb(31, 34, 37));
    font-weight: 600;
  }

  [part="input"] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  [part="hint"] {
    margin: 0;
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
    font-size: 12px;
  }

  [part="list"] {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  :host([list-type="list"]) [part="list"] {
    border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
    border-radius: var(--gk-radius-md, 0.5rem);
    background: var(--gk-color-surface, #fff);
    overflow: hidden;
  }

  :host([list-type="picture-card"]) [part="list"] {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    gap: 12px;
  }

  @media (min-width: 768px) {
    :host([list-type="picture-card"]) [part="list"] {
      grid-template-columns: repeat(4, max-content);
    }
  }

  [part="item"] {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 10px;
    align-items: start;
  }

  :host([list-type="list"]) [part="item"] {
    padding: 10px 12px;
    border-bottom: 1px solid var(--gk-color-divider, rgb(239, 239, 245));
  }

  :host([size="sm"][list-type="list"]) [part="item"] {
    padding: 8px 10px;
  }
  :host([size="lg"][list-type="list"]) [part="item"] {
    padding: 12px 14px;
  }

  :host([list-type="list"]) [part="item"]:last-child {
    border-bottom: 0;
  }

  :host([list-type="list"]) [part="item"]:hover {
    background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 10%, transparent);
  }

  [part="thumbnail"] {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border-radius: var(--gk-radius-sm, 0.375rem);
    background: rgba(46, 51, 56, 0.06);
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
    overflow: hidden;
  }

  [part="thumbnail"] img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  [part="name"] {
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  [part="meta"] {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 10px;
    margin-top: 2px;
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
    font-size: 12px;
  }

  [part="status"] {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-weight: 600;
  }

  [part="status"][data-status="uploading"] {
    color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
  }
  [part="status"][data-status="success"] {
    color: var(--gk-color-success, #18a058);
  }
  [part="status"][data-status="error"] {
    color: var(--gk-color-danger, #d03050);
  }

  [part="status-icon"] {
    display: inline-flex;
    width: 14px;
    height: 14px;
  }

  [part="status-icon"] svg {
    width: 14px;
    height: 14px;
  }

  [part="progress"] {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
  }

  [part="track"] {
    flex: 1;
    height: 6px;
    border-radius: var(--gk-radius-pill, 9999px);
    background: rgba(46, 51, 56, 0.09);
    overflow: hidden;
  }

  [part="fill"] {
    height: 100%;
    border-radius: inherit;
    background: var(--gk-color-brand, rgb(242, 206, 94));
    transition: width 160ms ease;
  }

  [part="fill"][data-status="error"] {
    background: var(--gk-color-danger, #d03050);
  }
  [part="fill"][data-status="success"] {
    background: var(--gk-color-success, #18a058);
  }

  [part="percent"] {
    min-width: 2.25rem;
    font-size: 12px;
    font-weight: 600;
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
    text-align: right;
  }

  [part="actions"] {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  [part="remove"],
  [part="preview"] {
    width: 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: var(--gk-radius-sm, 0.375rem);
    background: transparent;
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
    cursor: pointer;
  }

  [part="remove"]:hover {
    background: rgba(208, 48, 80, 0.08);
    color: var(--gk-color-danger, #d03050);
  }

  [part="retry"] {
    height: 28px;
    padding: 0 6px;
    border: 0;
    background: transparent;
    color: var(--gk-color-info, #2080f0);
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border-radius: var(--gk-radius-sm, 0.375rem);
  }

  [part="retry"]:hover {
    background: rgba(32, 128, 240, 0.08);
  }

  :host([list-type="picture-card"]) [part="item"] {
    position: relative;
    display: block;
    width: 104px;
    height: 104px;
    padding: 0;
    border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
    border-radius: var(--gk-radius-md, 0.5rem);
    overflow: hidden;
    background: var(--gk-color-surface, #fff);
  }

  :host([size="sm"][list-type="picture-card"]) [part="item"],
  :host([size="sm"][list-type="picture-card"]) [part~="add"] {
    width: 96px;
    height: 96px;
  }
  :host([size="md"][list-type="picture-card"]) [part="item"],
  :host([size="md"][list-type="picture-card"]) [part~="add"],
  :host(:not([size])[list-type="picture-card"]) [part="item"],
  :host(:not([size])[list-type="picture-card"]) [part~="add"] {
    width: 104px;
    height: 104px;
  }
  :host([size="lg"][list-type="picture-card"]) [part="item"],
  :host([size="lg"][list-type="picture-card"]) [part~="add"] {
    width: 112px;
    height: 112px;
  }

  :host([list-type="picture-card"]) [part="thumbnail"] {
    width: 100%;
    height: 100%;
    border-radius: 0;
    background: rgba(46, 51, 56, 0.04);
  }

  :host([list-type="picture-card"]) [part="overlay"] {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: rgba(31, 34, 37, 0.45);
    opacity: 0;
  }

  :host([list-type="picture-card"]) [part="item"]:hover [part="overlay"],
  :host([list-type="picture-card"]) [part="item"]:focus-within [part="overlay"] {
    opacity: 1;
  }

  :host([list-type="picture-card"]) [part="overlay"] [part="remove"],
  :host([list-type="picture-card"]) [part="overlay"] [part="preview"],
  :host([list-type="picture-card"]) [part="overlay"] [part="retry"] {
    background: rgba(255, 255, 255, 0.92);
    color: var(--gk-color-on-surface, rgb(31, 34, 37));
  }

  :host([list-type="picture-card"]) [part="badge"] {
    position: absolute;
    left: 6px;
    bottom: 6px;
    max-width: calc(100% - 12px);
    padding: 2px 6px;
    border-radius: var(--gk-radius-pill, 9999px);
    background: rgba(255, 255, 255, 0.92);
    font-size: 11px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :host([list-type="picture-card"]) [part="badge"][data-status="success"] {
    color: var(--gk-color-success, #18a058);
  }
  :host([list-type="picture-card"]) [part="badge"][data-status="error"] {
    color: var(--gk-color-danger, #d03050);
  }
  :host([list-type="picture-card"]) [part="badge"][data-status="uploading"] {
    color: var(--gk-color-brand-on, rgb(31, 34, 37));
    background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 92%, white);
  }

  :host([list-type="picture-card"]) [part="progress"] {
    position: absolute;
    left: 6px;
    right: 6px;
    bottom: 28px;
    margin: 0;
  }

  :host([list-type="picture-card"]) [part="percent"] {
    display: none;
  }

  [part~="add"] {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 0;
    border: 1px dashed var(--gk-color-border, rgb(224, 224, 230));
    border-radius: var(--gk-radius-md, 0.5rem);
    background: rgba(46, 51, 56, 0.02);
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }

  [part~="add"]:hover {
    border-color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
    background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 18%, transparent);
    color: var(--gk-color-on-surface, rgb(31, 34, 37));
  }

  [part~="add"] [part="add-icon"] {
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    border-radius: var(--gk-radius-sm, 0.375rem);
    background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 28%, transparent);
    color: var(--gk-color-brand-on, rgb(31, 34, 37));
    font-size: 20px;
    line-height: 1;
  }

  [part="empty"] {
    color: var(--gk-color-text-muted, rgb(118, 124, 130));
    font-size: 13px;
  }

  @media (prefers-reduced-motion: reduce) {
    [part="fill"],
    [part="overlay"] {
      transition: none;
    }
  }
`;
