import { CheckIcon, MinusIcon } from "@/assets/icons/button-icons";
import { ClockIcon, EditIcon, FlameIcon, TrashIcon } from "@/assets/icons/common-icons";
import { COLORS } from "@/constants/theme";
import { Habit, WeekDay } from "@/types/habit";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Module } from "./Module";
import { StyledText } from "./StyledText";
import { getStreakColor } from "@/utils/strakColor";

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
          <StyledText style={styles.habitName}>{habit.name}</StyledText>
        </View>
        <View style={styles.interactionIcons}>
          <EditIcon color={COLORS.INTERACTION_ICONS} />
          <TrashIcon color={COLORS.INTERACTION_ICONS} />
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
          style={styles.decrementButton}
          onPress={() => onDecrement(habit)}
          disabled={habit.completionsToday === 0}
        >
          <MinusIcon />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.progressButton}
          onPress={() => onComplete(habit)}
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
              Отметить выполнение
            </StyledText>
          </View>
        </TouchableOpacity>
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
          <ClockIcon color={COLORS.HINT_TEXT} />
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
  flameAndNumber:{
    flexDirection: "row"
  }
});
