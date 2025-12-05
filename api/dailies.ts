import { api, safeApiCall } from "./http";


export const DailiesApi = {
  getToday: () => safeApiCall(() => api.get("/api/Dailies/me").then(res => res.data)),

  complete: (dailyId: number) =>
    safeApiCall(() => api.post("/api/Dailies/me/complete", { achievementId: dailyId }).then(res => res.data)),

  completeByDailyId: (dailyId: number) =>
    safeApiCall(() => api.post("/api/Dailies/me/complete", { achievementId: dailyId }).then(res => res.data))
};
