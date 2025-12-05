import { User } from "@/types/User";
import { api, safeApiCall } from "./http";


export const AuthApi = {
  login: (username: string, password: string) =>
    safeApiCall(() => api.post("/api/Account/login", { username, password }).then(res => res.data as User)),

  register: (username: string, email: string, password: string) =>
    safeApiCall(() => api.post("/api/Account/register", { username, email, password }).then(res => res.data as User)),

  currentUser: () =>
    safeApiCall(() => api.get("/api/Achievements/me").then(res => res.data as User)),

  logout: () =>
    safeApiCall(() => api.post("/api/Account/logout").then(res => res.data as User)),

  refresh: () =>
    safeApiCall(() => api.post("/Account/refresh").then(res => res.data as User))
};
