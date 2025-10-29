import { TrophyIcon } from "@/assets/icons/tab-icons";
import { AchievementModule } from "@/components/AchivementModule";
import { Module } from "@/components/Module";
import { StyledText } from "@/components/StyledText";
import { COLORS } from "@/constants/theme";
import { StyleSheet, View } from "react-native";
import { moderateScale } from "react-native-size-matters";

export default function StatsScreen() {
  let completionPercentage = 10;

  let achivements = [
    { description: "Создать первую привычку", reward: 10, unlocked: true },
    {
      description: "Выполнять привычку на протяжении недели",
      reward: 100,
      unlocked: false,
    },
  ];

  const unlockedAchievements = achivements.filter((a) => a.unlocked);
  const lockedAchievements = achivements.filter((a) => !a.unlocked);

  return (
    <View style={styles.container}>
      <Module style={styles.lvlBlock}>
        <View style={styles.trophybox}>
          <TrophyIcon
            size={moderateScale(50)}
            color={COLORS.PRIMARY_BACKGROUND}
          />
        </View>
        <View style={styles.levelInfo}>
          <StyledText style={{ fontSize: moderateScale(12) }}>
            Уровень {1}
          </StyledText>
          <StyledText style={{ fontSize: moderateScale(8) }}>
            {100} очков
          </StyledText>
          <View style={styles.progressInfo}>
            <StyledText style={{ fontSize: moderateScale(8) }}>
              до уровня {2}
            </StyledText>
            <StyledText style={{ fontSize: moderateScale(8) }}>
              {10}/{200}
            </StyledText>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(completionPercentage, 100)}%`,
                },
              ]}
            />
          </View>
        </View>
      </Module>

      <View style={styles.stats}>
        <Module style={styles.statsBlock}>
          <StyledText style={styles.statsBlockText}>Открыто</StyledText>
          <StyledText style={styles.statsBlockText}>{2}</StyledText>
        </Module>
        <Module style={styles.statsBlock}>
          <StyledText style={styles.statsBlockText}>Всего</StyledText>
          <StyledText style={styles.statsBlockText}>{10}</StyledText>
        </Module>
      </View>

      <View style={styles.achievementsSection}>
        <StyledText style={styles.sectionTitle}>Разблокированные</StyledText>
        {unlockedAchievements.length > 0 ? (
          unlockedAchievements.map((achievement, index) => (
            <AchievementModule
              key={index}
              description={achievement.description}
              reward={achievement.reward}
              unlocked={achievement.unlocked}
            />
          ))
        ) : (
          <StyledText style={styles.emptyText}>
            Нет разблокированных достижений
          </StyledText>
        )}
      </View>

      <View style={styles.achievementsSection}>
        <StyledText style={styles.sectionTitle}>Заблокированные</StyledText>
        {lockedAchievements.length > 0 ? (
          lockedAchievements.map((achievement, index) => (
            <AchievementModule
              key={index}
              description={achievement.description}
              reward={achievement.reward}
              unlocked={achievement.unlocked}
            />
          ))
        ) : (
          <StyledText style={styles.emptyText}>
            Нет заблокированных достижений
          </StyledText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: moderateScale(20),
    marginHorizontal: moderateScale(16),
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScale(12),
  },
  statsBlock: {
    width: moderateScale(165),
    alignItems: "center",
  },
  statsBlockText: {
    fontSize: moderateScale(14),
  },
  lvlBlock: {
    gap: moderateScale(12),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(12),
  },
  trophybox: {
    backgroundColor: COLORS.BUTTON_BACKGROUND,
    borderRadius: moderateScale(24),
    padding: moderateScale(6),
  },
  levelInfo: {
    flex: 1,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: moderateScale(2),
  },
  progressBar: {
    borderRadius: moderateScale(10),
    height: moderateScale(5),
    position: "relative",
    backgroundColor: COLORS.INACTIVE_BUTTON_BACKGROUND,
    marginTop: moderateScale(4),
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
  achievementsSection: {
    gap: moderateScale(8),
    marginBottom: moderateScale(12),
  },
  sectionTitle: {
    fontSize: moderateScale(14),
    fontWeight: "bold",
    marginBottom: moderateScale(4),
  },
  emptyText: {
    fontSize: moderateScale(12),
    textAlign: "center",
    color: COLORS.INACTIVE_BUTTON_BACKGROUND,
    fontStyle: "italic",
  },
});
