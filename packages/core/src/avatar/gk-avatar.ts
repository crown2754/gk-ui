import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { avatarStyles } from "./gk-avatar.styles.js";

export type GkAvatarSize = "sm" | "md" | "lg" | (string & {});

@customElement("gk-avatar")
export class GkAvatar extends LitElement {
  static styles = avatarStyles;

  @property({ reflect: true })
  size: GkAvatarSize = "md";

  @property({ type: Boolean, reflect: true })
  round = false;

  @property({ reflect: true })
  src?: string;

  @property()
  alt = "";

  @property({ reflect: true })
  color?: string;

  @property({ attribute: "object-fit", reflect: true })
  objectFit = "cover";

  @state()
  private imageFailed = false;

  protected updated(changed: Map<string, unknown>) {
    if (changed.has("src")) {
      this.imageFailed = false;
    }
    const numeric =
      this.size && !["sm", "md", "lg"].includes(this.size) && /^\d+(\.\d+)?$/.test(this.size);
    this.style.setProperty("--gk-avatar-size", numeric ? `${this.size}px` : null);
    this.style.setProperty("--gk-avatar-object-fit", this.objectFit || "cover");
    this.style.setProperty("--gk-avatar-color", this.color ?? null);
  }

  private onImageError = () => {
    this.imageFailed = true;
  };

  private get showImage() {
    return Boolean(this.src) && !this.imageFailed;
  }

  render() {
    return html`
      <span part="base">
        ${this.showImage
          ? html`<img
              part="image"
              src=${this.src!}
              alt=${this.alt}
              @error=${this.onImageError}
            />`
          : html`<span part="content"><slot></slot></span>`}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-avatar": GkAvatar;
  }
}
