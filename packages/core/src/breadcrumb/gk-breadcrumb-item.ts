import { LitElement, html, nothing, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { PropertyValues } from "lit";
import { falseableBoolean } from "../overlay/boolean.js";
import { breadcrumbItemStyles } from "./gk-breadcrumb.styles.js";

function chevron() {
  return svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true" focusable="false"><path d="m9 6 6 6-6 6"></path></svg>`;
}

@customElement("gk-breadcrumb-item")
export class GkBreadcrumbItem extends LitElement {
  static styles = breadcrumbItemStyles;

  @property()
  href = "";

  @property({ attribute: "key" })
  itemKey = "";

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  disabled = false;

  /** Set by `gk-breadcrumb`. The last item is current and is not a link. */
  @property({ type: Boolean, reflect: true })
  current = false;

  /** Set by `gk-breadcrumb`. Hidden on the last item. */
  @property({ type: Boolean })
  showSeparator = false;

  separatorMode = "chevron";
  separatorNodes: Node[] = [];

  protected override willUpdate(_changed: PropertyValues) {
    const parent = this.parentElement;
    if (!parent || parent.localName !== "gk-breadcrumb") {
      this.current = true;
      this.showSeparator = false;
      return;
    }
    const items = [...parent.children].filter((node) => node.localName === "gk-breadcrumb-item");
    const index = items.indexOf(this);
    const last = index < 0 || index === items.length - 1;
    this.current = last;
    this.showSeparator = !last;
    const trail = parent as HTMLElement & { separator?: string; separatorNodes?: Node[] };
    if (typeof trail.separator === "string") this.separatorMode = trail.separator;
    if (Array.isArray(trail.separatorNodes)) this.separatorNodes = trail.separatorNodes;
  }

  private onActivate = (event: Event) => {
    if (this.current) {
      event.preventDefault();
      return;
    }
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (!this.href) {
      this.dispatchEvent(
        new CustomEvent("select", {
          detail: { key: this.itemKey, item: this },
          bubbles: true,
          composed: true,
        }),
      );
    }
  };

  private separator() {
    if (!this.showSeparator) return nothing;
    const nodes = this.separatorNodes.filter((node) => {
      if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
      return node.nodeType === Node.ELEMENT_NODE;
    });
    const body = nodes.length
      ? nodes.map((node) => node.cloneNode(true))
      : this.separatorMode && this.separatorMode !== "chevron"
        ? this.separatorMode
        : chevron();
    return html`<span part="separator" aria-hidden="true">${body}</span>`;
  }

  override render() {
    const label = html`<slot></slot>`;
    const control = this.current
      ? html`<span part="current" aria-current="page">${label}</span>`
      : this.href
        ? html`<a
            part="link"
            href=${this.href}
            aria-disabled=${this.disabled ? "true" : "false"}
            @click=${this.onActivate}
            >${label}</a
          >`
        : html`<button type="button" part="link" ?disabled=${this.disabled} @click=${this.onActivate}
            >${label}</button
          >`;
    return html`<span class="gk-breadcrumb-item__row">${control}${this.separator()}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-breadcrumb-item": GkBreadcrumbItem;
  }
}
