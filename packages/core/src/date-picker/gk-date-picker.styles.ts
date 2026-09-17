import { css } from "lit";

export const datePickerStyles = css`
  :host {
    display: inline-block;
    vertical-align: middle;
    max-width: 100%;
  }

  [part="base"] {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    gap: var(--gk-space-2, 0.5rem);
    width: 100%;
    margin: 0;
    background: var(--gk-color-surface, #fff);
    color: var(--gk-color-on-surface, rgb(31, 34, 37));
    border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
    color-scheme: light;
    border-radius: var(--gk-radius-sm, 0.375rem);
    font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
    font-weight: var(--gk-font-weight-medium, 500);
    transition: border-color 150ms ease, box-shadow 150ms ease;
    cursor: pointer;
  }

  :host([size="sm"]) [part="base"] {
    min-height: 28px;
    padding: 0 10px;
    font-size: 14px;
  }

  :host([size="md"]) [part="base"],
  :host(:not([size])) [part="base"] {
    min-height: 34px;
    padding: 0 14px;
    font-size: 14px;
  }

  :host([size="lg"]) [part="base"] {
    min-height: 40px;
    padding: 0 18px;
    font-size: 15px;
  }

  :host([round]) [part="base"] {
    border-radius: var(--gk-radius-pill, 9999px);
  }

  [part="base"]:focus-within {
    outline: 2px solid var(--gk-color-focus-ring, rgb(242, 206, 94));
    outline-offset: 2px;
    border-color: var(--gk-color-focus-ring, rgb(242, 206, 94));
  }

  :host([status="success"]) [part="base"] {
    border-color: var(--gk-color-success, #18a058);
  }
  :host([status="warning"]) [part="base"] {
    border-color: var(--gk-color-warning, #f0a020);
  }
  :host([status="error"]) [part="base"] {
    border-color: var(--gk-color-danger, #d03050);
  }

  :host([status="success"]) [part="base"]:focus-within {
    border-color: var(--gk-color-success, #18a058);
    outline-color: var(--gk-color-success, #18a058);
  }
  :host([status="warning"]) [part="base"]:focus-within {
    border-color: var(--gk-color-warning, #f0a020);
    outline-color: var(--gk-color-warning, #f0a020);
  }
  :host([status="error"]) [part="base"]:focus-within {
    border-color: var(--gk-color-danger, #d03050);
    outline-color: var(--gk-color-danger, #d03050);
  }

  :host([disabled]) [part="base"] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  [part="input"] {
    flex: 1;
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    line-height: 1.4;
    outline: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    pointer-events: none;
  }

  [part="input"][data-empty] {
    color: var(--gk-color-on-surface-muted, rgb(118, 124, 130));
  }

  [part="suffix"] {
    display: inline-flex;
    align-items: center;
    gap: var(--gk-space-1, 0.25rem);
    flex-shrink: 0;
    color: var(--gk-color-on-surface-muted, rgb(118, 124, 130));
  }

  [part="clear"] {
    flex-shrink: 0;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: 1em;
    line-height: 1;
    opacity: 0.7;
  }

  [part="clear"]:hover {
    opacity: 1;
  }

  :host([disabled]) [part="clear"] {
    pointer-events: none;
  }

  [part="clear"] svg,
  [part="suffix"] > svg {
    display: block;
    width: 1em;
    height: 1em;
    fill: currentColor;
  }
`;

