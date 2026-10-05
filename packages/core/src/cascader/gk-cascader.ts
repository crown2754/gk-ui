import { LitElement, html, nothing, svg, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { computeFixedPanelPosition } from "../date-picker/date-utils.js";
import { markOwnedSize, prefersZh } from "../internal/field.js";
import { PANEL_Z_BASE, Z_STEP } from "../overlay/stack.js";
import { cascaderStyles } from "./gk-cascader.styles.js";

export type GkCascaderSize = "sm" | "md" | "lg";
export type GkCascaderStatus = "success" | "warning" | "error" | "";
export type GkCascaderExpandTrigger = "click" | "hover";
export type GkCascaderCheckStrategy = "child" | "parent" | "all";
export type GkCascaderPlacement = "bottom-start" | "top-start";

export type CascaderOption = {
  label: string;
  value: string;
  children?: CascaderOption[];
  disabled?: boolean;
};

const pathConverter = {
  fromAttribute(value: string | null): string[] | null {
    if (value == null || value.trim() === "") return null;
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      /* comma-separated */
    }
    const parts = value.split(",").map((part) => part.trim()).filter(Boolean);
    return parts.length ? parts : null;
  },
  toAttribute(value: string[] | null) {
    return value && value.length ? JSON.stringify(value) : null;
  },
};

let uid = 0;

@customElement("gk-cascader")
export class GkCascader extends LitElement {
  static styles = cascaderStyles;

  @property({ reflect: true, converter: pathConverter })
  value: string[] | null = null;

  @property({ attribute: false })
  options: CascaderOption[] = [];

  @property()
  placeholder = "";

  @property()
  separator = " / ";

  @property({ reflect: true })
  size: GkCascaderSize = "md";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  clearable = false;

  @property({ reflect: true })
  status: GkCascaderStatus = "";

  @property({ reflect: true, attribute: "expand-trigger" })
  expandTrigger: GkCascaderExpandTrigger = "click";

  /** Follow-up. v1 does not search. */
  @property({ type: Boolean, reflect: true })
  filterable = false;

  /** Follow-up. v1 is single-select and commits on a leaf only. */
  @property({ type: Boolean, reflect: true })
  multiple = false;

  /** Follow-up. Ignored until multiple selection ships. Default remains leaf (`child`). */
  @property({ reflect: true, attribute: "check-strategy" })
  checkStrategy: GkCascaderCheckStrategy = "child";

  @property({ reflect: true })
  placement: GkCascaderPlacement = "bottom-start";

  @property({ type: Number, attribute: "column-width" })
  columnWidth = 160;

  @property({ type: Boolean, reflect: true })
  open = false;

  @state()
  private expanded: string[] = [];

  @state()
  private activeCol = 0;

  @state()
  private activeIndex = 0;

  private readonly panelId = `gk-cascader-${++uid}`;
  private dismissBound = false;

  override attributeChangedCallback(
    name: string,
    old: string | null,
    value: string | null,
  ) {
    super.attributeChangedCallback(name, old, value);
    markOwnedSize(this, name);
  }

  override connectedCallback() {
    super.connectedCallback();
    if (this.open) this.bindDismiss();
  }

  override disconnectedCallback() {
    this.unbindDismiss();
    super.disconnectedCallback();
  }

  protected override willUpdate(changed: PropertyValues) {
    if (changed.has("open") && this.open) this.syncExpandedFromValue();
    this.style.setProperty("--gk-cascader-column", `${this.columnWidth}px`);
  }

  protected override updated(changed: PropertyValues) {
    if (changed.has("open")) {
      if (this.open) {
        this.bindDismiss();
        this.positionPanel();
      } else {
        this.unbindDismiss();
      }
    } else if (this.open && (changed.has("expanded") || changed.has("options"))) {
      this.positionPanel();
    }
  }

  private syncExpandedFromValue() {
    const path = this.value ?? [];
    this.expanded = path.length > 1 ? path.slice(0, -1) : [];
    this.activeCol = Math.max(0, this.expanded.length);
    this.activeIndex = 0;
  }

  private columns(): CascaderOption[][] {
    const cols: CascaderOption[][] = [];
    let level = this.options ?? [];
    if (!level.length) return cols;
    cols.push(level);
    for (const value of this.expanded) {
      const node = level.find((option) => option.value === value);
      if (!node?.children?.length) break;
      level = node.children;
      cols.push(level);
    }
    return cols;
  }

