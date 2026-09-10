import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-message-provider.js";
import type { GkMessageProvider } from "./gk-message-provider.js";
import { gkMessage } from "./gk-message-api.js";

describe("gk-message-provider", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    document.querySelectorAll(".gk-message-container").forEach((n) => n.remove());
  });

  it("defaults placement top, duration 3000, closable false, keepAliveOnHover false", async () => {
    const el = await fixture<GkMessageProvider>(
      html`<gk-message-provider></gk-message-provider>`,
    );
    expect(el.placement).toBe("top");
    expect(el.duration).toBe(3000);
    expect(el.closable).toBe(false);
    expect(el.keepAliveOnHover).toBe(false);
  });

  it("createMessage appends a toast; auto-removes after duration", async () => {
    const el = await fixture<GkMessageProvider>(
      html`<gk-message-provider duration="1000"></gk-message-provider>`,
    );
    el.createMessage("Hi", { type: "success" });
    await el.updateComplete;
    const container = document.querySelector(".gk-message-container");
    expect(container?.querySelectorAll("gk-message").length).toBe(1);
    vi.advanceTimersByTime(1000);
    await el.updateComplete;
    expect(container?.querySelectorAll("gk-message").length).toBe(0);
  });

  it("duration 0 stays until destroy", async () => {
    const el = await fixture<GkMessageProvider>(
      html`<gk-message-provider></gk-message-provider>`,
    );
    const handle = el.createMessage("Stay", { duration: 0 });
    await el.updateComplete;
    vi.advanceTimersByTime(10_000);
    expect(
      document.querySelectorAll(".gk-message-container gk-message").length,
    ).toBe(1);
    handle.destroy();
    await el.updateComplete;
    expect(
      document.querySelectorAll(".gk-message-container gk-message").length,
    ).toBe(0);
  });

  it("max drops oldest", async () => {
    const el = await fixture<GkMessageProvider>(
      html`<gk-message-provider max="2"></gk-message-provider>`,
    );
    el.createMessage("a", { duration: 0 });
    el.createMessage("b", { duration: 0 });
    el.createMessage("c", { duration: 0 });
    await el.updateComplete;
    const texts = [
      ...document.querySelectorAll(".gk-message-container gk-message"),
    ].map((m) => (m as HTMLElement & { content: string }).content);
    expect(texts).toEqual(["b", "c"]);
  });

  it("destroyAll clears all", async () => {
    const el = await fixture<GkMessageProvider>(
      html`<gk-message-provider></gk-message-provider>`,
    );
    el.createMessage("a", { duration: 0 });
    el.createMessage("b", { duration: 0 });
    await el.updateComplete;
    el.destroyAll();
    await el.updateComplete;
    expect(
      document.querySelectorAll(".gk-message-container gk-message").length,
    ).toBe(0);
  });

  it("close on message removes it from queue", async () => {
    const el = await fixture<GkMessageProvider>(
      html`<gk-message-provider closable></gk-message-provider>`,
    );
    el.createMessage("X", { duration: 0 });
    await el.updateComplete;
    const msg = document.querySelector(
      ".gk-message-container gk-message",
    ) as HTMLElement;
    msg.dispatchEvent(
      new CustomEvent("gk-close", { bubbles: true, composed: true }),
    );
    await el.updateComplete;
    expect(
      document.querySelectorAll(".gk-message-container gk-message").length,
    ).toBe(0);
  });

  it("keepAliveOnHover pauses timer while hovered", async () => {
    const el = await fixture<GkMessageProvider>(
      html`<gk-message-provider
        duration="1000"
        keep-alive-on-hover
      ></gk-message-provider>`,
    );
    el.createMessage("Hover me");
    await el.updateComplete;
    const msg = document.querySelector(
      ".gk-message-container gk-message",
    ) as HTMLElement;
    msg.dispatchEvent(new Event("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(1500);
    expect(
      document.querySelectorAll(".gk-message-container gk-message").length,
    ).toBe(1);
    msg.dispatchEvent(new Event("mouseleave", { bubbles: true }));
    vi.advanceTimersByTime(1000);
    await el.updateComplete;
    expect(
      document.querySelectorAll(".gk-message-container gk-message").length,
    ).toBe(0);
  });

  it("resumes keepAliveOnHover timer after portal rebuild when mouseleave never fires", async () => {
    const el = await fixture<GkMessageProvider>(
      html`<gk-message-provider
        duration="1000"
        keep-alive-on-hover
      ></gk-message-provider>`,
    );
    el.createMessage("Paused then rebuilt");
    await el.updateComplete;
    const first = document.querySelector(
      ".gk-message-container gk-message",
    ) as HTMLElement;
    first.dispatchEvent(new Event("mouseenter", { bubbles: true }));
    // Queue change rebuilds portal; hovered node is replaced so mouseleave may never fire.
    el.createMessage("Second", { duration: 0 });
    await el.updateComplete;
    vi.advanceTimersByTime(1000);
    await el.updateComplete;
    const texts = [
      ...document.querySelectorAll(".gk-message-container gk-message"),
    ].map((m) => (m as HTMLElement & { content: string }).content);
    expect(texts).toEqual(["Second"]);
  });

  it("portal uses placement class and cleans up on disconnect", async () => {
    const el = await fixture<GkMessageProvider>(
      html`<gk-message-provider placement="bottom-right"></gk-message-provider>`,
    );
    const container = document.querySelector(
      ".gk-message-container.gk-message-container--bottom-right",
    );
    expect(container).not.toBeNull();
    expect(container?.parentElement).toBe(document.body);
    el.remove();
    expect(document.querySelector(".gk-message-container")).toBeNull();
  });
});

describe("gkMessage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.querySelectorAll("gk-message-provider").forEach((n) => n.remove());
    document.querySelectorAll(".gk-message-container").forEach((n) => n.remove());
  });
  afterEach(() => {
    vi.useRealTimers();
    document.querySelectorAll("gk-message-provider").forEach((n) => n.remove());
    document.querySelectorAll(".gk-message-container").forEach((n) => n.remove());
  });

  it("throws when no provider", () => {
    expect(() => gkMessage.info("x")).toThrow(/gk-message-provider/i);
  });

  it("info/success route through top provider", async () => {
    await fixture(html`<gk-message-provider></gk-message-provider>`);
    gkMessage.success("ok");
    await Promise.resolve();
    const msg = document.querySelector(".gk-message-container gk-message") as {
      type: string;
      content: string;
    };
    expect(msg.content).toBe("ok");
    expect(msg.type).toBe("success");
  });

  it("loading defaults to non-auto-dismiss", async () => {
    const el = await fixture(html`<gk-message-provider duration="500"></gk-message-provider>`);
    gkMessage.loading("wait");
    await el.updateComplete;
    vi.advanceTimersByTime(2000);
    expect(
      document.querySelectorAll(".gk-message-container gk-message").length,
    ).toBe(1);
  });

  it("destroyAll clears via API", async () => {
    await fixture(html`<gk-message-provider></gk-message-provider>`);
    gkMessage.info("a", { duration: 0 });
    gkMessage.info("b", { duration: 0 });
    gkMessage.destroyAll();
    expect(
      document.querySelectorAll(".gk-message-container gk-message").length,
    ).toBe(0);
  });
});
