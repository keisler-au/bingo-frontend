import * as Sentry from "sentry-expo";

let URLS: { [key: string]: string };
let STORAGE_KEYS: { [key: string]: string };
const SENTRY_DNS = process.env.EXPO_PUBLIC_SENTRY_DNS || "";
const SERVER = __DEV__
  ? process.env.EXPO_PUBLIC_DEV_SERVER
  : process.env.EXPO_PUBLIC_PROD_SERVER;

if (!SERVER) {
  console.error(`SERVER = ${SERVER}, __DEV__ = ${__DEV__}`);
  Sentry.Native.captureException(`SERVER = ${SERVER}, __DEV__ = ${__DEV__}`);
}
URLS = {
  PUBLISH_GAME_URL: `https://${SERVER}/${process.env.EXPO_PUBLIC_PUBLISH_GAME}`,
  JOIN_GAME_URL: `https://${SERVER}/${process.env.EXPO_PUBLIC_JOIN_GAME}`,
  CREATE_PLAYER_URL: `https://${SERVER}/${process.env.EXPO_PUBLIC_CREATE_PLAYER}`,
  FEEDBACK_URL: `https://${SERVER}/${process.env.EXPO_PUBLIC_FEEDBACK}`,
  WEBSOCKET_UPDATES_URL: `wss://${SERVER}/${process.env.EXPO_PUBLIC_GAME_UPDATES}`,
  SENTRY_DNS,
};

STORAGE_KEYS = {};
["player", "offlineUpdatesQueue", "offlineGameState", "gameHistory"].forEach(
  (key) => (STORAGE_KEYS[key] = key),
);

export { STORAGE_KEYS, URLS };

export default {};
