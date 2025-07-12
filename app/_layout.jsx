import { Stack } from "expo-router";
import { useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { preloadFoodItems } from "../services/preloadItems.js";
import { getDB, setDB } from "../services/sqlite.js";
import "./globals.css";

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
    <PaperProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}
