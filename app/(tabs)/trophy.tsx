import { TrophyIcon } from "@/assets/icons/tab-icons";
import { AchievementModule } from "@/components/AchivementModule";
import { Module } from "@/components/Module";
import { StyledText } from "@/components/StyledText";
import { COLORS } from "@/constants/theme";
import { useHabits } from "@/contexts/HabitsContext";
import { StyleSheet, View } from "react-native";
import { moderateScale } from "react-native-size-matters";

export default function AchievementsScreen() {
  const { habits, loading } = useHabits();

  if (loading) {
    return (
      <View style={styles.container}>
        <StyledText style={styles.emptyText}>Загрузка...</StyledText>
      </View>
    );
  }

  if (!habits || habits.length === 0) {
    return (
      <View style={styles.container}>
        <StyledText style={styles.emptyText}>Нет привычек</StyledText>
      </View>
    );
  }

  // Пример вычисления уровня и очков (можно поменять логику на свою)
  const totalPoints = habits.reduce((acc, h) => acc + h.allCompletions, 0);
  const level = Math.floor(totalPoints / 100) + 1;
  const pointsForNextLevel = level * 100;
  const progressPercentage = Math.min(
    100,
    Math.round((totalPoints / pointsForNextLevel) * 100)
  );

  // Определяем достижения на основе привычек
  const achievements = [
    {
      description: "Создать первую привычку",
      reward: 10,
      unlocked: habits.length >= 1,
    },
    {
      description: "Выполнять привычку на протяжении недели",
      reward: 100,
      unlocked: habits.some((h) => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Пн
        const completionsThisWeek = h.completionDays.filter((d) => {
          const date = new Date(d);
          return date >= startOfWeek && date <= today;
        }).length;
        return completionsThisWeek >= 7;
      }),
    },
    {
      description: "Достичь 100 выполнений",
      reward: 50,
      unlocked: totalPoints >= 100,
    },
  ];

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const lockedAchievements = achievements.filter((a) => !a.unlocked);

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
            Уровень {level}
          </StyledText>
          <StyledText style={{ fontSize: moderateScale(8) }}>
            {totalPoints} очков
          </StyledText>
          <View style={styles.progressInfo}>
            <StyledText style={{ fontSize: moderateScale(8) }}>
              до уровня {level + 1}
            </StyledText>
            <StyledText style={{ fontSize: moderateScale(8) }}>
              {totalPoints}/{pointsForNextLevel}
            </StyledText>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progressPercentage}%` }]}
            />
          </View>
        </View>
      </Module>

      <View style={styles.stats}>
        <Module style={styles.statsBlock}>
          <StyledText style={styles.statsBlockText}>Открыто</StyledText>
          <StyledText style={styles.statsBlockText}>
            {unlockedAchievements.length}
          </StyledText>
        </Module>
        <Module style={styles.statsBlock}>
          <StyledText style={styles.statsBlockText}>Всего</StyledText>
          <StyledText style={styles.statsBlockText}>
            {achievements.length}
          </StyledText>
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
  container: { gap: moderateScale(20), marginHorizontal: moderateScale(16) },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScale(12),
  },
  statsBlock: { width: moderateScale(165), alignItems: "center" },
  statsBlockText: { fontSize: moderateScale(14) },
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
  levelInfo: { flex: 1 },
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
