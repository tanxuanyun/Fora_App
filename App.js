import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { AuthProvider } from "./src/provider/AuthProvider";
import Navigation from "./src/navigation";
import { ThemeProvider } from "react-native-rapi-ui";
import * as Linking from "expo-linking"

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
  },
};

const prefix = Linking.createURL("/");

const Stack = createStackNavigator();

const App = () => {

  const [data, setData] = useState(null);

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        ResetPassword: "resetPassword",
      },
    },
  };

    function handleDeepLink(event) {
      let data = Linking.parse(event.url);
      setData(data);
    }

    useEffect(() => {
      Linking.addEventListener("url", handleDeepLink);
      return () => {
        Linking.removeEventListener("url");
      };
    }, []);


  const [loaded] = useFonts({
    InterBold: require("./src/assets/fonts/Inter-Bold.ttf"),
    InterSemiBold: require("./src/assets/fonts/Inter-SemiBold.ttf"),
    InterMedium: require("./src/assets/fonts/Inter-Medium.ttf"),
    InterRegular: require("./src/assets/fonts/Inter-Regular.ttf"),
    InterLight: require("./src/assets/fonts/Inter-Light.ttf"),
  });

  // if (!loaded) return null;

  return (
    <ThemeProvider>
      <AuthProvider>
        <Navigation linking = {linking}/>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
