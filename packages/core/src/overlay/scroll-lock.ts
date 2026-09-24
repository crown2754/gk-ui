let locks = 0;
let previousOverflow = "";

export function acquireScrollLock() {
  if (typeof document === "undefined") return;
  if (locks === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  locks += 1;
}

export function releaseScrollLock() {
  if (locks === 0) return;
  locks -= 1;
  if (locks === 0 && typeof document !== "undefined") {
    document.body.style.overflow = previousOverflow;
  }
}
