const FOCUSABLE = [
  "button:not([disabled])",
  "a[href]",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function deepActiveElement(): HTMLElement | null {
  let node: Element | null = document.activeElement;
  while (node instanceof HTMLElement && node.shadowRoot?.activeElement) {
    node = node.shadowRoot.activeElement;
  }
  return node instanceof HTMLElement ? node : null;
}

export function collectFocusable(root: ParentNode): HTMLElement[] {
  const found: HTMLElement[] = [];
  const visit = (node: ParentNode) => {
    const children =
      node instanceof HTMLSlotElement
        ? node.assignedElements({ flatten: true })
        : [...node.children];
    for (const child of children) {
      if (!(child instanceof HTMLElement)) continue;
      if (child.matches(FOCUSABLE)) found.push(child);
      if (child instanceof HTMLSlotElement) visit(child);
      else if (child.shadowRoot) visit(child.shadowRoot);
      else visit(child);
    }
  };
  visit(root);
  return found;
}

export function focusElement(el: HTMLElement | null | undefined) {
  if (!el) return;
  const inner = el.shadowRoot?.querySelector(FOCUSABLE) as HTMLElement | null;
  (inner ?? el).focus();
}

export function trapTabKey(root: ParentNode, event: KeyboardEvent) {
  if (event.key !== "Tab") return;
  const items = collectFocusable(root);
  if (!items.length) {
    event.preventDefault();
    return;
  }
  const active = deepActiveElement();
  let index = items.findIndex(
    (el) =>
      el === active ||
      el.contains(active) ||
      el.shadowRoot?.activeElement === active,
  );
  if (index < 0) index = event.shiftKey ? 0 : -1;
  event.preventDefault();
  const next = event.shiftKey
    ? items[(index - 1 + items.length) % items.length]
    : items[(index + 1) % items.length];
  focusElement(next);
}
