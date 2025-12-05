import { CheckIcon, MinusIcon } from "@/assets/icons/button-icons";
import {
  ClockIcon,
  EditIcon,
  FlameIcon,
  TrashIcon,
} from "@/assets/icons/common-icons";
import { COLORS } from "@/constants/theme";
import { Habit, WeekDay } from "@/types/habit";
import { getStreakColor } from "@/utils/strakColor";
import { useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Module } from "./Module";
import { StyledText } from "./StyledText";

interface HabitModuleProps {
  habit: Habit;
  onPress?: () => void;
  onDecrement: () => void;
  onComplete: () => void;
  deleteHabit: () => void;
  isPending: boolean;
}

export const HabitModule: React.FC<HabitModuleProps> = ({
  habit,
  onPress,
  onDecrement,
  onComplete,
  deleteHabit,
  isPending,
}) => {
  const [localCompletions, setLocalCompletions] = useState(0);

  const todayCompletions = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // "2025-12-05"

    const todayCompletion = (habit.completions ?? []).find((c) => {
      const date = new Date(c.date);
      const dateStr = date.toISOString().split("T")[0];
      return dateStr === todayStr;
    });

    return todayCompletion?.currentCount || localCompletions;
  }, [habit.completions, localCompletions]);

  const totalCompletions = useMemo(() => {
    if (!habit.completions || habit.completions.length === 0) {
      return habit.allCompletions || 0;
    }

    const sum = habit.completions.reduce((total, completion) => {
      const count =
        completion.currentCount !== undefined ? completion.currentCount : 0;
      return total + count;
    }, 0);

    return sum;
  }, [habit.completions, habit.allCompletions]);

  const weekDayMap: { [key: number]: WeekDay } = {
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
    0: "sunday",
  };
  const today = new Date();
  const todayWeekDay = weekDayMap[today.getDay()];
  const isScheduledToday = habit.completionDays.includes(todayWeekDay);

  const completionPercentage =
    habit.completionsNeed > 0
      ? (todayCompletions / habit.completionsNeed) * 100
      : 0;

  const isCompletedToday = todayCompletions >= habit.completionsNeed;

  const weekDays: { key: WeekDay; label: string }[] = [
    { key: "monday", label: "пн" },
    { key: "tuesday", label: "вт" },
    { key: "wednesday", label: "ср" },
    { key: "thursday", label: "чт" },
    { key: "friday", label: "пт" },
    { key: "saturday", label: "сб" },
    { key: "sunday", label: "вс" },
  ];

  const handleComplete = () => {
    if (isPending || isCompletedToday || !isScheduledToday) return;
    onComplete();
    setLocalCompletions((prev) => Math.min(prev + 1, habit.completionsNeed));
  };

  const handleDecrement = () => {
    if (todayCompletions === 0 || !isScheduledToday) return;
    onDecrement();
    setLocalCompletions((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Module style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View
            style={[styles.colorCircle, { backgroundColor: habit.color }]}
          />
          <StyledText style={styles.habitName}>{habit.name}</StyledText>
        </View>
        <View style={styles.interactionIcons}>
          <EditIcon color={COLORS.INTERACTION_ICONS} />
          <TouchableOpacity
            onPress={() => {
              if (isPending) return;
              deleteHabit();
            }}
          >
            <TrashIcon color={COLORS.INTERACTION_ICONS} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.completionProgress}>
        <StyledText style={styles.progressText}>Прогресс выполнения</StyledText>
        <StyledText style={styles.progressText}>
          {completionPercentage.toFixed(1)}%
        </StyledText>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.decrementButton,
            (todayCompletions === 0 || !isScheduledToday) && { opacity: 0.5 },
          ]}
          onPress={handleDecrement}
          disabled={todayCompletions === 0 || !isScheduledToday || isPending}
        >
          <MinusIcon />
        </TouchableOpacity>

        {isScheduledToday ? (
          <TouchableOpacity
            style={[
              styles.progressButton,
              (isPending || isCompletedToday) && { opacity: 0.5 },
            ]}
            onPress={handleComplete}
            disabled={isPending || isCompletedToday}
          >
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(completionPercentage, 100)}%` },
              ]}
            />
            <View style={styles.ProgressButtonInner}>
              <CheckIcon
                color={COLORS.PRIMARY_BACKGROUND}
                size={moderateScale(16)}
              />
              <StyledText style={styles.progressButtonText}>
                {isCompletedToday ? "Выполнено" : "Отметить выполнение"}
              </StyledText>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={[styles.progressButton, { opacity: 0.5 }]}>
            <StyledText style={styles.progressButtonText}>
              Не планируется на сегодня
            </StyledText>
          </View>
        )}
      </View>

      <View style={styles.miniInfoBlocks}>
        <View style={styles.InfoBlock}>
          <StyledText style={styles.TextInfoBlok}>Стрик</StyledText>
          <View style={styles.flameAndNumber}>
            <StyledText style={styles.TextInfoBlok}>{habit.streak}</StyledText>
            <FlameIcon color={getStreakColor(habit.streak)} />
          </View>
        </View>
        <View style={styles.InfoBlock}>
          <StyledText style={styles.TextInfoBlok}>Всего</StyledText>
          <StyledText style={styles.TextInfoBlok}>
            {totalCompletions}
          </StyledText>
        </View>
        <View style={styles.InfoBlock}>
          <StyledText style={styles.TextInfoBlok}>Сегодня</StyledText>
          <StyledText style={styles.TextInfoBlok}>
            {todayCompletions}/{habit.completionsNeed}
          </StyledText>
        </View>
      </View>

      <View style={styles.weekDaysContainer}>
        {weekDays.map((day) => (
          <View
            key={day.key}
            style={[
              styles.daySquare,
              {
                backgroundColor: habit.completionDays.includes(day.key)
                  ? COLORS.TABBAR_BACKGROUND_ITEM_SELECTED
                  : COLORS.BLOCKS_BACKGROUND,
              },
            ]}
          >
            <StyledText
              style={[
                styles.dayText,
                {
                  color: habit.completionDays.includes(day.key)
                    ? COLORS.PRIMARY_BACKGROUND
                    : COLORS.PRIMARY_TEXT,
                },
              ]}
            >
              {day.label}
            </StyledText>
          </View>
        ))}
      </View>

      {habit.notificationsTime && habit.notificationsTime.length > 0 && (
        <View style={styles.reminderContainer}>
          <ClockIcon color={COLORS.HINT_TEXT} />
          <StyledText style={styles.reminderText}>
            Напоминание: {habit.notificationsTime.join(", ")}
          </StyledText>
        </View>
      )}
    </Module>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    gap: moderateScale(6),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(24),
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  colorCircle: {
    width: moderateScale(16),
    height: moderateScale(16),
    borderRadius: moderateScale(8),
    marginRight: moderateScale(8),
  },
  habitName: {
    fontSize: moderateScale(14),
  },
  interactionIcons: {
    flexDirection: "row",
    gap: moderateScale(16),
  },
  decrementButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(12),
    backgroundColor: COLORS.INPUT_BACKGROUND,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  progressButton: {
    borderRadius: moderateScale(10),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: COLORS.INACTIVE_BUTTON_BACKGROUND,
    gap: moderateScale(8),
    flex: 1,
  },
  progressFill: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: moderateScale(10),
    backgroundColor: COLORS.BUTTON_BACKGROUND,
    zIndex: -1,
  },
  progressText: {
    color: COLORS.PRIMARY_TEXT,
    fontSize: moderateScale(12),
  },
  ProgressButtonInner: {
    marginHorizontal: moderateScale(24),
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(10),
  },
  progressButtonText: {
    color: COLORS.PRIMARY_BACKGROUND,
    fontSize: moderateScale(12),
  },
  completionProgress: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  miniInfoBlocks: {
    marginTop: moderateScale(14),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  InfoBlock: {
    alignItems: "center",
  },
  TextInfoBlok: {
    fontSize: moderateScale(12),
  },
  weekDaysContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: moderateScale(12),
  },
  daySquare: {
    width: moderateScale(36),
    height: moderateScale(45),
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontSize: moderateScale(12),
  },
  reminderContainer: {
    marginTop: moderateScale(8),
    flexDirection: "row",
    alignItems: "center",
  },
  reminderText: {
    fontSize: moderateScale(12),
    marginLeft: moderateScale(10),
    color: COLORS.HINT_TEXT,
    textAlign: "left",
  },
  flameAndNumber: {
    flexDirection: "row",
  },
});
