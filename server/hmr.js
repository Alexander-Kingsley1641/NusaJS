import fs from "node:fs";
import path from "node:path";

export function createHmr({ root, logger }) {
  const clients = new Set();
  let watcher;

  function handler(req, res) {
    if (req.url !== "/__hmr") {
      return false;
    }
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    });
    res.write("\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return true;
  }

  function broadcast(message = "reload") {
    for (const client of clients) {
      client.write(`data: ${message}\n\n`);
    }
  }

  function watch() {
    if (watcher || !root) {
      return;
    }
    watcher = fs.watch(root, { recursive: true }, (event, filename) => {
      if (!filename) {
        return;
      }
      const ext = path.extname(filename);
      if (ext === ".jsi" || ext === ".js" || ext === ".html" || ext === ".css") {
        logger?.info(`HMR reload: ${filename}`);
        broadcast("reload");
      }
    });
  }

  function close() {
    watcher?.close();
    watcher = undefined;
    for (const client of clients) {
      client.end();
    }
    clients.clear();
  }

  return { handler, broadcast, watch, close };
}
