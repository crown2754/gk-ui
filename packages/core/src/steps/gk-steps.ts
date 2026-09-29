import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { falseableBoolean } from "../overlay/boolean.js";
import { stepsStyles } from "./gk-steps.styles.js";
import {
  GkStep,
  type GkStepStatus,
  type GkStepsDirection,
  type GkStepsSize,
} from "./gk-step.js";

export type GkStepItem = {
  title: string;
  description?: string;
  status?: GkStepStatus;
  key?: string;
};

export type { GkStepStatus, GkStepsDirection, GkStepsSize };

const STATUSES: GkStepStatus[] = ["wait", "process", "finish", "error"];

function english(el: HTMLElement) {
  return (el.ownerDocument?.documentElement?.lang || "").toLowerCase().startsWith("en");
}

function isStatus(value: unknown): value is GkStepStatus {
  return typeof value === "string" && (STATUSES as string[]).includes(value);
}

function parseItems(value: string | null): GkStepItem[] | null {
  if (value == null || value.trim() === "") return null;
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed
      .map((entry) => {
        if (!entry || typeof entry !== "object") return null;
        const record = entry as Record<string, unknown>;
        const title = String(record.title ?? "").trim();
        if (!title) return null;
        const item: GkStepItem = { title };
        if (typeof record.description === "string") item.description = record.description;
        if (isStatus(record.status)) item.status = record.status;
        if (typeof record.key === "string") item.key = record.key;
        return item;
      })
      .filter((item): item is GkStepItem => item !== null);
  } catch {
    return null;
  }
}

/** Status for one step from the root current index, unless the step sets its own. */
export function resolveStepStatus(
  index: number,
  current: number,
  currentStatus: GkStepStatus,
  explicit?: GkStepStatus | "",
): GkStepStatus {
  if (explicit && isStatus(explicit)) return explicit;
  if (index < current) return "finish";
  if (index === current) return isStatus(currentStatus) ? currentStatus : "process";
  return "wait";
}

@customElement("gk-steps")
export class GkSteps extends LitElement {
  static styles = stepsStyles;

  /** 0-based index of the active step. */
  @property({ type: Number })
  current = 0;

  /** Status applied to the current step. Earlier steps are finish, later steps wait. */
  @property({ reflect: true })
  status: GkStepStatus = "process";

  @property({ reflect: true })
  direction: GkStepsDirection = "horizontal";

  @property({ reflect: true })
  size: GkStepsSize = "md";

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  clickable = false;

  @property({
    attribute: "items",
    converter: { fromAttribute: parseItems },
  })
  items: GkStepItem[] | null = null;

  private readonly onSlot = () => {
    this.syncSteps();
    this.requestUpdate();
  };

  private readonly onActivate = (event: Event) => {
    const index = (event as CustomEvent<{ index: number }>).detail?.index;
    if (typeof index !== "number" || !this.clickable) return;
    if (index < 0 || index > this.current || index === this.current) return;
    this.current = index;
    const detail = { current: index };
    this.dispatchEvent(
      new CustomEvent("update:current", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("change", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  };

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener("gk-step-activate", this.onActivate);
  }

  override disconnectedCallback() {
    this.removeEventListener("gk-step-activate", this.onActivate);
    super.disconnectedCallback();
  }

  protected override willUpdate() {
    const count = this.lightSteps().length || this.items?.length || 0;
    let next = Math.max(0, Math.floor(Number(this.current)) || 0);
    if (count > 0) next = Math.min(next, count - 1);
    if (this.current !== next) this.current = next;
    if (!isStatus(this.status)) this.status = "process";
    this.syncSteps();
  }

  protected override updated() {
    this.syncSteps();
  }

  lightSteps(): GkStep[] {
    return [...this.children].filter((node): node is GkStep => node instanceof GkStep);
  }

  private shadowSteps(): GkStep[] {
    return [...this.renderRoot.querySelectorAll("gk-step")].filter(
      (node): node is GkStep => node instanceof GkStep,
    );
  }

  steps(): GkStep[] {
    const light = this.lightSteps();
    return light.length ? light : this.shadowSteps();
  }

  syncSteps() {
    const steps = this.steps();
    const current = Math.min(this.current, Math.max(0, steps.length - 1));
    steps.forEach((step, index) => {
      const view = resolveStepStatus(index, current, this.status, step.status);
      if (step.position !== index) step.position = index;
      if (step.view !== view) step.view = view;
      if (step.direction !== this.direction) step.direction = this.direction;
      if (step.size !== this.size) step.size = this.size;
      const tail = index === steps.length - 1;
      if (step.tail !== tail) step.tail = tail;
      const canActivate = this.clickable && index < this.current;
      if (step.canActivate !== canActivate) step.canActivate = canActivate;
      const markCurrent = index === current;
      if (step.markCurrent !== markCurrent) step.markCurrent = markCurrent;
    });
  }

  private landmark() {
    return this.getAttribute("aria-label") || (english(this) ? "Steps" : "步驟");
  }

  private renderItems() {
    return (this.items ?? []).map(
      (item) => html`<gk-step
        title=${item.title}
        description=${item.description ?? ""}
        .status=${item.status ?? ""}
        direction=${this.direction}
        size=${this.size}
      ></gk-step>`,
    );
  }

  override render() {
    const slotted = this.lightSteps().length > 0;
    return html`
      <nav part="root" aria-label=${this.landmark()}>
        <div part="list" role="list">
          ${slotted
            ? html`<slot @slotchange=${this.onSlot}></slot>`
            : html`<div class="gk-steps__generated">${this.renderItems()}<slot hidden @slotchange=${this.onSlot}></slot></div>`}
        </div>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-steps": GkSteps;
  }
}
