import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export function toPosixPath(inputPath) {
  return inputPath.replace(/\\/g, "/");
}

export function resolveFrom(base, ...segments) {
  return path.resolve(base, ...segments);
}

export function ensureSlashEnd(inputPath) {
  return inputPath.endsWith(path.sep) ? inputPath : `${inputPath}${path.sep}`;
}

export function toFileUrl(inputPath) {
  return pathToFileURL(inputPath).href;
}

export function fromFileUrl(url) {
  return fileURLToPath(url);
}
