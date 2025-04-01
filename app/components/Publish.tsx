import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import IconHeader from "./IconHeader";

import CreateProfileModal from "./CreateProfileModal";
import FailedConnectionModal from "./FailedConnectionModal";
import { URLS } from "../constants";
import EditableGrid from "./EditableGrid";
import { RootStackParamList } from "../types";
import { reformatGame } from "../utils/gameActions";
import useGameEntry from "../utils/useGameEntry";
import { StackScreenProps } from "@react-navigation/stack";
import ScreenBackground from "./ScreenBackground";
import { GlobalStyleContext } from "./settingsUtils";

const MAIN_FONT_FAMILY = "Verdana";

const GRID_OPTIONS = ["5x5", "4x5", "4x4", "3x4", "3x3"];

type PublishProps = StackScreenProps<RootStackParamList, "Publish">;
const Publish = ({ route }: PublishProps) => {
  const { globalStyles } = useContext(GlobalStyleContext);
  const [selectedGridSize, setSelectedGridSize] = useState("5x5");
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [game, setGame] = useState(reformatGame(route.params.game));
  const [title, setTitle] = useState("");
  const {
    loading,
    playerModal,
    setPlayerModal,
    error,
    setError,
    handleGameEntry,
  } = useGameEntry();

  const selectGridSize = (item: string) => {
    setRows(+item[0]);
    setCols(+item.slice(-1));
    setSelectedGridSize(item);
  };
  const changeGridText = (input: string, row: number, col: number) => {
    let editedGame = [...game];
    editedGame[row][col] = input;
    setGame(editedGame);
  };

  const publishGame = async () => {
    const values = game.slice(0, rows).map((row) => row.slice(0, cols));
    handleGameEntry(URLS.PUBLISH_GAME_URL, { title, values });
  };

  return (
    <ScreenBackground localStyles={styles.screenContainer}>
      <IconHeader icons={[{ type: "home-outline", path: "Home" }]} />
      {/* Editable Title */}
      <View style={styles.editTitleContainer}>
        <TextInput
          placeholder="Enter Game Name"
          style={styles.title}
          value={title}
          onChangeText={(value) => setTitle(value)}
        />
        <Feather name="edit-3" size={20} />
      </View>
      <EditableGrid
        game={game}
        rows={rows}
        cols={cols}
        onChange={changeGridText}
      />
      <View
        style={[
          styles.pickerHelper,
          { backgroundColor: globalStyles.backgroundColor },
        ]}
      />
      <Picker
        selectedValue={selectedGridSize}
        onValueChange={selectGridSize}
        style={[
          styles.picker,
          { backgroundColor: globalStyles.backgroundColor },
        ]}
      >
        {GRID_OPTIONS.map((option) => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>
      <TouchableOpacity
        onPress={publishGame}
        activeOpacity={1}
        style={styles.button}
      >
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text style={styles.buttonText}>Publish</Text>
        )}
      </TouchableOpacity>
      <CreateProfileModal
        displayModal={playerModal}
        onClose={() => setPlayerModal(false)}
      />
      <FailedConnectionModal
        displayModal={!!error}
        message={error}
        onClose={() => setError(false)}
      />
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    position: "relative",
    alignItems: "center",
    height: "100%",
  },
  editTitleContainer: {
    marginTop: 88,
    width: "56%",
    height: 20,
    flexDirection: "row",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderLeftColor: "transparent",
    borderBottomColor: "black",
    borderWidth: 1,
  },
  title: {
    width: 200,
    fontSize: 18,
  },
  pickerHelper: {
    height: 50,
    position: "absolute",
    bottom: "32%",
    left: "35%",
    right: "35%",
    zIndex: 1,
  },
  picker: {
    position: "absolute",
    bottom: "17%",
    left: "35%",
    right: "35%",
    height: 165,
    marginVertical: 0,
    overflow: "hidden",
  },
  button: {
    position: "absolute",
    bottom: "7%",
    left: "20%",
    right: "20%",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    padding: 8,
    opacity: 0.5,
  },
  buttonText: {
    textAlign: "center",
    color: "black",
    fontFamily: MAIN_FONT_FAMILY,
    fontSize: 23,
  },
});

export default Publish;
