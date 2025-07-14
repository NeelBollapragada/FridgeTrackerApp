import { Stack } from "expo-router";
import { useEffect } from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { preloadFoodItems } from "../services/preloadItems.js";
import { getDB, setDB } from "../services/sqlite.js";
import "./globals.css";

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#ffffff",
    surface: "#ffffff",
    background: "#ffffff",
    primaryContainer: "#ffffff",
    secondaryContainer: "#ffffff",
    elevation: {
      ...DefaultTheme.colors.elevation,
      level2: "#ffffff",
    },
  },
};

export default function RootLayout() {
  useEffect(() => {
    const initDB = async () => {
      const db = await getDB();
      await setDB(db);
      console.log("set db");
      await preloadFoodItems();
      console.log("loaded food items");
    };

    initDB();
  }, []);

  return (
    <PaperProvider theme={customTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}
