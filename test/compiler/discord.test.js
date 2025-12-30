import test from "node:test";
import assert from "node:assert/strict";
import { compile } from "../../compiler/discord/compile.js";

test("compiler discord menyisipkan banner", () => {
  const source = "@use discord\nexport default 42;";
  const output = compile(source);
  assert.ok(output.startsWith("// Compiled with NusaJS (discord)"));
  assert.ok(output.includes("export default 42"));
});
