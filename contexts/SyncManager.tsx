// contexts/SyncManager.tsx
import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";
import { useHabits } from "./HabitsContext";
import { useNotifications } from "./NotificationsContext";

export const useSyncManager = () => {
  const { syncWithServer } = useHabits();
  const { syncNotifications } = useNotifications();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = Boolean(state.isConnected && state.isInternetReachable);
      if (online) {
        syncWithServer();
        syncNotifications();
      }
    });

    return unsubscribe;
  }, []);
};
