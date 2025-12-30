import { normalizeChild } from "./elemen.js";

export function render(node, container) {
  if (!(container instanceof Element)) {
    throw new Error("Target render harus berupa elemen DOM.");
  }
  container.innerHTML = "";
  const nodes = normalizeChild(node);
  for (const child of nodes) {
    container.appendChild(child);
  }
  return container;
}
