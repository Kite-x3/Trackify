import { useHabits } from "@/contexts/HabitsContext";
import { Offline } from "@/storage/offline";
import React, { createContext, useContext, useEffect, useState } from "react";

export type Stats = {
  xp: number;
  level: number;
  streak: number; // дни подряд
  progress: number; // % прогресса до следующего уровня
};

type StatsContextType = {
  stats: Stats;
  addXP: (amount: number) => void;
  resetStreak: () => void;
  refreshStats: () => void;
  resetStats(): void;
};

const defaultStats: Stats = {
  xp: 0,
  level: 1,
  streak: 0,
  progress: 0,
};

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stats, setStats] = useState<Stats>(
    () => Offline.get<Stats>("stats") ?? defaultStats
  );
  const { habits } = useHabits();

  useEffect(() => {
    refreshStats();
  }, [habits]);

  const saveStats = (s: Stats) => {
    setStats(s);
    Offline.set("stats", s);
  };

  const resetStats = () => {
    setStats(defaultStats);
    Offline.remove("stats");
  };

  const addXP = (amount: number) => {
    const newXP = stats.xp + amount;
    const newLevel = Math.floor(newXP / 100) + 1;
    const progress = newXP % 100;
    saveStats({ ...stats, xp: newXP, level: newLevel, progress });
  };

  const resetStreak = () => {
    saveStats({ ...stats, streak: 0 });
  };

  const refreshStats = () => {
    // Простейший алгоритм подсчета streak и XP по привычкам
    const completedHabits = habits.filter(
      (h) => h.completionsToday >= h.completionsNeed
    ).length;
    const newXP = completedHabits * 10; // 10 XP за каждую выполненную привычку
    const newStreak = completedHabits > 0 ? stats.streak + 1 : 0;
    const newLevel = Math.floor(newXP / 100) + 1;
    const progress = newXP % 100;
    saveStats({ xp: newXP, level: newLevel, streak: newStreak, progress });
  };

  return (
    <StatsContext.Provider
      value={{ stats, addXP, resetStreak, refreshStats, resetStats }}
    >
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const ctx = useContext(StatsContext);
  if (!ctx) throw new Error("useStats must be used within StatsProvider");
  return ctx;
};
