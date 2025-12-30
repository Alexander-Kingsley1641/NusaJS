import { render } from "./render.js";

export function mount(component, target = "#app", props = {}) {
  const container =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!container) {
    throw new Error("Target mount tidak ditemukan.");
  }
  const node = typeof component === "function" ? component(props) : component;
  return render(node, container);
}
