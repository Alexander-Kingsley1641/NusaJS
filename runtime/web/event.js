export function on(target, event, handler, options) {
  if (!target || typeof target.addEventListener !== "function") {
    throw new Error("Target event harus berupa elemen DOM.");
  }
  target.addEventListener(event, handler, options);
  return () => target.removeEventListener(event, handler, options);
}
