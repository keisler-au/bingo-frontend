import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Share } from "react-native";
import useWebSocket from "react-use-websocket";
import IconHeader from "./IconHeader";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Sentry from "sentry-expo";
// @ts-ignore
import BottomSheet from "react-native-simple-bottom-sheet";
import { useNetInfo } from "@react-native-community/netinfo";
// @ts-ignore
import { isEqual } from "lodash";
import { URLS } from "../constants";
import { RootStackParamList, Task as Square } from "../types";
import {
  saveGameToStorage,
  saveToQueue,
  sendSavedQueue,
  updateGame,
  verifyEarliestCompletedSquare,
} from "../utils/gameActions";
import FailedConnectionModal from "./FailedConnectionModal";
import RequestService from "../services";
import GameGrid from "./GameGrid";
import { StackScreenProps } from "@react-navigation/stack";
import ScreenBackground from "./ScreenBackground";

const webSocketConfig = {
  heartbeat: {
    message: "heartbeat",
    returnMessage: "thump",
    timeout: 60000, // 1 minute, if no response received, the connection is closed
    interval: 25000, // every 25 seconds a ping message will be sent
  },
  shouldReconnect: (_: any) => true,
  retryOnError: true,
  reconnectInterval: (attempt: number) =>
    Math.min(Math.pow(2, attempt) * 1000, 12000),
  onOpen: () => console.log("WebSocket connected"),
  onClose: (event: any) =>
    console.log(`WebSocket closed: ${event.reason}, reconnecting...`),
};

type PlayProps = StackScreenProps<RootStackParamList, "Play">;
const Play = ({ route }: PlayProps) => {
  const [game, setGame] = useState(route.params.game.tasks);
  const [saveGame, setSaveGame] = useState(true);
  const [completedSquare, setCompletedSquare] = useState<Square | null>(null);
  const [errorModal, setErrorModal] = useState<string | false>(false);
  const player = route.params.player;
  const netInfo = useNetInfo();
  const isOffline = !netInfo.isConnected;

  useEffect(() => {
    if (saveGame && route.params.game) {
      saveGameToStorage({ ...route.params.game, tasks: game });
      setSaveGame(false);
    }
  }, [saveGame, route.params.game]);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket<{ data: any }>(
    `${URLS.WEBSOCKET_UPDATES_URL}${route.params.game.id}/${player.id}/`,
    {
      onReconnectStop: (e) => {
        setErrorModal(RequestService.WEBSOCKET_FAILURE);
        Sentry.Native.captureException(e);
      },
      filter: (message) => {
        const data = JSON.parse(message.data);
        return data.task && data.task.completed_by.id !== player.id;
      },
      ...webSocketConfig,
    },
  );

  useEffect(() => {
    if (lastJsonMessage?.data) {
      const recievedSquare = lastJsonMessage.data.task;
      const earliestSquare = verifyEarliestCompletedSquare(
        recievedSquare,
        game[recievedSquare.grid_row][recievedSquare.grid_column],
      );
      if (isEqual(recievedSquare, earliestSquare)) {
        const updatedGame = updateGame(recievedSquare, game);
        setGame(updatedGame);
        saveGameToStorage({ ...route.params.game, tasks: updatedGame });
      }
    }
  }, [lastJsonMessage, game, player.id, route.params.game]);

  useEffect(() => {
    if (isOffline === null) return;
    if (isOffline && completedSquare) {
      saveToQueue(completedSquare);
      setCompletedSquare(null);
    } else if (completedSquare) {
      sendJsonMessage(completedSquare);
      setCompletedSquare(null);
    } else if (isOffline) {
      saveGameToStorage({ ...route.params.game, tasks: game });
    } else {
      sendSavedQueue(sendJsonMessage);
    }
  }, [isOffline, completedSquare, sendJsonMessage, game, route.params.game]);

  const shareContent = async () =>
    await Share.share({ message: route.params.game.code });

  const taskCompleted = async (square: Square) => {
    const currentSquare = game[square.grid_row][square.grid_column];
    const earliestSquare = verifyEarliestCompletedSquare(square, currentSquare);
    if (isEqual(square, earliestSquare)) {
      square = {
        ...square,
        completed: true,
        completed_by: player,
        currentSession: true,
      };
      const updatedGame = updateGame(square, game);
      setGame(updatedGame);
      saveGameToStorage({ ...route.params.game, tasks: updatedGame });
      setCompletedSquare(square);
    }
  };

  const taskDisplayChange = (square: Square) => {
    const updatedGame = updateGame(square, game);
    setGame(updatedGame);
  };

  return (
    <ScreenBackground localStyles={styles.screenContainer}>
      <IconHeader icons={[{ type: "home-outline", path: "Home" }]} />
      <Text style={styles.gameCode}>Game Code</Text>
      <View testID="shareButton" style={styles.shareContainer}>
        <Text style={styles.code}>{route.params.game.code}</Text>
        <Feather name="share" onPress={shareContent} size={25} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{route.params.game.title}</Text>
      </View>
      <GameGrid
        game={game}
        onComplete={taskCompleted}
        onDisplayChange={taskDisplayChange}
      />
      <BottomSheet
        isOpen={false}
        sliderMinHeight={40}
        wrapperStyle={{
          shadowOpacity: 1,
          shadowColor: "#ffffff",
          shadowRadius: 1,
          shadowOffset: { width: 0, height: -5 },
        }}
        outerContentStyle={{ backgroundColor: "#ffffff" }}
      >
        <View style={styles.users}>
          {route.params.game.players.map((player) => (
            <View key={player.id} style={styles.profileContainer}>
              <Ionicons name="person-circle-outline" size={20} />
              <Text>{player.name}</Text>
            </View>
          ))}
        </View>
      </BottomSheet>
      <FailedConnectionModal
        displayModal={!!errorModal}
        message={errorModal}
        onClose={() => setErrorModal(false)}
      />
    </ScreenBackground>
  );
};

export default Play;

const styles = StyleSheet.create({
  screenContainer: {
    alignItems: "center",
    height: "100%",
  },
  gameCode: {
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 100,
  },
  shareContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    marginTop: 10,
  },
  code: {
    marginTop: 5,
    letterSpacing: 4,
    fontSize: 25,
  },
  titleContainer: {
    marginTop: 60,
    height: 25,
  },
  title: {
    marginBottom: 2,
    fontSize: 18,
    textAlign: "center",
  },
  users: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    paddingBottom: 20,
    paddingLeft: 20,
  },
  profileContainer: {
    flexDirection: "row",
    gap: 10,
  },
});
