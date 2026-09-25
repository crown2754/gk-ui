import { LitElement, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { falseableBoolean } from "../overlay/boolean.js";
import { emptyStyles } from "./gk-empty.styles.js";

export type GkEmptySize = "default" | "large";

@customElement("gk-empty")
export class GkEmpty extends LitElement {
  static styles = emptyStyles;

  private _description: string | undefined = undefined;

  /** Locale default: zh「暫無資料」/ en「No data」 when the attribute is omitted. */
  @property()
  get description(): string {
    if (this._description !== undefined) return this._description;
    const lang = (this.ownerDocument?.documentElement?.lang || "").toLowerCase();
    return lang.startsWith("en") ? "No data" : "暫無資料";
  }

  set description(value: string) {
    const old = this._description;
    this._description = value;
    this.requestUpdate("description", old);
  }

  @property()
  title = "";

  @property({ reflect: true })
  size: GkEmptySize = "default";

  @property({
    type: Boolean,
    reflect: true,
    attribute: "show-icon",
    converter: falseableBoolean,
  })
  showIcon = true;

  @state()
  private hasImageSlot = false;

  @state()
  private hasIconSlot = false;

  @state()
  private hasDescriptionSlot = false;

  @state()
  private hasTitleSlot = false;

  @state()
  private hasExtraSlot = false;

  @state()
  private hasActionSlot = false;

  private slotFilled(slot: HTMLSlotElement) {
    return slot.assignedNodes({ flatten: true }).some((node) => {
      if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
      return node.nodeType === Node.ELEMENT_NODE;
    });
  }

  private onImageSlot = (event: Event) => {
    this.hasImageSlot = this.slotFilled(event.target as HTMLSlotElement);
  };

  private onIconSlot = (event: Event) => {
    this.hasIconSlot = this.slotFilled(event.target as HTMLSlotElement);
  };

  private onDescriptionSlot = (event: Event) => {
    this.hasDescriptionSlot = this.slotFilled(event.target as HTMLSlotElement);
  };

  private onTitleSlot = (event: Event) => {
    this.hasTitleSlot = this.slotFilled(event.target as HTMLSlotElement);
  };

  private onExtraSlot = (event: Event) => {
    this.hasExtraSlot = this.slotFilled(event.target as HTMLSlotElement);
  };

  private onActionSlot = (event: Event) => {
    this.hasActionSlot = this.slotFilled(event.target as HTMLSlotElement);
  };

  protected override firstUpdated() {
    const read = (name: string) => {
      const slot = this.shadowRoot?.querySelector(
        `slot[name="${name}"]`,
      ) as HTMLSlotElement | null;
      return slot ? this.slotFilled(slot) : false;
    };
    this.hasImageSlot = read("image");
    this.hasIconSlot = read("icon");
    this.hasDescriptionSlot = read("description");
    this.hasTitleSlot = read("title");
    this.hasExtraSlot = read("extra");
    this.hasActionSlot = read("action");
  }

  private illustration() {
    return svg`
      <svg
        class="gk-empty__art"
        viewBox="0 0 128 96"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="28" y="22" width="72" height="52" rx="6"></rect>
        <path d="M28 38h72"></path>
        <path d="M44 54h24M44 64h40"></path>
        <circle
          cx="96"
          cy="70"
          r="14"
          fill="color-mix(in srgb, rgb(242,206,94) 18%, white)"
          stroke="currentColor"
        ></circle>
        <path d="M96 64v8M92 72h8"></path>
      </svg>
    `;
  }

  override render() {
    const customImage = this.hasImageSlot || this.hasIconSlot;
    const showImage = this.showIcon || customImage;
    const showTitle = Boolean(this.title) || this.hasTitleSlot;
    const showExtra = this.hasExtraSlot || this.hasActionSlot;
    return html`
      <div part="root">
        <div part="image" aria-hidden="true" ?hidden=${!showImage}>
          ${customImage || !this.showIcon ? nothing : this.illustration()}
          <slot name="image" @slotchange=${this.onImageSlot}></slot>
          <slot name="icon" @slotchange=${this.onIconSlot}></slot>
        </div>
        <div part="title" ?hidden=${!showTitle}>
          ${this.hasTitleSlot ? nothing : this.title}
          <slot name="title" @slotchange=${this.onTitleSlot}></slot>
        </div>
        <div part="description">
          ${this.hasDescriptionSlot ? nothing : this.description}
          <slot name="description" @slotchange=${this.onDescriptionSlot}></slot>
        </div>
        <slot></slot>
        <div part="extra" ?hidden=${!showExtra}>
          <slot name="extra" @slotchange=${this.onExtraSlot}></slot>
          <slot name="action" @slotchange=${this.onActionSlot}></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-empty": GkEmpty;
  }
}
