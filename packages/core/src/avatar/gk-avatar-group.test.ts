import { describe, it, expect } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-avatar.js";
import "./gk-avatar-group.js";
import type { GkAvatarGroup } from "./gk-avatar-group.js";

describe("gk-avatar-group", () => {
  it("renders slotted avatars", async () => {
    const el = await fixture<GkAvatarGroup>(html`
      <gk-avatar-group>
        <gk-avatar>A</gk-avatar>
        <gk-avatar>B</gk-avatar>
      </gk-avatar-group>
    `);
    expect(el.querySelectorAll("gk-avatar").length).toBe(2);
    expect(el.shadowRoot?.querySelector("slot:not([name])")).toBeTruthy();
  });

  it("hides avatars beyond max and sets rest", async () => {
    const el = await fixture<GkAvatarGroup>(html`
      <gk-avatar-group max="2">
        <gk-avatar>A</gk-avatar>
        <gk-avatar>B</gk-avatar>
        <gk-avatar>C</gk-avatar>
        <gk-avatar>D</gk-avatar>
        <span slot="overflow">+extra</span>
      </gk-avatar-group>
    `);
    await el.updateComplete;
    // allow slotchange handler
    await new Promise((r) => queueMicrotask(r));
    await el.updateComplete;
    expect(el.rest).toBe(2);
    expect(el.getAttribute("rest")).toBe("2");
    const avatars = [...el.querySelectorAll("gk-avatar")];
    expect(avatars.filter((a) => getComputedStyle(a).display !== "none").length).toBe(2);
  });
});
