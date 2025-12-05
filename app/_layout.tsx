import { AuthProvider } from "@/contexts/AuthContext";
import { DailiesProvider } from "@/contexts/DailiesContex";
import { FontProvider } from "@/contexts/FontContext";
import { HabitProvider } from "@/contexts/HabitsContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { StatsProvider } from "@/contexts/StatsContext";
import { useSyncManager } from "@/contexts/SyncManager";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import * as Font from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  useEffect(() => {
    Font.loadAsync({
      "DelaGothicOne-Regular": require("../assets/fonts/DelaGothicOne-Regular.ttf"),
    });
  }, []);

  return (
    <AuthProvider>
      <FontProvider>
        <HabitProvider>
          <DailiesProvider>
            <NotificationsProvider>
              <StatsProvider>
                <SyncManagerWrapper />
                <ThemeProvider value={DefaultTheme}>
                  <Stack>
                    <Stack.Screen
                      name="(tabs)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="add-habit"
                      options={{ headerShown: false }}
                    />
                  </Stack>
                  <StatusBar style="auto" />
                </ThemeProvider>
              </StatsProvider>
            </NotificationsProvider>
          </DailiesProvider>
        </HabitProvider>
      </FontProvider>
    </AuthProvider>
  );
}

const SyncManagerWrapper = () => {
  useSyncManager();
  return null;
};
