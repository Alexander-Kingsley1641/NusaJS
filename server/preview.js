import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createStaticHandler } from "./static.js";
import { loadConfig } from "../shared/config.js";
import { logger } from "../shared/logger.js";

async function startPreview() {
  const config = await loadConfig();
  const outDir = path.resolve(config.root, config.outDir);
  const port = Number(process.env.PORT) || 5000;

  if (!fs.existsSync(outDir)) {
    logger.warn(`Folder build tidak ditemukan: ${outDir}`);
  }

  const handler = createStaticHandler({ root: outDir });
  const server = http.createServer((req, res) => {
    handler(req, res);
  });

  server.listen(port, () => {
    logger.success(`Preview tersedia di http://localhost:${port}`);
  });
}

startPreview();
