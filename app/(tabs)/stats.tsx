import { GraphIcon } from "@/assets/icons/tab-icons";
import { HabitRow } from "@/components/HabitRow";
import { Module } from "@/components/Module";
import { StyledText } from "@/components/StyledText";
import { COLORS } from "@/constants/theme";
import { useHabits } from "@/contexts/HabitsContext";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { moderateScale } from "react-native-size-matters";

export default function StatsScreen() {
  const { habits, loading } = useHabits();
  const today = new Date();

  // Вычисляем границы периодов (выносим из useMemo, так как это не зависит от habits)
  const startOfWeek = useMemo(() => {
    const date = new Date(today);
    date.setDate(today.getDate() - ((today.getDay() + 6) % 7)); // понедельник
    date.setHours(0, 0, 0, 0);
    return date;
  }, [today]);

  const startOfMonth = useMemo(() => {
    const date = new Date(today);
    date.setDate(today.getDate() - 29); // последние 30 дней
    date.setHours(0, 0, 0, 0);
    return date;
  }, [today]);

  // helpers: сравнение по дате (игнорируем время)
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  // Считаем все метрики в одном useMemo
  const {
    totalCompletionsAllTime,
    weekProgressPercentage,
    monthProgressPercentage,
    habitsWithProgress,
    habitsForToday,
    totalHabits,
    totalCompletionsToday,
    totalNeededToday,
    bestStreaks,
    needAttention,
  } = useMemo(() => {
    if (!habits || habits.length === 0) {
      return {
        totalCompletionsAllTime: 0,
        weekProgressPercentage: 0,
        monthProgressPercentage: 0,
        habitsWithProgress: [],
        habitsForToday: [],
        totalHabits: 0,
        totalCompletionsToday: 0,
        totalNeededToday: 0,
        bestStreaks: [],
        needAttention: [],
      };
    }

    const totalHabitsValue = habits.length;

    // Считаем общее количество выполнений за все время
    const totalCompletionsAllTimeValue = habits.reduce((totalAcc, habit) => {
      const completions = habit.completions ?? [];
      const habitTotal = completions.reduce((habitAcc, completion) => {
        const count =
          completion.currentCount !== undefined
            ? completion.currentCount
            : completion.completed
            ? 1
            : 0;
        return habitAcc + count;
      }, 0);
      return totalAcc + habitTotal;
    }, 0);

    // Считаем общее количество выполнений за неделю и месяц для ВСЕХ привычек
    let weekCompletions = 0;
    let weekExpected = 0;
    let monthCompletions = 0;
    let monthExpected = 0;

    const habitsWithProgressValue = habits.map((habit) => {
      const comps = habit.completions ?? [];

      // Выполнения за неделю для этой привычки
      const habitWeekCompletions = comps.reduce((total, c) => {
        if (!c) return total;
        const d = new Date(c.date);
        if (d >= startOfWeek && d <= today) {
          return total + (c.currentCount || (c.completed ? 1 : 0));
        }
        return total;
      }, 0);

      // Выполнения за месяц для этой привычки
      const habitMonthCompletions = comps.reduce((total, c) => {
        if (!c) return total;
        const d = new Date(c.date);
        if (d >= startOfMonth && d <= today) {
          return total + (c.currentCount || (c.completed ? 1 : 0));
        }
        return total;
      }, 0);

      // Выполнения за сегодня для этой привычки
      const completionsTodayCount = comps.reduce((total, c) => {
        if (!c) return total;
        if (isSameDay(new Date(c.date), today)) {
          return total + (c.currentCount || (c.completed ? 1 : 0));
        }
        return total;
      }, 0);

      // Общее количество выполнений для этой привычки
      const allCompletions = comps.reduce((total, c) => {
        if (!c) return total;
        return total + (c.currentCount || (c.completed ? 1 : 0));
      }, 0);

      // Подсчитываем, сколько дней в периоде привычка была активна
      const habitDaysPerWeek =
        (habit.completionDays ?? []).length > 0
          ? Math.min(7, habit.completionDays.length)
          : 7;

      const habitDaysPerMonth =
        (habit.completionDays ?? []).length > 0
          ? Math.min(30, Math.ceil(habit.completionDays.length * (30 / 7)))
          : 30;

      // Ожидаемое количество выполнение за период
      const expectedWeek = Math.max(
        1,
        habit.completionsNeed * habitDaysPerWeek
      );
      const expectedMonth = Math.max(
        1,
        habit.completionsNeed * habitDaysPerMonth
      );

      const weeklyProgress = Math.min(
        100,
        Math.round((habitWeekCompletions / expectedWeek) * 100)
      );
      const monthlyProgress = Math.min(
        100,
        Math.round((habitMonthCompletions / expectedMonth) * 100)
      );

      // Суммируем для общего расчета
      weekCompletions += habitWeekCompletions;
      weekExpected += expectedWeek;
      monthCompletions += habitMonthCompletions;
      monthExpected += expectedMonth;

      return {
        ...habit,
        weeklyProgress,
        monthlyProgress,
        completionsThisWeek: habitWeekCompletions,
        completionsThisMonth: habitMonthCompletions,
        completionsTodayCount,
        allCompletions,
      };
    });

    // Процент выполненных привычек за неделю (общий процент, а не средний)
    const weekProgressPercentageValue =
      weekExpected > 0
        ? Math.min(100, Math.round((weekCompletions / weekExpected) * 100))
        : 0;

    // Процент выполненных привычек за месяц (общий процент, а не средний)
    const monthProgressPercentageValue =
      monthExpected > 0
        ? Math.min(100, Math.round((monthCompletions / monthExpected) * 100))
        : 0;

    // Словарь для перевода getDay() в тип WeekDay
    const weekDayMap: { [k: number]: string } = {
      0: "sunday",
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    };
    const todayWeekKey = weekDayMap[today.getDay()];

    // Привычки назначенные на сегодня (учитываем completionDays как WeekDay[])
    const habitsForTodayValue = habitsWithProgressValue.filter((h) =>
      (h.completionDays ?? []).includes(todayWeekKey as any)
    );

    // Выполнения/потребности только для сегодняшних привычек
    const totalCompletionsTodayValue = habitsForTodayValue.reduce(
      (acc, h) => acc + (h.completionsTodayCount ?? 0),
      0
    );
    const totalNeededTodayValue = habitsForTodayValue.reduce(
      (acc, h) => acc + (h.completionsNeed ?? 0),
      0
    );

    const bestStreaksValue = [...habitsWithProgressValue]
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 3);

    const needAttentionValue = habitsWithProgressValue.filter(
      (h) =>
        ((h.completionsTodayCount ?? 0) / Math.max(1, h.completionsNeed)) *
          100 <
        50
    );

    return {
      totalCompletionsAllTime: totalCompletionsAllTimeValue,
      weekProgressPercentage: weekProgressPercentageValue,
      monthProgressPercentage: monthProgressPercentageValue,
      habitsWithProgress: habitsWithProgressValue,
      habitsForToday: habitsForTodayValue,
      totalHabits: totalHabitsValue,
      totalCompletionsToday: totalCompletionsTodayValue,
      totalNeededToday: totalNeededTodayValue,
      bestStreaks: bestStreaksValue,
      needAttention: needAttentionValue,
    };
  }, [habits, startOfWeek, startOfMonth, today, isSameDay]);

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <StyledText style={styles.noHabitTitle}>Загрузка...</StyledText>
      </View>
    );
  }

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

  const renderHabitList = (
    habitArray: typeof habitsWithProgress,
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
          <StyledText style={styles.moduleValue}>
            {totalCompletionsAllTime}
          </StyledText>
        </Module>
        <Module style={styles.statModule}>
          <StyledText style={styles.moduleTitle}>За неделю</StyledText>
          <StyledText style={styles.moduleValue}>
            {weekProgressPercentage}%
          </StyledText>
        </Module>
        <Module style={styles.statModule}>
          <StyledText style={styles.moduleTitle}>За месяц</StyledText>
          <StyledText style={styles.moduleValue}>
            {monthProgressPercentage}%
          </StyledText>
        </Module>
      </View>

      <Module style={styles.fullModule}>
        <StyledText style={styles.moduleTitle}>Прогресс за сегодня</StyledText>
        <View style={styles.progressInfo}>
          <StyledText style={styles.progressText}>Выполнено задач</StyledText>
          <StyledText style={styles.progressText}>
            {totalCompletionsToday}/{totalNeededToday}
          </StyledText>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${
                  (totalCompletionsToday / Math.max(1, totalNeededToday)) * 100
                }%`,
              },
            ]}
          />
        </View>
      </Module>

      <Module style={styles.fullModule}>
        <StyledText style={styles.moduleTitle}>
          Прогресс на неделе сегодняшних привычек
        </StyledText>
        {habitsForToday.length === 0 ? (
          <StyledText style={styles.habitValue}>
            Нет привычек на сегодня
          </StyledText>
        ) : (
          renderHabitList(habitsForToday, "weeklyProgress")
        )}
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
