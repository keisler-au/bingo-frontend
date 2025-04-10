import { useState, useRef } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Carousel from "./Carousel";
import CreatePlayerModal from "./CreateProfileModal";
import IconHeader from "./IconHeader";
import JoinGameInput from "./Join";
import VerticalReel from "./VerticalReel";

import bingoGames from "../fixtures/templates";
import ScreenBackground from "./ScreenBackground";

const Home = () => {
  const [expanded, setExpanded] = useState(false);
  const [playerModal, setPlayerModal] = useState(false);
  const expandedGridset = useRef<string[][]>();

  const icons = [
    {
      type: "settings-outline",
      path: "Settings",
    },
    {
      type: "person-circle-outline",
      path: false,
    },
  ];

  const isVerticalReel = (gridset: string) => {
    expandedGridset.current = bingoGames[gridset];
    setExpanded(!expanded);
  };

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.background}>
        <IconHeader icons={icons} onPress={() => setPlayerModal(true)} />
        <Carousel isVerticalReel={isVerticalReel} />
        {expanded ? (
          <VerticalReel
            collapseReel={isVerticalReel}
            expandedGridset={expandedGridset.current}
          />
        ) : (
          <JoinGameInput />
        )}
        <CreatePlayerModal
          displayModal={playerModal}
          onClose={() => setPlayerModal(false)}
        />
      </SafeAreaView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    height: "100%",
    position: "relative",
  },
});

export default Home;
