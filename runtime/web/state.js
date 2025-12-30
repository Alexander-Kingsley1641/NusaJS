export function state(initial) {
  let value = initial;
  const listeners = new Set();

  const get = () => value;
  const set = (next) => {
    value = typeof next === "function" ? next(value) : next;
    for (const listener of listeners) {
      listener(value);
    }
  };
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { get, set, subscribe };
}
