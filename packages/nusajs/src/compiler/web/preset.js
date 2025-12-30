export function createWebPreset(options = {}) {
  return {
    banner: "// Compiled with NusaJS (web)",
    hmr: options.hmr ?? false,
  };
}

export const webPreset = createWebPreset();
