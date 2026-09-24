import { LitElement, html, nothing, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { falseableBoolean } from "../overlay/boolean.js";
import {
  computeOverlayPosition,
  type GkPlacement,
} from "../overlay/placement.js";
import { dropdownStyles } from "./gk-dropdown.styles.js";
import type { GkDropdownItem } from "./gk-dropdown-item.js";

export type GkDropdownSize = "sm" | "md" | "lg";
export type GkDropdownTrigger = "click" | "hover" | "manual";

let uid = 0;

@customElement("gk-dropdown")
export class GkDropdown extends LitElement {
  static styles = dropdownStyles;

  @property()
  label = "";

  @property({ reflect: true })
  placement: GkPlacement = "bottom-start";

  @property({ reflect: true })
  trigger: GkDropdownTrigger = "click";

  @property({ reflect: true })
  size: GkDropdownSize = "md";

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  disabled = false;

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  open = false;

  private readonly menuId = `gk-dropdown-${++uid}`;
  private activeIndex = 0;
  private listenersBound = false;
  private hoverTimer = 0;

  private readonly onHostClick = (event: Event) => {
    if (this.disabled || this.trigger !== "click") return;
    const path = event.composedPath();
    if (path.some((node) => node instanceof Element && node.localName === "gk-dropdown-item")) {
      return;
    }
    this.setOpen(!this.open);
  };

  private readonly onHostKeydown = (event: KeyboardEvent) => {
    if (this.disabled) return;
    if (event.key === "Escape" && this.open) {
      event.preventDefault();
      this.setOpen(false);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!this.open) {
        this.setOpen(true);
        return;
      }
      this.move(event.key === "ArrowDown" ? 1 : -1);
      return;
    }
    if ((event.key === "Home" || event.key === "End") && this.open) {
      event.preventDefault();
      const items = this.selectable();
      if (!items.length) return;
      this.activeIndex = event.key === "Home" ? 0 : items.length - 1;
      this.markActive();
      return;
    }
    if ((event.key === "Enter" || event.key === " ") && this.open) {
      const item = this.selectable()[this.activeIndex];
      if (!item) return;
      event.preventDefault();
      this.choose(item);
    }
  };

  private readonly onItemSelect = (event: Event) => {
    const detail = (event as CustomEvent<{ key: string; item: GkDropdownItem }>).detail;
    if (!detail?.item || detail.item.disabled || detail.item.type === "divider") return;
    const index = this.selectable().indexOf(detail.item);
    if (index >= 0) this.activeIndex = index;
    this.choose(detail.item);
  };

  private readonly onDocClick = (event: MouseEvent) => {
    if (!this.open) return;
    const path = event.composedPath();
    if (path.includes(this)) return;
    this.setOpen(false);
  };

  private readonly onDocKey = (event: KeyboardEvent) => {
    if (!this.open || event.key !== "Escape") return;
    this.setOpen(false);
  };

  private readonly onEnter = () => {
    if (this.trigger !== "hover" || this.disabled) return;
    window.clearTimeout(this.hoverTimer);
    this.setOpen(true);
  };

  private readonly onLeave = () => {
    if (this.trigger !== "hover") return;
    window.clearTimeout(this.hoverTimer);
    this.hoverTimer = window.setTimeout(() => this.setOpen(false), 100);
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this.onHostClick);
    this.addEventListener("gk-item-select", this.onItemSelect as EventListener);
    this.addEventListener("mouseenter", this.onEnter);
    this.addEventListener("mouseleave", this.onLeave);
    if (this.open) this.bindDismiss();
  }

  disconnectedCallback() {
    this.unbindDismiss();
    window.clearTimeout(this.hoverTimer);
    this.removeEventListener("click", this.onHostClick);
    this.removeEventListener("gk-item-select", this.onItemSelect as EventListener);
    this.removeEventListener("mouseenter", this.onEnter);
    this.removeEventListener("mouseleave", this.onLeave);
    super.disconnectedCallback();
  }

  protected updated() {
    this.syncTriggerAria();
    if (this.open) {
      this.positionMenu();
      void this.markActiveSoon();
      this.bindDismiss();
    }
  }

  private setOpen(next: boolean) {
    if (this.disabled && next) return;
    if (this.open === next) return;
    this.open = next;
    if (next) this.activeIndex = 0;
    this.dispatchEvent(
      new CustomEvent("update:open", {
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
    if (next) this.bindDismiss();
    else this.unbindDismiss();
  }

  private choose(item: GkDropdownItem) {
    this.dispatchEvent(
      new CustomEvent("select", {
        detail: { key: item.itemKey, item },
        bubbles: true,
        composed: true,
      }),
    );
    this.setOpen(false);
  }

  private items(): GkDropdownItem[] {
    const slot = this.shadowRoot?.querySelector(
      "slot:not([name])",
    ) as HTMLSlotElement | null;
    const assigned = slot?.assignedElements({ flatten: true });
    const nodes = assigned?.length ? assigned : [...this.children];
    return nodes.filter(
      (node): node is GkDropdownItem => node.localName === "gk-dropdown-item",
    );
  }

  private selectable() {
    return this.items().filter((item) => item.type !== "divider" && !item.disabled);
  }

  private move(dir: number) {
    const items = this.selectable();
    if (!items.length) return;
    this.activeIndex = (this.activeIndex + dir + items.length) % items.length;
    this.markActive();
  }

  private async markActiveSoon() {
    await Promise.all(this.items().map((item) => item.updateComplete));
    if (this.open) this.markActive();
  }

  private markActive() {
    const items = this.selectable();
    const current = items[this.activeIndex];
    for (const item of this.items()) {
      item.active = item === current;
    }
    const menu = this.shadowRoot?.querySelector("[part='menu']");
    if (menu) {
      if (current) menu.setAttribute("aria-activedescendant", current.itemId);
      else menu.removeAttribute("aria-activedescendant");
    }
  }

  private triggerControl() {
    const slot = this.shadowRoot?.querySelector(
      "slot[name='trigger']",
    ) as HTMLSlotElement | null;
    const assigned = slot?.assignedElements({ flatten: true })[0] as HTMLElement | undefined;
    return (
      assigned ??
      (this.shadowRoot?.querySelector(".gk-dropdown__fallback") as HTMLElement | null)
    );
  }

  private syncTriggerAria() {
    const trigger = this.triggerControl();
    if (!trigger) return;
    trigger.setAttribute("aria-haspopup", "menu");
    trigger.setAttribute("aria-expanded", this.open ? "true" : "false");
    if (this.open) trigger.setAttribute("aria-controls", this.menuId);
    else trigger.removeAttribute("aria-controls");
    if (this.disabled) trigger.setAttribute("aria-disabled", "true");
  }

  private positionMenu() {
    const menu = this.shadowRoot?.querySelector("[part='menu']") as HTMLElement | null;
    const trigger = this.triggerControl();
    if (!menu || !trigger || !this.open) return;
    const rect = trigger.getBoundingClientRect();
    const panel = menu.getBoundingClientRect();
    const pos = computeOverlayPosition({
      trigger: {
        top: rect.top,
        left: rect.left,
        width: rect.width || trigger.offsetWidth,
        height: rect.height || trigger.offsetHeight,
      },
      panelWidth: panel.width || menu.offsetWidth || 180,
      panelHeight: panel.height || menu.offsetHeight || 40,
      viewportWidth: window.innerWidth || 800,
      viewportHeight: window.innerHeight || 600,
      placement: this.placement,
      gap: 4,
    });
    menu.style.top = `${pos.top}px`;
    menu.style.left = `${pos.left}px`;
    menu.dataset.placement = pos.placement;
  }

  private bindDismiss() {
    if (this.listenersBound) return;
    document.addEventListener("click", this.onDocClick, true);
    document.addEventListener("keydown", this.onDocKey, true);
    this.listenersBound = true;
  }

  private unbindDismiss() {
    if (!this.listenersBound) return;
    document.removeEventListener("click", this.onDocClick, true);
    document.removeEventListener("keydown", this.onDocKey, true);
    this.listenersBound = false;
  }

  private chevron() {
    return svg`
      <svg class="gk-dropdown__chevron" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M4.2 6.2 8 10l3.8-3.8 1.2 1.2L8 12.4 3 7.4z" />
      </svg>
    `;
  }

  render() {
    return html`
      <div part="trigger" @keydown=${this.onHostKeydown}>
        <slot name="trigger">
          <button type="button" class="gk-dropdown__fallback" ?disabled=${this.disabled}>
            <span>${this.label}</span>
            ${this.chevron()}
          </button>
        </slot>
      </div>
      <div
        part="menu"
        id=${this.menuId}
        role="menu"
        ?hidden=${!this.open}
        aria-labelledby=${this.triggerControl()?.id || nothing}
      >
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-dropdown": GkDropdown;
  }
}
