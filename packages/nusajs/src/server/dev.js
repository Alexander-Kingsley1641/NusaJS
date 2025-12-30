import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createStaticHandler } from "./static.js";
import { createHmr } from "./hmr.js";
import { logger } from "../shared/logger.js";
import { loadConfig } from "../shared/config.js";
import { compile } from "../compiler/web/compile.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frameworkRoot = path.resolve(__dirname, "../..");

function resolveDir(root, dirName, fallbackRelative) {
  const primary = path.resolve(root, dirName);
  if (fs.existsSync(primary)) {
    return primary;
  }
  return path.resolve(frameworkRoot, fallbackRelative);
}

async function startDevServer() {
  const config = await loadConfig();
  const root = config.root;
  const publicDir = resolveDir(root, config.publicDir, "templates/web/public");
  const srcDir = resolveDir(root, config.srcDir, "templates/web/src");
  const port = Number(process.env.PORT) || 3000;

  const hmr = createHmr({ root, logger });
  hmr.watch();

  const staticHandler = createStaticHandler({
    root: publicDir,
    fallback: async (req, res) => {
      const url = new URL(req.url ?? "/", "http://localhost");
      const pathname = decodeURIComponent(url.pathname);
      if (pathname.startsWith("/@nusajs/")) {
        const subpath = pathname.replace("/@nusajs/", "");
        if (!subpath.startsWith("runtime/web/")) {
          return false;
        }
        const runtimeRelative = subpath.replace(/^runtime[\\/]+web[\\/]+/, "");
        const candidates = [
          path.resolve(root, "node_modules", "nusajs-dom", "src", runtimeRelative),
          path.resolve(frameworkRoot, "..", "nusajs-dom", "src", runtimeRelative),
        ];
        const target = candidates.find((candidate) => fs.existsSync(candidate));
        if (!target) {
          return false;
        }
        const source = fs.readFileSync(target);
        res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8" });
        res.end(source);
        return true;
      }
      if (pathname === "/" || pathname === "/index.html") {
        const indexPath = path.join(publicDir, "index.html");
        if (fs.existsSync(indexPath)) {
          return false;
        }
        const body = `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>NusaJS</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/index.jsi"></script>
  </body>
</html>`;
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(body);
        return true;
      }
      if (pathname.endsWith(".jsi")) {
        const relativePath = pathname.startsWith("/")
          ? pathname.slice(1)
          : pathname;
        const filePath = path.resolve(root, relativePath);
        const fallbackPath = path.resolve(srcDir, relativePath.replace(/^src[\\/]/, ""));
        const targetPath = fs.existsSync(filePath) ? filePath : fallbackPath;
        if (!fs.existsSync(targetPath)) {
          return false;
        }
        const source = fs.readFileSync(targetPath, "utf-8");
        const code = compile(source, { filename: targetPath, hmr: true });
        res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8" });
        res.end(code);
        return true;
      }
      return false;
    },
  });

  const server = http.createServer(async (req, res) => {
    if (hmr.handler(req, res)) {
      return;
    }
    await staticHandler(req, res);
  });

  server.listen(port, () => {
    logger.success(`Dev server ready at http://localhost:${port}`);
  });

  process.on("SIGINT", () => {
    hmr.close();
    server.close(() => process.exit(0));
  });
}

startDevServer();
