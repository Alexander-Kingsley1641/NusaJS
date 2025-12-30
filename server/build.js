import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../shared/config.js";
import { logger } from "../shared/logger.js";
import { compile } from "../compiler/web/compile.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frameworkRoot = path.resolve(__dirname, "..");

function resolveDir(root, dirName, fallbackRelative) {
  const primary = path.resolve(root, dirName);
  if (fsSync.existsSync(primary)) {
    return primary;
  }
  return path.resolve(frameworkRoot, fallbackRelative);
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function compileDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await compileDir(srcPath, destPath);
      continue;
    }
    if (entry.name.endsWith(".jsi")) {
      const source = await fs.readFile(srcPath, "utf-8");
      const code = compile(source, { filename: srcPath });
      await fs.writeFile(destPath, code, "utf-8");
      continue;
    }
    await fs.copyFile(srcPath, destPath);
  }
}

async function build() {
  const config = await loadConfig();
  const root = config.root;
  const publicDir = resolveDir(root, config.publicDir, "templates/web/public");
  const srcDir = resolveDir(root, config.srcDir, "templates/web/src");
  const outDir = path.resolve(root, config.outDir);
  const runtimeNode = path.resolve(root, "node_modules", "nusajs", "runtime");
  const runtimeSource = fsSync.existsSync(runtimeNode)
    ? runtimeNode
    : path.resolve(frameworkRoot, "runtime");
  const runtimeDest = path.join(outDir, "@nusajs", "runtime");

  await fs.mkdir(outDir, { recursive: true });
  await copyDir(publicDir, outDir);
  await compileDir(srcDir, path.join(outDir, config.srcDir));
  await copyDir(runtimeSource, runtimeDest);

  logger.success(`Build selesai: ${outDir}`);
}

build().catch((error) => {
  logger.error(`Build gagal: ${error.message}`);
  process.exitCode = 1;
});
