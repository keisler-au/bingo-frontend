import { StyleSheet, Text, View } from "react-native";
import IconHeader from "./IconHeader";
import { Picker } from "@react-native-picker/picker";
import { useContext, useEffect, useState } from "react";

import { GlobalStyleContext } from "./settingsUtils";
import ScreenBackground from "./ScreenBackground";
import { getGameHistory } from "../utils/gameActions";
import Feedback from "./Feedback";
import { Header } from "./settingsUtils";

export const COLOR_OPTIONS = [
  {
    label: "peach",
    color: "rgb(246, 231, 219)",
  },
  {
    label: "green",
    color: "rgb(213, 252, 209)",
  },
  {
    label: "blue",
    color: "rgb(208, 228, 249)",
  },
  {
    label: "yellow",
    color: "rgb(247, 245, 207)",
  },
  {
    label: "purple",
    color: "rgb(238, 220, 247)",
  },
  {
    label: "grey",
    color: "#F0F0F0",
  },
];

interface GameHistory {
  title: string;
  code: string;
  date: string;
}

const Settings = () => {
  const { globalStyles, setGlobalStyle } = useContext(GlobalStyleContext);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const headers = ["Name", "Code", "Date"];

  useEffect(() => {
    const gameHistoryHelper = async () => {
      const updatedHistory = await getGameHistory();
      setGameHistory(updatedHistory);
    };
    gameHistoryHelper();
  }, []);

  const selectColor = (item: string) =>
    setGlobalStyle({ ...globalStyles, backgroundColor: item });

  return (
    <ScreenBackground localStyles={styles.container}>
      <IconHeader icons={[{ type: "home-outline", path: "Home" }]} />
      <View style={styles.spacer}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={globalStyles.backgroundColor}
            onValueChange={selectColor}
            itemStyle={[styles.pickerItem]}
          >
            {COLOR_OPTIONS.map(({ label, color }) => (
              <Picker.Item key={label} label={label} value={color} />
            ))}
          </Picker>
        </View>
      </View>
      <Header text="Previous Games" />
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={styles.headings}>
          {headers.map((heading) => (
            <Text
              key={heading}
              style={[{ fontWeight: "bold" }, styles.columns]}
            >
              {heading}
            </Text>
          ))}
        </View>
        {gameHistory.map((game, index) => (
          <View key={index} style={styles.gameValues}>
            <Text style={styles.columns}>{game.title}</Text>
            <Text style={styles.columns}>{game.code}</Text>
            <Text style={styles.columns}>{game.date}</Text>
          </View>
        ))}
      </View>
      <Feedback globalBackgroundColor={globalStyles.backgroundColor} />
    </ScreenBackground>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  spacer: {
    marginTop: "20%",
    height: 120,
    width: "100%",
    alignItems: "center",
  },
  pickerContainer: {
    position: "absolute",
    width: 120,
    height: 120,
    zIndex: 10,
  },
  pickerItem: {
    borderRadius: "50%",
    height: "100%",
    backgroundColor: "white",
  },
  headings: {
    flexDirection: "row",
    marginBottom: "3%",
  },
  gameValues: {
    flexDirection: "row",
  },
  columns: {
    width: 120,
    textAlign: "center",
  },
});
