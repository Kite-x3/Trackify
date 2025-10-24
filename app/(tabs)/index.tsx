import React, { useState } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet } from "react-native";

import { Habit, WeekDay } from "../../types/habit";
import { HabitModule } from "@/components/HabitModule";
import { StyledText } from "@/components/StyledText";
import { Module } from "@/components/Module";
import { CalendarIcon } from "@/assets/icons/tab-icons";
import { TelescopeIcon } from "@/assets/icons/empty-tab-icons";
import { COLORS } from "@/constants/theme";
import { router } from "expo-router";
import { AddIcon } from "@/assets/icons/button-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

let mockHabits: Habit[] = [
  {
    id: "1",
    name: "Утренняя зарядка",
    description: "15 минут упражнений",
    completionsToday: 1,
    color: "rgba(54, 37, 92, 0.8)",
    streak: 7,
    completionDays: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
    type: "sport",
    reminderTime: "07:00",
    createdAt: new Date(),
    completionsNeed: 1,
    notificationsTime: ["07:00"],
    allCompletions: 20,
  },
  {
    id: "2",
    name: "Чтение книги",
    description: "30 минут чтения перед сном",
    completionsToday: 0,
    color: "rgba(201, 68, 114, 0.85)",
    streak: 3,
    completionDays: ["monday", "wednesday", "friday", "sunday"],
    type: "reading",
    reminderTime: "21:00",
    createdAt: new Date(),
    completionsNeed: 1,
    notificationsTime: ["21:00"],
    allCompletions: 12,
  },
  {
    id: "3",
    name: "Пить воду",
    description: "8 стаканов воды в день",
    completionsToday: 3,
    color: "rgba(202, 209, 131, 1)",
    streak: 15,
    completionDays: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
    type: "health",
    reminderTime: undefined,
    createdAt: new Date(),
    completionsNeed: 8,
    notificationsTime: ["10:00", "14:00", "18:00"],
    allCompletions: 120,
  },
];

export default function HabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>(mockHabits);
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

  const handleDecrementHabit = (habit: Habit) => {
    setHabits((prevHabits) =>
      prevHabits.map((h) =>
        h.id === habit.id && h.completionsToday > 0
          ? {
              ...h,
              completionsToday: h.completionsToday - 1,
              allCompletions: Math.max(0, h.allCompletions - 1),
              weeklyCompletions: Math.max(0, h.completionsToday - 1),
              streak:
                h.completionsToday - 1 < h.completionsNeed
                  ? Math.max(0, h.streak - 1)
                  : h.streak,
            }
          : h
      )
    );
  };

  const handleCompleteHabit = (habit: Habit) => {
    setHabits((prevHabits) =>
      prevHabits.map((h) =>
        h.id === habit.id
          ? {
              ...h,
              completionsToday: Math.min(
                h.completionsToday + 1,
                h.completionsNeed
              ),
              allCompletions:
                h.completionsToday - h.completionsNeed >= 0
                  ? h.allCompletions
                  : h.allCompletions + 1,
              streak:
                h.completionsToday - h.completionsNeed >= 0
                  ? h.streak
                  : h.streak + 1,
            }
          : h
      )
    );
  };

  const renderHabitItem = ({ item }: { item: Habit }) => {
    return (
      <HabitModule
        habit={item}
        onDecrement={handleDecrementHabit}
        onComplete={handleCompleteHabit}
      />
    );
  };

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
            <View>
              <StyledText style={styles.commonInfo}>
                На сегодня запланировано {habits.length} привычки
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
    marginHorizontal: 16,
  },
  listContent: {
    gap: 12,
    marginVertical: 20,
  },
  commonInfoContainer: {
    flexDirection: "row",
    gap: 12,
  },
  commonInfo: {
    fontSize: 12,
  },
  noHabitsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noHabitsTitle: {
    marginTop: 26,
    fontSize: 20,
    marginBottom: 10,
  },
  noHabitsText: {
    fontSize: 12,
    paddingHorizontal: 24,
    textAlign: "center",
  },
  addButton: {
    marginTop: 50,
    gap: 10,
    backgroundColor: COLORS.BUTTON_BACKGROUND,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  addButtonText: {
    fontSize: 16,
    color: COLORS.PRIMARY_BACKGROUND,
  },
});
