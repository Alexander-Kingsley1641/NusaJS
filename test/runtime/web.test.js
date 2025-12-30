import test from "node:test";
import assert from "node:assert/strict";
import { state } from "../../runtime/web/state.js";

test("state menyimpan dan memperbarui nilai", () => {
  const store = state(0);
  let latest = null;
  const unsubscribe = store.subscribe((value) => {
    latest = value;
  });
  store.set(2);
  assert.equal(store.get(), 2);
  assert.equal(latest, 2);
  unsubscribe();
});
