import fs from "node:fs/promises";
import path from "node:path";

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".jsi": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json; charset=utf-8",
};

function getContentType(filePath) {
  return contentTypes[path.extname(filePath)] ?? "application/octet-stream";
}

function safeJoin(root, requested) {
  const resolvedPath = path.normalize(path.join(root, requested));
  if (!resolvedPath.startsWith(path.normalize(root))) {
    return null;
  }
  return resolvedPath;
}

export function createStaticHandler({ root, index = "index.html", fallback }) {
  return async function handle(req, res) {
    const url = new URL(req.url ?? "/", "http://localhost");
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith("/")) {
      pathname = `${pathname}${index}`;
    }
    const filePath = safeJoin(root, pathname.slice(1));
    if (!filePath) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    try {
      const data = await fs.readFile(filePath);
      res.writeHead(200, { "Content-Type": getContentType(filePath) });
      res.end(data);
    } catch (error) {
      if (fallback) {
        const response = await fallback(req, res);
        if (response !== false) {
          return;
        }
      }
      res.writeHead(404);
      res.end("Not Found");
    }
  };
}
