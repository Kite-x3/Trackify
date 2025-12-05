import { HabitService } from "@/api/habits";
import { api } from "@/api/http";
import { Habit } from "@/types/habit";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import React, { createContext, useContext, useEffect, useState } from "react";
import { createMMKV } from "react-native-mmkv";

export const storage = createMMKV();

type SyncAction =
  | { type: "complete"; id: string }
  | { type: "uncomplete"; id: string }
  | { type: "update"; habit: Habit }
  | { type: "create"; habit: Habit }
  | { type: "delete"; id: string };

type HabitContextType = {
  habits: Habit[];
  completeHabit(id: string): void;
  uncompleteHabit(id: string): void;
  updateHabit(h: Habit): void;
  createHabit(h: Habit): void;
  syncWithServer(): Promise<void>;
  resetHabits(): void;
  loading: boolean;
  isPending: (id: string) => boolean;
  deleteHabit(id: string): void;
};

const HabitContext = createContext<HabitContextType | null>(null);

export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [syncQueue, setSyncQueue] = useState<SyncAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(false);

  // ---------------- LOAD LOCAL + SUBSCRIBE NETWORK ----------------
  useEffect(() => {
    const saved = storage.getString("habits");
    if (saved) setHabits(JSON.parse(saved));

    const savedQueue = storage.getString("sync_queue");
    if (savedQueue) setSyncQueue(JSON.parse(savedQueue));

    NetInfo.addEventListener((state: NetInfoState) => {
      const isOn = Boolean(state.isConnected && state.isInternetReachable);
      const wasOffline = !online;

      setOnline(isOn);

      if (wasOffline && isOn) syncWithServer();
    });

    fetchFromBackend();
  }, []);

  // ---------------- SAVE HELPERS ----------------
  const saveHabits = (list: Habit[]) => {
    storage.set("habits", JSON.stringify(list));
  };

  // ---------------- FETCH FROM SERVER ----------------
  const fetchFromBackend = async () => {
    try {
      const data = await HabitService.getAll();
      if (data) {
        setHabits((prevHabits) => {
          // Мержим: берём новые данные с сервера, но сохраняем локальные completionsToday
          const merged = (data as Habit[]).map((serverHabit) => {
            const localHabit = prevHabits.find((h) => h.id === serverHabit.id);
            // Если есть локальное, используем его completionsToday (более свежее)
            // иначе берём с сервера
            return localHabit
              ? {
                  ...serverHabit,
                  completionsToday: localHabit.completionsToday,
                }
              : serverHabit;
          });
          saveHabits(merged);
          return merged;
        });
      }
    } catch (error) {
      console.error("Error fetching habits:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- ADD TO QUEUE ----------------
  const enqueue = (action: SyncAction) => {
    const raw = storage.getString("sync_queue");
    const existing: SyncAction[] = raw ? JSON.parse(raw) : [];
    const updated = [...existing, action];

    storage.set("sync_queue", JSON.stringify(updated));
    setSyncQueue(updated);

    console.log("enqueue action:", action, "queueLength:", updated.length);
    return updated;
  };

  // ---------------- SYNC WITH SERVER ----------------
  const syncWithServer = async (overrideQueue?: SyncAction[]) => {
    try {
      // берем актуальную очередь: если передали override, используем её,
      // иначе читаем прямо из storage (чтобы избежать race)
      const raw = storage.getString("sync_queue");
      const storedQueue: SyncAction[] = raw ? JSON.parse(raw) : [];
      const queueToProcess = overrideQueue ?? storedQueue ?? syncQueue;

      console.log("syncWithServer START, queue length:", queueToProcess.length);

      // process sequentially, removing each item from storage after success
      for (const action of queueToProcess) {
        try {
          console.log("Syncing action:", action);
          let result: any = null;

          switch (action.type) {
            case "complete":
              result = await HabitService.addCompletion(action.id);
              if (result) replaceHabit(result);
              break;

            case "uncomplete":
              result = await HabitService.removeCompletion(action.id);
              if (result) replaceHabit(result);
              break;

            case "update":
              const putRes = await api.put(
                `/api/Habit/${action.habit.id}`,
                action.habit
              );
              if (putRes?.data) replaceHabit(putRes.data);
              break;

            case "create":
              result = await HabitService.create(action.habit);
              if (result) replaceHabit(result);
              break;
          }

          // удаляем успешно обработанный action из storage-очереди
          const rawAfter = storage.getString("sync_queue");
          const after: SyncAction[] = rawAfter ? JSON.parse(rawAfter) : [];
          const idx = after.findIndex(
            (a) => JSON.stringify(a) === JSON.stringify(action)
          );
          if (idx !== -1) {
            after.splice(idx, 1);
            storage.set("sync_queue", JSON.stringify(after));
            setSyncQueue(after);
          }

          // сбрасываем pending для этой привычки
          if (action.type === "complete" || action.type === "uncomplete") {
            setPending((prev) => {
              const copy = new Set(prev);
              copy.delete(action.id);
              return copy;
            });
          }
        } catch (err) {
          console.warn("Sync for action failed, will retry later", err);
          return;
        }
      }

      try {
        await fetchFromBackend();
        console.log("Refreshed habits from server after sync.");
      } catch (err) {
        console.warn("Failed to refresh habits after sync:", err);
      }

      console.log("syncWithServer finished");
    } catch (err) {
      console.error("syncWithServer error:", err);
    }
  };

  // ---------------- LOCAL MUTATION HELPERS ----------------
  const replaceHabit = (habit: Habit) => {
    setHabits((prev) => {
      const updated = prev.map((h) => (h.id === habit.id ? habit : h));
      saveHabits(updated);
      return updated;
    });
  };

  const updateLocalHabit = (id: string, fn: (h: Habit) => Habit) => {
    setHabits((prev) => {
      const updated = prev.map((h) => (h.id === id ? fn(h) : h));
      saveHabits(updated);
      return updated;
    });
  };

  // ---------------- PUBLIC ACTIONS ----------------
  const completeHabit = (id: string) => {
    // блокируем повторные нажатия
    setPending((prev) => new Set(prev).add(id));

    // локально даём мгновенный отклик интерфейсу (необязательно)
    updateLocalHabit(id, (h) => ({
      ...h,
      completionsToday: Math.min(h.completionsToday + 1, h.completionsNeed),
    }));

    // add to queue (synchronously to storage) и получаем актуальную очередь
    const updatedQueue = enqueue({ type: "complete", id });

    // если онлайн, прокидываем актуальную очередь в syncWithServer
    if (online) {
      syncWithServer(updatedQueue);
    }
  };

  const resetHabits = () => {
    setHabits([]);
    setPending(new Set());
    setSyncQueue([]);
    storage.remove("habits");
    storage.remove("sync_queue");
  };

  const uncompleteHabit = (id: string) => {
    setPending((prev) => {
      const copy = new Set(prev);
      copy.add(id);
      return copy;
    });

    updateLocalHabit(id, (h) => ({
      ...h,
      completionsToday: Math.max(0, h.completionsToday - 1),
    }));

    const q = enqueue({ type: "uncomplete", id });
    if (online) syncWithServer(q);
  };

  const updateHabit = (habit: Habit) => {
    replaceHabit(habit);
    enqueue({ type: "update", habit });
    if (online) syncWithServer();
  };

  const createHabit = (habit: Habit) => {
    setHabits((prev) => {
      const updated = [...prev, habit];
      saveHabits(updated);
      return updated;
    });

    enqueue({ type: "create", habit });
    if (online) syncWithServer();
  };

  const deleteHabit = async (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    const updatedQueue = enqueue({ type: "delete", id });

    if (online) {
      try {
        const res = await HabitService.delete(id);
        // удаляем из очереди после успешного удаления
        setSyncQueue((prev) =>
          prev.filter((a) => !(a.type === "delete" && a.id === id))
        );
      } catch (err) {
        console.warn("Failed to delete habit from server:", err);
      }
    }
  };

  // ---------------- RENDER ----------------
  return (
    <HabitContext.Provider
      value={{
        habits,
        completeHabit,
        uncompleteHabit,
        updateHabit,
        createHabit,
        deleteHabit,
        loading,
        syncWithServer,
        isPending: (id: string) => pending.has(id),
        resetHabits,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error("useHabits must be used inside HabitProvider");
  return ctx;
};
