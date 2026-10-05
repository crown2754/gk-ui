import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { formStyles } from "./gk-form.styles.js";
import type { GkFormItem } from "./gk-form-item.js";
import type { GkFormError, GkFormRules } from "./rules.js";

export type GkFormSize = "sm" | "md" | "lg";
export type GkFormLabelPlacement = "left" | "top";
export type GkFormLabelAlign = "left" | "right" | "";

@customElement("gk-form")
export class GkForm extends LitElement {
  static styles = formStyles;

  @property({ attribute: false })
  model: Record<string, unknown> = {};

  @property({ attribute: false })
  rules: GkFormRules = {};

  @property({ reflect: true })
  size: GkFormSize = "md";

  @property({ reflect: true, attribute: "label-placement" })
  labelPlacement: GkFormLabelPlacement = "left";

  @property({ attribute: "label-width" })
  labelWidth = "auto";

  @property({ attribute: "label-align" })
  labelAlign: GkFormLabelAlign = "";

  @property({ type: Boolean, reflect: true })
  inline = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true, attribute: "show-label" })
  showLabel = true;

  @property({ type: Boolean, reflect: true, attribute: "show-require-mark" })
  showRequireMark = true;

  @property({ type: Boolean, reflect: true, attribute: "show-feedback" })
  showFeedback = true;

  private initialModel: Record<string, unknown> = {};
  private submitting = false;

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

  protected override firstUpdated() {
    this.initialModel = structuredClone(this.model ?? {});
  }

  protected override updated() {
    const width =
      !this.labelWidth || this.labelWidth === "auto" ? "max-content" : this.labelWidth;
    const align = this.labelAlign || (this.labelPlacement === "left" ? "right" : "left");
    const height = this.size === "sm" ? "28px" : this.size === "lg" ? "40px" : "34px";
    this.style.setProperty("--gk-form-label-width", width);
    this.style.setProperty("--gk-form-label-align", align);
    this.style.setProperty(
      "--gk-form-label-justify",
      align === "right" ? "flex-end" : "flex-start",
    );
    this.style.setProperty("--gk-form-control-height", height);
  }

  readPath(path: string) {
    if (!this.model || !path) return undefined;
    return path.split(".").reduce<unknown>((current, key) => {
      if (current == null || typeof current !== "object") return undefined;
      return (current as Record<string, unknown>)[key];
    }, this.model);
  }

  pathExists(path: string) {
    if (!this.model || !path) return false;
    const parts = path.split(".");
    let current: unknown = this.model;
    for (const key of parts) {
      if (current == null || typeof current !== "object" || !(key in (current as object))) {
        return false;
      }
      current = (current as Record<string, unknown>)[key];
    }
    return true;
  }

  writePath(path: string, value: unknown) {
    if (!path) return;
    if (!this.model) this.model = {};
    if (this.pathExists(path) && sameValue(this.readPath(path), value)) return;
    const parts = path.split(".");
    let current: Record<string, unknown> = this.model;
    for (let index = 0; index < parts.length - 1; index += 1) {
      const key = parts[index];
      const next = current[key];
      if (next == null || typeof next !== "object") current[key] = {};
      current = current[key] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = value;
    this.requestUpdate();
  }

  validate(): Promise<{ valid: boolean; errors: GkFormError[] }> {
    const errors: GkFormError[] = [];
    let first: GkFormItem | null = null;
    for (const item of this.items()) {
      const message = item.validateSync();
      if (message) {
        errors.push({ path: item.path, message });
        first ??= item;
      }
    }
    first?.focusControl();
    return Promise.resolve({ valid: errors.length === 0, errors });
  }

  restoreValidation() {
    for (const item of this.items()) item.clearValidation();
  }

  private items() {
    return [...this.querySelectorAll("gk-form-item")].filter(
      (item) => item.closest("gk-form") === this,
    ) as GkFormItem[];
  }

  private async submitForm() {
    if (this.submitting) return;
    this.submitting = true;
    try {
      const result = await this.validate();
      if (!result.valid) return;
      this.dispatchEvent(
        new CustomEvent("submit", {
          detail: { model: this.model ?? {} },
          bubbles: true,
          composed: true,
        }),
      );
    } finally {
      this.submitting = false;
    }
  }

  private resetForm() {
    const next = structuredClone(this.initialModel ?? {});
    if (!this.model) this.model = next;
    else {
      for (const key of Object.keys(this.model)) {
        if (!(key in next)) delete this.model[key];
      }
      Object.assign(this.model, next);
    }
    this.restoreValidation();
    this.requestUpdate();
    for (const item of this.items()) item.requestUpdate();
  }

  private onNativeSubmit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    void this.submitForm();
  };

  private onClick = (event: Event) => {
    const path = event.composedPath();
    if (path.some((node) => isButton(node, "reset"))) {
      event.preventDefault();
      this.resetForm();
      return;
    }
    if (path.some((node) => isButton(node, "submit"))) {
      event.preventDefault();
      void this.submitForm();
    }
  };

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Enter" || event.isComposing) return;
    const target = event.composedPath()[0];
    if (!(target instanceof HTMLInputElement)) return;
    event.preventDefault();
    void this.submitForm();
  };

  override render() {
    return html`<form part="root" novalidate @submit=${this.onNativeSubmit}>
      <slot></slot>
    </form>`;
  }
}

function sameValue(left: unknown, right: unknown) {
  if (left === right) return true;
  if (Array.isArray(left) && Array.isArray(right)) {
    return left.length === right.length && left.every((item, index) => item === right[index]);
  }
  return false;
}

function isButton(node: EventTarget | null, kind: "submit" | "reset") {
  if (!(node instanceof Element)) return false;
  const tag = node.tagName;
  if (tag !== "GK-BUTTON" && tag !== "BUTTON" && tag !== "INPUT") return false;
  const type =
    (node as HTMLElement & { type?: string }).type || node.getAttribute("type") || "";
  return type === kind;
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-form": GkForm;
  }
}
