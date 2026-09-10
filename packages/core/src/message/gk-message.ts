import { LitElement, html, nothing, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { messageStyles } from "./gk-message.styles.js";

export type GkMessageType =
  | "default"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "loading";

@customElement("gk-message")
export class GkMessage extends LitElement {
  static styles = messageStyles;

  @property({ reflect: true })
  type: GkMessageType = "default";

  @property({ reflect: true })
  content = "";

  @property({ type: Boolean, reflect: true })
  closable = false;

  @property({ type: Boolean, reflect: true, attribute: "show-icon" })
  showIcon = true;

  private onClose = () => {
    this.dispatchEvent(
      new CustomEvent("gk-close", { bubbles: true, composed: true }),
    );
  };

  private builtinIcon() {
    if (this.type === "loading") {
      return html`<span class="gk-message__spinner" aria-hidden="true"></span>`;
    }
    if (this.type === "default") return nothing;

    const paths: Record<string, string> = {
      info: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
      success:
        "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
      warning:
        "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
      error:
        "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z",
    };

    return svg`
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d=${paths[this.type]} />
      </svg>
    `;
  }

  render() {
    return html`
      <div part="base" role="status">
        <div
          part="icon"
          ?hidden=${!this.showIcon || this.type === "default"}
        >
          ${this.builtinIcon()}
        </div>
        <div part="content">${this.content}</div>
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
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-message": GkMessage;
  }
}
