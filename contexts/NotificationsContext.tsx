import { api } from "@/api/http";
import { Offline } from "@/storage/offline";
import NetInfo from "@react-native-community/netinfo";
import React, { createContext, useContext, useEffect, useState } from "react";

export type Notification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
};

type NotificationsContextType = {
  notifications: Notification[];
  addNotification: (n: Notification) => void;
  markRead: (id: string) => void;
  syncNotifications: () => Promise<void>;
};

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>(
    () => Offline.get<Notification[]>("notifications") ?? []
  );
  const [queue, setQueue] = useState<Notification[]>(
    () => Offline.get<Notification[]>("notif_queue") ?? []
  );
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOn = Boolean(state.isConnected && state.isInternetReachable);
      setOnline(isOn);
      if (isOn) syncNotifications();
    });
    return unsubscribe;
  }, []);

  const saveNotifications = (list: Notification[]) => {
    setNotifications(list);
    Offline.set("notifications", list);
  };

  const saveQueue = (q: Notification[]) => {
    setQueue(q);
    Offline.set("notif_queue", q);
  };

  const addNotification = (n: Notification) => {
    const updated = [n, ...notifications];
    saveNotifications(updated);

    const q = [...queue, n];
    saveQueue(q);

    if (online) syncNotifications();
  };

  const markRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  const syncNotifications = async () => {
    for (const n of queue) {
      try {
        await api.post("/notifications", n);
      } catch {
        return;
      }
    }
    saveQueue([]);
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, addNotification, markRead, syncNotifications }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within NotificationsProvider"
    );
  return ctx;
};
