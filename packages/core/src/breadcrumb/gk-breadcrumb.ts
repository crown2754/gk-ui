import { LitElement, html, nothing, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { breadcrumbStyles } from "./gk-breadcrumb.styles.js";
import type { GkBreadcrumbItem } from "./gk-breadcrumb-item.js";
import "./gk-breadcrumb-item.js";

export type GkBreadcrumbSize = "sm" | "md" | "lg";

export type GkBreadcrumbItemData = {
  label: string;
  href?: string;
  key?: string;
  disabled?: boolean;
};

function english(el: HTMLElement) {
  return (el.ownerDocument?.documentElement?.lang || "").toLowerCase().startsWith("en");
}

function parseItems(value: string | null): GkBreadcrumbItemData[] | null {
  if (value == null || value.trim() === "") return null;
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed
      .map((entry) => {
        if (!entry || typeof entry !== "object") return null;
        const record = entry as Record<string, unknown>;
        const label = String(record.label ?? "").trim();
        if (!label) return null;
        const item: GkBreadcrumbItemData = { label };
        if (typeof record.href === "string") item.href = record.href;
        if (typeof record.key === "string") item.key = record.key;
        if (record.disabled === true) item.disabled = true;
        return item;
      })
      .filter((item): item is GkBreadcrumbItemData => item !== null);
  } catch {
    return null;
  }
}

function chevron() {
  return svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true" focusable="false"><path d="m9 6 6 6-6 6"></path></svg>`;
}

@customElement("gk-breadcrumb")
export class GkBreadcrumb extends LitElement {
  static styles = breadcrumbStyles;

  /** Visual separator. `chevron` draws the icon; any other string is text. The `separator` slot wins. */
  @property({ reflect: true })
  separator = "chevron";

  @property({ reflect: true })
  size: GkBreadcrumbSize = "md";

  /**
   * Data API. Slotted `gk-breadcrumb-item` children win when present.
   * `max-items` collapse is intentionally not implemented in v1.
   */
  @property({
    attribute: "items",
    converter: {
      fromAttribute: parseItems,
    },
  })
  items: GkBreadcrumbItemData[] | null = null;

  separatorNodes: Node[] = [];

  private onSlot = () => {
    this.syncItems();
    this.requestUpdate();
  };

  private onSeparatorSlot = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    this.separatorNodes = slot.assignedNodes({ flatten: true }).filter((node) => {
      if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
      return node.nodeType === Node.ELEMENT_NODE;
    });
    for (const item of this.itemElements()) item.requestUpdate();
    this.requestUpdate();
  };

  protected override updated() {
    const sepChanged = this.captureSeparator();
    this.syncItems();
    for (const item of this.itemElements()) item.requestUpdate();
    // Data-API trails render the separator in this shadow root, so a late
    // slot assignment needs one more pass. Slotted items update themselves.
    if (sepChanged && this.itemElements().length === 0) this.requestUpdate();
  }

  private captureSeparator() {
    const slot = this.renderRoot.querySelector("slot[name='separator']") as HTMLSlotElement | null;
    const nodes = (slot?.assignedNodes({ flatten: true }) ?? []).filter((node) => {
      if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
      return node.nodeType === Node.ELEMENT_NODE;
    });
    const changed =
      nodes.length !== this.separatorNodes.length ||
      nodes.some((node, index) => node !== this.separatorNodes[index]);
    this.separatorNodes = nodes;
    return changed;
  }

  itemElements(): GkBreadcrumbItem[] {
    return [...this.children].filter(
      (node): node is GkBreadcrumbItem => node.localName === "gk-breadcrumb-item",
    );
  }

  syncItems() {
    const items = this.itemElements();
    items.forEach((item, index) => {
      const last = index === items.length - 1;
      item.separatorMode = this.separator;
      item.separatorNodes = this.separatorNodes;
      if (item.current !== last) item.current = last;
      if (item.showSeparator !== !last) item.showSeparator = !last;
    });
  }

  private landmark() {
    return this.getAttribute("aria-label") || (english(this) ? "Breadcrumb" : "麵包屑");
  }

  private separatorTemplate() {
    const nodes = this.separatorNodes;
    if (nodes.length) {
      return html`<span part="separator" aria-hidden="true"
        >${nodes.map((node) => node.cloneNode(true))}</span
      >`;
    }
    if (this.separator && this.separator !== "chevron") {
      return html`<span part="separator" aria-hidden="true">${this.separator}</span>`;
    }
    return html`<span part="separator" aria-hidden="true">${chevron()}</span>`;
  }

  private onDataActivate(item: GkBreadcrumbItemData, event: Event) {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    if (!item.href) {
      this.dispatchEvent(
        new CustomEvent("select", {
          detail: { key: item.key ?? "", item },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private dataList() {
    const items = this.items ?? [];
    return html`<ol part="list">
      ${items.map((item, index) => {
        const last = index === items.length - 1;
        const control = last
          ? html`<span part="current" aria-current="page">${item.label}</span>`
          : item.href
            ? html`<a
                part="link"
                href=${item.href}
                aria-disabled=${item.disabled ? "true" : "false"}
                @click=${(event: Event) => this.onDataActivate(item, event)}
                >${item.label}</a
              >`
            : html`<button
                type="button"
                part="link"
                ?disabled=${item.disabled}
                @click=${(event: Event) => this.onDataActivate(item, event)}
                >${item.label}</button
              >`;
        return html`<li part="item">
          ${control}${last ? nothing : this.separatorTemplate()}
        </li>`;
      })}
    </ol>`;
  }

  override render() {
    const slotted = this.itemElements().length > 0;
    return html`
      <nav part="root" aria-label=${this.landmark()}>
        <slot
          name="separator"
          style="display:none"
          @slotchange=${this.onSeparatorSlot}
        ></slot>
        ${slotted
          ? html`<div part="list" role="list"><slot @slotchange=${this.onSlot}></slot></div>`
          : html`<div part="items">${this.dataList()}<slot hidden @slotchange=${this.onSlot}></slot></div>`}
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-breadcrumb": GkBreadcrumb;
  }
}
