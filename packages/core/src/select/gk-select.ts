import { LitElement, html, nothing, render, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { computeFixedPanelPosition } from "../date-picker/date-utils.js";
import type { GkOption } from "./gk-option.js";
import {
  SELECT_LISTBOX_STYLE_ID,
  selectListboxCssText,
  selectStyles,
} from "./gk-select.styles.js";

export type GkSelectSize = "sm" | "md" | "lg";
export type GkSelectStatus = "success" | "warning" | "error" | "";

type OptionRecord = {
  value: string;
  label: string;
  disabled: boolean;
  groupLabel?: string;
};

let uid = 0;

@customElement("gk-select")
export class GkSelect extends LitElement {
  static styles = selectStyles;

  @property()
  value: string | string[] = "";

  @property()
  placeholder = "";

  @property({ reflect: true })
  size: GkSelectSize = "md";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  clearable = false;

  @property({ type: Boolean, reflect: true })
  filterable = false;

  @property({ type: Boolean, reflect: true })
  multiple = false;

  @property({ type: Boolean, reflect: true })
  virtual = false;

  @property({ type: Number, attribute: "item-height" })
  itemHeight = 34;

  @property({ type: Number })
  max = 0;

  @property({ type: Boolean, reflect: true })
  loading = false;

  @property({ type: Boolean, reflect: true })
  remote = false;

  @property({ type: Number, attribute: "remote-debounce" })
  remoteDebounce = 300;

  @property({ reflect: true })
  status: GkSelectStatus = "";

  @property({ reflect: true })
  name = "";

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: Boolean, reflect: true })
  open = false;

  @state()
  private activeIndex = 0;

  @state()
  private filterText = "";

  private listbox: HTMLDivElement | null = null;
  private listenersBound = false;
  private positionListenersBound = false;
  private remoteRequestId = 0;
  private readonly instanceId = `gk-select-${++uid}`;
  private readonly internals =
    typeof ElementInternals === "undefined"
      ? undefined
      : this.createInternals();
  private formElement: HTMLFormElement | null = null;

  static formAssociated = true;

  private createInternals() {
    const element = this as unknown as HTMLElement & {
      attachInternals?: () => ElementInternals;
    };
    return element.attachInternals?.();
  }

  connectedCallback() {
    super.connectedCallback();
    this.formElement = this.closest("form");
    this.formElement?.addEventListener("reset", this.onFormReset);
    if (this.open) this.ensureListbox();
  }

  disconnectedCallback() {
    this.formElement?.removeEventListener("reset", this.onFormReset);
    this.cancelRemoteSearch();
    this.teardownListbox();
    super.disconnectedCallback();
  }

  protected updated(changed: Map<string, unknown>) {
    if (
      changed.has("value") ||
      changed.has("name") ||
      changed.has("required") ||
      changed.has("disabled")
    ) {
      this.syncFormState();
    }
    if (changed.has("open")) {
      if (this.open) this.ensureListbox();
      else {
        this.teardownListbox();
        if (changed.get("open") !== undefined) {
          this.shadowRoot?.querySelector<HTMLElement>("[part='base']")?.focus();
        }
      }
    } else if (this.open) {
      this.renderListbox();
      this.positionListbox();
    }
  }

  private options(): OptionRecord[] {
    const nodes = [...this.querySelectorAll("gk-option")];
    return nodes.map((el) => {
        const opt = el as GkOption;
        const group = el.closest("gk-option-group");
        return {
          value: opt.value || el.getAttribute("value") || "",
          label: (el.textContent ?? "").trim(),
          disabled:
            opt.disabled ||
            group?.hasAttribute("disabled") === true,
          groupLabel: group?.getAttribute("label") || undefined,
        };
      });
  }

  private customStateContent(name: "loading" | "empty") {
    const source = this.querySelector<HTMLElement>(`[slot="${name}"]`);
    return source?.cloneNode(true) as HTMLElement | undefined;
  }

  private selectedLabel() {
    const opt = this.options().find((o) => o.value === this.selectedValues[0]);
    return opt?.label ?? "";
  }

  private get selectedValues(): string[] {
    return Array.isArray(this.value) ? this.value : this.value ? [this.value] : [];
  }

  private selectedLabels() {
    const selected = new Set(this.selectedValues);
    return this.options().filter((option) => selected.has(option.value));
  }

  private get showClearButton() {
    return this.clearable && !this.disabled && this.selectedValues.length > 0;
  }

  private setOpen(next: boolean) {
    if (this.disabled && next) return;
    this.open = next;
    if (next) {
      const opts = this.options();
      const selected = new Set(this.selectedValues);
      const i = opts.findIndex((o) => selected.has(o.value));
      this.activeIndex =
        i >= 0 && !opts[i].disabled ? i : this.nextEnabledIndex(-1, 1);
      this.filterText = "";
      this.bindDismissListeners();
    } else {
      this.unbindDismissListeners();
      this.cancelRemoteSearch();
      this.remoteRequestId++;
      this.shadowRoot?.querySelector<HTMLElement>("[part='base']")?.focus();
    }
  }

  private emitValue(next: string | string[]) {
    this.value = next;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private syncFormState() {
    const internals = this.internals;
    if (!internals) return;
    const values = this.selectedValues;
    const formValue = this.multiple ? values.join(",") : values[0] ?? "";
    internals.setFormValue(this.disabled || !this.name ? null : formValue);
    if (this.required && values.length === 0 && !this.disabled) {
      const base = this.shadowRoot?.querySelector("[part='base']") as HTMLElement | null;
      internals.setValidity(
        { valueMissing: true },
        "Please select an option.",
        base ?? undefined,
      );
    } else {
      internals.setValidity({});
    }
  }

  formResetCallback() {
    this.value = this.multiple ? [] : "";
    this.filterText = "";
    this.open = false;
  }

  private onFormReset = () => {
    this.formResetCallback();
  };

  checkValidity() {
    return !this.required || this.disabled || this.selectedValues.length > 0;
  }

  reportValidity() {
    const valid = this.checkValidity();
    if (!valid) {
      this.dispatchEvent(new Event("invalid", { bubbles: false, cancelable: true }));
    }
    return valid;
  }

  private pick(value: string) {
    if (this.loading) return;
    const opt = this.options().find((o) => o.value === value);
    if (!opt || opt.disabled) return;
    if (this.multiple) {
      const selected = new Set(this.selectedValues);
      if (selected.has(value)) selected.delete(value);
      else {
        if (this.max > 0 && selected.size >= this.max) return;
        selected.add(value);
      }
      this.emitValue([...selected]);
      this.renderListbox();
      return;
    }
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
    this.emitValue(this.multiple ? [] : "");
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
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      if (!this.open) return;
      event.preventDefault();
      const direction = event.key === "Home" ? 1 : -1;
      this.activeIndex =
        direction === 1
          ? this.nextEnabledIndex(-1, 1)
          : this.nextEnabledIndex(this.options().length, -1);
      this.renderListbox();
    }
    if (event.key === "Escape" && this.open) {
      event.preventDefault();
      this.setOpen(false);
    }
  };

  private moveActive(dir: number) {
    if (!this.visibleOptions().length) return;
    this.activeIndex = this.nextEnabledIndex(
      this.activeIndex,
      dir === 1 ? 1 : -1,
    );
    this.renderListbox();
  }

  private nextEnabledIndex(start: number, dir: 1 | -1) {
    const visible = this.visibleOptions();
    for (let n = 1; n <= visible.length; n++) {
      const index = (start + dir * n + this.options().length * 2) % this.options().length;
      const option = visible.find((item) => item.index === index);
      if (option && !option.option.disabled) return index;
    }
    return 0;
  }

  private visibleOptions() {
    const query = this.remote ? "" : this.filterText.trim().toLocaleLowerCase();
    return this.options()
      .map((option, index) => ({ option, index }))
      .filter(
        ({ option }) =>
          !query ||
          option.label.toLocaleLowerCase().includes(query) ||
          option.value.toLocaleLowerCase().includes(query),
      );
  }

  private onFilterInput = (event: Event) => {
    this.filterText = (event.target as HTMLInputElement).value;
    if (this.remote) {
      this.scheduleRemoteSearch();
    }
    const first = this.visibleOptions().find(({ option }) => !option.disabled);
    this.activeIndex = first?.index ?? 0;
    this.renderListbox();
    this.positionListbox();
    this.listbox?.querySelector<HTMLInputElement>("[data-filter]")?.focus();
  };

  private remoteSearchTimer: ReturnType<typeof setTimeout> | undefined;

  private cancelRemoteSearch() {
    if (this.remoteSearchTimer === undefined) return;
    clearTimeout(this.remoteSearchTimer);
    this.remoteSearchTimer = undefined;
  }

  private scheduleRemoteSearch() {
    this.cancelRemoteSearch();
    const requestId = ++this.remoteRequestId;
    const emitSearch = () => {
      this.remoteSearchTimer = undefined;
      this.dispatchEvent(
        new CustomEvent("search", {
          detail: { query: this.filterText, requestId },
          bubbles: true,
          composed: true,
        }),
      );
    };
    if (this.remoteDebounce <= 0) {
      emitSearch();
      return;
    }
    this.remoteSearchTimer = setTimeout(emitSearch, this.remoteDebounce);
  }

  private onListboxKeydown = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      this.moveActive(event.key === "ArrowDown" ? 1 : -1);
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      this.activeIndex =
        event.key === "Home"
          ? this.nextEnabledIndex(-1, 1)
          : this.nextEnabledIndex(this.options().length, -1);
      this.renderListbox();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const option = this.options()[this.activeIndex];
      if (option) this.pick(option.value);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      this.setOpen(false);
    }
  };

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
      this.listbox.addEventListener("scroll", this.onListboxScroll);
      document.body.appendChild(this.listbox);
    }
    this.renderListbox();
    this.positionListbox();
    if (this.filterable || this.remote) {
      this.listbox.querySelector<HTMLInputElement>("[data-filter]")?.focus();
    }
    this.bindPositionListeners();
    this.bindDismissListeners();
  }

  private teardownListbox() {
    this.unbindPositionListeners();
    this.unbindDismissListeners();
    if (this.listbox) {
      this.listbox.removeEventListener("scroll", this.onListboxScroll);
      render(nothing, this.listbox);
      this.listbox.remove();
      this.listbox = null;
    }

    if (!document.querySelector(".gk-select-listbox")) {
      document.getElementById(SELECT_LISTBOX_STYLE_ID)?.remove();
    }
  }

  private onListboxScroll = () => {
    if (this.virtual) this.renderListbox();
  };

  private renderListbox() {
    if (!this.listbox) return;
    const visible = this.visibleOptions();
    const items = document.createElement("div");
    items.className = "gk-select-listbox__items";
    const existingFilter = this.listbox.querySelector<HTMLInputElement>(
      "[data-filter]",
    );
    let filterInput = existingFilter;
    if (this.filterable || this.remote) {
      if (!filterInput) {
        filterInput = document.createElement("input");
        filterInput.type = "search";
        filterInput.placeholder = "Search options";
        filterInput.setAttribute("data-filter", "");
        filterInput.setAttribute("aria-label", "Filter options");
        filterInput.addEventListener("input", this.onFilterInput);
        filterInput.addEventListener("keydown", this.onListboxKeydown);
      }
      filterInput.value = this.filterText;
    }
    if (this.loading) {
      const loading = document.createElement("div");
      loading.className = "gk-select-listbox__loading";
      loading.setAttribute("role", "status");
      loading.append(this.customStateContent("loading") ?? "Loading...");
      items.append(loading);
    } else if (visible.length === 0) {
      const empty = document.createElement("div");
      empty.className = "gk-select-listbox__empty";
      empty.setAttribute("role", "status");
      empty.append(this.customStateContent("empty") ?? "No options");
      items.append(empty);
    } else {
      const virtualStart = this.virtual
        ? Math.max(
            0,
            Math.floor((this.listbox?.scrollTop ?? 0) / this.itemHeight) - 3,
          )
        : 0;
      const virtualEnd = this.virtual
        ? Math.min(
            visible.length,
            virtualStart +
              Math.ceil((this.listbox?.clientHeight || 256) / this.itemHeight) +
              6,
          )
        : visible.length;
      const rendered = this.virtual
        ? visible.slice(virtualStart, virtualEnd)
        : visible;
      if (this.virtual) {
        items.style.position = "relative";
        items.style.height = `${visible.length * this.itemHeight}px`;
      }
      let lastGroup: string | undefined;
      rendered.forEach(({ option: opt, index: i }, renderedIndex) => {
        if (opt.groupLabel && opt.groupLabel !== lastGroup) {
          const group = document.createElement("div");
          group.className = "gk-select-listbox__group";
          group.setAttribute("role", "presentation");
          group.textContent = opt.groupLabel;
          items.append(group);
        }
        lastGroup = opt.groupLabel;
        const option = document.createElement("div");
        option.id = `${this.instanceId}-opt-${i}`;
        option.dataset.value = opt.value;
        option.setAttribute("role", "option");
        option.setAttribute(
          "aria-selected",
          String(this.selectedValues.includes(opt.value)),
        );
        if (this.multiple) {
          option.setAttribute(
            "aria-checked",
            String(this.selectedValues.includes(opt.value)),
          );
        }
        option.setAttribute("aria-disabled", String(opt.disabled));
        option.classList.toggle("is-active", i === this.activeIndex);
        if (this.virtual) {
          option.style.position = "absolute";
          option.style.top = `${(virtualStart + renderedIndex) * this.itemHeight}px`;
          option.style.left = "0";
          option.style.right = "0";
        }
        if (this.multiple) {
          const checkbox = document.createElement("span");
          checkbox.className = "gk-select-listbox__checkbox";
          checkbox.setAttribute("aria-hidden", "true");
          checkbox.textContent = this.selectedValues.includes(opt.value)
            ? "✓"
            : "";
          option.append(checkbox, opt.label);
        } else {
          option.textContent = opt.label;
        }
        option.addEventListener("click", () => this.pick(opt.value));
        items.append(option);
      });
    }
    this.listbox.querySelector(".gk-select-listbox__items")?.remove();
    if (filterInput) {
      if (filterInput.parentElement !== this.listbox) {
        this.listbox.append(filterInput);
      }
      this.listbox.append(items);
    } else {
      this.listbox.replaceChildren(items);
    }
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
    const selected = this.selectedLabels();
    const label = this.selectedLabel();
    const empty = selected.length === 0;
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
        aria-required=${this.required ? "true" : "false"}
        aria-invalid=${this.internals?.validity.valid === false ? "true" : "false"}
        aria-busy=${this.loading ? "true" : "false"}
        @click=${this.onTriggerClick}
        @keydown=${this.onTriggerKeydown}
      >
        <span part="value" ?data-empty=${empty}>
          ${this.multiple
            ? selected.length
              ? selected.map(
                  (option) =>
                    html`<span part="tag" data-value=${option.value}>
                      ${option.label}
                    </span>`,
                )
              : this.placeholder || "\u00a0"
            : label || this.placeholder || "\u00a0"}
        </span>
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
      <slot name="loading" hidden></slot>
      <slot name="empty" hidden></slot>
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-select": GkSelect;
  }
}
