import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

test("CLI tersedia dan memiliki shebang", async () => {
  const cliPath = path.join(root, "bin", "nusajs.js");
  const content = await fs.readFile(cliPath, "utf-8");
  assert.ok(content.startsWith("#!/usr/bin/env node"));
});
