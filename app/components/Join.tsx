import { useState, useRef, useEffect, useContext } from "react";
import {
  ActivityIndicator,
  View,
  TextInput,
  StyleSheet,
  Text,
  Pressable,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import CreateProfileModal from "./CreateProfileModal";
import FailedConnectionModal from "./FailedConnectionModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS, URLS } from "../constants";
import useGameEntry from "../utils/useGameEntry";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyleContext } from "./settingsUtils";

const MAIN_FONT_FAMILY = "Verdana";

const JoinGameInput = () => {
  const navigation = useNavigation();
  const { globalStyles } = useContext(GlobalStyleContext);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [active, setActive] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [previousGame, setPreviousGame] = useState();
  const inputs = useRef<(TextInput | null)[]>([]);
  const netInfo = useNetInfo();
  const isOffline = !netInfo.isConnected;
  const {
    loading,
    playerModal,
    setPlayerModal,
    error,
    setError,
    handleGameEntry,
  } = useGameEntry();

  useEffect(() => {
    const enterPreviousGameCode = async () => {
      const storedGame = await AsyncStorage.getItem(
        STORAGE_KEYS.offlineGameState,
      );
      const game = JSON.parse(storedGame || "{}");
      if (game) {
        setPreviousGame(game);
        const twentyFourHours = 24 * (60 * 60 * 1000);
        const previousSave = new Date(game.lastSaved).getTime();
        if (new Date().getTime() - previousSave < twentyFourHours) {
          setCode(game.code.split(""));
          setSubmit(true);
        }
      }
    };
    const focusListener = navigation.addListener(
      "focus",
      enterPreviousGameCode,
    );
    return () => {
      focusListener();
    };
  }, [navigation]);

  const handleChange = (text: string, index: number) => {
    if (!/^[A-Z0-9]*$/.test(text)) return;
    if (text.length > 1 && text.length < 6) return;
    let nextFocus = text && index < 5 ? index + 1 : index;
    let newCode = [...code];
    newCode[index] = text;
    if (text.length === 6 && !index) {
      nextFocus = 5;
      newCode = text.split("");
    }
    inputs.current[nextFocus]?.focus();
    setCode(newCode);
    if (newCode.join("").length === 6) setSubmit(true);
  };

  const handleKeyPress = (e: any, index: number) => {
    const backSpaceCondition =
      e.nativeEvent.key === "Backspace" && !code[index] && index > 0;
    backSpaceCondition && inputs.current[index - 1]?.focus();
  };

  const handleCollapse = () => {
    setActive(false);
    Keyboard.dismiss();
  };

  const connectToGame = async () => {
    handleGameEntry(
      URLS.JOIN_GAME_URL,
      { code: code.join("") },
      isOffline,
      previousGame,
    );
  };

  return (
    <Pressable
      style={[containerStyles(active).container, globalStyles]}
      onPress={handleCollapse}
    >
      <Text style={styles.label}>Join</Text>
      <View style={styles.inputContainer}>
        {code.map((digit, index) => (
          <View
            key={`container-${index}`}
            style={{ flexDirection: "row", gap: 11 }}
          >
            {index === 3 && (
              <Text
                key={`dash-${index}`}
                testID={`dash-${index}`}
                style={styles.dash}
              >
                {" "}
                -{" "}
              </Text>
            )}
            <TextInput
              key={`input-${index}`}
              testID={`input-${index}`}
              ref={(el) => (inputs.current[index] = el)}
              style={styles.input}
              autoCapitalize="characters"
              maxLength={6}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setActive(true)}
              selectionColor="black"
            />
          </View>
        ))}
      </View>
      {submit && (
        <TouchableOpacity
          onPress={connectToGame}
          activeOpacity={1}
          style={styles.button}
        >
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={styles.buttonText}>Join Game</Text>
          )}
        </TouchableOpacity>
      )}
      <CreateProfileModal
        displayModal={playerModal}
        onClose={() => setPlayerModal(false)}
      />
      <FailedConnectionModal
        displayModal={!!error}
        message={error}
        onClose={() => setError(false)}
      />
    </Pressable>
  );
};

const containerStyles = (active = false) =>
  StyleSheet.create({
    container: {
      paddingTop: active ? 165 : 0,
      position: active ? "absolute" : "relative",
      top: active ? 50 : 120,
      bottom: 0,
      right: 0,
      left: 0,
      alignItems: "center",
      zIndex: 100,
    },
  });

const styles = StyleSheet.create({
  label: {
    fontWeight: "bold",
    fontFamily: MAIN_FONT_FAMILY,
    fontSize: 18,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    width: 40,
    height: 50,
    borderWidth: 1,
    textAlign: "center",
    fontSize: 20,
    borderRadius: 5,
    // backgroundColor: "#F0F0F0",
  },
  dash: {
    height: 1,
    width: 6,
    backgroundColor: "black",
    alignSelf: "center",
    opacity: 0.5,
  },
  button: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 35,
    // backgroundColor: "#F0F0F0",
  },
  buttonText: {
    fontFamily: MAIN_FONT_FAMILY,
    fontSize: 23,
  },
});

export default JoinGameInput;
