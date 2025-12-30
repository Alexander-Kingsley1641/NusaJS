import fs from "node:fs";
import path from "node:path";

export function resolveImport(specifier, basedir) {
  if (!specifier.startsWith(".")) {
    return specifier;
  }
  const resolved = path.resolve(basedir, specifier);
  if (path.extname(resolved) && fs.existsSync(resolved)) {
    return specifier;
  }
  const jsiPath = `${resolved}.jsi`;
  if (fs.existsSync(jsiPath)) {
    return `${specifier}.jsi`;
  }
  const jsPath = `${resolved}.js`;
  if (fs.existsSync(jsPath)) {
    return `${specifier}.js`;
  }
  return specifier;
}
