import { describe, it, expect, vi } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-input.js";
import type { GkInput } from "./gk-input.js";

describe("gk-input", () => {
  it("defaults type text, size md, empty value, clearable/round false", async () => {
    const el = await fixture<GkInput>(html`<gk-input></gk-input>`);
    expect(el.type).toBe("text");
    expect(el.size).toBe("md");
    expect(el.value).toBe("");
    expect(el.clearable).toBe(false);
    expect(el.round).toBe(false);
    expect(el.disabled).toBe(false);
    expect(el.readonly).toBe(false);
    expect(el.rows).toBe(3);
  });

  it("reflects type, size, value, placeholder, flags, status, rows", async () => {
    const el = await fixture<GkInput>(html`
      <gk-input
        type="password"
        size="lg"
        value="secret"
        placeholder="Password"
        clearable
        round
        status="error"
        rows="5"
        name="pw"
      ></gk-input>
    `);
    expect(el.type).toBe("password");
    expect(el.size).toBe("lg");
    expect(el.value).toBe("secret");
    expect(el.placeholder).toBe("Password");
    expect(el.clearable).toBe(true);
    expect(el.round).toBe(true);
    expect(el.status).toBe("error");
    expect(el.rows).toBe(5);
    expect(el.name).toBe("pw");
  });

  it("typing updates value and dispatches input", async () => {
    const el = await fixture<GkInput>(html`<gk-input></gk-input>`);
    const spy = vi.fn();
    el.addEventListener("input", spy);
    const input = el.shadowRoot?.querySelector(
      "[part='input']",
    ) as HTMLInputElement;
    input.value = "hi";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe("hi");
    expect(spy).toHaveBeenCalled();
    const ev = spy.mock.calls[0][0] as CustomEvent;
    expect(ev.bubbles).toBe(true);
    expect(ev.composed).toBe(true);
    expect(ev.detail).toEqual({ value: "hi" });
  });

  it("clear empties value and dispatches input and change", async () => {
    const el = await fixture<GkInput>(
      html`<gk-input value="abc" clearable></gk-input>`,
    );
    const onInput = vi.fn();
    const onChange = vi.fn();
    el.addEventListener("input", onInput);
    el.addEventListener("change", onChange);
    const btn = el.shadowRoot?.querySelector(
      "button[part='clear']",
    ) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    btn.click();
    await el.updateComplete;
    expect(el.value).toBe("");
    expect(onInput).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalled();
  });

  it("password toggle switches inner type without clearing value", async () => {
    const el = await fixture<GkInput>(
      html`<gk-input type="password" value="secret"></gk-input>`,
    );
    const input = el.shadowRoot?.querySelector(
      "[part='input']",
    ) as HTMLInputElement;
    expect(input.type).toBe("password");
    const toggle = el.shadowRoot?.querySelector(
      "button[part='password-toggle']",
    ) as HTMLButtonElement;
    toggle.click();
    await el.updateComplete;
    const input2 = el.shadowRoot?.querySelector(
      "[part='input']",
    ) as HTMLInputElement;
    expect(input2.type).toBe("text");
    expect(el.value).toBe("secret");
    expect(el.type).toBe("password");
  });

  it("textarea renders with rows", async () => {
    const el = await fixture<GkInput>(
      html`<gk-input type="textarea" rows="4" value="note"></gk-input>`,
    );
    const ta = el.shadowRoot?.querySelector("textarea[part='input']");
    expect(ta).toBeTruthy();
    expect(Number((ta as HTMLTextAreaElement).rows)).toBe(4);
    expect((ta as HTMLTextAreaElement).value).toBe("note");
  });

  it("hides clear when empty or disabled", async () => {
    const el = await fixture<GkInput>(
      html`<gk-input clearable value=""></gk-input>`,
    );
    expect(el.shadowRoot?.querySelector("button[part='clear']")).toBeNull();
    el.value = "x";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("button[part='clear']")).toBeTruthy();
    el.disabled = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("button[part='clear']")).toBeNull();
  });
});
