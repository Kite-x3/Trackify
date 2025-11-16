export const getStreakColor = (streak: number) => {
  if (streak >= 50) return "#f704ffff"
  if (streak >= 30) return "#FF4500";
  if (streak >= 5) return "#FF8C42";
  return "#6C6C6C";
};
