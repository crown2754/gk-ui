type SizeHost = HTMLElement & {
  hasUpdated: boolean;
  __gkApplyingSize?: boolean;
};

/** Traditional Chinese when the element, an ancestor, or the document says zh. */
export function prefersZh(el: HTMLElement) {
  const lang = (
    el.lang ||
    el.closest("[lang]")?.getAttribute("lang") ||
    (typeof document !== "undefined" ? document.documentElement.lang : "") ||
    ""
  ).toLowerCase();
  return lang.startsWith("zh");
}

/**
 * A size attribute from the parser (before connect) or a later user assignment
 * is owned. The reflected default `md` during the first update is not.
 * Form assignment sets `__gkApplyingSize` so it is not treated as user-owned.
 */
export function markOwnedSize(el: SizeHost, name: string) {
  if (name !== "size" || el.__gkApplyingSize) return;
  if ((el.hasUpdated || !el.isConnected) && el.getAttribute("size")) {
    el.setAttribute("data-gk-size-own", "");
    el.removeAttribute("data-gk-size-from-form");
  }
}

export function assignFormSize(el: HTMLElement & { size?: string }, size: string) {
  const host = el as SizeHost;
  host.__gkApplyingSize = true;
  el.setAttribute("data-gk-size-from-form", "");
  el.removeAttribute("data-gk-size-own");
  if (el.size !== size) el.size = size;
  else if (el.getAttribute("size") !== size) el.setAttribute("size", size);
  queueMicrotask(() => {
    host.__gkApplyingSize = false;
  });
}

export function shouldInheritSize(el: HTMLElement) {
  if (el.hasAttribute("data-gk-size-own")) return false;
  if (el.hasAttribute("data-gk-size-from-form")) return true;
  const size = el.getAttribute("size");
  return size == null || size === "md";
}
