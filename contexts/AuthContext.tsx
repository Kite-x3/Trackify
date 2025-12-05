// contexts/AuthContext.tsx
import { AuthApi } from "@/api/auth";
import { Offline } from "@/storage/offline";
import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  userId?: string;
  username?: string;
  email?: string;
  [k: string]: any;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // Инициализация: сначала пробуем загрузить юзера с сервера
  useEffect(() => {
    (async () => {
      try {
        const me = await AuthApi.currentUser();
        setUser(me);
        Offline.set("user", me);
      } catch {
        // если сервер вернул 401 — используем кэш
        const cached = Offline.get<User>("user");
        setUser(cached ?? null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // --- LOGIN ---
  async function login(username: string, password: string) {
    await AuthApi.login(username, password); // сервер сам поставит cookie
    const me = await AuthApi.currentUser();
    setUser(me);
    Offline.set("user", me);
  }

  // --- REGISTER ---
  async function register(username: string, email: string, password: string) {
    await AuthApi.register(username, email, password);
    const me = await AuthApi.currentUser();
    setUser(me);
    Offline.set("user", me);
  }

  // --- LOGOUT ---
  async function logout() {
    try {
      await AuthApi.logout();
    } catch {}
    setUser(null);
    Offline.remove("user");
  }

  // --- REFRESH ---
  async function refreshUser() {
    try {
      const me = await AuthApi.currentUser();
      setUser(me);
      Offline.set("user", me);
    } catch {
      setUser(null);
      Offline.remove("user");
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
