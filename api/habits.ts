import { api, safeApiCall } from "./http";


export const HabitService = {
  getAll: () => safeApiCall(() => api.get("/api/Habit").then(res => res.data)),
  create: (data: any) => safeApiCall(() => api.post("/api/Habit", data).then(res => res.data)),
  addCompletion: (habitId: string) =>
    safeApiCall(() => api.post(`/api/habits/${habitId}/completions`, { increment: 1 }).then(res => res.data)),
  removeCompletion: (habitId: string) =>
    safeApiCall(() => api.post(`/api/habits/${habitId}/completions`, { increment: -1 }).then(res => res.data)),
  delete: (id: string) =>
    safeApiCall(() => api.delete(`/api/Habit/${id}`))
};
