import { DailiesApi } from "@/api/dailies";
import { useAuth } from "@/contexts/AuthContext";
import { Offline } from "@/storage/offline";
import React, { createContext, useContext, useEffect, useState } from "react";

type Daily = {
  id: number;
  title: string;
  completed: boolean;
};

type Ctx = {
  dailies: Daily[];
  loading: boolean;
  refresh: () => Promise<void>;
  complete: (id: number) => Promise<void>;
};

const DailiesContext = createContext<Ctx | undefined>(undefined);

export const DailiesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dailies, setDailies] = useState<Daily[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setDailies([]);
      setLoading(false);
      return;
    }

    const cached = Offline.get<Daily[]>("dailies") ?? [];
    setDailies(cached);

    refresh();
  }, [user]);

  async function refresh() {
    setLoading(true);
    try {
      const data = (await DailiesApi.getToday()) ?? [];
      setDailies(data);
      Offline.set("dailies", data);
    } finally {
      setLoading(false);
    }
  }

  async function complete(id: number) {
    setDailies((prev) => {
      const updated = prev.map((d) =>
        d.id === id ? { ...d, completed: true } : d
      );
      Offline.set("dailies", updated);
      return updated;
    });

    try {
      await DailiesApi.complete(id);
    } catch {}
  }

  return (
    <DailiesContext.Provider value={{ dailies, loading, refresh, complete }}>
      {children}
    </DailiesContext.Provider>
  );
};

export function useDailies() {
  const ctx = useContext(DailiesContext);
  if (!ctx) throw new Error("useDailies must be used within DailiesProvider");
  return ctx;
}
