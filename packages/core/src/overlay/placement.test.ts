import { describe, expect, it } from "vitest";
import { computeOverlayPosition } from "./placement.js";

const viewport = { viewportWidth: 800, viewportHeight: 600 };

describe("computeOverlayPosition", () => {
  it("places a top tip centered above the trigger", () => {
    const pos = computeOverlayPosition({
      ...viewport,
      placement: "top",
      panelWidth: 100,
      panelHeight: 40,
      trigger: { top: 200, left: 300, width: 80, height: 34 },
      gap: 8,
    });
    expect(pos.placement).toBe("top");
    expect(pos.top).toBe(200 - 8 - 40);
    expect(pos.left).toBe(300 + 40 - 50);
  });

  it("places bottom-start aligned to the trigger start edge", () => {
    const pos = computeOverlayPosition({
      ...viewport,
      placement: "bottom-start",
      panelWidth: 160,
      panelHeight: 80,
      trigger: { top: 100, left: 40, width: 120, height: 34 },
      gap: 4,
    });
    expect(pos.placement).toBe("bottom-start");
    expect(pos.top).toBe(100 + 34 + 4);
    expect(pos.left).toBe(40);
  });

  it("flips top to bottom when there is not enough room above", () => {
    const pos = computeOverlayPosition({
      ...viewport,
      placement: "top",
      panelWidth: 80,
      panelHeight: 40,
      trigger: { top: 10, left: 100, width: 80, height: 34 },
      gap: 8,
    });
    expect(pos.placement).toBe("bottom");
    expect(pos.top).toBe(10 + 34 + 8);
  });

  it("flips right to left when the viewport edge is too close", () => {
    const pos = computeOverlayPosition({
      ...viewport,
      placement: "right",
      panelWidth: 120,
      panelHeight: 32,
      trigger: { top: 200, left: 740, width: 40, height: 34 },
      gap: 8,
    });
    expect(pos.placement).toBe("left");
    expect(pos.left).toBe(740 - 8 - 120);
  });
});
