import { mmkv } from "./mkkv";

export const Offline = {
  set(key: string, value: any) {
    mmkv.set(key, JSON.stringify(value));
  },

  get<T = any>(key: string, fallback: T | null = null): T | null {
    try {
      const raw = mmkv.getString(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },

  remove(key: string) {
    mmkv.remove(key) ;
  },
};
