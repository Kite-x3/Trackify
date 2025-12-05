import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import { AddIcon } from "@/assets/icons/button-icons";
import { TelescopeIcon } from "@/assets/icons/empty-tab-icons";
import { CalendarIcon } from "@/assets/icons/tab-icons";
import { HabitModule } from "@/components/HabitModule";
import { Module } from "@/components/Module";
import { StyledText } from "@/components/StyledText";
import { COLORS } from "@/constants/theme";
import { useHabits } from "@/contexts/HabitsContext";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import { Habit, WeekDay } from "../../types/habit";

export default function HabitsScreen() {
  const { habits, completeHabit, uncompleteHabit, deleteHabit, isPending } =
    useHabits();
  const insets = useSafeAreaInsets();

  const today = new Date()
    .toLocaleString("en-us", { weekday: "long" })
    .toLowerCase() as WeekDay;

  const completedToday = habits.filter(
    (habit) => habit.completionsToday >= habit.completionsNeed
  ).length;

  const scheduledToday = habits.filter((habit) =>
    habit.completionDays.includes(today)
  ).length;

  const renderHabitItem = ({ item }: { item: Habit }) => (
    <HabitModule
      habit={item}
      onComplete={() => completeHabit(item.id)}
      onDecrement={() => uncompleteHabit(item.id)}
      deleteHabit={() => deleteHabit(item.id)}
      isPending={isPending(item.id)}
    />
  );

  if (habits.length === 0) {
    return (
      <View style={styles.noHabitsContainer}>
        <TelescopeIcon
          size={100}
          color={COLORS.BACKGROUND_ICONS}
        ></TelescopeIcon>
        <StyledText style={styles.noHabitsTitle}>Пока нет привычек</StyledText>
        <StyledText style={styles.noHabitsText}>
          Создайте свою первую привычку и начните путь к лучшей версии себя
        </StyledText>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/add-habit")}
        >
          <AddIcon color={COLORS.PRIMARY_BACKGROUND}></AddIcon>
          <StyledText style={styles.addButtonText}>
            Создать новую привычки
          </StyledText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={habits}
      keyExtractor={(item) => item.id}
      renderItem={renderHabitItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.listContent,
        { paddingBottom: insets.bottom },
      ]}
      style={styles.container}
      ListHeaderComponent={
        <Module>
          <View style={styles.commonInfoContainer}>
            <CalendarIcon />
            <View style={{ flex: 1 }}>
              <StyledText style={styles.commonInfo}>
                На сегодня запланировано {scheduledToday} привычки
              </StyledText>
              <StyledText style={styles.commonInfo}>
                Выполнено {completedToday} из {scheduledToday} привычек сегодня
              </StyledText>
            </View>
          </View>
        </Module>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: moderateScale(16),
  },
  listContent: {
    gap: moderateScale(12),
    marginVertical: moderateScale(20),
  },
  commonInfoContainer: {
    flexDirection: "row",
    gap: moderateScale(12),
  },
  commonInfo: {
    fontSize: moderateScale(12),
    flexWrap: "wrap",
  },
  noHabitsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noHabitsTitle: {
    marginTop: moderateScale(26),
    fontSize: moderateScale(20),
    marginBottom: moderateScale(10),
  },
  noHabitsText: {
    fontSize: moderateScale(12),
    paddingHorizontal: moderateScale(24),
    textAlign: "center",
  },
  addButton: {
    marginTop: moderateScale(50),
    gap: moderateScale(10),
    backgroundColor: COLORS.BUTTON_BACKGROUND,
    borderRadius: moderateScale(20),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(20),
  },
  addButtonText: {
    fontSize: moderateScale(16),
    color: COLORS.PRIMARY_BACKGROUND,
  },
});
