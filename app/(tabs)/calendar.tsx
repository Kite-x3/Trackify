import { ArrowLeftIcon, ArrowRightIcon } from "@/assets/icons/common-icons";
import { CalendarIcon } from "@/assets/icons/tab-icons";
import { Module } from "@/components/Module";
import { StyledText } from "@/components/StyledText";
import { COLORS } from "@/constants/theme";
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";

const weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

const dummyHabits = [
  { id: "1", name: "Утренний спорт", color: "rgba(54, 37, 92, 0.8)" },
  { id: "2", name: "Чтение", color: "rgba(202, 209, 131, 1)" },
];

const dummyCompletions = [
  { habitId: "1", date: "2025-10-01", completed: true },
  { habitId: "2", date: "2025-10-02", completed: false },
];

export default function CalendarScreen() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handlePrevMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

  const generateDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startWeekDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Пн=0
    const days: { date: Date; currentMonth: boolean }[] = [];

    for (let i = startWeekDay; i > 0; i--) {
      days.push({ date: new Date(year, month, 1 - i), currentMonth: false });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), currentMonth: true });
    }
    while (days.length % 7 !== 0) {
      const lastDate = days[days.length - 1].date.getDate();
      days.push({
        date: new Date(year, month, lastDate + 1),
        currentMonth: false,
      });
    }
    return days;
  };

  const days = generateDays();

  const renderDay = ({
    item,
  }: {
    item: { date: Date; currentMonth: boolean };
  }) => (
    <View
      style={[
        styles.dayBox,
        {
          backgroundColor: item.currentMonth
            ? COLORS.CALENDAR_CURRENT
            : COLORS.CALENDAR_ELSE,
        },
      ]}
    >
      <StyledText style={styles.dayNumber}>{item.date.getDate()}</StyledText>
      {dummyHabits.map((habit) => {
        const completion = dummyCompletions.find(
          (c) =>
            c.habitId === habit.id &&
            c.date === item.date.toISOString().slice(0, 10)
        );
        if (!completion) return null;
        return (
          <View
            key={habit.id}
            style={[
              styles.habitDot,
              {
                backgroundColor: completion.completed
                  ? habit.color
                  : COLORS.BUTTON_BACKGROUND,
              },
            ]}
          >
            {!completion.completed && <View style={styles.innerDot} />}
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <CalendarIcon size={24} color={COLORS.BACKGROUND_ICONS} />
        <StyledText style={styles.headerText}>Календарь</StyledText>
      </View>

      <Module style={styles.module}>
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={handlePrevMonth}>
            <ArrowLeftIcon />
          </TouchableOpacity>
          <StyledText style={styles.monthText}>
            {currentMonth.toLocaleString("ru-RU", { month: "long" })}
          </StyledText>
          <TouchableOpacity onPress={handleNextMonth}>
            <ArrowRightIcon />
          </TouchableOpacity>
        </View>

        <View style={styles.weekDaysRow}>
          {weekDays.map((day) => (
            <StyledText key={day} style={styles.weekDay}>
              {day}
            </StyledText>
          ))}
        </View>

        <FlatList
          data={days}
          renderItem={renderDay}
          keyExtractor={(item) => item.date.toDateString()}
          numColumns={7}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          scrollEnabled={false} // чтобы календарь не скроллился
        />
      </Module>

      {/* Легенда */}
      <View style={styles.legendContainer}>
        <StyledText style={styles.legendTitle}>Легенда:</StyledText>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: COLORS.BUTTON_BACKGROUND },
              ]}
            />
            <StyledText style={styles.legendText}>Выполнено</StyledText>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: COLORS.BUTTON_BACKGROUND },
              ]}
            >
              <View style={styles.innerDot} />
            </View>
            <StyledText style={styles.legendText}>Не выполнено</StyledText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1 - 0.2,
    justifyContent: "center",
    padding: 16,
  },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  headerText: { fontSize: 16, marginLeft: 8, color: COLORS.PRIMARY_TEXT },
  module: { width: "100%" },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  monthText: { fontSize: 16, marginHorizontal: 12, color: COLORS.PRIMARY_TEXT },
  weekDaysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  weekDay: { width: 40, textAlign: "center", color: COLORS.PRIMARY_TEXT },
  dayBox: {
    width: 40,
    height: 40,
    marginVertical: 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  dayNumber: { fontSize: 12, color: COLORS.PRIMARY_TEXT },
  habitDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  innerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.CALENDAR_CURRENT,
  },
  legendContainer: { alignItems: "center", marginTop: 16 },
  legendTitle: { fontSize: 14, color: COLORS.PRIMARY_TEXT, marginBottom: 4 },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  legendText: { fontSize: 12, color: COLORS.PRIMARY_TEXT },
});
