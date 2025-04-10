import { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import * as Sentry from "sentry-expo";
import Home from "./components/Home";
import Publish from "./components/Publish";
import Settings, { COLOR_OPTIONS } from "./components/Settings";
import Play from "./components/Play";
import { URLS } from "./constants";
import { GlobalStyleContext } from "./components/settingsUtils";

Sentry.init({
  dsn: URLS.SENTRY_DNS,
  sendDefaultPii: true,
});

const Stack = createStackNavigator();

export default function Index() {
  const navigation = useNavigation();
  const [globalStyles, setGlobalStyle] = useState({
    backgroundColor: COLOR_OPTIONS[0].color,
  });

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <GlobalStyleContext.Provider value={{ globalStyles, setGlobalStyle }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Publish" component={Publish} />
        <Stack.Screen name="Play" component={Play} />
      </Stack.Navigator>
    </GlobalStyleContext.Provider>
  );
}
