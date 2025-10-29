import { StyledText } from "@/components/StyledText";
import { COLORS } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { moderateScale } from "react-native-size-matters";

interface HabitBoxProps {
  name: string;
  color: string;
}

export const HabitBox: React.FC<HabitBoxProps> = ({ name, color }) => {
  return (
    <View style={styles.habitBox}>
      <View style={[styles.colorDot, { backgroundColor: color }]} />
      <StyledText style={styles.habitName}>{name}</StyledText>
    </View>
  );
};

const styles = StyleSheet.create({
  habitBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.ADD_HABBIT_BUTTONS,
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(6),
  },
  colorDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    marginRight: moderateScale(6),
  },
  habitName: {
    color: COLORS.PRIMARY_BACKGROUND,
    fontSize: moderateScale(12),
  },
});
