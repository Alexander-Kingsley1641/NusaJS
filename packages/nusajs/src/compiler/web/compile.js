import { tokenize } from "../shared/tokenizer.js";
import { parse } from "../shared/parser.js";
import { transform } from "../shared/transform.js";
import { createWebPreset } from "./preset.js";

export function compile(source, options = {}) {
  const tokens = tokenize(source, { filename: options.filename ?? "" });
  const ast = parse(tokens);
  const preset = createWebPreset({ hmr: options.hmr });
  return transform(ast, { ...preset, ...options });
}
