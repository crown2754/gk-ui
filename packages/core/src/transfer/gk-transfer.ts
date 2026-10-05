import { LitElement, html, nothing, svg, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { markOwnedSize, prefersZh } from "../internal/field.js";
import { transferStyles } from "./gk-transfer.styles.js";

export type GkTransferSize = "sm" | "md" | "lg";

export type TransferOption = {
  label: string;
  value?: string | number;
  key?: string | number;
  disabled?: boolean;
};

const flag = {
  fromAttribute(value: string | null) {
    return value !== "false" && value !== "0";
  },
  toAttribute(value: boolean) {
    return value ? "" : "false";
  },
};

const optionalFlag = {
  fromAttribute(value: string | null) {
    if (value == null) return undefined;
    return value !== "false" && value !== "0";
  },
  toAttribute(value: boolean | undefined) {
    if (value == null) return null;
    return value ? "" : "false";
  },
};

function parseKeys(value: string | null): Array<string | number> {
  if (value == null || value.trim() === "") return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.map((item) => (typeof item === "number" ? item : String(item)));
    }
  } catch {
    /* comma-separated */
  }
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

const keyListConverter = {
  fromAttribute: parseKeys,
  toAttribute(value: Array<string | number> | null) {
    return value?.length ? JSON.stringify(value) : null;
  },
};

@customElement("gk-transfer")
export class GkTransfer extends LitElement {
  static styles = transferStyles;

  @property({ converter: keyListConverter })
  value: Array<string | number> = [];

  @property({ attribute: "target-keys", converter: keyListConverter })
  targetKeys: Array<string | number> = [];

  @property({ attribute: false })
  options: TransferOption[] = [];

  @property({ attribute: false })
  data: TransferOption[] | null = null;

  @property({ attribute: "source-title" })
  sourceTitle = "";

  @property({ attribute: "target-title" })
  targetTitle = "";

  @property({ attribute: false })
  titles: [string, string] | null = null;

  @property({ reflect: true, attribute: "show-search", converter: flag })
  showSearch = true;

  /** Alias of `show-search`. Either flag can turn search off. */
  @property({ reflect: true, converter: flag })
  filterable = true;

  @property({ attribute: "filter-placeholder" })
  filterPlaceholder = "";

