import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

import { Game, Task as Square } from "../types";
import { STORAGE_KEYS } from "../constants";
import { addDisplayTextDetails } from "./displayText";

export const getStoredPlayer = async () => {
  const storedPlayer = await getItemAsync(STORAGE_KEYS.player);
  return storedPlayer ? JSON.parse(storedPlayer) : null;
};

export const saveToQueue = async (square: Square) => {
  const storedData = await getItemAsync(STORAGE_KEYS.offlineUpdatesQueue);
  const dataArray = storedData ? JSON.parse(storedData) : [];
  dataArray.push(square);
  setItemAsync(STORAGE_KEYS.offlineUpdatesQueue, JSON.stringify(dataArray));
};

export const sendSavedQueue = async (sendJsonMessage: Function) => {
  const offlineUpdates = await getItemAsync(STORAGE_KEYS.offlineUpdatesQueue);
  if (offlineUpdates) {
    JSON.parse(offlineUpdates).forEach((square: Square) =>
      sendJsonMessage(square),
    );
    await deleteItemAsync(STORAGE_KEYS.offlineUpdatesQueue);
  }
};

export const updateGame = (square: Square, game: Square[][]) => {
  square = addDisplayTextDetails(square);
  let updated = game.map((row) => [...row]);
  updated[square.grid_row][square.grid_column] = square;
  return updated;
};

export const getGameHistory = async () => {
  return JSON.parse(await getItemAsync(STORAGE_KEYS.gameHistory)) || [];
};

export const addToGameHistory = async (game: Game) => {
  const gameHistory = await getGameHistory();
  const gameAlreadyAdded = gameHistory.some(
    (g: { code: string }) => g.code === game.code,
  );
  if (!gameAlreadyAdded) {
    const currentGame = {
      title: game.title,
      code: game.code,
      date: new Date(Date.now()).toLocaleDateString(),
    };
    await setItemAsync(
      STORAGE_KEYS.gameHistory,
      JSON.stringify([...gameHistory, currentGame]),
    );
  }
};

export const saveGameToStorage = async (game: Game) => {
  const lastSaved = Date.now();
  await setItemAsync(
    STORAGE_KEYS.offlineGameState,
    JSON.stringify({ ...game, lastSaved }),
  );
};

export const verifyEarliestCompletedSquare = (
  pushSquare: Square,
  currentSquare: Square,
) => {
  if (pushSquare.game_id === currentSquare.game_id) {
    const pushSquareIsEarlier =
      new Date(pushSquare.last_updated) < new Date(currentSquare.last_updated);
    return pushSquareIsEarlier ? pushSquare : currentSquare;
  }
};

export const reformatGame = (game: string[]) =>
  Array.from({ length: 5 }, (_, rowIndex) =>
    game.slice(rowIndex * 5, (rowIndex + 1) * 5),
  );

export default {};
