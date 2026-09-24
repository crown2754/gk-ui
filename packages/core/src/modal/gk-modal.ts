import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { falseableBoolean } from "../overlay/boolean.js";
import { collectFocusable, focusElement, trapTabKey } from "../overlay/focus.js";
import { toCssSize } from "../overlay/placement.js";
import { acquireScrollLock, releaseScrollLock } from "../overlay/scroll-lock.js";
import { overlayZ, registerBlockingOverlay } from "../overlay/stack.js";
import { modalStyles } from "./gk-modal.styles.js";

export type GkModalPreset = "dialog" | "card" | "";
export type GkModalConfirmVariant = "primary" | "danger";

let uid = 0;

function modalWidth(value: string | number) {
  const raw = String(value);
  if (raw === "sm") return "400px";
  if (raw === "lg") return "720px";
  if (raw === "md" || raw === "") return "520px";
  return toCssSize(raw, "520px");
}

type Registration = ReturnType<typeof registerBlockingOverlay>;

@customElement("gk-modal")
export class GkModal extends LitElement {
  static styles = modalStyles;

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  open = false;

  @property()
  title = "";

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  closable = true;

  @property({
    type: Boolean,
    reflect: true,
    attribute: "mask-closable",
    converter: falseableBoolean,
  })
  maskClosable = true;

  @property({ reflect: true })
  preset: GkModalPreset = "";

  @property({ reflect: true })
  width: string | number = "md";

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  loading = false;

  /** Dialog preset primary action. `danger` uses the danger fill from the approved mock. */
  @property({ reflect: true, attribute: "confirm-variant" })
  confirmVariant: GkModalConfirmVariant = "primary";

  @property({ attribute: "confirm-text" })
  confirmText = "Confirm";

  @property({ attribute: "cancel-text" })
  cancelText = "Cancel";

  @state()
  private footerAssigned = false;

  private readonly titleId = `gk-modal-title-${++uid}`;
  private registration: Registration | null = null;
  private level = 0;
  private isTop = false;
  private restoreEl: HTMLElement | null = null;
  private pendingRestore: HTMLElement | null | undefined = undefined;
  private scrollHeld = false;

