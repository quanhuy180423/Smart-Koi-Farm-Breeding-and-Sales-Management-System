import { useEffect, useRef, useCallback, useState } from "react";

// Notification type definitions
export enum NotificationType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

export interface WaterAlertData {
  PondId?: number;
  pondId?: number;
  PondName?: string;
  pondName?: string;
  ParameterName?: string;
  parameterName?: string;
  MeasuredValue?: number;
  measuredValue?: number;
  Severity?: string;
  severity?: string;
  AlertType?: string;
  alertType?: string;
  Message?: string;
  message?: string;
  CreatedAt?: string;
  createdAt?: string;
  IsResolved?: boolean;
  isResolved?: boolean;
  ResolvedByUserId?: number | null;
  resolvedByUserId?: number | null;
  ResolvedByUserName?: string | null;
  resolvedByUserName?: string | null;
}

export type NotificationMessageData = WaterAlertData | undefined;

export interface NotificationMessage {
  type: NotificationType | string;
  title: string;
  message: string;
  timestamp?: string;
  data?: NotificationMessageData;
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
          return;
        }

        try {
          const parsedData = JSON.parse(event.data) as unknown;

          // Validate notification structure
          if (typeof parsedData !== "object" || parsedData === null) {
            return;
          }

          const notif = parsedData as Record<string, unknown>;

          // Check if it's a water alert by looking for water alert specific fields
          // Backend sends PascalCase (C# style): PondId, PondName, ParameterName, MeasuredValue, AlertType, Severity
          const isWaterAlert =
            ("PondId" in notif || "pondId" in notif) &&
            ("PondName" in notif || "pondName" in notif);

          // Ensure we have either message/Message or title/Title, or it's a water alert
          const hasMessage =
            "message" in notif ||
            "Message" in notif ||
            "title" in notif ||
            "Title" in notif;

          if (!isWaterAlert && !hasMessage) {
            return;
          }

          // Build notification with defaults
          // For water alerts, pass the entire alert object as data
          const notification: NotificationMessage = {
            type: (notif.type as string) || (notif.Type as string) || "info",
            title:
              (notif.title as string) ||
              (notif.Title as string) ||
              (notif.ParameterName as string) ||
              "",
            message:
              (notif.message as string) || (notif.Message as string) || "",
            timestamp:
              (notif.timestamp as string) ||
              (notif.CreatedAt as string) ||
              undefined,
            // If data exists, use it; otherwise, if it's a water alert, use the whole object
            data:
              (notif.data as WaterAlertData) ||
              (isWaterAlert ? (notif as WaterAlertData) : undefined),
          };

          // Call callback if provided
          onMessage?.(notification);
        } catch {}
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
