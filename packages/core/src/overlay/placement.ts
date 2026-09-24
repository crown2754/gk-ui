export type GkPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

export type GkPlacementSide = "top" | "bottom" | "left" | "right";
export type GkPlacementAlign = "start" | "end" | "";

const OPPOSITE: Record<GkPlacementSide, GkPlacementSide> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

export function splitPlacement(placement: string): {
  side: GkPlacementSide;
  align: GkPlacementAlign;
} {
  const [sideRaw, alignRaw] = placement.split("-");
  const side: GkPlacementSide =
    sideRaw === "bottom" || sideRaw === "left" || sideRaw === "right"
      ? sideRaw
      : "top";
  const align: GkPlacementAlign =
    alignRaw === "start" || alignRaw === "end" ? alignRaw : "";
  return { side, align };
}

export function joinPlacement(
  side: GkPlacementSide,
  align: GkPlacementAlign,
): GkPlacement {
  return (align ? `${side}-${align}` : side) as GkPlacement;
}

function clamp(value: number, min: number, max: number) {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

/** Position a floating panel around a trigger, flipping the main axis at viewport edges. */
export function computeOverlayPosition(opts: {
  trigger: { top: number; left: number; width: number; height: number };
  panelWidth: number;
  panelHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  placement: GkPlacement | string;
  gap?: number;
}): { top: number; left: number; placement: GkPlacement } {
  const gap = opts.gap ?? 8;
  const triggerRight = opts.trigger.left + opts.trigger.width;
  const triggerBottom = opts.trigger.top + opts.trigger.height;
  const centerX = opts.trigger.left + opts.trigger.width / 2;
  const centerY = opts.trigger.top + opts.trigger.height / 2;
  let { side, align } = splitPlacement(opts.placement);

  const space: Record<GkPlacementSide, number> = {
    top: opts.trigger.top - gap,
    bottom: opts.viewportHeight - triggerBottom - gap,
    left: opts.trigger.left - gap,
    right: opts.viewportWidth - triggerRight - gap,
  };
  const needed =
    side === "top" || side === "bottom" ? opts.panelHeight : opts.panelWidth;
  if (space[side] < needed && space[OPPOSITE[side]] > space[side]) {
    side = OPPOSITE[side];
  }

  let top = 0;
  let left = 0;
  if (side === "top") top = opts.trigger.top - gap - opts.panelHeight;
  if (side === "bottom") top = triggerBottom + gap;
  if (side === "left") left = opts.trigger.left - gap - opts.panelWidth;
  if (side === "right") left = triggerRight + gap;

  if (side === "top" || side === "bottom") {
    if (align === "start") left = opts.trigger.left;
    else if (align === "end") left = triggerRight - opts.panelWidth;
    else left = centerX - opts.panelWidth / 2;
  } else if (align === "start") top = opts.trigger.top;
  else if (align === "end") top = triggerBottom - opts.panelHeight;
  else top = centerY - opts.panelHeight / 2;

  left = clamp(left, gap, opts.viewportWidth - opts.panelWidth - gap);
  top = clamp(top, gap, opts.viewportHeight - opts.panelHeight - gap);

  return { top, left, placement: joinPlacement(side, align) };
}

export function toCssSize(value: string | number | null | undefined, fallback: string) {
  const raw = String(value ?? "").trim();
  if (!raw) return fallback;
  if (/^-?\d+(\.\d+)?$/.test(raw)) return `${raw}px`;
  return raw;
}
