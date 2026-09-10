import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cardStyles } from "./gk-card.styles.js";

export type GkCardSize = "sm" | "md" | "lg";

@customElement("gk-card")
export class GkCard extends LitElement {
  static styles = cardStyles;

  @property({ reflect: true })
  override title = "";

  @property({ reflect: true })
  size: GkCardSize = "md";

  @property({ reflect: true })
  cover?: string;

  @property({ type: Boolean, reflect: true })
  hoverable = false;

  @property({ type: Boolean, reflect: true })
  bordered = true;

  @property({ type: Boolean, reflect: true })
  segmented = false;

  @property({ type: Boolean, reflect: true })
  closable = false;

  @state()
  private hasCoverSlot = false;

  @state()
  private hasHeaderSlot = false;

  @state()
  private hasFooterSlot = false;

  private onCoverSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    this.hasCoverSlot = slot.assignedNodes({ flatten: true }).length > 0;
  };

  private onHeaderSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    this.hasHeaderSlot = slot.assignedNodes({ flatten: true }).length > 0;
  };

  private onFooterSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    this.hasFooterSlot = slot.assignedNodes({ flatten: true }).length > 0;
  };

  private syncSlotState(slotName: "cover" | "header" | "footer") {
    const slot = this.shadowRoot?.querySelector(
      `slot[name="${slotName}"]`,
    ) as HTMLSlotElement | null;
    if (!slot) return;
    const hasContent = slot.assignedNodes({ flatten: true }).length > 0;
    if (slotName === "cover") this.hasCoverSlot = hasContent;
    if (slotName === "header") this.hasHeaderSlot = hasContent;
    if (slotName === "footer") this.hasFooterSlot = hasContent;
  }

  protected firstUpdated() {
    this.syncSlotState("cover");
    this.syncSlotState("header");
    this.syncSlotState("footer");
  }

  private onClose = () => {
    this.dispatchEvent(
      new CustomEvent("gk-close", { bubbles: true, composed: true }),
    );
  };

  private get showBuiltInCover() {
    return Boolean(this.cover) && !this.hasCoverSlot;
  }

  private get showHeader() {
    return this.hasHeaderSlot || Boolean(this.title) || this.closable;
  }

  private get showCover() {
    return this.showBuiltInCover || this.hasCoverSlot;
  }

  render() {
    return html`
      <article part="base">
        <div part="cover" ?hidden=${!this.showCover}>
          ${this.showBuiltInCover
            ? html`<img src=${this.cover!} alt="" />`
            : nothing}
          <slot name="cover" @slotchange=${this.onCoverSlotChange}></slot>
        </div>
        ${this.showHeader
          ? html`
              <header part="header">
                <div class="gk-card__header-main">
                  ${this.hasHeaderSlot
                    ? nothing
                    : this.title
                      ? html`<div class="gk-card__title">${this.title}</div>`
                      : nothing}
                  <slot name="header" @slotchange=${this.onHeaderSlotChange}></slot>
                </div>
                <div part="action">
                  <slot name="action"></slot>
                  ${this.closable
                    ? html`<button
                        type="button"
                        part="close"
                        aria-label="Close"
                        @click=${this.onClose}
                      >
                        ×
                      </button>`
                    : nothing}
                </div>
              </header>
            `
          : html`<slot name="header" @slotchange=${this.onHeaderSlotChange} hidden></slot>`}
        <div part="content"><slot></slot></div>
        <footer part="footer" ?hidden=${!this.hasFooterSlot}>
          <slot name="footer" @slotchange=${this.onFooterSlotChange}></slot>
        </footer>
      </article>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-card": GkCard;
  }
}
