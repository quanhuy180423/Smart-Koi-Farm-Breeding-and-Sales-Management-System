import { useNotificationSocket } from "./useNotificationSocket";
import type { NotificationMessage } from "./useNotificationSocket";

interface UseNotificationOptions {
  onMessage?: (notification: NotificationMessage) => void;
  autoConnect?: boolean;
}

export interface UseNotificationReturn {
  isConnected: boolean;
}

/**
 * Notification hook using WebSocket for real-time updates
 * Note: For reliable notification fetching, use useGetWaterAlerts directly
 * This hook is for receiving push notifications from the backend
 */
export function useNotification(
  options: UseNotificationOptions = {},
): UseNotificationReturn {
  const { onMessage, autoConnect = true } = options;

  // WebSocket connection for real-time push notifications
  const { isConnected } = useNotificationSocket({
    autoConnect: autoConnect,
    onMessage: (notification) => {
      onMessage?.(notification);
    },
  });

  return {
    isConnected,
  };
}
