import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const defaultConfig = {
  root: process.cwd(),
  srcDir: "src",
  publicDir: "public",
  outDir: "dist",
  commandsDir: "src/commands",
  eventsDir: "src/events",
};

export function defineConfig(config) {
  return config;
}

export async function loadConfig(cwd = process.cwd()) {
  const configPath = path.join(cwd, "nusajs.config.js");
  if (!fs.existsSync(configPath)) {
    return { ...defaultConfig, root: cwd };
  }
  const mod = await import(pathToFileURL(configPath).href);
  const config = mod.default ?? mod.config ?? {};
  return { ...defaultConfig, ...config, root: cwd };
}
