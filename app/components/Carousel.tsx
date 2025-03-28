import { useRef } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import CarouselItem from "./CarouselItem";
import bingoGames from "../fixtures/templates";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.5;
const GAME_SETS = Array(50).fill(Object.keys(bingoGames)).flat();

const Carousel = ({ isVerticalReel }: { isVerticalReel: Function }) => {
  const scrollX = useSharedValue(0);
  const flatListRef = useRef(null);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <CarouselItem
      item={item}
      index={index}
      scrollX={scrollX}
      isVerticalReel={isVerticalReel}
    />
  );

  return (
    <Animated.FlatList
      ref={flatListRef}
      data={GAME_SETS}
      style={styles.carousel}
      horizontal
      keyExtractor={(item, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
      onScroll={onScrollHandler}
      renderItem={renderItem}
      snapToAlignment="center"
      snapToInterval={CARD_WIDTH}
      disableIntervalMomentum={true}
      scrollEventThrottle={16}
      initialScrollIndex={GAME_SETS.length / 2}
      getItemLayout={(_, index) => ({
        length: CARD_WIDTH,
        offset: CARD_WIDTH * index - (width - CARD_WIDTH) / 2,
        index,
      })}
    />
  );
};

export default Carousel;

const styles = StyleSheet.create({
  carousel: {
    marginTop: 100,
    width: width,
    maxHeight: "35%",
  },
});
