import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { assignFormSize, prefersZh, shouldInheritSize } from "../internal/field.js";
import type { GkForm, GkFormSize } from "./gk-form.js";
import { formItemStyles } from "./gk-form-item.styles.js";
import { normalizeRules, validateValue, type GkFormRule } from "./rules.js";

export type GkFormStatus = "success" | "warning" | "error" | "";

const SIZE_CONTROLS = new Set([
  "GK-INPUT",
  "GK-SELECT",
  "GK-INPUT-NUMBER",
  "GK-CASCADER",
  "GK-DATE-PICKER",
  "GK-RATE",
]);

const STATUS_CONTROLS = new Set([
  "GK-INPUT",
  "GK-SELECT",
  "GK-INPUT-NUMBER",
  "GK-CASCADER",
  "GK-DATE-PICKER",
]);

const triBool = {
  fromAttribute(value: string | null) {
    if (value == null) return undefined;
    return value !== "false" && value !== "0";
  },
  toAttribute(value: boolean | undefined) {
    if (value == null) return null;
    return value ? "" : "false";
  },
};

let seq = 0;

@customElement("gk-form-item")
export class GkFormItem extends LitElement {
  static styles = formItemStyles;

  @property()
  label = "";

  @property()
  path = "";

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ attribute: false })
  rule?: GkFormRule | GkFormRule[];

  @property({ reflect: true })
  size: "" | GkFormSize = "";

  @property({ reflect: true, attribute: "label-placement" })
  labelPlacement: "" | "left" | "top" = "";

  @property({ attribute: "show-label", converter: triBool })
  showLabel?: boolean;

  @property({ attribute: "show-feedback", converter: triBool })
  showFeedback?: boolean;

  @property({ attribute: "show-require-mark", converter: triBool })
  showRequireMark?: boolean;

  @property()
  feedback = "";

  @property({ reflect: true, attribute: "validation-status" })
  validationStatus: GkFormStatus = "";

  @property()
  help = "";

  @state()
  private ruleMessage = "";

  private statusFromValidate = false;
  private savedStatus: GkFormStatus = "";
  private bound: HTMLElement | null = null;
  private readonly uid = `gk-fi-${++seq}`;

  private get form() {
    return this.closest("gk-form") as GkForm | null;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener("slotchange", this.onAnySlot);
  }

  override disconnectedCallback() {
    this.unbind();
    this.removeEventListener("slotchange", this.onAnySlot);
    super.disconnectedCallback();
  }

  private onAnySlot = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    if (slot.name) return;
    this.bindControl(slot);
    this.applyToControl();
  };

  private controlFrom(slot: HTMLSlotElement | null) {
    const assigned = slot?.assignedElements({ flatten: true }) ?? [];
    const found = assigned.find((el) => el.tagName.startsWith("GK-")) ?? assigned[0] ?? null;
    return found as HTMLElement | null;
  }

  private bindControl(slot: HTMLSlotElement | null) {
    const next = this.controlFrom(slot);
    if (next === this.bound) return;
    this.unbind();
    this.bound = next;
    next?.addEventListener("input", this.onControlInput);
    next?.addEventListener("change", this.onControlCommit);
    next?.addEventListener("update:value", this.onControlCommit);
  }

  private unbind() {
    this.bound?.removeEventListener("input", this.onControlInput);
    this.bound?.removeEventListener("change", this.onControlCommit);
    this.bound?.removeEventListener("update:value", this.onControlCommit);
    this.bound = null;
  }

  private onControlInput = (event: Event) => {
    if ((event.currentTarget as HTMLElement | null)?.tagName !== "GK-INPUT") return;
    this.writeFromEvent(event);
  };

  private onControlCommit = (event: Event) => {
    const tag = (event.currentTarget as HTMLElement | null)?.tagName;
    if (tag === "GK-INPUT" && event.type === "input") return;
    this.writeFromEvent(event);
  };

  private writeFromEvent(event: Event) {
    const detail = (event as CustomEvent<{ value?: unknown }>).detail;
    if (!detail || !("value" in detail) || !this.path) return;
    this.form?.writePath(this.path, detail.value);
  }

  private effectiveSize(): GkFormSize {
    if (this.size) return this.size;
    return this.form?.size ?? "md";
  }

  private effectivePlacement(): "left" | "top" {
    if (this.labelPlacement) return this.labelPlacement;
    return this.form?.labelPlacement ?? "left";
  }

  private effectiveShowLabel() {
    return this.showLabel ?? this.form?.showLabel ?? true;
  }

  private effectiveShowFeedback() {
    return this.showFeedback ?? this.form?.showFeedback ?? true;
  }

  private effectiveShowMark() {
    return this.showRequireMark ?? this.form?.showRequireMark ?? true;
  }

  private rules() {
    if (this.rule) return normalizeRules(this.rule);
    if (!this.path || !this.form) return [];
    return normalizeRules(this.form.rules?.[this.path]);
  }

  private get isRequired() {
    return this.required || this.rules().some((rule) => rule.required);
  }

  get displayStatus(): GkFormStatus {
    if (this.validationStatus) return this.validationStatus;
    return this.ruleMessage ? "error" : "";
  }

  get displayMessage() {
    if (this.feedback) return this.feedback;
    return this.ruleMessage;
  }

  validateSync() {
    const control = this.bound;
    const value =
      this.path && this.form?.pathExists(this.path)
        ? this.form.readPath(this.path)
        : (control as (HTMLElement & { value?: unknown }) | null)?.value;
    const message = validateValue(value, this.rules(), {
      required: this.required,
      tagName: control?.tagName,
      zh: prefersZh(this),
    });
    this.ruleMessage = message ?? "";
    if (message) {
      if (!this.statusFromValidate) this.savedStatus = this.validationStatus;
      this.validationStatus = "error";
      this.statusFromValidate = true;
    } else if (this.statusFromValidate) {
      this.validationStatus = this.savedStatus;
      this.savedStatus = "";
      this.statusFromValidate = false;
    }
    this.applyToControl();
    return message;
  }

  clearValidation() {
    this.ruleMessage = "";
    if (this.statusFromValidate) {
      this.validationStatus = this.savedStatus;
      this.savedStatus = "";
      this.statusFromValidate = false;
    }
    this.applyToControl();
  }

  focusControl() {
    const el = this.bound;
    if (!el) return;
    const inner = el.shadowRoot?.querySelector<HTMLElement>(
      "input, textarea, [part='trigger'], [part='base'], [part='half'], [part='full']",
    );
    (inner ?? el).focus();
  }

  protected override updated() {
    this.setAttribute("data-placement", this.effectivePlacement());
    this.toggleAttribute("data-show-feedback", this.effectiveShowFeedback());
    this.setAttribute("data-show-label", this.effectiveShowLabel() ? "true" : "false");
    const slot = this.shadowRoot?.querySelector("slot:not([name])") as HTMLSlotElement | null;
    this.bindControl(slot);
    this.applyToControl();
  }

  private applyToControl() {
    const el = this.bound as
      | (HTMLElement & {
          size?: string;
          disabled?: boolean;
          status?: string;
          requestUpdate?: () => void;
          value?: unknown;
        })
      | null;
    if (!el) return;
    const form = this.form;

    if (SIZE_CONTROLS.has(el.tagName) && shouldInheritSize(el)) {
      assignFormSize(el, this.effectiveSize());
    }

    if (form?.disabled) {
      if (!el.hasAttribute("data-gk-disabled-own")) {
        if (el.disabled && !el.hasAttribute("data-gk-disabled-from-form")) {
          el.setAttribute("data-gk-disabled-own", "");
        } else {
          el.setAttribute("data-gk-disabled-from-form", "");
          el.disabled = true;
        }
      }
    } else if (el.hasAttribute("data-gk-disabled-from-form")) {
      el.disabled = false;
      el.removeAttribute("data-gk-disabled-from-form");
    }

    if (STATUS_CONTROLS.has(el.tagName)) {
      const status = this.displayStatus;
      if (status) {
        el.setAttribute("data-gk-status-from-form", "");
        el.status = status;
      } else if (el.hasAttribute("data-gk-status-from-form")) {
        el.status = "";
        el.removeAttribute("data-gk-status-from-form");
      }
    }

    this.pushValue(el);
    this.syncAria(el);
    if (el.tagName !== "GK-RATE") {
      el.style.width = "100%";
      el.style.maxWidth = "100%";
    }
    el.requestUpdate?.();
  }

  private pushValue(el: HTMLElement & { value?: unknown }) {
    if (!this.path || !this.form?.pathExists(this.path)) return;
    if (this.controlFocused(el) && el.tagName === "GK-INPUT-NUMBER") return;
    let next = this.form.readPath(this.path);
    if (el.tagName === "GK-INPUT" && next == null) next = "";
    if (sameValue(el.value, next)) return;
    el.value = next;
  }

  private controlFocused(el: HTMLElement) {
    try {
      return el.matches(":focus") || !!el.shadowRoot?.activeElement;
    } catch {
      return false;
    }
  }

  private syncAria(el: HTMLElement) {
    const showLabel = this.effectiveShowLabel() && (this.label || this.querySelector("[slot='label']"));
    if (showLabel) el.setAttribute("aria-labelledby", `${this.uid}-label`);
    else el.removeAttribute("aria-labelledby");
    if (this.isRequired) el.setAttribute("aria-required", "true");
    else el.removeAttribute("aria-required");
    if (this.displayStatus === "error") el.setAttribute("aria-invalid", "true");
    else el.removeAttribute("aria-invalid");
    if (this.effectiveShowFeedback()) el.setAttribute("aria-describedby", `${this.uid}-feedback`);
    else el.removeAttribute("aria-describedby");
  }

  override render() {
    const showLabel = this.effectiveShowLabel();
    const showFeedback = this.effectiveShowFeedback();
    const showMark = showLabel && this.effectiveShowMark() && this.isRequired;
    const message = this.displayMessage;
    const status = this.displayStatus;
    const help = !message ? this.help : "";
    const emptyLabel = !this.label && !this.querySelector("[slot='label']");
    return html`
      <div part="row">
        <div part="label" id=${`${this.uid}-label`} ?data-empty=${emptyLabel} ?hidden=${!showLabel}>
          ${showMark ? html`<span part="mark" aria-hidden="true">*</span>` : nothing}
          ${this.label}
          <slot name="label"></slot>
        </div>
        <div part="control"><slot @slotchange=${this.onAnySlot}></slot></div>
        <div part="meta">
          <div part="feedback-row" ?hidden=${!showFeedback}>
            ${message
              ? html`<div part="feedback" id=${`${this.uid}-feedback`} data-status=${status}>
                  ${message}
                </div>`
              : help
                ? html`<div part="help" id=${`${this.uid}-feedback`}>${help}</div>`
                : html`<div part="feedback" id=${`${this.uid}-feedback`}></div>`}
          </div>
          <slot name="extra" part="extra"></slot>
        </div>
      </div>
    `;
  }
}

function sameValue(left: unknown, right: unknown) {
  if (Object.is(left, right)) return true;
  if (Array.isArray(left) && Array.isArray(right)) {
    return left.length === right.length && left.every((item, index) => item === right[index]);
  }
  return false;
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-form-item": GkFormItem;
  }
}
