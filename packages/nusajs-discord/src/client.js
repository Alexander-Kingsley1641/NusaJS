import { EventEmitter } from "node:events";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createContext } from "./context.js";
import { loadModules, loadBotConfig } from "./loader.js";

const defaultConfig = {
  root: process.cwd(),
  srcDir: "src",
  commandsDir: "src/commands",
  eventsDir: "src/events",
};

function createLogger(prefix = "nusajs-discord") {
  const format = (level, message) =>
    `[${new Date().toISOString()}] ${level} ${prefix} ${message}`;
  return {
    info: (msg) => console.log(format("INFO", msg)),
    warn: (msg) => console.warn(format("WARN", msg)),
    error: (msg) => console.error(format("ERROR", msg)),
    success: (msg) => console.log(format("OK", msg)),
  };
}

async function loadConfig(root) {
  const configPath = path.join(root, "nusajs.config.js");
  if (!fs.existsSync(configPath)) {
    return { ...defaultConfig, root };
  }
  const mod = await import(pathToFileURL(configPath).href);
  const config = mod.default ?? mod.config ?? {};
  return { ...defaultConfig, ...config, root };
}

const defaultLogger = createLogger();

export class NusaDiscordClient extends EventEmitter {
  constructor(options = {}) {
    super();
    this.options = options;
    this.commands = new Map();
  }

  registerCommand(command) {
    if (!command || !command.name) {
      return;
    }
    this.commands.set(command.name, command);
  }

  registerEvent(eventName, handler) {
    if (!eventName || typeof handler !== "function") {
      return;
    }
    this.on(eventName, handler);
  }

  async login(token = "") {
    this.token = token;
    process.nextTick(() => this.emit("ready"));
    return true;
  }

  async simulateCommand(name, payload = {}) {
    const command = this.commands.get(name);
    if (command && typeof command.execute === "function") {
      return command.execute(payload, this);
    }
    return null;
  }
}

export function createClient(options = {}) {
  return new NusaDiscordClient(options);
}

function resolveBotFile(root, srcDir) {
  const candidates = [
    path.join(root, srcDir, "bot.jsi"),
    path.join(root, srcDir, "bot.js"),
  ];
  return candidates.find((file) => fs.existsSync(file)) ?? null;
}

export async function runBot({
  root = process.cwd(),
  token,
  logger = defaultLogger,
} = {}) {
  const config = await loadConfig(root);
  const client = createClient(config);
  const context = createContext({ client, config, logger });

  const botFile = resolveBotFile(root, config.srcDir);
  const botConfig = await loadBotConfig(botFile);
  if (botConfig && typeof botConfig.setup === "function") {
    await botConfig.setup(context);
  }

  const commandsDir = path.resolve(root, config.commandsDir);
  const eventsDir = path.resolve(root, config.eventsDir);
  const { commands, events } = await loadModules({
    commandsDir: fs.existsSync(commandsDir) ? commandsDir : null,
    eventsDir: fs.existsSync(eventsDir) ? eventsDir : null,
  });

  for (const entry of commands) {
    const command = entry.module;
    if (command) {
      context.commands.push(command);
      client.registerCommand(command);
    }
  }

  for (const entry of events) {
    const event = entry.module;
    if (!event) {
      continue;
    }
    const eventName = event.event ?? event.name;
    if (!eventName || typeof event.execute !== "function") {
      continue;
    }
    context.events.push(event);
    client.registerEvent(eventName, (...args) => event.execute(context, ...args));
  }

  const tokenEnv = botConfig?.tokenEnv ?? "NUSA_TOKEN";
  const resolvedToken = token ?? process.env[tokenEnv] ?? "";
  await client.login(resolvedToken);
  logger.success(
    `Bot aktif (simulasi). Commands: ${client.commands.size}, Events: ${context.events.length}`
  );

  return client;
}

const isDirectRun = import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  runBot().catch((error) => {
    defaultLogger.error(`Bot gagal: ${error.message}`);
    process.exitCode = 1;
  });
}
