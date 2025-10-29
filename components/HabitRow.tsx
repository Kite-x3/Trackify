import { StyledText } from "@/components/StyledText";
import { COLORS } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { HabitBox } from "./HabitBox";

interface HabitRowProps {
  habit: {
    id: string;
    name: string;
    streak: number;
    weeklyProgress: number;
    color: string;
  };
  valueType: "streak" | "weeklyProgress";
}

export const HabitRow: React.FC<HabitRowProps> = ({ habit, valueType }) => {
  return (
    <View style={styles.habitRow}>
      <HabitBox name={habit.name} color={habit.color} />
      <StyledText style={styles.habitValue}>
        {valueType === "streak"
          ? `${habit.streak} дн`
          : `${habit.weeklyProgress}%`}
      </StyledText>
    </View>
  );
};

const styles = StyleSheet.create({
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(8),
  },
  habitValue: {
    color: COLORS.PRIMARY_TEXT,
    fontSize: moderateScale(12),
  },
});
