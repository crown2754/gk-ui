import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { avatarGroupStyles } from "./gk-avatar-group.styles.js";
import type { GkAvatarSize } from "./gk-avatar.js";

@customElement("gk-avatar-group")
export class GkAvatarGroup extends LitElement {
  static styles = avatarGroupStyles;

  @property({ type: Number })
  max?: number;

  @property({ reflect: true })
  size?: GkAvatarSize;

  @property({ type: Number, reflect: true })
  rest = 0;

  private onSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    if (slot.name) return;
    const avatars = slot
      .assignedElements({ flatten: true })
      .filter((n) => n.tagName === "GK-AVATAR") as HTMLElement[];
    const limit = this.max != null && this.max >= 0 ? this.max : avatars.length;
    avatars.forEach((el, i) => {
      el.style.display = i < limit ? "" : "none";
      if (this.size) el.setAttribute("size", this.size);
    });
    this.rest = Math.max(0, avatars.length - limit);
  };

  protected updated(changed: Map<string, unknown>) {
    if (changed.has("max") || changed.has("size")) {
      const slot = this.shadowRoot?.querySelector("slot:not([name])") as HTMLSlotElement | null;
      if (slot) this.onSlotChange({ target: slot } as unknown as Event);
    }
  }

  render() {
    return html`
      <div class="gk-avatar-group__row">
        <slot @slotchange=${this.onSlotChange}></slot>
        <span ?hidden=${this.rest <= 0}><slot name="overflow"></slot></span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-avatar-group": GkAvatarGroup;
  }
}
