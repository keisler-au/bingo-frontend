import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";

import { RootStackParamList } from "../types";
import { GlobalStyleContext } from "./settingsUtils";
import { useContext } from "react";

const { width } = Dimensions.get("window");
const GRID_SIZE = width / 1.1;

interface VerticalReelProps {
  collapseReel: (gridset: string) => void;
  expandedGridset?: string[][];
}
const VerticalReel = ({ collapseReel, expandedGridset }: VerticalReelProps) => {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "Publish">>();
  const { globalStyles } = useContext(GlobalStyleContext);

  const handleNavigation = (gameIndex: number) => {
    if (expandedGridset) {
      navigation.navigate("Publish", { game: expandedGridset[gameIndex] });
      collapseReel("");
    }
  };

  return (
    <Pressable
      style={[styles.pressableScreen, globalStyles]}
      onPress={collapseReel}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.verticalContainer,
            {
              minHeight: expandedGridset && expandedGridset.length * GRID_SIZE,
            },
          ]}
        >
          {expandedGridset &&
            expandedGridset.map((grid, gridIndex) => {
              return (
                <TouchableOpacity
                  key={gridIndex}
                  activeOpacity={1}
                  style={[styles.gridContainer, { flexWrap: "wrap" }]}
                  onPress={() => handleNavigation(gridIndex)}
                >
                  {grid.map((square, squareIndex) => (
                    <View key={squareIndex} style={[styles.square]}>
                      <Text>{square}</Text>
                    </View>
                  ))}
                </TouchableOpacity>
              );
            })}
        </View>
      </ScrollView>
    </Pressable>
  );
};

export default VerticalReel;

const styles = StyleSheet.create({
  pressableScreen: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "#F0F0F0",
  },
  verticalContainer: {
    paddingTop: 120,
    paddingBottom: 60,
    gap: 90,
    alignItems: "center",
  },
  gridContainer: {
    borderWidth: 1,
    height: GRID_SIZE + 2,
    width: GRID_SIZE + 2,
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 5,
    backgroundColor: "#F0F0F0",
  },
  square: {
    borderWidth: 0.2,
    height: GRID_SIZE / 5,
    width: GRID_SIZE / 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
});