  private optionAt(path: string[]): CascaderOption | null {
    let level = this.options ?? [];
    let found: CascaderOption | null = null;
    for (const value of path) {
      found = level.find((option) => option.value === value) ?? null;
      if (!found) return null;
      level = found.children ?? [];
    }
    return found;
  }

  private labelsFor(path: string[] | null) {
    const labels: string[] = [];
    let level = this.options ?? [];
    for (const value of path ?? []) {
      const node = level.find((option) => option.value === value);
      if (!node) break;
      labels.push(node.label);
      level = node.children ?? [];
    }
    return labels;
  }

  private emitValue(path: string[] | null) {
    const detail = { value: path, option: path ? this.optionAt(path) : null };
    this.dispatchEvent(
      new CustomEvent("change", { detail, bubbles: true, composed: true }),
    );
    this.dispatchEvent(
      new CustomEvent("update:value", { detail, bubbles: true, composed: true }),
    );
  }

  private commit(path: string[]) {
    this.value = path;
    this.open = false;
    this.emitValue(path);
    this.focusTrigger();
  }

  private clear(event?: Event) {
    event?.stopPropagation();
    event?.preventDefault();
    if (this.disabled) return;
    this.value = null;
    this.expanded = [];
    this.open = false;
    this.dispatchEvent(new CustomEvent("clear", { bubbles: true, composed: true }));
    this.emitValue(null);
  }

  private onOption(column: number, option: CascaderOption) {
    if (option.disabled || this.disabled) return;
    const path = [...this.expanded.slice(0, column), option.value];
    if (option.children?.length) {
      this.expanded = path;
      this.activeCol = column + 1;
      this.activeIndex = 0;
      return;
    }
    this.commit(path);
  }

  private onTriggerClick = () => {
    if (this.disabled) return;
    this.open = !this.open;
  };

