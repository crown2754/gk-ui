import { afterEach, describe, expect, it, vi } from "vitest";
import { fixture, fixtureCleanup, html } from "@open-wc/testing";
import "./gk-steps.js";
import { resolveStepStatus, type GkSteps } from "./gk-steps.js";
import type { GkStep } from "./gk-step.js";
import { stepStyles } from "./gk-steps.styles.js";

async function settle(el: GkSteps) {
  await el.updateComplete;
  await Promise.all(el.steps().map((step) => step.updateComplete));
}

describe("resolveStepStatus", () => {
  it("finishes earlier steps, applies the root status to current, and waits after", () => {
    expect(resolveStepStatus(0, 1, "process")).toBe("finish");
    expect(resolveStepStatus(1, 1, "process")).toBe("process");
    expect(resolveStepStatus(2, 1, "process")).toBe("wait");
    expect(resolveStepStatus(1, 1, "error")).toBe("error");
    expect(resolveStepStatus(0, 1, "error")).toBe("finish");
    expect(resolveStepStatus(2, 1, "error", "finish")).toBe("finish");
  });
});

describe("gk-steps", () => {
  afterEach(() => {
    document.documentElement.lang = "";
    fixtureCleanup();
  });

  it("shows a brand process step, a success check for finish, and a muted wait step", async () => {
    const el = await fixture<GkSteps>(html`
      <gk-steps current="1">
        <gk-step title="填寫資料"></gk-step>
        <gk-step title="確認付款"></gk-step>
        <gk-step title="完成"></gk-step>
      </gk-steps>
    `);
    await settle(el);
    expect(el.direction).toBe("horizontal");
    expect(el.status).toBe("process");
    expect(el.size).toBe("md");
    const nav = el.shadowRoot?.querySelector("[part='root']");
    expect(nav?.tagName).toBe("NAV");
    expect(nav?.getAttribute("aria-label")).toBe("步驟");
    const steps = el.steps();
    expect(steps.map((step) => step.view)).toEqual(["finish", "process", "wait"]);
    expect(steps[0].shadowRoot?.querySelector("[part='indicator'] svg")).toBeTruthy();
    expect(steps[0].shadowRoot?.querySelector("[part='indicator']")?.textContent).not.toContain("1");
    expect(steps[1].shadowRoot?.querySelector("[part='indicator']")?.textContent?.trim()).toBe("2");
    expect(steps[1].getAttribute("aria-current")).toBe("step");
    expect(steps[1].getAttribute("aria-label")).toBe("步驟 2，進行中：確認付款");
    expect(steps[1].shadowRoot?.querySelector("[part='indicator']")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
    expect(steps[1].shadowRoot?.querySelector("[part='connector']")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
    expect(steps[2].tail).toBe(true);
    expect(steps[2].shadowRoot?.querySelector("[part='connector']")).toBeTruthy();
    expect(steps[0].getAttribute("data-status")).toBe("finish");
    expect(steps[1].getAttribute("data-status")).toBe("process");
  });

  it("uses English names and keeps an explicit error on the current step", async () => {
    document.documentElement.lang = "en";
    const el = await fixture<GkSteps>(html`
      <gk-steps current="1" status="error" direction="vertical" size="sm">
        <gk-step title="Upload"></gk-step>
        <gk-step title="Validate" description="Bad format"></gk-step>
        <gk-step title="Publish"></gk-step>
      </gk-steps>
    `);
    await settle(el);
    expect(el.shadowRoot?.querySelector("nav")?.getAttribute("aria-label")).toBe("Steps");
    const steps = el.steps();
    expect(steps.map((step) => step.view)).toEqual(["finish", "error", "wait"]);
    expect(steps[1].getAttribute("aria-label")).toBe("Step 2, error: Validate");
    expect(steps[1].direction).toBe("vertical");
    expect(steps[1].size).toBe("sm");
    expect(steps[1].shadowRoot?.querySelector("[part='description']")?.textContent).toContain(
      "Bad format",
    );
    expect(steps[1].shadowRoot?.querySelector("[part='indicator'] circle")).toBeTruthy();
  });

  it("emits update:current when a finished step is activated", async () => {
    const el = await fixture<GkSteps>(html`
      <gk-steps current="1" clickable>
        <gk-step title="One"></gk-step>
        <gk-step title="Two"></gk-step>
        <gk-step title="Three"></gk-step>
      </gk-steps>
    `);
    await settle(el);
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    el.addEventListener("update:current", onUpdate);
    el.addEventListener("change", onChange);
    const steps = el.steps();
    expect(steps[0].canActivate).toBe(true);
    expect(steps[0].tabIndex).toBe(0);
    expect(steps[2].canActivate).toBe(false);
    expect(steps[2].hasAttribute("tabindex")).toBe(false);
    steps[0].click();
    await settle(el);
    expect(el.current).toBe(0);
    expect((onUpdate.mock.calls[0][0] as CustomEvent).detail).toEqual({ current: 0 });
    expect((onChange.mock.calls[0][0] as CustomEvent).detail).toEqual({ current: 0 });
    expect(el.steps().map((step) => step.view)).toEqual(["process", "wait", "wait"]);
    steps[0].dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(onUpdate).toHaveBeenCalledOnce();
  });

  it("renders the items API and honors a per-step status", async () => {
    const el = await fixture<GkSteps>(html`<gk-steps current="1"></gk-steps>`);
    el.items = [
      { title: "A" },
      { title: "B", description: "Now", status: "error" },
      { title: "C" },
    ];
    await settle(el);
    await settle(el);
    const steps = el.steps();
    expect(steps).toHaveLength(3);
    expect(steps[1].view).toBe("error");
    expect(steps[1].shadowRoot?.querySelector("[part='description']")?.textContent).toContain("Now");
    expect(steps[0].view).toBe("finish");
  });

  it("locks finish to success green and process to brand gold", () => {
    const css = stepStyles.cssText;
    expect(css).toMatch(/data-status="finish"[\s\S]*--gk-color-success/);
    expect(css).toMatch(/data-status="process"[\s\S]*--gk-color-brand/);
    expect(css).toMatch(/--gk-color-brand-on/);
    expect(css).toMatch(/data-status="error"[\s\S]*--gk-color-danger/);
    expect(css).toMatch(/--gk-step-circle:\s*24px/);
    expect(css).toMatch(/--gk-step-circle:\s*28px/);
    expect(css).toMatch(/--gk-step-circle:\s*32px/);
    expect(css).toMatch(/--gk-color-focus-ring[^;]*70%/);
    expect(css).toMatch(/20%/);
  });
});
