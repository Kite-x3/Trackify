import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { StyledText } from "@/components/StyledText";
import { Module } from "@/components/Module";
import { COLORS } from "@/constants/theme";
import { GraphIcon } from "@/assets/icons/tab-icons";

// Заглушечные данные
const colorOptions = [
  "rgba(54, 37, 92, 0.8)",
  "rgba(202, 209, 131, 1)",
  "rgba(102, 152, 204, 1)",
  "rgba(201, 68, 114, 0.85)",
  "rgba(255, 209, 213, 1)",
  "rgba(90, 170, 132, 0.8)",
  "rgba(255, 217, 94, 1)",
  "rgba(34, 60, 99, 1)",
];

const dummyHabits = [
  {
    id: "1",
    name: "Чтение",
    completionsToday: 1,
    completionsNeed: 2,
    streak: 12,
    color: colorOptions[2],
    weeklyProgress: 70,
  },
  {
    id: "2",
    name: "Зарядка",
    completionsToday: 2,
    completionsNeed: 2,
    streak: 25,
    color: colorOptions[0],
    weeklyProgress: 95,
  },
  {
    id: "3",
    name: "Медитация",
    completionsToday: 0,
    completionsNeed: 1,
    streak: 2,
    color: colorOptions[3],
    weeklyProgress: 40,
  },
  {
    id: "4",
    name: "Планирование",
    completionsToday: 1,
    completionsNeed: 1,
    streak: 5,
    color: colorOptions[1],
    weeklyProgress: 30,
  },
];

export default function StatsScreen() {
  const habits = dummyHabits;

  if (!habits || habits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <GraphIcon size={100} color={COLORS.BACKGROUND_ICONS} />
        <StyledText style={styles.noHabitTitle}>Нет данных</StyledText>
        <StyledText style={styles.noHabitText}>
          Создайте привычки и начните их выполнять
        </StyledText>
      </View>
    );
  }

  const totalHabits = habits.length;
  const totalCompletions = habits.reduce(
    (acc, h) => acc + h.completionsToday,
    0
  );
  const totalNeeded = habits.reduce((acc, h) => acc + h.completionsNeed, 0);
  const avgWeek = Math.round(
    habits.reduce((acc, h) => acc + h.weeklyProgress, 0) / habits.length
  );
  const avgMonth = Math.round(avgWeek * 0.9);

  const bestStreaks = habits.sort((a, b) => b.streak - a.streak).slice(0, 3);
  const needAttention = habits.filter((h) => h.weeklyProgress < 50);

  const renderHabitList = (
    habitArray: typeof habits,
    valueType: "streak" | "weeklyProgress"
  ) => (
    <View>
      {habitArray.map((habit) => (
        <View key={habit.id} style={styles.habitRow}>
          <View style={styles.habitBox}>
            <View style={[styles.colorDot, { backgroundColor: habit.color }]} />
            <StyledText style={styles.habitName}>{habit.name}</StyledText>
          </View>
          <StyledText style={styles.habitValue}>
            {valueType === "streak"
              ? `${habit.streak} дн`
              : `${habit.weeklyProgress}%`}
          </StyledText>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Верхние 4 модуля */}
      <View style={styles.topModules}>
        <Module style={styles.statModule}>
          <StyledText style={styles.moduleTitle}>Привычки</StyledText>
          <StyledText style={styles.moduleValue}>{totalHabits}</StyledText>
        </Module>
        <Module style={styles.statModule}>
          <StyledText style={styles.moduleTitle}>Выполнения</StyledText>
          <StyledText style={styles.moduleValue}>{totalCompletions}</StyledText>
        </Module>
        <Module style={styles.statModule}>
          <StyledText style={styles.moduleTitle}>За неделю</StyledText>
          <StyledText style={styles.moduleValue}>{avgWeek}%</StyledText>
        </Module>
        <Module style={styles.statModule}>
          <StyledText style={styles.moduleTitle}>За месяц</StyledText>
          <StyledText style={styles.moduleValue}>{avgMonth}%</StyledText>
        </Module>
      </View>

      {/* Прогресс за сегодня */}
      <Module style={styles.fullModule}>
        <StyledText style={styles.moduleTitle}>Прогресс за сегодня</StyledText>
        <View style={styles.progressInfo}>
          <StyledText style={styles.progressText}>Выполнено задач</StyledText>
          <StyledText style={styles.progressText}>
            {totalCompletions}/{totalNeeded}
          </StyledText>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${(totalCompletions / totalNeeded) * 100}%` },
            ]}
          />
        </View>
      </Module>

      {/* Привычки на сегодня */}
      <Module style={styles.fullModule}>
        <StyledText style={styles.moduleTitle}>Привычки на сегодня</StyledText>
        {renderHabitList(habits, "weeklyProgress")}
      </Module>

      {/* Лучшие стрики */}
      <Module style={styles.fullModule}>
        <StyledText style={styles.moduleTitle}>Лучшие стрики</StyledText>
        {renderHabitList(bestStreaks, "streak")}
      </Module>

      {/* Требуют внимания */}
      <Module style={styles.fullModule}>
        <StyledText style={styles.moduleTitle}>Требуют внимания</StyledText>
        {needAttention.length === 0 ? (
          <StyledText style={styles.habitValue}>
            Все привычки в норме
          </StyledText>
        ) : (
          renderHabitList(needAttention, "weeklyProgress")
        )}
      </Module>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  noHabitTitle: {
    marginTop: 26,
    fontSize: 24,
    marginBottom: 10,
    color: COLORS.PRIMARY_TEXT,
  },
  noHabitText: { fontSize: 12, color: COLORS.PRIMARY_TEXT },

  topModules: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  statModule: { width: "48%", alignItems: "center", paddingVertical: 16 },
  moduleTitle: { fontSize: 14, marginBottom: 8, color: COLORS.PRIMARY_TEXT },
  moduleValue: { fontSize: 16, color: COLORS.PRIMARY_TEXT },
  fullModule: { marginTop: 12, padding: 12 },

  progressInfo: { flexDirection: "row", justifyContent: "space-between" },

  progressText: { fontSize: 12, color: COLORS.PRIMARY_TEXT, marginBottom: 8 },
  progressBarContainer: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.INACTIVE_BUTTON_BACKGROUND,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.BUTTON_BACKGROUND,
  },

  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: "space-between",
  },
  habitBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.ADD_HABBIT_BUTTONS,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  colorDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  habitName: { color: COLORS.PRIMARY_BACKGROUND, fontSize: 12 },
  habitValue: { color: COLORS.PRIMARY_TEXT, fontSize: 12 },
});
