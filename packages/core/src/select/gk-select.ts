import { LitElement, html, nothing, render, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { computeFixedPanelPosition } from "../date-picker/date-utils.js";
import type { GkOption } from "./gk-option.js";
import {
  SELECT_LISTBOX_STYLE_ID,
  selectListboxCssText,
  selectStyles,
} from "./gk-select.styles.js";

export type GkSelectSize = "sm" | "md" | "lg";
export type GkSelectStatus = "success" | "warning" | "error" | "";

type OptionRecord = { value: string; label: string; disabled: boolean };

let uid = 0;

@customElement("gk-select")
export class GkSelect extends LitElement {
  static styles = selectStyles;

  @property()
  value = "";

  @property()
  placeholder = "";

  @property({ reflect: true })
  size: GkSelectSize = "md";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  clearable = false;

  @property({ reflect: true })
  status: GkSelectStatus = "";

  @property({ type: Boolean, reflect: true })
  open = false;

  @state()
  private activeIndex = 0;

  private listbox: HTMLDivElement | null = null;
  private listenersBound = false;
  private positionListenersBound = false;
  private readonly instanceId = `gk-select-${++uid}`;

  connectedCallback() {
    super.connectedCallback();
    if (this.open) this.ensureListbox();
  }

  disconnectedCallback() {
    this.teardownListbox();
    super.disconnectedCallback();
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has("open")) {
      if (this.open) this.ensureListbox();
      else this.teardownListbox();
    } else if (this.open) {
      this.renderListbox();
      this.positionListbox();
    }
  }

  private options(): OptionRecord[] {
    const slotted = (
      this.shadowRoot?.querySelector("slot") as HTMLSlotElement | null
    )?.assignedElements({ flatten: true });
    const nodes = (
      slotted?.length
        ? slotted
        : [...this.querySelectorAll("gk-option")]
    ) as Element[];
    return nodes
      .filter((el) => el.tagName === "GK-OPTION")
      .map((el) => {
        const opt = el as GkOption;
        return {
          value: opt.value || el.getAttribute("value") || "",
          label: (el.textContent ?? "").trim(),
          disabled: opt.disabled,
        };
      });
  }

  private selectedLabel() {
    const opt = this.options().find((o) => o.value === this.value);
    return opt?.label ?? "";
  }

  private get showClearButton() {
    return this.clearable && !this.disabled && this.value.length > 0;
  }

  private setOpen(next: boolean) {
    if (this.disabled && next) return;
    this.open = next;
    if (next) {
      const opts = this.options();
      const i = opts.findIndex((o) => o.value === this.value);
      this.activeIndex = i >= 0 ? i : 0;
      this.bindDismissListeners();
    } else {
      this.unbindDismissListeners();
    }
  }

  private emitValue(next: string) {
    this.value = next;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private pick(value: string) {
    const opt = this.options().find((o) => o.value === value);
    if (!opt || opt.disabled) return;
    this.emitValue(value);
    this.setOpen(false);
  }

  private onTriggerClick = (event: Event) => {
    if (this.disabled) return;
    const t = event.target as HTMLElement | null;
    if (t?.closest?.("[part='clear']")) return;
    this.setOpen(!this.open);
  };

  private onClearClick = (event: Event) => {
    event.stopPropagation();
    if (this.disabled) return;
    this.emitValue("");
    this.setOpen(false);
  };

  private onTriggerKeydown = (event: KeyboardEvent) => {
    if (this.disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (this.open) {
        const opt = this.options()[this.activeIndex];
        if (opt) this.pick(opt.value);
        else this.setOpen(false);
      } else {
        this.setOpen(true);
      }
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!this.open) {
        this.setOpen(true);
        return;
      }
      this.moveActive(event.key === "ArrowDown" ? 1 : -1);
    }
    if (event.key === "Escape" && this.open) {
      event.preventDefault();
      this.setOpen(false);
    }
  };

  private moveActive(dir: number) {
    const opts = this.options();
    if (!opts.length) return;
    let i = this.activeIndex;
    for (let n = 0; n < opts.length; n++) {
      i = (i + dir + opts.length) % opts.length;
      if (!opts[i].disabled) {
        this.activeIndex = i;
        this.renderListbox();
        return;
      }
    }
  }

  private onDocumentClick = (event: MouseEvent) => {
    if (!this.open) return;
    const path = event.composedPath();
    if (path.includes(this) || (this.listbox && path.includes(this.listbox))) {
      return;
    }
    this.setOpen(false);
  };

  private onDocumentKeydown = (event: KeyboardEvent) => {
    if (!this.open) return;
    if (event.key === "Escape") this.setOpen(false);
  };

  private bindDismissListeners() {
    if (this.listenersBound) return;
    document.addEventListener("click", this.onDocumentClick, true);
    document.addEventListener("keydown", this.onDocumentKeydown, true);
    this.listenersBound = true;
  }

  private unbindDismissListeners() {
    if (!this.listenersBound) return;
    document.removeEventListener("click", this.onDocumentClick, true);
    document.removeEventListener("keydown", this.onDocumentKeydown, true);
    this.listenersBound = false;
  }

  private bindPositionListeners() {
    if (this.positionListenersBound) return;
    window.addEventListener("scroll", this.onViewportChange, true);
    window.addEventListener("resize", this.onViewportChange);
    this.positionListenersBound = true;
  }

  private unbindPositionListeners() {
    if (!this.positionListenersBound) return;
    window.removeEventListener("scroll", this.onViewportChange, true);
    window.removeEventListener("resize", this.onViewportChange);
    this.positionListenersBound = false;
  }

  private onViewportChange = () => {
    if (this.open) this.positionListbox();
  };

  private ensureListbox() {
    if (!document.getElementById(SELECT_LISTBOX_STYLE_ID)) {
      const styleEl = document.createElement("style");
      styleEl.id = SELECT_LISTBOX_STYLE_ID;
      styleEl.textContent = selectListboxCssText;
      document.head.appendChild(styleEl);
    }
    if (!this.listbox) {
      this.listbox = document.createElement("div");
      this.listbox.className = "gk-select-listbox";
      this.listbox.id = `${this.instanceId}-listbox`;
      document.body.appendChild(this.listbox);
    }
    this.renderListbox();
    this.positionListbox();
    this.bindPositionListeners();
    this.bindDismissListeners();
  }

  private teardownListbox() {
    this.unbindPositionListeners();
    this.unbindDismissListeners();
    if (this.listbox) {
      render(nothing, this.listbox);
      this.listbox.remove();
      this.listbox = null;
    }
    if (!document.querySelector(".gk-select-listbox")) {
      document.getElementById(SELECT_LISTBOX_STYLE_ID)?.remove();
    }
  }

  private renderListbox() {
    if (!this.listbox) return;
    const opts = this.options();
    render(
      html`
        <div class="gk-select-listbox__items">
          ${opts.map(
            (opt, i) => html`
              <div
                role="option"
                id=${`${this.instanceId}-opt-${i}`}
                data-value=${opt.value}
                class=${classMap({ "is-active": i === this.activeIndex })}
                aria-selected=${opt.value === this.value ? "true" : "false"}
                aria-disabled=${opt.disabled ? "true" : "false"}
                @click=${() => this.pick(opt.value)}
              >
                ${opt.label}
              </div>
            `,
          )}
        </div>
      `,
      this.listbox,
    );
    this.listbox.setAttribute("role", "listbox");
  }

  private positionListbox() {
    if (!this.listbox) return;
    const base = this.shadowRoot?.querySelector(
      "[part='base']",
    ) as HTMLElement | null;
    const trigger = (base ?? this).getBoundingClientRect();
    const width = Math.max(trigger.width || 0, 160);
    this.listbox.style.width = `${width}px`;
    const panelRect = this.listbox.getBoundingClientRect();
    const { top, left } = computeFixedPanelPosition({
      trigger,
      panelWidth: width,
      panelHeight: panelRect.height || this.listbox.offsetHeight || 40,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    });
    this.listbox.style.top = `${top}px`;
    this.listbox.style.left = `${left}px`;
  }

  private clearIcon() {
    return svg`
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
        />
      </svg>
    `;
  }

  private chevronIcon() {
    return svg`
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M7 10l5 5 5-5H7z" />
      </svg>
    `;
  }

  render() {
    const label = this.selectedLabel();
    const empty = !label;
    const activeId = `${this.instanceId}-opt-${this.activeIndex}`;
    return html`
      <div
        part="base"
        role="combobox"
        tabindex=${this.disabled ? -1 : 0}
        aria-expanded=${this.open ? "true" : "false"}
        aria-haspopup="listbox"
        aria-controls=${this.open ? `${this.instanceId}-listbox` : nothing}
        aria-activedescendant=${this.open ? activeId : nothing}
        aria-disabled=${this.disabled ? "true" : "false"}
        @click=${this.onTriggerClick}
        @keydown=${this.onTriggerKeydown}
      >
        <span part="value" ?data-empty=${empty}
          >${label || this.placeholder || "\u00a0"}</span
        >
        <span part="suffix">
          ${this.showClearButton
            ? html`<button
                type="button"
                part="clear"
                aria-label="Clear"
                @click=${this.onClearClick}
              >
                ${this.clearIcon()}
              </button>`
            : nothing}
          ${this.chevronIcon()}
        </span>
      </div>
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-select": GkSelect;
  }
}
