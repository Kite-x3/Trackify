import { CalendarIcon } from "@/assets/icons/tab-icons";
import { Module } from "@/components/Module";
import { StyledText } from "@/components/StyledText";
import { COLORS } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

interface AchievementModuleProps {
  description: string;
  reward: number;
  unlocked: boolean;
}

export const AchievementModule: React.FC<AchievementModuleProps> = ({
  description,
  reward,
  unlocked,
}) => {
  return (
    <Module
      style={[styles.achievementItem, !unlocked && styles.lockedAchievement]}
    >
      <CalendarIcon />
      <View style={styles.achievementContent}>
        <StyledText
          style={[
            styles.achievementDescription,
            !unlocked && styles.lockedText,
          ]}
        >
          {description}
        </StyledText>
        <StyledText
          style={[
            styles.achievementReward,
            !unlocked && styles.lockedRewardBack,
          ]}
        >
          +{reward}
        </StyledText>
      </View>
    </Module>
  );
};

const styles = StyleSheet.create({
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    marginTop: 8,
  },
  lockedAchievement: {
    opacity: 0.6,
  },
  achievementContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  achievementDescription: {
    fontSize: 12,
    flex: 1,
    marginRight: 8,
  },
  achievementReward: {
    fontSize: 14,
    color: COLORS.PRIMARY_BACKGROUND,
    backgroundColor: COLORS.BUTTON_BACKGROUND,
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  lockedText: {
    color: COLORS.LOCKED_ACHIVEMENTS_TEXT,
  },
  lockedRewardBack: {
    backgroundColor: COLORS.LOCKED_ACHEVEMENTS_REWARD_BACKGROUND,
  },
});
