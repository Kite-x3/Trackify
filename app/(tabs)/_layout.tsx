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
import { Tabs, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { moderateScale } from "react-native-size-matters";

export default function TabLayout() {
  const router = useRouter();

  return (
    <>
      <View style={styles.header}>
        <StyledText style={styles.headerText}>Trackify</StyledText>

        <View style={styles.rightSide}>
          <View style={styles.levelContainer}>
            <View style={styles.levelBadge}>
              <TrophyIcon size={22} color={COLORS.BUTTON_BACKGROUND} />
              <StyledText style={styles.levelText}>Ур. 12</StyledText>
            </View>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/add-habit")}
          >
            <AddIcon color={COLORS.PRIMARY_BACKGROUND} />
          </TouchableOpacity>
        </View>
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
                <HomeIcon color={color} size={moderateScale(24)} />
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
                <CalendarIcon color={color} size={moderateScale(24)} />
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
                <GraphIcon color={color} size={moderateScale(24)} />
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
                <TrophyIcon color={color} size={moderateScale(28)} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.tabIconContainer}>
                {focused && <View style={styles.backgroundSquare} />}
                <SettingsIcon color={color} size={moderateScale(28)} />
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
    marginTop: 64,
    marginBottom: 14,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:"center"
  },
  headerText: {
    fontSize: FONT.SIZE.HEADER,
  },
  addButton: {
    width: moderateScale(48),
    height: moderateScale(48),
    backgroundColor: COLORS.BUTTON_BACKGROUND,
    borderRadius: moderateScale(20),
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
    width: moderateScale(40),
    height: moderateScale(40),
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backgroundSquare: {
    position: "absolute",
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(10),
    backgroundColor: COLORS.TABBAR_BACKGROUND_ITEM_SELECTED,
    zIndex: -1,
  },
  levelContainer: {
  justifyContent: "center",
},

levelBadge: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: COLORS.CALENDAR_ELSE,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 20,
  gap: 6,
},
levelText: {
  color: COLORS.PRIMARY_TEXT,
},
rightSide:{
  flexDirection: "row",
  gap:10
}

});
