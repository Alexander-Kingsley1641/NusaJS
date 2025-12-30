const border = "─".repeat(36);

export function formatBanner({ name = "NusaJS", status = "Pre-Alpha" } = {}) {
  return [
    border,
    `${name} · ${status}`,
    "Framework JavaScript Indonesia",
    border,
  ].join("\n");
}

export function printBanner(options) {
  console.log(formatBanner(options));
}