  private readonly onDocKey = (event: KeyboardEvent) => {
    if (!this.open || !this.isTop) return;
    if (event.key === "Escape") {
      if (!this.closable) return;
      event.preventDefault();
      this.dismiss();
      return;
    }
    if (event.key === "Tab" && this.shadowRoot) {
      trapTabKey(this.shadowRoot, event);
    }
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this.onDocKey, true);
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this.onDocKey, true);
    this.releaseStack();
    super.disconnectedCallback();
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (!changed.has("open")) return;
    if (this.open && !this.registration) {
      this.captureRestore();
      this.registration = registerBlockingOverlay((isTop, level) => {
        this.isTop = isTop;
        this.level = level;
        this.registration?.setPanel(
          (this.shadowRoot?.querySelector("[part='panel']") as HTMLElement | null) ?? null,
        );
        this.requestUpdate();
      });
      this.isTop = this.registration.isTop();
      this.level = this.registration.level();
      this.holdScroll();
    } else if (!this.open && this.registration) {
      const previous = this.registration.unregister();
      this.registration = null;
      this.isTop = false;
      this.pendingRestore = previous;
      this.holdScroll(false);
    }
  }

  protected updated(changed: Map<string, unknown>) {
    const panel = this.shadowRoot?.querySelector("[part='panel']") as HTMLElement | null;
    this.registration?.setPanel(panel);
    this.syncFooter();
    if (changed.has("open") && this.open && this.isTop) this.focusInitial();
    if (changed.has("open") && !this.open && this.pendingRestore !== undefined) {
      const previous = this.pendingRestore;
      this.pendingRestore = undefined;
      if (previous?.isConnected) previous.focus();
      else this.restoreEl?.focus();
      this.restoreEl = null;
    }
  }

  private captureRestore() {
    const active = document.activeElement;
    if (
      active instanceof HTMLElement &&
      active !== document.body &&
      active !== document.documentElement
    ) {
      this.restoreEl = active;
    } else {
      this.restoreEl = null;
    }
  }

  private holdScroll(acquire = true) {
    if (acquire && !this.scrollHeld) {
      acquireScrollLock();
      this.scrollHeld = true;
    } else if (!acquire && this.scrollHeld) {
      releaseScrollLock();
      this.scrollHeld = false;
    }
  }

  private releaseStack() {
    if (this.registration) {
      this.registration.unregister();
      this.registration = null;
    }
    this.holdScroll(false);
  }

  private focusInitial() {
    const root = this.shadowRoot;
    if (!root) return;
    if (this.preset === "dialog") {
      const confirm = root.querySelector("[part='confirm']") as HTMLElement | null;
      if (confirm) {
        focusElement(confirm);
        return;
      }
    }
    const items = collectFocusable(root);
    focusElement(items[0] ?? (root.querySelector("[part='panel']") as HTMLElement | null));
  }

  private dismiss() {
    if (!this.open) return;
    this.open = false;
    this.dispatchEvent(
      new CustomEvent("update:open", {
        detail: false,
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("close", { bubbles: true, composed: true }),
    );
  }

  private onConfirm = () => {
    if (this.loading) return;
    this.dispatchEvent(
      new CustomEvent("confirm", { bubbles: true, composed: true }),
    );
  };

  private onMaskClick = (event: Event) => {
    if (event.target !== event.currentTarget) return;
    if (!this.isTop || !this.maskClosable) return;
    this.dismiss();
  };

  private syncFooter() {
    const slot = this.shadowRoot?.querySelector(
      "slot[name='footer']",
    ) as HTMLSlotElement | null;
    const assigned = Boolean(
      slot?.assignedNodes({ flatten: true }).some((node) => {
        return node.nodeType === Node.ELEMENT_NODE || Boolean(node.textContent?.trim());
      }),
    );
    if (assigned !== this.footerAssigned) this.footerAssigned = assigned;
    const footer = this.shadowRoot?.querySelector("[part='footer']") as HTMLElement | null;
    if (footer) footer.hidden = !assigned && !(this.preset === "dialog" && !assigned);
  }

  private onFooterSlot = () => {
    this.syncFooter();
  };

  private get showDefaultFooter() {
    return this.preset === "dialog" && !this.footerAssigned;
  }

  render() {
    if (!this.open) return html``;
    const z = overlayZ(this.level);
    const showHeader = Boolean(this.title) || this.closable;
    return html`
      <div
        part="mask"
        style=${styleMap({ zIndex: String(z.mask) })}
        @click=${this.onMaskClick}
      ></div>
      <div
        part="panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby=${this.title ? this.titleId : nothing}
        tabindex="-1"
        data-preset=${this.preset || nothing}
        style=${styleMap({
          zIndex: String(z.panel),
          "--gk-modal-width": modalWidth(this.width),
        })}
      >
        ${showHeader
          ? html`
              <div part="header">
                <slot name="header"></slot>
                ${this.title
                  ? html`<h2 part="title" id=${this.titleId}>${this.title}</h2>`
                  : nothing}
                ${this.closable
                  ? html`<button
                      type="button"
                      part="close"
                      aria-label="Close"
                      @click=${this.dismiss}
                    >
                      ×
                    </button>`
                  : nothing}
              </div>
            `
          : nothing}
        <div part="body"><slot></slot></div>
        <div part="footer" ?hidden=${!this.showDefaultFooter && !this.footerAssigned}>
          <slot name="footer" @slotchange=${this.onFooterSlot}></slot>
          ${this.showDefaultFooter
            ? html`
                <button
                  type="button"
                  part="cancel"
                  ?disabled=${this.loading}
                  @click=${this.dismiss}
                >
                  ${this.cancelText}
                </button>
                <button
                  type="button"
                  part="confirm"
                  data-variant=${this.confirmVariant}
                  ?disabled=${this.loading}
                  @click=${this.onConfirm}
                >
                  ${this.loading
                    ? html`<span part="spinner" aria-hidden="true"></span>`
                    : nothing}
                  ${this.confirmText}
                </button>
              `
            : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-modal": GkModal;
  }
}