  @property({ reflect: true })
  size: GkTransferSize = "md";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ attribute: "source-filterable", converter: optionalFlag })
  sourceFilterable?: boolean;

  @property({ attribute: "target-filterable", converter: optionalFlag })
  targetFilterable?: boolean;

  @state()
  private sourceSelected: string[] = [];

  @state()
  private targetSelected: string[] = [];

  @state()
  private sourceQuery = "";

  @state()
  private targetQuery = "";

  override attributeChangedCallback(name: string, old: string | null, value: string | null) {
    super.attributeChangedCallback(name, old, value);
    markOwnedSize(this, name);
  }

  protected override willUpdate(changed: PropertyValues<this>) {
    if (this.data && this.data !== this.options) this.options = this.data;
    if (changed.has("value") && changed.has("targetKeys")) {
      const useTarget = this.value.length === 0 && this.targetKeys.length > 0;
      if (useTarget) this.value = this.targetKeys;
      else this.targetKeys = this.value;
    } else if (changed.has("value") && this.targetKeys !== this.value) {
      this.targetKeys = this.value;
    } else if (changed.has("targetKeys") && this.value !== this.targetKeys) {
      this.value = this.targetKeys;
    }
    const sourceIds = new Set(this.sourceItems().map((item) => String(optionKey(item))));
    const targetIds = new Set(this.targetItems().map((item) => String(optionKey(item))));
    const nextSource = this.sourceSelected.filter((key) => sourceIds.has(key));
    const nextTarget = this.targetSelected.filter((key) => targetIds.has(key));
    if (nextSource.length !== this.sourceSelected.length) this.sourceSelected = nextSource;
    if (nextTarget.length !== this.targetSelected.length) this.targetSelected = nextTarget;
  }

  private sourceItems() {
    return (this.options ?? []).filter((option) => !hasKey(this.value, optionKey(option)));
  }

  private targetItems() {
    return this.value.map((key) => this.optionByKey(key) ?? { label: String(key), value: key });
  }

  private optionByKey(key: string | number) {
    return (this.options ?? []).find((option) => String(optionKey(option)) === String(key));
  }

  private filtered(items: TransferOption[], query: string) {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) => item.label.toLowerCase().includes(needle));
  }

  private searchEnabled(side: "source" | "target") {
    const override = side === "source" ? this.sourceFilterable : this.targetFilterable;
    if (override != null) return override;
    return this.showSearch && this.filterable;
  }

  private assign(next: Array<string | number>) {
    this.value = next;
    this.targetKeys = next;
  }

  private emitChange(direction: "source" | "target", movedKeys: Array<string | number>) {
    const detail = { targetKeys: this.value, value: this.value, direction, movedKeys };
    this.dispatchEvent(new CustomEvent("change", { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent("update:value", { detail, bubbles: true, composed: true }));
  }

  private emitSelect() {
    this.dispatchEvent(
      new CustomEvent("select", {
        detail: {
          sourceSelectedKeys: [...this.sourceSelected],
          targetSelectedKeys: [...this.targetSelected],
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private move(direction: "source" | "target", keys: Array<string | number>) {
    if (this.disabled || !keys.length) return;
    const moving = keys.filter((key) => {
      const option = this.optionByKey(key);
      if (!option || option.disabled) return false;
      const inTarget = hasKey(this.value, key);
      return direction === "target" ? !inTarget : inTarget;
    });
    if (!moving.length) return;
    const next =
      direction === "target"
        ? [...this.value, ...moving]
        : this.value.filter((key) => !moving.some((item) => String(item) === String(key)));
    this.assign(next);
    if (direction === "target") {
      const moved = new Set(moving.map((key) => String(key)));
      this.sourceSelected = this.sourceSelected.filter((key) => !moved.has(key));
    } else {
      const moved = new Set(moving.map((key) => String(key)));
      this.targetSelected = this.targetSelected.filter((key) => !moved.has(key));
    }
    this.emitChange(direction, moving);
  }

  private enabledKeys(side: "source" | "target") {
    const items = side === "source" ? this.sourceItems() : this.targetItems();
    return items.filter((item) => !item.disabled).map((item) => optionKey(item));
  }

  private checkedKeys(side: "source" | "target") {
    const selected = side === "source" ? this.sourceSelected : this.targetSelected;
    return selected
      .map((key) => {
        const option = (side === "source" ? this.sourceItems() : this.targetItems()).find(
          (item) => String(optionKey(item)) === key,
        );
        return option && !option.disabled ? optionKey(option) : null;
      })
      .filter((key): key is string | number => key != null);
  }

  private toggleKey(side: "source" | "target", key: string | number, disabled?: boolean) {
    if (this.disabled || disabled) return;
    const id = String(key);
    const current = side === "source" ? this.sourceSelected : this.targetSelected;
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    if (side === "source") this.sourceSelected = next;
    else this.targetSelected = next;
    this.emitSelect();
  }

  private toggleAll(side: "source" | "target") {
    if (this.disabled) return;
    const visible = this.filtered(
      side === "source" ? this.sourceItems() : this.targetItems(),
      side === "source" ? this.sourceQuery : this.targetQuery,
    ).filter((item) => !item.disabled);
    const selected = side === "source" ? this.sourceSelected : this.targetSelected;
    const ids = visible.map((item) => String(optionKey(item)));
    const allOn = ids.length > 0 && ids.every((id) => selected.includes(id));
    const next = allOn
      ? selected.filter((id) => !ids.includes(id))
      : [...new Set([...selected, ...ids])];
    if (side === "source") this.sourceSelected = next;
    else this.targetSelected = next;
    this.emitSelect();
  }

  private onSearch(side: "source" | "target", value: string) {
    if (side === "source") this.sourceQuery = value;
    else this.targetQuery = value;
    this.dispatchEvent(
      new CustomEvent("search", {
        detail: { direction: side, value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private onItemKey(event: KeyboardEvent, side: "source" | "target", key: string | number, disabled?: boolean) {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    this.toggleKey(side, key, disabled);
  }

  private checkState(side: "source" | "target") {
    const visible = this.filtered(
      side === "source" ? this.sourceItems() : this.targetItems(),
      side === "source" ? this.sourceQuery : this.targetQuery,
    ).filter((item) => !item.disabled);
    const selected = side === "source" ? this.sourceSelected : this.targetSelected;
    const count = visible.filter((item) => selected.includes(String(optionKey(item)))).length;
    if (!visible.length || count === 0) return "false";
    if (count === visible.length) return "true";
    return "mixed";
  }

  private checkedCount(side: "source" | "target") {
    const items = side === "source" ? this.sourceItems() : this.targetItems();
    const selected = side === "source" ? this.sourceSelected : this.targetSelected;
    return items.filter((item) => selected.includes(String(optionKey(item)))).length;
  }

  private box(on: boolean, mixed = false) {
    if (!on && !mixed) return nothing;
    if (mixed) {
      return svg`<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="2" rx="0.5"></rect></svg>`;
    }
    return svg`<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6.2 10.6 3.4 7.8l-1.2 1.2 4 4 8-8-1.2-1.2z"></path></svg>`;
  }

  private renderPanel(side: "source" | "target") {
    const zh = prefersZh(this);
    const source = side === "source";
    const title =
      (source ? this.titles?.[0] : this.titles?.[1]) ||
      (source ? this.sourceTitle : this.targetTitle) ||
      (source ? (zh ? "來源" : "Source") : zh ? "目標" : "Target");
    const items = source ? this.sourceItems() : this.targetItems();
    const query = source ? this.sourceQuery : this.targetQuery;
    const visible = this.filtered(items, query);
    const selected = source ? this.sourceSelected : this.targetSelected;
    const state = this.checkState(side);
    const placeholder = this.filterPlaceholder || (zh ? "搜尋" : "Search");
    const empty = zh ? "暫無資料" : "No data";
    const listLabel = source ? (zh ? "來源清單" : "Source list") : zh ? "目標清單" : "Target list";
    const allLabel = source ? (zh ? "全選來源" : "Select all source") : zh ? "全選目標" : "Select all target";
    return html`
      <section part=${source ? "source-panel" : "target-panel"}>
        <div part="header">
          <button
            type="button"
            part="checkbox"
            role="checkbox"
            aria-checked=${state}
            aria-label=${allLabel}
            @click=${() => this.toggleAll(side)}
          >
            ${this.box(state === "true", state === "mixed")}
          </button>
          <span part="title">
            <slot name=${source ? "source-title" : "target-title"}>${title}</slot>
          </span>
          <span part="count">${this.checkedCount(side)}/${items.length}</span>
        </div>
        ${this.searchEnabled(side)
          ? html`<div part="search-wrap">
              <input
                part="search"
                type="search"
                placeholder=${placeholder}
                aria-label=${`${placeholder}${title}`}
                .value=${query}
                @input=${(event: Event) =>
                  this.onSearch(side, (event.target as HTMLInputElement).value)}
              />
            </div>`
          : nothing}
        <div part="list" role="listbox" aria-multiselectable="true" aria-label=${listLabel}>
          ${visible.length
            ? visible.map((item) => {
                const key = optionKey(item);
                const id = String(key);
                const on = selected.includes(id);
                return html`
                  <div
                    part="item"
                    role="option"
                    aria-selected=${on ? "true" : "false"}
                    aria-disabled=${item.disabled ? "true" : "false"}
                    tabindex=${item.disabled || this.disabled ? -1 : 0}
                    @click=${() => this.toggleKey(side, key, item.disabled)}
                    @keydown=${(event: KeyboardEvent) => this.onItemKey(event, side, key, item.disabled)}
                  >
                    <span part="checkbox" aria-hidden="true">${this.box(on)}</span>
                    <span part="label">${item.label}</span>
                  </div>
                `;
              })
            : html`<div part="empty">
                <slot name=${source ? "source-empty" : "target-empty"}>${empty}</slot>
              </div>`}
        </div>
      </section>
    `;
  }

  override render() {
    const zh = prefersZh(this);
    const labelledBy = this.getAttribute("aria-labelledby");
    const canSource = this.checkedKeys("source").length > 0;
    const canTarget = this.checkedKeys("target").length > 0;
    const canAllSource = this.enabledKeys("source").length > 0;
    const canAllTarget = this.enabledKeys("target").length > 0;
    return html`
      <div
        part="root"
        role="group"
        aria-label=${labelledBy ? nothing : zh ? "穿梭選擇" : "Transfer"}
        aria-labelledby=${labelledBy || nothing}
        aria-disabled=${this.disabled ? "true" : "false"}
      >
        <div part="body">
          ${this.renderPanel("source")}
          <div part="actions">
            <button
              type="button"
              part="button"
              data-variant="primary"
              aria-label=${zh ? "全部移至目標" : "Move all to target"}
              ?disabled=${!canAllSource}
              @click=${() => this.move("target", this.enabledKeys("source"))}
            >
              &gt;&gt;
            </button>
            <button
              type="button"
              part="button"
              data-variant="primary"
              aria-label=${zh ? "移至目標" : "Move to target"}
              ?disabled=${!canSource}
              @click=${() => this.move("target", this.checkedKeys("source"))}
            >
              &gt;
            </button>
            <button
              type="button"
              part="button"
              data-variant="outline"
              aria-label=${zh ? "移回來源" : "Move to source"}
              ?disabled=${!canTarget}
              @click=${() => this.move("source", this.checkedKeys("target"))}
            >
              &lt;
            </button>
            <button
              type="button"
              part="button"
              data-variant="outline"
              aria-label=${zh ? "全部移回來源" : "Move all to source"}
              ?disabled=${!canAllTarget}
              @click=${() => this.move("source", this.enabledKeys("target"))}
            >
              &lt;&lt;
            </button>
          </div>
          ${this.renderPanel("target")}
        </div>
      </div>
    `;
  }
}

function optionKey(option: TransferOption): string | number {
  if (option.value != null && option.value !== "") return option.value;
  if (option.key != null && option.key !== "") return option.key;
  return option.label;
}

function hasKey(list: Array<string | number>, key: string | number) {
  return list.some((item) => String(item) === String(key));
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-transfer": GkTransfer;
  }
}
