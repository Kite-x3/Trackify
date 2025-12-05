import { ArrowLeftIcon, ArrowRightIcon } from "@/assets/icons/common-icons";
import { CalendarIcon } from "@/assets/icons/tab-icons";
import { HabitBox } from "@/components/HabitBox";
import { Module } from "@/components/Module";
import { StyledText } from "@/components/StyledText";
import { COLORS } from "@/constants/theme";
import { useHabits } from "@/contexts/HabitsContext";
import { WeekDay } from "@/types/habit";
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

export default function CalendarScreen() {
  const { habits } = useHabits();
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

    const firstDay = new Date(Date.UTC(year, month, 1));
    const lastDay = new Date(Date.UTC(year, month + 1, 0));

    const startWeekDay =
      firstDay.getUTCDay() === 0 ? 6 : firstDay.getUTCDay() - 1;
    const days: { date: Date; currentMonth: boolean }[] = [];

    for (let i = startWeekDay; i > 0; i--) {
      days.push({
        date: new Date(Date.UTC(year, month, 1 - i)),
        currentMonth: false,
      });
    }

    for (let i = 1; i <= lastDay.getUTCDate(); i++) {
      days.push({
        date: new Date(Date.UTC(year, month, i)),
        currentMonth: true,
      });
    }

    let nextDayCounter = 1;
    while (days.length % 7 !== 0) {
      days.push({
        date: new Date(Date.UTC(year, month + 1, nextDayCounter)),
        currentMonth: false,
      });
      nextDayCounter++;
    }

    return days;
  };

  const days = generateDays();

  const renderDay = ({
    item,
  }: {
    item: { date: Date; currentMonth: boolean };
  }) => {
    const weekDayMap: { [key: number]: WeekDay } = {
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
      0: "sunday",
    };

    const dayOfWeek = weekDayMap[item.date.getUTCDay()];

    const habitDots = selectedHabitId
      ? habits
          .filter((h) => h.id === selectedHabitId)
          .map((habit) => {
            const needToComplete = habit.completionDays.includes(dayOfWeek);

            if (!needToComplete) return null;

            const isCompleted =
              habit.completions?.some((c) => {
                const completionDate = new Date(c.date);
                const isSameDay =
                  completionDate.getUTCFullYear() ===
                    item.date.getUTCFullYear() &&
                  completionDate.getUTCMonth() === item.date.getUTCMonth() &&
                  completionDate.getUTCDate() === item.date.getUTCDate();

                return isSameDay && c.completed === true;
              }) || false;

            return (
              <View
                key={habit.id}
                style={[styles.habitDot, { backgroundColor: habit.color }]}
              >
                {!isCompleted && (
                  <View
                    style={[
                      styles.innerDot,
                      { backgroundColor: COLORS.PRIMARY_BACKGROUND },
                    ]}
                  />
                )}
              </View>
            );
          })
      : null;

    return (
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
        <View style={{ position: "absolute", top: moderateScale(2) }}>
          <StyledText style={styles.dayNumber}>
            {item.date.getUTCDate()}
          </StyledText>
        </View>
        {habitDots}
      </View>
    );
  };

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
        {habits.map((habit) => (
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
  container: { flex: 1, padding: moderateScale(16) },
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
    justifyContent: "flex-start",
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
  legendContainer: { marginTop: moderateScale(16), alignItems: "flex-start" },
  legendTitle: {
    fontSize: moderateScale(14),
    color: COLORS.PRIMARY_TEXT,
    marginBottom: moderateScale(4),
  },
  legendRow: { flexDirection: "row", flexWrap: "wrap", gap: moderateScale(12) },
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
