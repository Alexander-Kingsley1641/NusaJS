import { formatWaktu } from "./waktu.js";

const levels = {
  info: "INFO",
  warn: "WARN",
  error: "ERROR",
  success: "OK",
  debug: "DEBUG",
};

function write(level, message) {
  const time = formatWaktu();
  const label = levels[level] ?? "LOG";
  const text = `[${time}] ${label} ${message}`;
  if (level === "error") {
    console.error(text);
    return;
  }
  if (level === "warn") {
    console.warn(text);
    return;
  }
  console.log(text);
}

export function createLogger(prefix = "") {
  const withPrefix = (msg) => (prefix ? `${prefix} ${msg}` : msg);
  return {
    info: (msg) => write("info", withPrefix(msg)),
    warn: (msg) => write("warn", withPrefix(msg)),
    error: (msg) => write("error", withPrefix(msg)),
    success: (msg) => write("success", withPrefix(msg)),
    debug: (msg) => write("debug", withPrefix(msg)),
  };
}

export const logger = createLogger("nusajs");
