import { createContext } from "react";
import { Text } from "react-native";

export const Header = ({ text }: { text: string }) => (
  <Text
    style={{
      marginTop: "15%",
      marginBottom: "7%",
      fontWeight: "bold",
      fontSize: 20,
      textAlign: "center",
    }}
  >
    {text}
  </Text>
);

export const GlobalStyleContext = createContext<any>(null);

export default {};
