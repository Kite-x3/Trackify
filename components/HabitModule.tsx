import { Habit, WeekDay } from "@/types/habit";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Module } from "./Module";
import { StyledText } from "./StyledText";
import { COLORS } from "@/constants/theme";
import { CheckIcon, MinusIcon } from "@/assets/icons/button-icons";
import { ClockIcon, EditIcon, TrashIcon } from "@/assets/icons/common-icons";

interface HabitModuleProps {
  habit: Habit;
  onPress?: (habit: Habit) => void;
  onDecrement: (habit: Habit) => void;
  onComplete: (habit: Habit) => void;
}

export const HabitModule: React.FC<HabitModuleProps> = ({
  habit,
  onPress,
  onDecrement,
  onComplete,
}) => {
  const completionPercentage =
    habit.completionsNeed > 0
      ? (habit.completionsToday / habit.completionsNeed) * 100
      : 0;

  const weekDays: { key: WeekDay; label: string }[] = [
    { key: "monday", label: "пн" },
    { key: "tuesday", label: "вт" },
    { key: "wednesday", label: "ср" },
    { key: "thursday", label: "чт" },
    { key: "friday", label: "пт" },
    { key: "saturday", label: "сб" },
    { key: "sunday", label: "вс" },
  ];

  return (
    <Module style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View
            style={[styles.colorCircle, { backgroundColor: habit.color }]}
          />
          <StyledText>{habit.name}</StyledText>
        </View>
        <View style={styles.interactionIcons}>
          <EditIcon color={COLORS.INTERACTION_ICONS}></EditIcon>
          <TrashIcon color={COLORS.INTERACTION_ICONS}></TrashIcon>
        </View>
      </View>
      <View style={styles.completionProgress}>
        <StyledText style={styles.progressText}>Прогресс выполнения</StyledText>
        <StyledText style={styles.progressText}>
          {((habit.completionsToday / habit.completionsNeed) * 100).toFixed(1)}%
        </StyledText>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.decrementButton}
          onPress={() => onDecrement(habit)}
          disabled={habit.completionsToday === 0}
        >
          <MinusIcon></MinusIcon>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.progressButton}
          onPress={() => onComplete(habit)}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(completionPercentage, 100)}%`,
              },
            ]}
          />
          <View style={styles.ProgressButtonInner}>
            <CheckIcon color={COLORS.PRIMARY_BACKGROUND} size={16}></CheckIcon>
            <StyledText style={styles.progressButtonText}>
              Отметить выполнение
            </StyledText>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.miniInfoBlocks}>
        <View style={styles.InfoBlock}>
          <StyledText style={styles.TextInfoBlok}>Стрик</StyledText>
          <StyledText style={styles.TextInfoBlok}>{habit.streak}</StyledText>
        </View>
        <View style={styles.InfoBlock}>
          <StyledText style={styles.TextInfoBlok}>Всего</StyledText>
          <StyledText style={styles.TextInfoBlok}>{habit.streak}</StyledText>
        </View>
        <View style={styles.InfoBlock}>
          <StyledText style={styles.TextInfoBlok}>За неделю</StyledText>
          <StyledText style={styles.TextInfoBlok}>{habit.streak}</StyledText>
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

      {habit.reminderTime && (
        <View style={styles.reminderContainer}>
          <ClockIcon color={COLORS.HINT_TEXT}></ClockIcon>
          <StyledText style={styles.reminderText}>
            Напоминание: {habit.reminderTime}
          </StyledText>
        </View>
      )}
    </Module>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    gap: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  colorCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  interactionIcons: {
    flexDirection: "row",
    gap: 16,
  },
  decrementButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: COLORS.INPUT_BACKGROUND,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  progressButton: {
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: COLORS.INACTIVE_BUTTON_BACKGROUND,
    gap: 8,
  },
  progressFill: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 10,
    backgroundColor: COLORS.BUTTON_BACKGROUND,
    zIndex: -1,
  },
  progressText: {
    color: COLORS.PRIMARY_TEXT,
    fontSize: 12,
  },
  ProgressButtonInner: {
    marginHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressButtonText: {
    color: COLORS.PRIMARY_BACKGROUND,
  },
  completionProgress: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  miniInfoBlocks: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  InfoBlock: {
    alignItems: "center",
  },
  TextInfoBlok: {
    fontSize: 12,
  },
  weekDaysContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  daySquare: {
    width: 36,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontSize: 12,
  },
  reminderContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  reminderText: {
    fontSize: 12,
    marginLeft: 10,
    color: COLORS.HINT_TEXT,
    textAlign: "left",
  },
});
