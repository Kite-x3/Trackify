// contexts/FontContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Держи splash screen видимым пока шрифты не загрузятся
SplashScreen.preventAutoHideAsync();

type FontContextType = {
  fontsLoaded: boolean;
  fontError: Error | null;
};

const FontContext = createContext<FontContextType>({
  fontsLoaded: false,
  fontError: null,
});

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          "DelaGothicOne-Regular": require("../assets/fonts/DelaGothicOne-Regular.ttf"),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
        setFontError(error as Error);
        setFontsLoaded(true); // Все равно показываем приложение
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    loadFonts();
  }, []);

  return (
    <FontContext.Provider value={{ fontsLoaded, fontError }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFonts = () => useContext(FontContext);
