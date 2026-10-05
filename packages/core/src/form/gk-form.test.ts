import { describe, expect, it, vi } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "../input/gk-input.js";
import "../input-number/gk-input-number.js";
import "../rate/gk-rate.js";
import "../tree-select/gk-tree-select.js";
import "../upload/gk-upload.js";
import "../transfer/gk-transfer.js";
import "./gk-form.js";
import "./gk-form-item.js";
import type { GkForm } from "./gk-form.js";
import type { GkFormItem } from "./gk-form-item.js";
import type { GkInput } from "../input/gk-input.js";
import type { GkRate } from "../rate/gk-rate.js";
import type { GkTreeSelect } from "../tree-select/gk-tree-select.js";

describe("gk-form", () => {
  it("lays out a left label with a required mark and reserves feedback", async () => {
    const el = await fixture<GkForm>(html`
      <gk-form>
        <gk-form-item label="姓名" path="name" required help="與證件相同">
          <gk-input></gk-input>
        </gk-form-item>
      </gk-form>
    `);
    const item = el.querySelector("gk-form-item") as GkFormItem;
    expect(item.shadowRoot?.querySelector("[part='mark']")?.textContent).toBe("*");
    expect(item.getAttribute("data-placement")).toBe("left");
    expect(item.shadowRoot?.querySelector("[part='help']")?.textContent).toBe("與證件相同");
    expect(item.hasAttribute("data-show-feedback")).toBe(true);
    const input = item.querySelector("gk-input")?.shadowRoot?.querySelector("input");
    expect(input?.getAttribute("aria-required")).toBe("true");
    expect(input?.getAttribute("aria-labelledby")).toBeTruthy();
  });

  it("validates rules, focuses the first invalid control, and restores", async () => {
    const el = await fixture<GkForm>(html`
      <gk-form>
        <gk-form-item label="信箱" path="email" required>
          <gk-input value="chen@"></gk-input>
        </gk-form-item>
      </gk-form>
    `);
    el.model = { email: "chen@" };
    el.rules = {
      email: { required: true, pattern: /^[^@]+@[^@]+\.[^@]+$/, message: "請輸入有效的電子郵件" },
    };
    await el.updateComplete;
    const result = await el.validate();
    expect(result.valid).toBe(false);
    expect(result.errors[0].message).toBe("請輸入有效的電子郵件");
    const item = el.querySelector("gk-form-item") as GkFormItem;
    expect(item.validationStatus).toBe("error");
    const field = item.querySelector("gk-input") as GkInput;
    expect(field.status).toBe("error");
    el.restoreValidation();
    await el.updateComplete;
    expect(item.validationStatus).toBe("");
    expect(field.status).toBe("");
  });

  it("lets item feedback override the rule message", async () => {
    const el = await fixture<GkForm>(html`
      <gk-form>
        <gk-form-item label="代碼" path="code" feedback="請改用夏季代碼" required>
          <gk-input></gk-input>
        </gk-form-item>
      </gk-form>
    `);
    el.model = { code: "" };
    await el.updateComplete;
    await el.validate();
    const item = el.querySelector("gk-form-item") as GkFormItem;
    expect(item.shadowRoot?.querySelector("[part='feedback']")?.textContent?.trim()).toBe(
      "請改用夏季代碼",
    );
  });

  it("treats a rate of 0 as empty and blocks submit until the form is valid", async () => {
    const el = await fixture<GkForm>(html`
      <gk-form>
        <gk-form-item label="滿意度" path="score" required>
          <gk-rate></gk-rate>
        </gk-form-item>
        <button type="submit">送出</button>
      </gk-form>
    `);
    el.model = { score: 0 };
    await el.updateComplete;
    const onSubmit = vi.fn();
    el.addEventListener("submit", onSubmit);
    (el.querySelector("button") as HTMLButtonElement).click();
    await Promise.resolve();
    expect(onSubmit).not.toHaveBeenCalled();
    const rate = el.querySelector("gk-rate") as GkRate;
    rate.value = 4;
    el.model.score = 4;
    (el.querySelector("button") as HTMLButtonElement).click();
    await Promise.resolve();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0].detail.model.score).toBe(4);
  });

  it("resets the same model object and inherits size", async () => {
    const el = await fixture<GkForm>(html`
      <gk-form size="sm">
        <gk-form-item label="數量" path="qty">
          <gk-input-number></gk-input-number>
        </gk-form-item>
        <button type="reset">重設</button>
      </gk-form>
    `);
    const model = el.model;
    model.qty = 2;
    el.writePath("qty", 9);
    expect(el.model).toBe(model);
    expect(el.model.qty).toBe(9);
    (el.querySelector("button") as HTMLButtonElement).click();
    expect(el.model).toBe(model);
    expect(el.model.qty).toBeUndefined();
    const field = el.querySelector("gk-input-number");
    expect(field?.getAttribute("size")).toBe("sm");
    expect(field?.hasAttribute("data-gk-size-from-form")).toBe(true);
  });

  it("hides feedback text when show-feedback is false", async () => {
    const el = await fixture<GkForm>(html`
      <gk-form>
        <gk-form-item label="折扣碼" path="code" .showFeedback=${false} required>
          <gk-input></gk-input>
        </gk-form-item>
      </gk-form>
    `);
    el.model = { code: "" };
    await el.updateComplete;
    await el.validate();
    const item = el.querySelector("gk-form-item") as GkFormItem;
    expect(item.shadowRoot?.querySelector("[part='feedback-row']")?.hasAttribute("hidden")).toBe(
      true,
    );
    expect(item.querySelector("gk-input")?.getAttribute("status")).toBe("error");
  });

  it("passes size to upload, tree-select, and transfer and writes their values", async () => {
    const el = await fixture<GkForm>(html`
      <gk-form size="sm">
        <gk-form-item label="部門" path="dept" required>
          <gk-tree-select></gk-tree-select>
        </gk-form-item>
        <gk-form-item label="附件" path="files">
          <gk-upload></gk-upload>
        </gk-form-item>
        <gk-form-item label="欄位" path="cols">
          <gk-transfer></gk-transfer>
        </gk-form-item>
      </gk-form>
    `);
    await el.updateComplete;
    const tree = el.querySelector("gk-tree-select") as GkTreeSelect;
    const upload = el.querySelector("gk-upload");
    const transfer = el.querySelector("gk-transfer");
    expect(tree.getAttribute("size")).toBe("sm");
    expect(upload?.getAttribute("size")).toBe("sm");
    expect(transfer?.getAttribute("size")).toBe("sm");
    tree.dispatchEvent(
      new CustomEvent("change", { detail: { value: "design" }, bubbles: true, composed: true }),
    );
    expect(el.model.dept).toBe("design");
    const item = el.querySelector("gk-form-item") as GkFormItem;
    el.model.dept = null;
    await el.validate();
    expect(item.validationStatus).toBe("error");
    expect(tree.status).toBe("error");
  });
});
