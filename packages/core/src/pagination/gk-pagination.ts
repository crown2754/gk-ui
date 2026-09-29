import { LitElement, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { PropertyValues } from "lit";
import { falseableBoolean } from "../overlay/boolean.js";
import { paginationStyles } from "./gk-pagination.styles.js";

export type GkPaginationSize = "sm" | "md" | "lg";
export type GkPageToken = number | "ellipsis";

function english(el: HTMLElement) {
  return (el.ownerDocument?.documentElement?.lang || "").toLowerCase().startsWith("en");
}

function parseOptionalNumber(value: string | null): number | undefined {
  if (value == null || value.trim() === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function parsePageSizes(value: string | null): number[] {
  const fallback = [10, 20, 30, 50];
  if (value == null || value.trim() === "") return fallback;
  const raw = value.trim();
  const read = (list: unknown[]) =>
    list.map((item) => Number(item)).filter((n) => Number.isFinite(n) && n > 0);
  try {
    if (raw.startsWith("[")) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        const nums = read(parsed);
        if (nums.length) return nums;
      }
    }
  } catch {
    /* comma form */
  }
  const nums = read(raw.split(/[,\s]+/));
  return nums.length ? nums : fallback;
}

/**
 * Page buttons before ellipsis collapses.
 * Middle pages keep first, last, and the current ± neighbors inside `pageSlot` items.
 */
export function buildPageList(page: number, pageCount: number, pageSlot = 7): GkPageToken[] {
  const count = Math.max(0, Math.floor(pageCount));
  if (count <= 0) return [];
  const current = Math.min(Math.max(1, Math.floor(page) || 1), count);
  const slot = Math.max(5, Math.floor(pageSlot) || 7);
  if (count <= slot) {
    return Array.from({ length: count }, (_, index) => index + 1);
  }
  const pager = slot % 2 === 0 ? slot - 1 : slot;
  const side = (pager - 1) / 2;
  const showPrev = current > side + 1;
  const showNext = current < count - side;
  if (showPrev && !showNext) {
    const start = count - (pager - 3);
    return [1, "ellipsis", ...Array.from({ length: count - start + 1 }, (_, i) => start + i)];
  }
  if (!showPrev && showNext) {
    const head = pager - 2;
    return [...Array.from({ length: head }, (_, i) => i + 1), "ellipsis", count];
  }
  const window = pager - 4;
  const start = current - Math.floor((window - 1) / 2);
  return [
    1,
    "ellipsis",
    ...Array.from({ length: window }, (_, i) => start + i),
    "ellipsis",
    count,
  ];
}

@customElement("gk-pagination")
export class GkPagination extends LitElement {
  static styles = paginationStyles;

  /** 1-based current page. */
  @property({ type: Number })
  page = 1;

  @property({ type: Number, attribute: "page-size" })
  pageSize = 10;

  @property({
    attribute: "item-count",
    converter: {
      fromAttribute: parseOptionalNumber,
      toAttribute(value: number | undefined): string | null {
        return value == null ? null : String(value);
      },
    },
  })
  itemCount?: number;

  @property({
    attribute: "page-count",
    converter: {
      fromAttribute: parseOptionalNumber,
      toAttribute(value: number | undefined): string | null {
        return value == null ? null : String(value);
      },
    },
  })
  pageCount?: number;

  @property({
    attribute: "page-sizes",
    converter: {
      fromAttribute: parsePageSizes,
    },
  })
  pageSizes: number[] = [10, 20, 30, 50];

  @property({
    type: Boolean,
    reflect: true,
    attribute: "show-size-picker",
    converter: falseableBoolean,
  })
  showSizePicker = false;

  @property({
    type: Boolean,
    reflect: true,
    attribute: "show-quick-jumper",
    converter: falseableBoolean,
  })
  showQuickJumper = false;

  @property({
    type: Boolean,
    reflect: true,
    attribute: "show-total",
    converter: falseableBoolean,
  })
  showTotal = false;

  @property({ reflect: true })
  size: GkPaginationSize = "md";

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  disabled = false;

  /** Max page items (numbers + ellipses) before the list collapses. */
  @property({ type: Number, attribute: "page-slot" })
  pageSlot = 7;

  @state()
  private jumperValue = "1";

  private focusCurrent = false;

  /** Total pages from `item-count`, otherwise `page-count`, otherwise 1. */
  resolvedPageCount(): number {
    if (this.itemCount != null && Number.isFinite(Number(this.itemCount))) {
      const items = Math.max(0, Math.floor(Number(this.itemCount)));
      return Math.max(1, Math.ceil(items / this.safePageSize()));
    }
    if (this.pageCount != null && Number.isFinite(Number(this.pageCount))) {
      return Math.max(1, Math.floor(Number(this.pageCount)));
    }
    return 1;
  }

  private safePageSize() {
    const n = Math.floor(Number(this.pageSize));
    return Number.isFinite(n) && n > 0 ? n : 10;
  }

  private safeSizes() {
    const list = (this.pageSizes ?? [])
      .map((n) => Math.floor(Number(n)))
      .filter((n) => Number.isFinite(n) && n > 0);
    const sizes = list.length ? list : [10, 20, 30, 50];
    if (!sizes.includes(this.safePageSize())) sizes.unshift(this.safePageSize());
    return sizes;
  }

  protected override willUpdate(changed: PropertyValues) {
    const count = this.resolvedPageCount();
    let page = Math.floor(Number(this.page));
    if (!Number.isFinite(page) || page < 1) page = 1;
    if (page > count) page = count;
    if (page !== this.page) this.page = page;
    if (!this.hasUpdated || changed.has("page")) this.jumperValue = String(this.page);
    if (this.disabled) this.setAttribute("aria-disabled", "true");
    else this.removeAttribute("aria-disabled");
  }

  protected override updated() {
    if (!this.focusCurrent) return;
    this.focusCurrent = false;
    this.renderRoot.querySelector<HTMLButtonElement>('[aria-current="page"]')?.focus();
  }

  private emitPage(page: number) {
    const detail = { page };
    this.dispatchEvent(
      new CustomEvent("update:page", { detail, bubbles: true, composed: true }),
    );
    this.dispatchEvent(new CustomEvent("change", { detail, bubbles: true, composed: true }));
  }

  private go(page: number, focus = false) {
    if (this.disabled) return;
    const count = this.resolvedPageCount();
    const next = Math.min(count, Math.max(1, Math.floor(page)));
    if (!Number.isFinite(next) || next === this.page) {
      if (focus) this.focusCurrent = true;
      return;
    }
    this.page = next;
    if (focus) this.focusCurrent = true;
    this.emitPage(next);
  }

  private onSizeChange = (event: Event) => {
    if (this.disabled) return;
    const next = Math.floor(Number((event.target as HTMLSelectElement).value));
    if (!Number.isFinite(next) || next <= 0 || next === this.safePageSize()) return;
    this.pageSize = next;
    this.dispatchEvent(
      new CustomEvent("update:page-size", {
        detail: { pageSize: next },
        bubbles: true,
        composed: true,
      }),
    );
    if (this.page !== 1) {
      this.page = 1;
      this.emitPage(1);
    }
  };

  private onJumperInput = (event: Event) => {
    this.jumperValue = (event.target as HTMLInputElement).value;
  };

  private commitJumper = () => {
    if (this.disabled) return;
    const raw = this.jumperValue.trim();
    if (!raw) return;
    const n = Math.floor(Number(raw));
    if (!Number.isFinite(n)) return;
    this.go(n);
  };

  private onJumperKey = (event: KeyboardEvent) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    this.commitJumper();
  };

  private onKeyDown = (event: KeyboardEvent) => {
    if (this.disabled || event.altKey || event.metaKey || event.ctrlKey) return;
    const tag = (event.target as HTMLElement | null)?.tagName;
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      this.go(this.page - 1, true);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      this.go(this.page + 1, true);
    }
  };

  private chevron(direction: "left" | "right") {
    const d = direction === "left" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6";
    return svg`<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d=${d}></path></svg>`;
  }

  private totalText(count: number) {
    if (english(this)) {
      if (this.itemCount != null) return `${this.itemCount} items`;
      return `${count} pages`;
    }
    if (this.itemCount != null) return `共 ${this.itemCount} 筆`;
    return `共 ${count} 頁`;
  }

  override render() {
    const en = english(this);
    const count = this.resolvedPageCount();
    const items = buildPageList(this.page, count, this.pageSlot);
    const sizes = this.safeSizes();
    const label = this.getAttribute("aria-label") || (en ? "Pagination" : "分頁器");
    const atStart = this.page <= 1;
    const atEnd = this.page >= count;
    return html`
      <nav
        part="root"
        aria-label=${label}
        aria-disabled=${this.disabled ? "true" : "false"}
        @keydown=${this.onKeyDown}
      >
        ${this.showTotal ? html`<span part="total">${this.totalText(count)}</span>` : nothing}
        ${this.showSizePicker
          ? html`<select
              part="size-picker"
              aria-label=${en ? "Items per page" : "每頁筆數"}
              ?disabled=${this.disabled}
              @change=${this.onSizeChange}
            >
              ${sizes.map(
                (size) => html`<option value=${size} ?selected=${size === this.safePageSize()}>
                  ${en ? `${size} / page` : `${size} / 頁`}
                </option>`,
              )}
            </select>`
          : nothing}
        <div part="nav">
          <button
            type="button"
            part="prev"
            aria-label=${en ? "Previous page" : "上一頁"}
            aria-disabled=${atStart || this.disabled ? "true" : "false"}
            ?disabled=${atStart || this.disabled}
            @click=${() => this.go(this.page - 1)}
          >
            ${this.chevron("left")}
          </button>
          ${items.map((item) =>
            item === "ellipsis"
              ? html`<span part="ellipsis" aria-hidden="true">…</span>`
              : html`<button
                  type="button"
                  part=${item === this.page ? "item item-active" : "item"}
                  aria-current=${item === this.page ? "page" : nothing}
                  aria-disabled=${this.disabled ? "true" : "false"}
                  ?disabled=${this.disabled}
                  @click=${() => this.go(item)}
                >
                  ${item}
                </button>`,
          )}
          <button
            type="button"
            part="next"
            aria-label=${en ? "Next page" : "下一頁"}
            aria-disabled=${atEnd || this.disabled ? "true" : "false"}
            ?disabled=${atEnd || this.disabled}
            @click=${() => this.go(this.page + 1)}
          >
            ${this.chevron("right")}
          </button>
        </div>
        ${this.showQuickJumper
          ? html`<label part="quick-jumper">
              <span>${en ? "Go to" : "前往"}</span>
              <input
                type="number"
                inputmode="numeric"
                min="1"
                max=${count}
                aria-label=${en ? "Page number" : "頁碼"}
                autocomplete="off"
                .value=${this.jumperValue}
                ?disabled=${this.disabled}
                @input=${this.onJumperInput}
                @keydown=${this.onJumperKey}
                @change=${this.commitJumper}
              />
              ${en ? nothing : html`<span>頁</span>`}
            </label>`
          : nothing}
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-pagination": GkPagination;
  }
}
