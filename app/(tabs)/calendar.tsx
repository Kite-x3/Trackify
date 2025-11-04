import { ArrowLeftIcon, ArrowRightIcon } from "@/assets/icons/common-icons";
import { CalendarIcon } from "@/assets/icons/tab-icons";
import { HabitBox } from "@/components/HabitBox"; // импортируем HabitBox
import { Module } from "@/components/Module";
import { StyledText } from "@/components/StyledText";
import { COLORS } from "@/constants/theme";
import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale } from "react-native-size-matters";

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
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

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

    const startWeekDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
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
      {/* Число сверху */}
      <View style={{ position: "absolute", top: moderateScale(2) }}>
        <StyledText style={styles.dayNumber}>{item.date.getDate()}</StyledText>
      </View>

      {selectedHabitId &&
        dummyHabits
          .filter((h) => h.id === selectedHabitId)
          .map((habit) => {
            const completion = dummyCompletions.find(
              (c) =>
                c.habitId === habit.id &&
                c.date === item.date.toISOString().slice(0, 10)
            );
            if (!completion) return null;

            return (
              <View
                key={habit.id}
                style={[styles.habitDot, { backgroundColor: habit.color }]}
              >
                {!completion.completed && (
                  <View
                    style={[
                      styles.innerDot,
                      { backgroundColor: COLORS.PRIMARY_BACKGROUND },
                    ]}
                  />
                )}
              </View>
            );
          })}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <CalendarIcon
          size={moderateScale(24)}
          color={COLORS.BACKGROUND_ICONS}
        />
        <StyledText style={styles.headerText}>Календарь</StyledText>
      </View>

      {/* Боксы привычек */}
      <View style={styles.habitsRow}>
        {dummyHabits.map((habit) => (
          <TouchableOpacity
            key={habit.id}
            onPress={() =>
              setSelectedHabitId(habit.id === selectedHabitId ? null : habit.id)
            }
          >
            <HabitBox name={habit.name} color={habit.color} />
          </TouchableOpacity>
        ))}
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
          scrollEnabled={false}
        />
      </Module>

      {/* Унифицированная легенда */}
      <View style={styles.legendContainer}>
        <StyledText style={styles.legendTitle}>Легенда:</StyledText>
        <View style={styles.legendRow}>
          {/* Выполнено */}
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: COLORS.BUTTON_BACKGROUND },
              ]}
            />
            <StyledText style={styles.legendText}>Выполнено</StyledText>
          </View>

          {/* Не выполнено */}
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: COLORS.BUTTON_BACKGROUND },
              ]}
            >
              <View
                style={[
                  styles.innerDot,
                  { backgroundColor: COLORS.PRIMARY_BACKGROUND },
                ]}
              />
            </View>
            <StyledText style={styles.legendText}>Не выполнено</StyledText>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(16),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(8),
  },
  headerText: {
    fontSize: moderateScale(16),
    marginLeft: moderateScale(8),
    color: COLORS.PRIMARY_TEXT,
  },
  habitsRow: {
    flexDirection: "row",
    marginBottom: moderateScale(12),
    gap: moderateScale(8),
  },
  module: { width: "100%" },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: moderateScale(8),
  },
  monthText: {
    fontSize: moderateScale(16),
    marginHorizontal: moderateScale(12),
    color: COLORS.PRIMARY_TEXT,
  },
  weekDaysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScale(4),
  },
  weekDay: {
    width: moderateScale(40),
    textAlign: "center",
    color: COLORS.PRIMARY_TEXT,
  },
  dayBox: {
    width: moderateScale(40),
    height: moderateScale(40),
    marginVertical: moderateScale(2),
    alignItems: "center",
    justifyContent: "flex-start", // цифры сверху
    borderRadius: moderateScale(10),
    paddingTop: moderateScale(2),
  },
  dayNumber: { fontSize: moderateScale(12), color: COLORS.PRIMARY_TEXT },
  habitDot: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    marginTop: moderateScale(18),
    alignItems: "center",
    justifyContent: "center",
  },
  innerDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(6),
    backgroundColor: COLORS.PRIMARY_BACKGROUND,
    alignItems: "center",
    justifyContent: "center",
  },
  legendContainer: {
    marginTop: moderateScale(16),
    alignItems: "flex-start",
  },
  legendTitle: {
    fontSize: moderateScale(14),
    color: COLORS.PRIMARY_TEXT,
    marginBottom: moderateScale(4),
  },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(12),
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(4),
  },
  legendDot: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(10),
    marginRight: moderateScale(4),
    alignItems: "center",
    justifyContent: "center",
  },
  legendText: { fontSize: moderateScale(12), color: COLORS.PRIMARY_TEXT },
});