  private onKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) return;
    if (!this.open) {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.open = true;
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      this.open = false;
      this.focusTrigger();
      return;
    }
    const cols = this.columns();
    if (!cols.length) return;
    const col = Math.min(this.activeCol, cols.length - 1);
    const items = cols[col];
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      this.activeCol = col;
      this.activeIndex = nextEnabled(
        items,
        this.activeIndex,
        event.key === "ArrowDown" ? 1 : -1,
      );
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      this.activeIndex =
        event.key === "Home"
          ? nextEnabled(items, -1, 1)
          : nextEnabled(items, items.length, -1);
      return;
    }
    const option = items[this.activeIndex];
    if (!option || option.disabled) return;
    if (event.key === "ArrowRight" || event.key === "Enter") {
      event.preventDefault();
      this.onOption(col, option);
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (col > 0) {
        this.expanded = this.expanded.slice(0, col - 1);
        this.activeCol = col - 1;
        this.activeIndex = 0;
      }
    }
  };

  private onDocClick = (event: MouseEvent) => {
    if (!this.open) return;
    if (event.composedPath().includes(this)) return;
    this.open = false;
  };

  private bindDismiss() {
    if (this.dismissBound || typeof document === "undefined") return;
    document.addEventListener("click", this.onDocClick, true);
    this.dismissBound = true;
  }

  private unbindDismiss() {
    if (!this.dismissBound || typeof document === "undefined") return;
    document.removeEventListener("click", this.onDocClick, true);
    this.dismissBound = false;
  }

  private positionPanel() {
    if (typeof window === "undefined") return;
    const panel = this.renderRoot.querySelector<HTMLElement>("[part='panel']");
    const trigger = this.renderRoot.querySelector<HTMLElement>("[part='trigger']");
    if (!panel || !trigger) return;
    const rect = trigger.getBoundingClientRect();
    const width = Math.max(panel.offsetWidth, this.columnWidth);
    const height = panel.offsetHeight || 40;
    const pos = computeFixedPanelPosition({
      trigger: rect,
      panelWidth: width,
      panelHeight: height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    });
    let top = pos.top;
    if (this.placement === "top-start") {
      const above = rect.top - 4 - height;
      if (above >= 4) top = above;
    }
    panel.style.top = `${top}px`;
    panel.style.left = `${pos.left}px`;
    panel.style.zIndex = String(PANEL_Z_BASE + this.nestLevel() * Z_STEP);
  }

  private nestLevel() {
    const names = new Set([
      "GK-MODAL",
      "GK-DRAWER",
      "GK-CASCADER",
      "GK-SELECT",
      "GK-DROPDOWN",
      "GK-TOOLTIP",
      "GK-POPCONFIRM",
      "GK-DATE-PICKER",
    ]);
    let level = 0;
    let node: HTMLElement | null = this.parentElement;
    while (node) {
      if (names.has(node.tagName)) level += 1;
      node = node.parentElement;
    }
    return level;
  }

  private focusTrigger() {
    this.renderRoot.querySelector<HTMLElement>("[part='trigger']")?.focus();
  }

  private columnLabel(index: number) {
    return prefersZh(this) ? `層級 ${index + 1}` : `Level ${index + 1}`;
  }

  private icons() {
    return {
      clear: svg`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>`,
      chevron: svg`<svg part="chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5H7z"></path></svg>`,
      next: svg`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>`,
    };
  }

  override render() {
    const zh = prefersZh(this);
    const labels = this.labelsFor(this.value);
    const text = labels.join(this.separator);
    const showClear = this.clearable && !this.disabled && !!this.value?.length;
    const cols = this.columns();
    const selected = this.value ?? [];
    const icons = this.icons();
    const labelledBy = this.getAttribute("aria-labelledby");
    const describedBy = this.getAttribute("aria-describedby");
    return html`
      <div
        part="trigger"
        tabindex=${this.disabled ? -1 : 0}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded=${this.open ? "true" : "false"}
        aria-controls=${this.panelId}
        aria-disabled=${this.disabled ? "true" : "false"}
        aria-labelledby=${labelledBy || nothing}
        aria-describedby=${describedBy || nothing}
        aria-required=${this.getAttribute("aria-required") === "true" ? "true" : nothing}
        aria-invalid=${this.getAttribute("aria-invalid") === "true" ? "true" : nothing}
        @click=${this.onTriggerClick}
        @keydown=${this.onKeyDown}
      >
        ${text
          ? html`<span part="value">${text}</span>`
          : html`<span part="placeholder">${this.placeholder || "\u00a0"}</span>`}
        <span part="suffix">
          ${showClear
            ? html`<button
                type="button"
                part="clear"
                aria-label=${zh ? "清除" : "Clear"}
                @click=${this.clear}
              >
                ${icons.clear}
              </button>`
            : nothing}
          ${icons.chevron}
        </span>
      </div>
      <div id=${this.panelId} part="panel" ?hidden=${!this.open}>
        ${cols.length
          ? cols.map(
              (options, column) => html`
                <ul
                  part="column"
                  role="listbox"
                  aria-label=${this.columnLabel(column)}
                >
                  ${options.map((option, index) => {
                    const onPath =
                      selected[column] === option.value ||
                      this.expanded[column] === option.value;
                    return html`
                      <li
                        part="option"
                        role="option"
                        aria-selected=${onPath ? "true" : "false"}
                        aria-disabled=${option.disabled ? "true" : "false"}
                        ?data-active=${column === this.activeCol && index === this.activeIndex}
                        @click=${(event: Event) => {
                          event.stopPropagation();
                          this.onOption(column, option);
                        }}
                        @mouseenter=${() => {
                          if (
                            this.expandTrigger === "hover" &&
                            option.children?.length &&
                            !option.disabled
                          ) {
                            this.expanded = [
                              ...this.expanded.slice(0, column),
                              option.value,
                            ];
                            this.activeCol = column + 1;
                            this.activeIndex = 0;
                          }
                        }}
                      >
                        <span>${option.label}</span>
                        ${option.children?.length ? icons.next : nothing}
                      </li>
                    `;
                  })}
                </ul>
              `,
            )
          : html`<div part="empty" role="status">
              <slot name="empty">${zh ? "沒有資料" : "No data"}</slot>
            </div>`}
      </div>
    `;
  }
}

function nextEnabled(items: CascaderOption[], from: number, direction: 1 | -1) {
  if (!items.length) return 0;
  let index = from;
  for (let i = 0; i < items.length; i += 1) {
    index += direction;
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    if (!items[index]?.disabled) return index;
  }
  return from;
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-cascader": GkCascader;
  }
}
