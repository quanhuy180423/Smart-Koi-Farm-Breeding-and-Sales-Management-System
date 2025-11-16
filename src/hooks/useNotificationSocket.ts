import { useEffect, useRef, useCallback, useState } from "react";

// Notification type definitions
export enum NotificationType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

export interface NotificationData {
  [key: string]: string | number | boolean | null | undefined;
}

export interface NotificationMessage {
  type: NotificationType | string;
  title: string;
  message: string;
  timestamp?: string;
  data?: NotificationData;
}

interface UseNotificationSocketReturn {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: NotificationMessage) => void;
}

interface UseNotificationSocketOptions {
  onMessage?: (notification: NotificationMessage) => void;
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export function useNotificationSocket(
  options: UseNotificationSocketOptions = {},
): UseNotificationSocketReturn {
  const {
    onMessage,
    autoConnect = true,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const isConnectingRef = useRef(false);

  const connect = useCallback(() => {
    if (
      isConnectingRef.current ||
      wsRef.current?.readyState === WebSocket.OPEN
    ) {
      return;
    }

    isConnectingRef.current = true;

    try {
      // Get backend URL from environment variable
      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL_BACKEND || "http://localhost:5000";

      // Convert HTTP/HTTPS to WS/WSS
      const wsUrl = backendUrl
        .replace(/^https:/, "wss:")
        .replace(/^http:/, "ws:")
        .replace(/\/$/, "") // Remove trailing slash
        .concat("/api/ws/alerts");

      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        isConnectingRef.current = false;
        reconnectCountRef.current = 0;
        setIsConnected(true);
      };

      wsRef.current.onmessage = (event: Event) => {
        if (!(event instanceof MessageEvent)) {
          console.error("Invalid event type");
          return;
        }

        try {
          const parsedData = JSON.parse(event.data) as unknown;

          // Validate notification structure
          if (typeof parsedData !== "object" || parsedData === null) {
            console.warn(
              "⚠️ Invalid data structure (not an object):",
              parsedData,
            );
            return;
          }

          const notif = parsedData as Record<string, unknown>;

          // Check if it's a water alert (has Id or id field indicating it's from the alert service)
          const isWaterAlert = "Id" in notif || "id" in notif;

          // Ensure we have either message or title, or it's a water alert
          if (!isWaterAlert && !("message" in notif) && !("title" in notif)) {
            console.warn(
              "⚠️ Invalid notification format - missing required fields:",
              notif,
            );
            return;
          }

          // Build notification with defaults
          // For water alerts, pass the entire alert object as data
          const notification: NotificationMessage = {
            type: (notif.type as string) || "info",
            title: (notif.title as string) || "",
            message: (notif.message as string) || "",
            timestamp: notif.timestamp as string | undefined,
            // If data exists, use it; otherwise, if it's a water alert, use the whole object
            data:
              (notif.data as NotificationData) ||
              (isWaterAlert ? (notif as NotificationData) : undefined),
          };

          // Call callback if provided
          onMessage?.(notification);
        } catch (error) {
          if (error instanceof SyntaxError) {
            console.error("Failed to parse notification JSON:", error.message);
          } else if (error instanceof Error) {
            console.error("Notification processing error:", error.message);
          } else {
            console.error("Unknown error processing notification");
          }
        }
      };

      wsRef.current.onerror = () => {
        isConnectingRef.current = false;
        // Suppress error logging - normal during connection attempts
      };

      wsRef.current.onclose = () => {
        isConnectingRef.current = false;
        setIsConnected(false);
        wsRef.current = null;

        // Attempt to reconnect
        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++;

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };
    } catch {
      isConnectingRef.current = false;
    }
  }, [onMessage, reconnectAttempts, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    reconnectCountRef.current = 0;
  }, []);

  const sendMessage = useCallback((message: NotificationMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      // Only disconnect if we're not in the middle of a re-connection
      // This prevents the "closed before connection established" warning in Strict Mode
      if (
        wsRef.current?.readyState === WebSocket.OPEN ||
        wsRef.current?.readyState === WebSocket.CONNECTING
      ) {
        disconnect();
      }
    };
  }, [autoConnect, connect, disconnect]);

  return {
    isConnected,
    connect,
    disconnect,
    sendMessage,
  };
}
