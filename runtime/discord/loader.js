import fs from "node:fs/promises";
import path from "node:path";
import { compile } from "../../compiler/discord/compile.js";
import { listFiles, isJsiFile, toFileUrl } from "./helpers.js";

async function importModule(filePath) {
  if (isJsiFile(filePath)) {
    const source = await fs.readFile(filePath, "utf-8");
    const code = compile(source, { filename: filePath });
    const encoded = Buffer.from(code, "utf-8").toString("base64");
    const url = `data:text/javascript;base64,${encoded}`;
    return import(url);
  }
  return import(toFileUrl(filePath));
}

async function loadFromDir(dir) {
  const files = listFiles(dir, [".jsi", ".js"]);
  const modules = [];
  for (const file of files) {
    const mod = await importModule(file);
    modules.push({
      file,
      module: mod.default ?? mod,
    });
  }
  return modules;
}

export async function loadModules({ commandsDir, eventsDir }) {
  const commands = commandsDir ? await loadFromDir(commandsDir) : [];
  const events = eventsDir ? await loadFromDir(eventsDir) : [];
  return { commands, events };
}

export async function loadBotConfig(botFile) {
  if (!botFile) {
    return null;
  }
  try {
    const mod = await importModule(botFile);
    return mod.default ?? mod;
  } catch (error) {
    return null;
  }
}
