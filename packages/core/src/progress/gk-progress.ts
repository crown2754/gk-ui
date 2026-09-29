import { LitElement, html, nothing, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { falseableBoolean } from "../overlay/boolean.js";
import { progressStyles } from "./gk-progress.styles.js";

export type GkProgressType = "line" | "circle";
export type GkProgressStatus = "default" | "success" | "error" | "warning";
export type GkProgressSize = "sm" | "md" | "lg";
export type GkProgressIndicatorPlacement = "outside" | "inside";

function clampPercentage(value: number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, n));
}

@customElement("gk-progress")
export class GkProgress extends LitElement {
  static styles = progressStyles;

  @property({ reflect: true })
  type: GkProgressType = "line";

  @property({ type: Number })
  percentage = 0;

  /** `default` fills with brand gold. */
  @property({ reflect: true })
  status: GkProgressStatus = "default";

  @property({
    type: Boolean,
    reflect: true,
    attribute: "show-indicator",
    converter: falseableBoolean,
  })
  showIndicator = true;

  @property({ reflect: true, attribute: "indicator-placement" })
  indicatorPlacement: GkProgressIndicatorPlacement = "outside";

  /** Line track thickness in px. `0` uses the size preset (6 / 8 / 10). */
  @property({ type: Number })
  height = 0;

  /** Circle stroke in px. `0` uses 5 / 6 / 7 for sm / md / lg. Also used as line height when `height` is unset. */
  @property({ type: Number, attribute: "stroke-width" })
  strokeWidth = 0;

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  processing = false;

  @property({ reflect: true })
  size: GkProgressSize = "md";

  /** Accessible name. The host `aria-label` is copied onto the progressbar when this is empty. */
  @property()
  label = "";

  clamped() {
    return clampPercentage(this.percentage);
  }

  protected override willUpdate() {
    const next = this.clamped();
    if (this.percentage !== next) this.percentage = next;
  }

  protected override updated() {
    const value = String(this.clamped());
    this.setAttribute("role", "progressbar");
    this.setAttribute("aria-valuemin", "0");
    this.setAttribute("aria-valuemax", "100");
    this.setAttribute("aria-valuenow", value);
    const name = this.label.trim() || this.getAttribute("aria-label");
    if (name && this.getAttribute("aria-label") !== name) this.setAttribute("aria-label", name);
  }

  private lineThickness() {
    if (this.height > 0) return this.height;
    if (this.strokeWidth > 0 && this.indicatorPlacement !== "inside") return this.strokeWidth;
    if (this.indicatorPlacement === "inside") return 18;
    if (this.size === "sm") return 6;
    if (this.size === "lg") return 10;
    return 8;
  }

  private circleBox() {
    if (this.size === "sm") return 64;
    if (this.size === "lg") return 120;
    return 96;
  }

  private circleStroke() {
    if (this.strokeWidth > 0) return this.strokeWidth;
    if (this.size === "sm") return 5;
    if (this.size === "lg") return 7;
    return 6;
  }

  private indicator() {
    if (!this.showIndicator) return nothing;
    return html`<span part="indicator"><slot name="indicator">${this.clamped()}%</slot></span>`;
  }

  private line() {
    const inside = this.indicatorPlacement === "inside";
    const onFill = this.clamped() >= 60;
    return html`
      <div part="root">
        <div part="track" style=${styleMap({ height: `${this.lineThickness()}px` })}>
          <div part="fill" style=${styleMap({ width: `${this.clamped()}%` })}></div>
          ${inside && this.showIndicator
            ? html`<span part="indicator" data-placement="inside" data-on-fill=${onFill ? "true" : "false"}>
                <slot name="indicator">${this.clamped()}%</slot>
              </span>`
            : nothing}
        </div>
        ${inside ? nothing : this.indicator()}
      </div>
    `;
  }

  private circle() {
    const size = this.circleBox();
    const stroke = this.circleStroke();
    const radius = (size - stroke) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - this.clamped() / 100);
    const cap = this.clamped() <= 0 ? "butt" : "round";
    return html`
      <div part="root">
        ${svg`<svg part="circle" width=${size} height=${size} viewBox=${`0 0 ${size} ${size}`} aria-hidden="true">
          <circle part="trail" cx=${center} cy=${center} r=${radius} stroke-width=${stroke}></circle>
          <circle
            part="path"
            cx=${center}
            cy=${center}
            r=${radius}
            stroke-width=${stroke}
            stroke-linecap=${cap}
            stroke-dasharray=${circumference}
            stroke-dashoffset=${offset}
          ></circle>
        </svg>`}
        ${this.showIndicator
          ? html`<span part="indicator" data-placement="center"
              ><slot name="indicator">${this.clamped()}%</slot></span
            >`
          : nothing}
      </div>
    `;
  }

  override render() {
    return this.type === "circle" ? this.circle() : this.line();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-progress": GkProgress;
  }
}
