import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export function listFiles(dir, extensions = []) {
  const results = [];
  if (!fs.existsSync(dir)) {
    return results;
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFiles(fullPath, extensions));
      continue;
    }
    if (extensions.length === 0 || extensions.includes(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }
  return results;
}

export function isJsiFile(filePath) {
  return path.extname(filePath) === ".jsi";
}

export function toFileUrl(filePath) {
  return pathToFileURL(filePath).href;
}
