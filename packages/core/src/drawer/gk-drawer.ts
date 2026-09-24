import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { falseableBoolean } from "../overlay/boolean.js";
import { collectFocusable, focusElement, trapTabKey } from "../overlay/focus.js";
import { toCssSize } from "../overlay/placement.js";
import { acquireScrollLock, releaseScrollLock } from "../overlay/scroll-lock.js";
import { overlayZ, registerBlockingOverlay } from "../overlay/stack.js";
import { drawerStyles } from "./gk-drawer.styles.js";

export type GkDrawerPlacement = "left" | "right" | "top" | "bottom";

let uid = 0;

type Registration = ReturnType<typeof registerBlockingOverlay>;

@customElement("gk-drawer")
export class GkDrawer extends LitElement {
  static styles = drawerStyles;

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  open = false;

  @property()
  title = "";

  @property({ reflect: true })
  placement: GkDrawerPlacement = "right";

  @property({ reflect: true })
  width: string | number = "400";

  @property({ reflect: true })
  height: string | number = "40vh";

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  closable = true;

  @property({
    type: Boolean,
    reflect: true,
    attribute: "mask-closable",
    converter: falseableBoolean,
  })
  maskClosable = true;

  @property({
    type: Boolean,
    reflect: true,
    attribute: "show-mask",
    converter: falseableBoolean,
  })
  showMask = true;

  @state()
  private footerAssigned = false;

  private readonly titleId = `gk-drawer-title-${++uid}`;
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
    if (event.key === "Tab" && this.shadowRoot) trapTabKey(this.shadowRoot, event);
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
      const active = document.activeElement;
      this.restoreEl =
        active instanceof HTMLElement &&
        active !== document.body &&
        active !== document.documentElement
          ? active
          : null;
      this.registration = registerBlockingOverlay((isTop, level) => {
        this.isTop = isTop;
        this.level = level;
        this.requestUpdate();
      });
      this.isTop = this.registration.isTop();
      this.level = this.registration.level();
      this.holdScroll();
    } else if (!this.open && this.registration) {
      this.pendingRestore = this.registration.unregister();
      this.registration = null;
      this.isTop = false;
      this.holdScroll(false);
    }
  }

  protected updated(changed: Map<string, unknown>) {
    const z = overlayZ(this.level);
    const mask = this.shadowRoot?.querySelector("[part='mask']") as HTMLElement | null;
    const panel = this.shadowRoot?.querySelector("[part='panel']") as HTMLElement | null;
    if (mask) mask.style.zIndex = String(z.mask);
    if (panel) {
      panel.style.zIndex = String(z.panel);
      panel.style.setProperty("--gk-drawer-width", toCssSize(this.width, "400px"));
      panel.style.setProperty("--gk-drawer-height", toCssSize(this.height, "40vh"));
      panel.setAttribute("aria-modal", this.showMask ? "true" : "false");
      panel.dataset.placement = this.placement || "right";
      if (this.title) panel.setAttribute("aria-labelledby", this.titleId);
      else panel.removeAttribute("aria-labelledby");
    }
    const title = this.shadowRoot?.querySelector("[part='title']") as HTMLElement | null;
    if (title) {
      title.id = this.titleId;
      title.textContent = this.title;
      title.hidden = !this.title;
    }
    const close = this.shadowRoot?.querySelector("[part='close']") as HTMLElement | null;
    if (close) close.hidden = !this.closable;
    this.syncFooter();
    this.syncMask(z.mask);
    this.registration?.setPanel(panel);
    if (changed.has("open") && this.open && this.isTop) {
      const root = this.shadowRoot;
      if (root) {
        const items = collectFocusable(root);
        focusElement(items[0] ?? panel);
      }
    }
    if (changed.has("open") && !this.open && this.pendingRestore !== undefined) {
      const previous = this.pendingRestore;
      this.pendingRestore = undefined;
      if (previous?.isConnected) previous.focus();
      else this.restoreEl?.focus();
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
    this.dispatchEvent(new CustomEvent("close", { bubbles: true, composed: true }));
  }

  private onMaskClick = (event: Event) => {
    if (event.target !== event.currentTarget) return;
    if (!this.isTop || !this.maskClosable) return;
    this.dismiss();
  };

  private footerHasContent(slot: HTMLSlotElement | null) {
    return Boolean(
      slot?.assignedNodes({ flatten: true }).some((node) => {
        return node.nodeType === Node.ELEMENT_NODE || Boolean(node.textContent?.trim());
      }),
    );
  }

  private syncFooter() {
    const slot = this.shadowRoot?.querySelector(
      "slot[name='footer']",
    ) as HTMLSlotElement | null;
    const footer = this.shadowRoot?.querySelector("[part='footer']") as HTMLElement | null;
    const assigned = this.footerHasContent(slot);
    this.footerAssigned = assigned;
    if (footer) footer.hidden = !assigned;
  }

  private onFooterSlot = () => {
    this.syncFooter();
  };

  private syncMask(zIndex: number) {
    const root = this.shadowRoot;
    if (!root) return;
    let mask = root.querySelector("[part='mask']") as HTMLElement | null;
    if (!this.open || !this.showMask) {
      mask?.remove();
      return;
    }
    if (!mask) {
      mask = document.createElement("div");
      mask.setAttribute("part", "mask");
      mask.addEventListener("click", this.onMaskClick);
      root.prepend(mask);
    }
    mask.style.zIndex = String(zIndex);
  }

  render() {
    if (!this.open) return html``;
    return html`
      <div part="panel" role="dialog" tabindex="-1">
        <div part="header">
          <slot name="header"></slot>
          <h2 part="title"></h2>
          <button type="button" part="close" aria-label="Close" @click=${this.dismiss}>×</button>
        </div>
        <div part="body"><slot></slot></div>
        <div part="footer" hidden>
          <slot name="footer" @slotchange=${this.onFooterSlot}></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-drawer": GkDrawer;
  }
}
