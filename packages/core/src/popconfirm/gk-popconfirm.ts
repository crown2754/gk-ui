import { LitElement, html, nothing, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { PropertyValues } from "lit";
import { falseableBoolean } from "../overlay/boolean.js";
import { collectFocusable, deepActiveElement, focusElement, trapTabKey } from "../overlay/focus.js";
import { computeOverlayPosition, type GkPlacement } from "../overlay/placement.js";
import { acquireScrollLock, releaseScrollLock } from "../overlay/scroll-lock.js";
import { overlayZ, registerBlockingOverlay } from "../overlay/stack.js";
import { popconfirmStyles } from "./gk-popconfirm.styles.js";

export type GkPopconfirmType = "default" | "warning" | "error";
export type GkPopconfirmCancelReason = "cancel" | "outside" | "escape";

let uid = 0;
type Registration = ReturnType<typeof registerBlockingOverlay>;

function english(el: HTMLElement) {
  return (el.ownerDocument?.documentElement?.lang || "").toLowerCase().startsWith("en");
}

function warningIcon() {
  return svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3 2 20h20L12 3z"></path><path d="M12 10v4M12 17h.01"></path></svg>`;
}

function errorIcon() {
  return svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"></circle><path d="M12 8v5M12 16h.01"></path></svg>`;
}

@customElement("gk-popconfirm")
export class GkPopconfirm extends LitElement {
  static styles = popconfirmStyles;

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  open = false;

  /** Alias of `open`. */
  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  show = false;

  @property()
  title = "";

  @property()
  content = "";

  /** Alias of `content`. */
  @property()
  message = "";

  @property({ reflect: true })
  placement: GkPlacement = "top";

  /** v1 is click only. Hover is ignored so a confirm cannot open by accident. */
  @property({ reflect: true })
  trigger = "click";

  @property({ reflect: true })
  type: GkPopconfirmType = "default";

  @property({ attribute: "ok-text" })
  okText = "";

  @property({ attribute: "cancel-text" })
  cancelText = "";

  @property({
    type: Boolean,
    reflect: true,
    attribute: "show-cancel",
    converter: falseableBoolean,
  })
  showCancel = true;

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  disabled = false;

  @property({
    type: Boolean,
    reflect: true,
    attribute: "show-arrow",
    converter: falseableBoolean,
  })
  showArrow = true;

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  mask = false;

  private readonly titleId = `gk-popconfirm-title-${++uid}`;
  private readonly contentId = `gk-popconfirm-content-${uid}`;
  private readonly panelId = `gk-popconfirm-panel-${uid}`;
  private registration: Registration | null = null;
  private level = 0;
  private isTop = false;
  private wasOpen = false;
  private shouldFocus = false;
  private shouldRestore = false;
  private restoreEl: HTMLElement | null = null;
  private scrollHeld = false;
  private listenersBound = false;
  private placed = false;

  private readonly onHostClick = (event: Event) => {
    if (this.disabled || this.trigger === "manual") return;
    const path = event.composedPath();
    const insideOverlay = path.some(
      (node) =>
        node instanceof Element &&
        (node.getAttribute("part") === "panel" || node.getAttribute("part") === "mask"),
    );
    if (insideOverlay) return;
    this.setOpen(!this.open);
  };

  private readonly onDocClick = (event: MouseEvent) => {
    if (!this.open) return;
    if (event.composedPath().includes(this)) return;
    this.dismiss("outside");
  };

  private readonly onDocKey = (event: KeyboardEvent) => {
    if (!this.open || !this.isTop) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      this.dismiss("escape");
      return;
    }
    if (event.key === "Tab") {
      const panel = this.shadowRoot?.querySelector("[part='panel']");
      if (panel) trapTabKey(panel, event);
    }
  };

  private readonly onReflow = () => {
    if (this.open) this.position();
  };

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this.onHostClick);
    document.addEventListener("keydown", this.onDocKey, true);
  }

  override disconnectedCallback() {
    this.removeEventListener("click", this.onHostClick);
    document.removeEventListener("keydown", this.onDocKey, true);
    this.unbindDismiss();
    this.releaseStack();
    this.holdScroll(false);
    this.wasOpen = false;
    super.disconnectedCallback();
  }

  protected override willUpdate(changed: PropertyValues) {
    // The first update lists every property, with previous values of undefined.
    if (!this.hasUpdated) {
      if (this.show && !this.open) this.open = true;
      else this.show = this.open;
    } else if (changed.has("show") && !changed.has("open")) this.open = this.show;
    else if (changed.has("open")) this.show = this.open;

    if (this.disabled && this.open) {
      this.open = false;
      this.show = false;
    }

    if (this.open && !this.wasOpen) {
      this.captureFocus();
      this.shouldFocus = true;
      this.placed = false;
      this.mountStack();
      this.holdScroll(this.mask);
    } else if (!this.open && this.wasOpen) {
      this.releaseStack();
      this.holdScroll(false);
      this.shouldRestore = true;
    } else if (this.open) {
      this.holdScroll(this.mask);
    }
    this.wasOpen = this.open;
  }

  protected override updated() {
    this.syncTrigger();
    this.syncPanel();
    if (this.open) {
      this.bindDismiss();
      this.position();
      this.registration?.setPanel(
        (this.shadowRoot?.querySelector("[part='panel']") as HTMLElement | null) ?? null,
      );
      if (this.shouldFocus) {
        this.shouldFocus = false;
        this.focusInitial();
      }
    } else {
      this.unbindDismiss();
      if (this.shouldRestore) {
        this.shouldRestore = false;
        this.restoreFocus();
      }
    }
  }

  private setOpen(next: boolean) {
    if (this.disabled && next) return;
    if (this.open === next) return;
    this.open = next;
    this.show = next;
    this.dispatchEvent(
      new CustomEvent("update:open", {
        detail: next,
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("update:show", {
        detail: next,
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent(next ? "open" : "close", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private dismiss(reason: "confirm" | GkPopconfirmCancelReason) {
    if (!this.open) return;
    if (reason === "confirm") {
      this.dispatchEvent(
        new CustomEvent("confirm", { bubbles: true, composed: true }),
      );
    } else {
      this.dispatchEvent(
        new CustomEvent("cancel", {
          detail: { reason },
          bubbles: true,
          composed: true,
        }),
      );
    }
    this.setOpen(false);
  }

  private onConfirm = (event: Event) => {
    event.stopPropagation();
    this.dismiss("confirm");
  };

  private onCancel = (event: Event) => {
    event.stopPropagation();
    this.dismiss("cancel");
  };

  private onMask = (event: Event) => {
    event.stopPropagation();
    this.dismiss("outside");
  };

  private captureFocus() {
    this.restoreEl = deepActiveElement();
  }

  private restoreFocus() {
    const el = this.restoreEl;
    this.restoreEl = null;
    if (el?.isConnected) el.focus();
    else this.triggerControl()?.focus();
  }

  private holdScroll(acquire: boolean) {
    if (acquire && !this.scrollHeld) {
      acquireScrollLock();
      this.scrollHeld = true;
    } else if (!acquire && this.scrollHeld) {
      releaseScrollLock();
      this.scrollHeld = false;
    }
  }

  private mountStack() {
    if (this.registration) return;
    this.registration = registerBlockingOverlay((isTop, level) => {
      this.isTop = isTop;
      this.level = level;
      if (this.hasUpdated) this.requestUpdate();
    });
    this.level = this.registration.level();
    this.isTop = this.registration.isTop();
  }

  private releaseStack() {
    if (!this.registration) return;
    this.registration.unregister();
    this.registration = null;
    this.isTop = false;
  }

  private bindDismiss() {
    if (this.listenersBound) return;
    document.addEventListener("click", this.onDocClick, true);
    window.addEventListener("resize", this.onReflow);
    window.addEventListener("scroll", this.onReflow, true);
    this.listenersBound = true;
  }

  private unbindDismiss() {
    if (!this.listenersBound) return;
    document.removeEventListener("click", this.onDocClick, true);
    window.removeEventListener("resize", this.onReflow);
    window.removeEventListener("scroll", this.onReflow, true);
    this.listenersBound = false;
  }

  private triggerEl() {
    const slot = this.shadowRoot?.querySelector("slot:not([name])") as HTMLSlotElement | null;
    return (slot?.assignedElements({ flatten: true })[0] as HTMLElement | undefined) ?? null;
  }

  private triggerControl() {
    const trigger = this.triggerEl();
    if (!trigger) return null;
    const inner = trigger.shadowRoot?.querySelector(
      "button, a, [role='button']",
    ) as HTMLElement | null;
    return inner ?? trigger;
  }

  private syncTrigger() {
    const nodes = [this.triggerEl(), this.triggerControl()].filter(
      (node, index, list): node is HTMLElement => Boolean(node) && list.indexOf(node) === index,
    );
    for (const node of nodes) {
      node.setAttribute("aria-haspopup", "dialog");
      node.setAttribute("aria-expanded", this.open ? "true" : "false");
      if (this.open) node.setAttribute("aria-controls", this.panelId);
      else node.removeAttribute("aria-controls");
      if (this.disabled) {
        node.setAttribute("aria-disabled", "true");
        node.setAttribute("data-gk-pop-disabled", "");
      } else if (node.hasAttribute("data-gk-pop-disabled")) {
        node.removeAttribute("aria-disabled");
        node.removeAttribute("data-gk-pop-disabled");
      }
    }
  }

  private syncPanel() {
    const panel = this.shadowRoot?.querySelector("[part='panel']") as HTMLElement | null;
    if (!panel) return;
    const showTitle = this.showTitle();
    const showContent = this.showContent();
    panel.id = this.panelId;
    panel.setAttribute("role", this.type === "error" ? "alertdialog" : "dialog");
    panel.hidden = !this.open;
    panel.setAttribute("aria-modal", this.mask ? "true" : "false");
    if (showTitle) {
      panel.setAttribute("aria-labelledby", this.titleId);
      panel.removeAttribute("aria-label");
    } else {
      panel.removeAttribute("aria-labelledby");
      panel.setAttribute("aria-label", english(this) ? "Confirm" : "確認");
    }
    if (showContent) panel.setAttribute("aria-describedby", this.contentId);
    else panel.removeAttribute("aria-describedby");
  }

  private position() {
    const panel = this.shadowRoot?.querySelector("[part='panel']") as HTMLElement | null;
    const trigger = this.triggerEl() ?? this;
    if (!panel || !this.open) return;
    const rect = trigger.getBoundingClientRect();
    const box = panel.getBoundingClientRect();
    const pos = computeOverlayPosition({
      trigger: {
        top: rect.top,
        left: rect.left,
        width: rect.width || trigger.offsetWidth,
        height: rect.height || trigger.offsetHeight,
      },
      panelWidth: box.width || panel.offsetWidth || 220,
      panelHeight: box.height || panel.offsetHeight || 96,
      viewportWidth: window.innerWidth || 800,
      viewportHeight: window.innerHeight || 600,
      placement: this.placement,
      gap: 10,
    });
    const z = overlayZ(this.level);
    panel.style.zIndex = String(z.panel);
    panel.style.top = `${pos.top}px`;
    panel.style.left = `${pos.left}px`;
    panel.dataset.placement = pos.placement;
    const mask = this.shadowRoot?.querySelector("[part='mask']") as HTMLElement | null;
    if (mask) mask.style.zIndex = String(z.mask);
    if (!this.placed) {
      this.placed = true;
      requestAnimationFrame(() => {
        if (this.open) this.position();
      });
    }
  }

  private focusInitial() {
    const panel = this.shadowRoot?.querySelector("[part='panel']") as HTMLElement | null;
    if (!panel) return;
    if (this.hasCustomFooter()) {
      const items = collectFocusable(panel);
      focusElement(items[0] ?? panel);
      if (!items.length) panel.focus();
      return;
    }
    const cancel = panel.querySelector("[part='cancel']") as HTMLElement | null;
    const ok = panel.querySelector("[part='ok']") as HTMLElement | null;
    const destructive = this.type === "warning" || this.type === "error";
    if (destructive && cancel) {
      focusElement(cancel);
      return;
    }
    focusElement(ok ?? cancel ?? panel);
  }

  private hasCustomFooter() {
    return [...this.children].some((node) => {
      const name = node.getAttribute("slot");
      return name === "footer" || name === "action";
    });
  }

  private showTitle() {
    if (this.type !== "default") return true;
    if (this.title.trim()) return true;
    return [...this.children].some((node) => node.getAttribute("slot") === "title");
  }

  private showContent() {
    if (this.content.trim() || this.message.trim()) return true;
    return [...this.children].some((node) => node.getAttribute("slot") === "content");
  }

  private okLabel() {
    if (this.okText.trim()) return this.okText;
    return english(this) ? "OK" : "確定";
  }

  private cancelLabel() {
    if (this.cancelText.trim()) return this.cancelText;
    return english(this) ? "Cancel" : "取消";
  }

  private bodyText() {
    return this.content || this.message;
  }

  override render() {
    const showTitle = this.showTitle();
    const showContent = this.showContent();
    const icon =
      this.type === "warning" ? warningIcon() : this.type === "error" ? errorIcon() : nothing;
    // Wrap so every binding is nested. happy-dom drops lit's `<?>` markers
    // when they are direct children of a <template>, which shifts later parts.
    return html`<div class="gk-popconfirm__root">
      <span part="trigger"><slot></slot></span>
      ${this.mask && this.open
        ? html`<div part="mask" @click=${this.onMask}></div>`
        : nothing}
      <div part="panel" tabindex="-1" hidden data-placement=${this.placement}>
        ${this.showArrow ? html`<span part="arrow" aria-hidden="true"></span>` : nothing}
        ${showTitle
          ? html`<p part="title" id=${this.titleId}>
              ${icon === nothing ? nothing : html`<span part="icon">${icon}</span>`}
              <slot name="title">${this.title}</slot>
            </p>`
          : nothing}
        ${showContent
          ? html`<div part="content" id=${this.contentId}>
              <slot name="content">${this.bodyText()}</slot>
            </div>`
          : html`<slot name="content" hidden></slot>`}
        <div part="footer">
          ${this.hasCustomFooter()
            ? nothing
            : html`<span class="gk-popconfirm__actions">
                ${this.showCancel
                  ? html`<button type="button" part="cancel" @click=${this.onCancel}>
                      ${this.cancelLabel()}
                    </button>`
                  : nothing}
                <button type="button" part="ok" @click=${this.onConfirm}>${this.okLabel()}</button>
              </span>`}
          <slot name="footer"></slot>
          <slot name="action"></slot>
        </div>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-popconfirm": GkPopconfirm;
  }
}
