import { AddIcon } from "@/assets/icons/button-icons";
import {
  CalendarIcon,
  GraphIcon,
  HomeIcon,
  SettingsIcon,
  TrophyIcon,
} from "@/assets/icons/tab-icons";
import { StyledText } from "@/components/StyledText";
import { COLORS, FONT } from "@/constants/theme";
import { useRouter, Tabs } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function TabLayout() {
  const router = useRouter();

  return (
    <>
      <View style={styles.header}>
        <View>
          <StyledText>Trackify</StyledText>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/add-habit")}
        >
          <AddIcon color={COLORS.PRIMARY_BACKGROUND}></AddIcon>
        </TouchableOpacity>
      </View>

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.TABBAR_ITEM_SELECTED,
          tabBarInactiveTintColor: COLORS.TABBAR_ITEM_PRIAMRY,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.tabIconContainer}>
                <HomeIcon color={color} size={24} />
                {focused && <View style={styles.backgroundSquare} />}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.tabIconContainer}>
                {focused && <View style={styles.backgroundSquare} />}
                <CalendarIcon color={color} size={24} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.tabIconContainer}>
                {focused && <View style={styles.backgroundSquare} />}
                <GraphIcon color={color} size={24} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="trophy"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.tabIconContainer}>
                {focused && <View style={styles.backgroundSquare} />}
                <TrophyIcon color={color} size={28} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.tabIconContainer}>
                {focused && <View style={styles.backgroundSquare} />}
                <SettingsIcon color={color} size={28} />
              </View>
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 14,
    marginTop: 64,
    marginHorizontal: 16,
    fontSize: FONT.SIZE.HEADER,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.BUTTON_BACKGROUND,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBar: {
    backgroundColor: COLORS.TABBAR_BACKGROUND_COLOR,
    paddingTop: 14,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderTopWidth: 0,
    borderWidth: 2,
    borderColor: COLORS.TABBAR_STROKE,
    height: 90,
  },
  tabIconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backgroundSquare: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.TABBAR_BACKGROUND_ITEM_SELECTED,
    zIndex: -1,
  },
});
