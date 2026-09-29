import { LitElement, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { stepStyles } from "./gk-steps.styles.js";

export type GkStepStatus = "wait" | "process" | "finish" | "error";
export type GkStepsDirection = "horizontal" | "vertical";
export type GkStepsSize = "sm" | "md" | "lg";

function english(el: HTMLElement) {
  return (el.ownerDocument?.documentElement?.lang || "").toLowerCase().startsWith("en");
}

function statusWord(status: GkStepStatus, en: boolean) {
  if (en) {
    if (status === "process") return "in progress";
    if (status === "finish") return "finished";
    if (status === "error") return "error";
    return "waiting";
  }
  if (status === "process") return "進行中";
  if (status === "finish") return "已完成";
  if (status === "error") return "錯誤";
  return "等待";
}

function checkIcon() {
  return svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 13l4 4L19 7"></path></svg>`;
}

function errorIcon() {
  return svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"></circle><path d="M12 8v5M12 16h.01"></path></svg>`;
}

@customElement("gk-step")
export class GkStep extends LitElement {
  static styles = stepStyles;

  @property()
  title = "";

  @property()
  description = "";

  /** Explicit status. Empty lets `gk-steps` derive it from `current`. */
  @property()
  status: GkStepStatus | "" = "";

  @property({ reflect: true })
  direction: GkStepsDirection = "horizontal";

  @property({ reflect: true })
  size: GkStepsSize = "md";

  @property({ type: Number })
  position = 0;

  /** Resolved status written by `gk-steps` and reflected for styling. */
  @property({ reflect: true, attribute: "data-status" })
  view: GkStepStatus = "wait";

  @property({ type: Boolean, reflect: true })
  tail = false;

  @property({ type: Boolean, reflect: true, attribute: "clickable" })
  canActivate = false;

  @property({ type: Boolean })
  markCurrent = false;

  @state()
  private iconSlotted = false;

  @state()
  private descriptionSlotted = false;

  protected override willUpdate() {
    const owner = this.owner();
    if (!owner) return;
    const steps = owner.steps?.() ?? [];
    const index = steps.indexOf(this);
    if (index < 0) return;
    const current = Math.min(Math.max(0, owner.current), Math.max(0, steps.length - 1));
    const view = this.status
      ? this.status
      : index < current
        ? "finish"
        : index === current
          ? owner.status
          : "wait";
    this.position = index;
    this.view = view;
    this.direction = owner.direction;
    this.size = owner.size;
    this.tail = index === steps.length - 1;
    this.canActivate = owner.clickable && index < current;
    this.markCurrent = index === current;
  }

  private owner() {
    const root = this.getRootNode();
    const host = (root instanceof ShadowRoot ? root.host : this.parentElement) as
      | (HTMLElement & {
          current: number;
          status: GkStepStatus;
          direction: GkStepsDirection;
          size: GkStepsSize;
          clickable: boolean;
          steps?: () => GkStep[];
        })
      | null;
    if (!host || host.localName !== "gk-steps" || typeof host.steps !== "function") return null;
    return host;
  }

  private readonly onKeyDown = (event: KeyboardEvent) => {
    if (!this.canActivate) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    this.activate();
  };

  private readonly onClick = () => {
    if (!this.canActivate) return;
    this.activate();
  };

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this.onClick);
    this.addEventListener("keydown", this.onKeyDown);
  }

  override disconnectedCallback() {
    this.removeEventListener("click", this.onClick);
    this.removeEventListener("keydown", this.onKeyDown);
    super.disconnectedCallback();
  }

  protected override updated() {
    this.setAttribute("role", "listitem");
    if (this.markCurrent) this.setAttribute("aria-current", "step");
    else this.removeAttribute("aria-current");
    this.setAttribute("aria-label", this.accessibleName());
    if (this.canActivate) this.tabIndex = 0;
    else this.removeAttribute("tabindex");
  }

  private activate() {
    this.dispatchEvent(
      new CustomEvent("gk-step-activate", {
        detail: { index: this.position },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private titleText() {
    const named = this.shadowRoot?.querySelector(
      "slot[name='title']",
    ) as HTMLSlotElement | null;
    const fromSlot = named
      ?.assignedNodes({ flatten: true })
      .map((node) => node.textContent ?? "")
      .join("")
      .trim();
    if (fromSlot) return fromSlot;
    const fallback = this.shadowRoot?.querySelector("slot:not([name])") as HTMLSlotElement | null;
    const fromDefault = fallback
      ?.assignedNodes({ flatten: true })
      .map((node) => node.textContent ?? "")
      .join("")
      .trim();
    return this.title.trim() || fromDefault || "";
  }

  private accessibleName() {
    const en = english(this);
    const n = this.position + 1;
    const title = this.titleText();
    const state = statusWord(this.view, en);
    if (en) return title ? `Step ${n}, ${state}: ${title}` : `Step ${n}, ${state}`;
    return title ? `步驟 ${n}，${state}：${title}` : `步驟 ${n}，${state}`;
  }

  private onIcon = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    this.iconSlotted = slot
      .assignedNodes({ flatten: true })
      .some(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE || Boolean(node.textContent?.trim()),
      );
  };

  private onDescription = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    this.descriptionSlotted = slot
      .assignedNodes({ flatten: true })
      .some(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE || Boolean(node.textContent?.trim()),
      );
  };

  private glyph() {
    if (this.iconSlotted) return nothing;
    if (this.view === "finish") return checkIcon();
    if (this.view === "error") return errorIcon();
    return String(this.position + 1);
  }

  override render() {
    const showDescription = Boolean(this.description.trim()) || this.descriptionSlotted;
    return html`
      <div part="item" aria-hidden="true">
        <div part="head">
          <span part="indicator" aria-hidden="true">
            <slot name="icon" @slotchange=${this.onIcon}></slot>
            ${this.glyph()}
          </span>
          <span part="connector" aria-hidden="true"></span>
        </div>
        <div part="main">
          <p part="title"><slot name="title">${this.title}</slot></p>
          <p part="description" ?hidden=${!showDescription}>
            <slot name="description" @slotchange=${this.onDescription}>${this.description}</slot>
          </p>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-step": GkStep;
  }
}
