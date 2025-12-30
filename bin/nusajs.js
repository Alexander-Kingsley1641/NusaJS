#!/usr/bin/env node
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { logger } from "../shared/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frameworkRoot = path.resolve(__dirname, "..");

const pkg = JSON.parse(
  await fs.readFile(new URL("../package.json", import.meta.url), "utf-8")
);

const command = process.argv[2];
const args = process.argv.slice(3);

function printHelp() {
  console.log(`NusaJS CLI v${pkg.version}

Perintah:
  dev               Jalankan dev server web
  build             Build proyek web
  preview           Preview hasil build
  bot               Jalankan bot discord (mode simulasi)
  create <type> <dir>  Buat proyek baru (type: web|discord)
  --version         Lihat versi
  --help            Tampilkan bantuan
`);
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

async function createProject(type, targetDir) {
  const templateDir = path.resolve(frameworkRoot, "templates", type);
  if (!fsSync.existsSync(templateDir)) {
    logger.error(`Template tidak ditemukan: ${type}`);
    process.exitCode = 1;
    return;
  }
  await fs.mkdir(targetDir, { recursive: true });
  const entries = await fs.readdir(targetDir);
  if (entries.length > 0) {
    logger.warn("Folder tujuan tidak kosong. File akan ditimpa jika sama.");
  }
  await copyDir(templateDir, targetDir);
  logger.success(`Template ${type} dibuat di ${targetDir}`);
}

async function run() {
  if (!command || command === "--help" || command === "-h") {
    printHelp();
    return;
  }
  if (command === "--version" || command === "-v") {
    console.log(pkg.version);
    return;
  }

  if (command === "create") {
    const [type, dir] = args;
    if (!type || !dir) {
      logger.warn("Gunakan: nusajs create <web|discord> <dir>");
      process.exitCode = 1;
      return;
    }
    await createProject(type, path.resolve(process.cwd(), dir));
    return;
  }

  if (command === "dev") {
    await import(pathToFileURL(path.join(frameworkRoot, "server/dev.js")).href);
    return;
  }

  if (command === "build") {
    await import(pathToFileURL(path.join(frameworkRoot, "server/build.js")).href);
    return;
  }

  if (command === "preview") {
    await import(
      pathToFileURL(path.join(frameworkRoot, "server/preview.js")).href
    );
    return;
  }

  if (command === "bot") {
    const mod = await import(
      pathToFileURL(path.join(frameworkRoot, "runtime/discord/client.js")).href
    );
    if (typeof mod.runBot === "function") {
      await mod.runBot({ root: process.cwd() });
      return;
    }
    logger.warn("Runtime discord tidak tersedia.");
    return;
  }

  logger.warn(`Perintah tidak dikenal: ${command}`);
  printHelp();
}

run().catch((error) => {
  logger.error(error.message);
  process.exitCode = 1;
});
