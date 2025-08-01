import { Stack } from "expo-router";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { AuthProvider } from "../contexts/AuthContext.js";
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
  return (
    <AuthProvider>
      <PaperProvider theme={customTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="scan/scanner"
            options={{
              title: "Scanner",
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: "#000030",
              },
              headerTitleStyle: {
                color: "#fff",
              },
              headerTintColor: "#fff",
            }}
          />
        </Stack>
      </PaperProvider>
    </AuthProvider>
  );
}
