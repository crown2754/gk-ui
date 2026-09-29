import { LitElement, html, nothing, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { resultStyles } from "./gk-result.styles.js";

export type GkResultStatus = "success" | "info" | "warning" | "error" | "404";

function filled(host: HTMLElement, name: string) {
  return [...host.children].some((node) => node.getAttribute("slot") === name);
}

@customElement("gk-result")
export class GkResult extends LitElement {
  static styles = resultStyles;

  @property({ reflect: true })
  status: GkResultStatus = "info";

  @property()
  title = "";

  @property()
  description = "";

  private onSlot = () => {
    this.requestUpdate();
  };

  private glyph() {
    if (this.status === "404") {
      return html`<span class="gk-result__mark">404</span>`;
    }
    if (this.status === "success") {
      return svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>`;
    }
    if (this.status === "warning") {
      return svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 2 20h20L12 3z"></path><path d="M12 10v4M12 17h.01"></path></svg>`;
    }
    if (this.status === "error") {
      return svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="m15 9-6 6M9 9l6 6"></path></svg>`;
    }
    return svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 8h.01M11 12h1v4h1"></path></svg>`;
  }

  override render() {
    const customIcon = filled(this, "icon");
    const showTitle = Boolean(this.title.trim());
    const showDescription = Boolean(this.description.trim());
    const showExtra = filled(this, "extra") || filled(this, "action");
    return html`
      <div part="root">
        <div part="icon" aria-hidden=${showTitle ? "true" : "false"}>
          ${customIcon ? nothing : this.glyph()}
          <slot name="icon" @slotchange=${this.onSlot}></slot>
        </div>
        <h2 part="title" ?hidden=${!showTitle}>${this.title}</h2>
        <p part="description" ?hidden=${!showDescription}>${this.description}</p>
        <slot></slot>
        <div part="extra" ?hidden=${!showExtra}>
          <slot name="extra" @slotchange=${this.onSlot}></slot>
          <slot name="action" @slotchange=${this.onSlot}></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-result": GkResult;
  }
}
