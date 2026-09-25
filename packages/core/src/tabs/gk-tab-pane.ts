import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * Panel child of `gk-tabs`. The label is `tab` (or the `label` alias) or a `tab` slot.
 */
@customElement("gk-tab-pane")
export class GkTabPane extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  @property({ reflect: true })
  name = "";

  @property()
  tab = "";

  /** Alias of `tab`. Prefer `tab` in docs. */
  @property()
  label = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  private observer?: MutationObserver;

  /** Visible label. `tab` wins over `label`. */
  get text(): string {
    return this.tab || this.label || this.name;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.observer = new MutationObserver(() => this.notify());
    this.observer.observe(this, { childList: true, subtree: true });
  }

  override disconnectedCallback() {
    this.observer?.disconnect();
    super.disconnectedCallback();
  }

  protected override updated(changed: Map<string, unknown>) {
    if (
      changed.has("tab") ||
      changed.has("label") ||
      changed.has("name") ||
      changed.has("disabled")
    ) {
      this.notify();
    }
  }

  private notify() {
    this.dispatchEvent(new Event("gk-pane-change"));
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-tab-pane": GkTabPane;
  }
}
