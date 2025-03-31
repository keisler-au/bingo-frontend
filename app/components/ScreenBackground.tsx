import React, { useContext } from "react";
import { View } from "react-native";
import { GlobalStyleContext } from "./settingsUtils";

interface ScreenBackgroundProps {
  children: any;
  localStyles: object;
}
const ScreenBackground = ({ children, localStyles }: ScreenBackgroundProps) => {
  const { globalStyles } = useContext(GlobalStyleContext);
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        ...globalStyles,
        ...localStyles,
      }}
    >
      {children}
    </View>
  );
};

export default ScreenBackground;
