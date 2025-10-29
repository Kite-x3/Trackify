import { GraphIcon } from "@/assets/icons/tab-icons";
import { HabitRow } from "@/components/HabitRow";
import { Module } from "@/components/Module";
import { StyledText } from "@/components/StyledText";
import { COLORS } from "@/constants/theme";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { moderateScale } from "react-native-size-matters";

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
        <GraphIcon size={moderateScale(100)} color={COLORS.BACKGROUND_ICONS} />
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
        <HabitRow key={habit.id} habit={habit} valueType={valueType} />
      ))}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: moderateScale(16) }}
    >
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

      <Module style={styles.fullModule}>
        <StyledText style={styles.moduleTitle}>Привычки на сегодня</StyledText>
        {renderHabitList(habits, "weeklyProgress")}
      </Module>

      <Module style={styles.fullModule}>
        <StyledText style={styles.moduleTitle}>Лучшие стрики</StyledText>
        {renderHabitList(bestStreaks, "streak")}
      </Module>

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
    marginTop: moderateScale(26),
    fontSize: moderateScale(24),
    marginBottom: moderateScale(10),
    color: COLORS.PRIMARY_TEXT,
  },
  noHabitText: { fontSize: moderateScale(12), color: COLORS.PRIMARY_TEXT },
  topModules: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: moderateScale(8),
  },
  statModule: {
    width: "48%",
    alignItems: "center",
    paddingVertical: moderateScale(16),
  },
  moduleTitle: {
    fontSize: moderateScale(14),
    marginBottom: moderateScale(8),
    color: COLORS.PRIMARY_TEXT,
  },
  moduleValue: { fontSize: moderateScale(16), color: COLORS.PRIMARY_TEXT },
  fullModule: { marginTop: moderateScale(12), padding: moderateScale(12) },
  progressInfo: { flexDirection: "row", justifyContent: "space-between" },
  progressText: {
    fontSize: moderateScale(12),
    color: COLORS.PRIMARY_TEXT,
    marginBottom: moderateScale(8),
  },
  progressBarContainer: {
    width: "100%",
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: COLORS.INACTIVE_BUTTON_BACKGROUND,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.BUTTON_BACKGROUND,
  },
  habitValue: { color: COLORS.PRIMARY_TEXT, fontSize: moderateScale(12) },
});
