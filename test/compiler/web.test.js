import test from "node:test";
import assert from "node:assert/strict";
import { compile } from "../../compiler/web/compile.js";

test("compiler web menghasilkan output JS", () => {
  const source = "@use web\nexport const nilai = 1;";
  const output = compile(source, { hmr: true });
  assert.ok(output.includes("export const nilai = 1"));
  assert.ok(output.includes("EventSource"));
});
