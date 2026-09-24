export const MASK_Z_BASE = 3990;
export const PANEL_Z_BASE = 4000;
export const Z_STEP = 10;

export function overlayZ(level: number) {
  return {
    mask: MASK_Z_BASE + level * Z_STEP,
    panel: PANEL_Z_BASE + level * Z_STEP,
  };
}

type StackEntry = {
  id: number;
  panel: HTMLElement | null;
  notify: (isTop: boolean, level: number) => void;
};

const stack: StackEntry[] = [];
let seq = 0;

function restack() {
  stack.forEach((entry, index) => {
    entry.notify(index === stack.length - 1, index);
  });
}

export function registerBlockingOverlay(
  notify: (isTop: boolean, level: number) => void,
) {
  const entry: StackEntry = { id: ++seq, panel: null, notify };
  stack.push(entry);
  restack();
  return {
    setPanel(panel: HTMLElement | null) {
      entry.panel = panel;
    },
    isTop() {
      return stack[stack.length - 1]?.id === entry.id;
    },
    level() {
      const index = stack.findIndex((item) => item.id === entry.id);
      return index < 0 ? 0 : index;
    },
    unregister() {
      const index = stack.findIndex((item) => item.id === entry.id);
      const below = index > 0 ? stack[index - 1] : null;
      if (index >= 0) stack.splice(index, 1);
      restack();
      return below?.panel ?? null;
    },
  };
}
