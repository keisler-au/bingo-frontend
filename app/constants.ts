const SENTRY_DNS = process.env.EXPO_PUBLIC_SENTRY_DNS;
const SERVER =
  process.env.NODE_ENV === "production"
    ? process.env.EXPO_PUBLIC_PROD_SERVER
    : process.env.EXPO_PUBLIC_DEV_SERVER;
export const URLS = {
  PUBLISH_GAME_URL: `https://${SERVER}/${process.env.EXPO_PUBLIC_PUBLISH_GAME}`,
  JOIN_GAME_URL: `https://${SERVER}/${process.env.EXPO_PUBLIC_JOIN_GAME}`,
  CREATE_PLAYER_URL: `https://${SERVER}/${process.env.EXPO_PUBLIC_CREATE_PLAYER}`,
  WEBSOCKET_UPDATES_URL: `wss://${SERVER}/${process.env.EXPO_PUBLIC_GAME_UPDATES}`,
  SENTRY_DNS,
};

const STORAGE_KEYS: { [key: string]: string } = {};
["player", "offlineUpdatesQueue", "offlineGameState"].forEach(
  (key) => (STORAGE_KEYS[key] = key),
);
export { STORAGE_KEYS };

export default {};
