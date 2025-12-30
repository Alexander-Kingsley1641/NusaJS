import test from "node:test";
import assert from "node:assert/strict";
import { createClient } from "../../runtime/discord/client.js";

test("client dapat menjalankan command simulasi", async () => {
  const client = createClient();
  client.registerCommand({
    name: "ping",
    execute: () => "Pong!",
  });
  const result = await client.simulateCommand("ping");
  assert.equal(result, "Pong!");
});
