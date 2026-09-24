import { LitElement, html, nothing, render } from "lit";
import { customElement, property } from "lit/decorators.js";
import { falseableBoolean } from "../overlay/boolean.js";
import {
  computeOverlayPosition,
  type GkPlacement,
} from "../overlay/placement.js";
import { tooltipStyles } from "./gk-tooltip.styles.js";

let uid = 0;

function parseDelay(value: number | string | null | undefined): {
  show: number;
  hide: number;
} {
  if (Array.isArray(value)) {
    return { show: Number(value[0]) || 0, hide: Number(value[1]) || 0 };
  }
  const raw = String(value ?? "200");
  if (raw.includes(",")) {
    const [show, hide] = raw.split(",").map((part) => Number(part.trim()));
    return {
      show: Number.isFinite(show) ? show : 200,
      hide: Number.isFinite(hide) ? hide : 100,
    };
  }
  const show = Number(raw);
  return { show: Number.isFinite(show) ? show : 200, hide: 100 };
}

@customElement("gk-tooltip")
export class GkTooltip extends LitElement {
  static styles = tooltipStyles;

  @property()
  content = "";

  @property({ reflect: true })
  placement: GkPlacement = "top";

  /** Space-separated: `hover`, `focus`, or `hover focus`. */
  @property({ reflect: true })
  trigger = "hover focus";

  @property({ reflect: true, converter: falseableBoolean })
  arrow = true;

  /** Alias of `arrow` for the `show-arrow` attribute. */
  @property({ attribute: "show-arrow", converter: falseableBoolean })
  showArrow = true;

  @property()
  delay: number | string = 200;

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  disabled = false;

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  show = false;

  private readonly instanceId = `gk-tooltip-${++uid}`;
  private showTimer = 0;
  private hideTimer = 0;
  private readonly onEnter = () => this.schedule(true, "hover");
  private readonly onLeave = () => this.schedule(false, "hover");
  private readonly onFocusIn = () => this.schedule(true, "focus");
  private readonly onFocusOut = () => this.schedule(false, "focus");
  private readonly onKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && this.show) {
      event.stopPropagation();
      this.clearTimers();
      this.setShow(false);
    }
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("mouseenter", this.onEnter);
    this.addEventListener("mouseleave", this.onLeave);
    this.addEventListener("focusin", this.onFocusIn);
    this.addEventListener("focusout", this.onFocusOut);
    this.addEventListener("keydown", this.onKeydown);
  }

  disconnectedCallback() {
    this.clearTimers();
    this.removeEventListener("mouseenter", this.onEnter);
    this.removeEventListener("mouseleave", this.onLeave);
    this.removeEventListener("focusin", this.onFocusIn);
    this.removeEventListener("focusout", this.onFocusOut);
    this.removeEventListener("keydown", this.onKeydown);
    super.disconnectedCallback();
  }

  protected updated() {
    const outlet = this.shadowRoot?.querySelector("#gk-tooltip-outlet") as HTMLElement | null;
    if (outlet) render(this.show ? this.tipTemplate() : nothing, outlet);
    this.syncDescribedBy();
    if (this.show) this.positionTip();
  }

  private wants(kind: "hover" | "focus") {
    return this.trigger.toLowerCase().includes(kind);
  }

  private clearTimers() {
    window.clearTimeout(this.showTimer);
    window.clearTimeout(this.hideTimer);
    this.showTimer = 0;
    this.hideTimer = 0;
  }

  private schedule(next: boolean, kind: "hover" | "focus") {
    if (this.disabled && next) return;
    if (next && !this.wants(kind)) return;
    if (!next && kind === "hover" && this.wants("focus") && this.matches(":focus-within")) {
      return;
    }
    if (!next && kind === "focus" && this.wants("hover") && this.matches(":hover")) {
      return;
    }
    this.clearTimers();
    const { show, hide } = parseDelay(this.delay);
    const wait = next ? show : hide;
    const timer = window.setTimeout(() => this.setShow(next), wait);
    if (next) this.showTimer = timer;
    else this.hideTimer = timer;
  }

  private setShow(next: boolean) {
    if (this.disabled && next) return;
    if (this.show === next) return;
    this.show = next;
    this.dispatchEvent(
      new CustomEvent("update:show", {
        detail: next,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private triggerEl() {
    const slot = this.shadowRoot?.querySelector(
      "slot:not([name])",
    ) as HTMLSlotElement | null;
    return (slot?.assignedElements({ flatten: true })[0] as HTMLElement | undefined) ?? null;
  }

  private syncDescribedBy() {
    const trigger = this.triggerEl();
    if (!trigger) return;
    const id = `${this.instanceId}-tip`;
    if (this.show) trigger.setAttribute("aria-describedby", id);
    else trigger.removeAttribute("aria-describedby");
  }

  private positionTip() {
    const tip = this.shadowRoot?.querySelector("[part='tip']") as HTMLElement | null;
    const trigger = this.triggerEl() ?? this;
    if (!tip) return;
    const rect = trigger.getBoundingClientRect();
    const panel = tip.getBoundingClientRect();
    const pos = computeOverlayPosition({
      trigger: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
      panelWidth: panel.width || tip.offsetWidth || 80,
      panelHeight: panel.height || tip.offsetHeight || 28,
      viewportWidth: window.innerWidth || 800,
      viewportHeight: window.innerHeight || 600,
      placement: this.placement,
      gap: 10,
    });
    tip.style.top = `${pos.top}px`;
    tip.style.left = `${pos.left}px`;
    tip.dataset.placement = pos.placement;
  }

  private get arrowVisible() {
    return this.arrow && this.showArrow;
  }

  private tipTemplate() {
    const id = `${this.instanceId}-tip`;
    const arrow = this.arrowVisible
      ? html`<span part="arrow" aria-hidden="true"></span>`
      : null;
    return html`<div part="tip" role="tooltip" id=${id}>
      <slot name="content">${this.content}</slot>
      ${arrow}
    </div>`;
  }

  render() {
    return html`<span part="trigger"><slot></slot></span><div id="gk-tooltip-outlet"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-tooltip": GkTooltip;
  }
}
