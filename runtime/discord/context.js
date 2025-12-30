export function createContext({ client, config, logger }) {
  return {
    client,
    config,
    logger,
    commands: [],
    events: [],
    state: new Map(),
  };
}
