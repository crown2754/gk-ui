import { describe, it, expect } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-button.js";
import "./gk-button-group.js";
import type { GkButtonGroup } from "./gk-button-group.js";

describe("gk-button-group", () => {
  it("renders slotted gk-button children", async () => {
    const el = await fixture<GkButtonGroup>(html`
      <gk-button-group>
        <gk-button>One</gk-button>
        <gk-button>Two</gk-button>
      </gk-button-group>
    `);
    const buttons = el.querySelectorAll("gk-button");
    expect(buttons.length).toBe(2);
    expect(el.shadowRoot?.querySelector("slot")).toBeTruthy();
  });
});