/** Injected onto the body portal node (not shadow). */
export const datePickerPanelCssText = `
.gk-date-picker-panel {
  position: fixed;
  z-index: 4000;
  box-sizing: border-box;
  min-width: 280px;
  padding: 12px;
  background: var(--gk-color-surface-elevated, #fff);
  color: var(--gk-color-on-surface, rgb(31, 34, 37));
  border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
  border-radius: var(--gk-radius-md, 0.5rem);
  box-shadow: 0 4px 16px color-mix(in srgb, #000 12%, transparent);
  font-family: var(--gk-font-family-sans, "Source Sans 3", "Segoe UI", sans-serif);
  font-size: 14px;
}
.gk-date-picker-panel [part="calendar"] {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.gk-date-picker-panel .gk-date-picker-panel__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.gk-date-picker-panel .gk-date-picker-panel__nav-title {
  font-weight: 600;
  flex: 1;
  text-align: center;
}
.gk-date-picker-panel .gk-date-picker-panel__nav button {
  margin: 0;
  padding: 4px 8px;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  border-radius: var(--gk-radius-sm, 0.375rem);
  font: inherit;
}
.gk-date-picker-panel .gk-date-picker-panel__nav button:hover {
  background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 18%, transparent);
}
.gk-date-picker-panel .gk-date-picker-panel__weekdays,
.gk-date-picker-panel .gk-date-picker-panel__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}
.gk-date-picker-panel .gk-date-picker-panel__weekdays span {
  text-align: center;
  font-size: 12px;
  color: var(--gk-color-on-surface-muted, rgb(118, 124, 130));
  padding: 4px 0;
}
.gk-date-picker-panel .gk-date-picker-panel__days button {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  width: 100%;
  aspect-ratio: 1;
  border: 0;
  border-radius: var(--gk-radius-sm, 0.375rem);
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  line-height: 1;
}
.gk-date-picker-panel .gk-date-picker-panel__days button:hover:not(:disabled) {
  background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 18%, transparent);
}
.gk-date-picker-panel .gk-date-picker-panel__days button[data-outside] {
  color: var(--gk-color-on-surface-muted, rgb(118, 124, 130));
  opacity: 0.55;
}
.gk-date-picker-panel .gk-date-picker-panel__days button[data-today] {
  outline: 1px solid var(--gk-color-brand, rgb(242, 206, 94));
  outline-offset: -1px;
}
.gk-date-picker-panel .gk-date-picker-panel__days button[data-selected],
.gk-date-picker-panel .gk-date-picker-panel__days button.is-selected {
  background: var(--gk-color-brand, rgb(242, 206, 94));
  color: var(--gk-color-brand-on, rgb(31, 34, 37));
  outline: none;
}
.gk-date-picker-panel .gk-date-picker-panel__days button.is-in-range {
  background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 22%, transparent);
  border-radius: 0;
}
.gk-date-picker-panel .gk-date-picker-panel__days button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.gk-date-picker-panel .gk-dp-month-grid,
.gk-date-picker-panel .gk-dp-year-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
}
.gk-date-picker-panel .gk-dp-month-grid button,
.gk-date-picker-panel .gk-dp-year-grid button {
  box-sizing: border-box;
  margin: 0;
  padding: 8px 4px;
  border: 0;
  border-radius: var(--gk-radius-sm, 0.375rem);
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  line-height: 1.2;
}
.gk-date-picker-panel .gk-dp-month-grid button:hover:not(:disabled),
.gk-date-picker-panel .gk-dp-year-grid button:hover:not(:disabled) {
  background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 18%, transparent);
}
.gk-date-picker-panel .gk-dp-month-grid button[data-today],
.gk-date-picker-panel .gk-dp-year-grid button[data-today] {
  outline: 1px solid var(--gk-color-brand, rgb(242, 206, 94));
  outline-offset: -1px;
}
.gk-date-picker-panel .gk-dp-month-grid button[data-selected],
.gk-date-picker-panel .gk-dp-month-grid button.is-selected,
.gk-date-picker-panel .gk-dp-year-grid button[data-selected],
.gk-date-picker-panel .gk-dp-year-grid button.is-selected {
  background: var(--gk-color-brand, rgb(242, 206, 94));
  color: var(--gk-color-brand-on, rgb(31, 34, 37));
  outline: none;
}
.gk-date-picker-panel .gk-dp-month-grid button:disabled,
.gk-date-picker-panel .gk-dp-year-grid button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.gk-date-picker-panel [part="actions"] {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--gk-color-border, rgb(224, 224, 230));
}
.gk-date-picker-panel [part="actions"] button {
  margin: 0;
  padding: 4px 8px;
  border: 0;
  background: transparent;
  color: var(--gk-color-brand-pressed, rgb(201, 168, 58));
  cursor: pointer;
  font: inherit;
  border-radius: var(--gk-radius-sm, 0.375rem);
}
.gk-date-picker-panel [part="actions"] button:hover:not(:disabled) {
  background: color-mix(in srgb, var(--gk-color-brand, rgb(242, 206, 94)) 18%, transparent);
}
.gk-date-picker-panel [part="actions"] button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.gk-date-picker-panel .gk-dp-body {
  display: flex;
  gap: 8px;
}
.gk-date-picker-panel .gk-dp-time {
  display: flex;
  gap: 4px;
  max-height: 240px;
}
.gk-date-picker-panel .gk-dp-time-col {
  overflow-y: auto;
  width: 2.5rem;
  border-left: 1px solid var(--gk-color-outline-variant, #ccc);
}
.gk-date-picker-panel .gk-dp-time-col button {
  display: block;
  width: 100%;
  border: 0;
  background: transparent;
  padding: 4px 0;
  cursor: pointer;
}
.gk-date-picker-panel .gk-dp-time-col button.is-active {
  background: var(--gk-color-brand, #3b82f6);
  color: #fff;
}
`;
