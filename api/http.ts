import axios from "axios";
export const BASE_URL = "https://localhost:7038";

export const safeApiCall = async <T>(fn: () => Promise<T>): Promise<T | null> => {
  try {
    return await fn();
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      console.warn("Unauthorized request, returning null");
      return null as T;
    }
    console.error(err);
    return null as T;
  }
};

export const api = axios.create({
  baseURL: "https://localhost:7038",
  withCredentials: true
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post("/account/refresh");
        return api(originalRequest);
      } catch (refreshError) {

        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);