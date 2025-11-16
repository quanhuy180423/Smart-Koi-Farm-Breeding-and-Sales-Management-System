"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, AlertTriangle, AlertCircle, Eye, Droplets } from "lucide-react";
import Link from "next/link";
import { useGetWaterAlerts } from "@/hooks/useWaterAlert";
import { useNotification } from "@/hooks/useNotification";
import type { NotificationMessage } from "@/hooks/useNotificationSocket";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import type {
  Severity,
  WaterAlertResponse,
} from "@/lib/api/services/fetchWaterAlert";
import { AlertType as AlertTypeEnum } from "@/lib/api/services/fetchWaterAlert";

interface SeverityStyleConfig {
  bg: string;
  border: string;
  icon: React.ReactNode;
  dot: string;
  badge: string;
  hoverBg: string;
}

// Helper function to parse ISO timestamp and adjust for timezone offset
const parseTimestampWithTimezone = (timestamp: string): Date => {
  // Parse the ISO string as UTC
  const date = new Date(timestamp);

  // Get the local timezone offset in milliseconds
  const localOffset = new Date().getTimezoneOffset() * 60 * 1000;

  // Adjust the date by adding the offset to convert from UTC to local time
  // The backend sends UTC time, so we need to convert it properly
  return new Date(date.getTime() - localOffset);
};

const getSeverityStyles = (
  severity: Severity | string | null | undefined,
): SeverityStyleConfig => {
  const normalizedSeverity = severity ? String(severity).toLowerCase() : "low";

  switch (normalizedSeverity) {
    case "urgent":
      return {
        bg: "bg-red-50",
        border: "border-l-4 border-red-500",
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
        dot: "bg-red-600",
        badge: "bg-red-100 text-red-800",
        hoverBg: "hover:bg-red-100/80",
      };
    case "high":
      return {
        bg: "bg-orange-50",
        border: "border-l-4 border-orange-500",
        icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
        dot: "bg-orange-600",
        badge: "bg-orange-100 text-orange-800",
        hoverBg: "hover:bg-orange-100/80",
      };
    case "medium":
      return {
        bg: "bg-yellow-50",
        border: "border-l-4 border-yellow-500",
        icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
        dot: "bg-yellow-600",
        badge: "bg-yellow-100 text-yellow-800",
        hoverBg: "hover:bg-yellow-100/80",
      };
    case "low":
    default:
      return {
        bg: "bg-blue-50",
        border: "border-l-4 border-blue-500",
        icon: <Droplets className="h-5 w-5 text-blue-600" />,
        dot: "bg-blue-600",
        badge: "bg-blue-100 text-blue-800",
        hoverBg: "hover:bg-blue-100/80",
      };
  }
};

const getSeverityLabel = (
  severity: Severity | string | null | undefined,
): string => {
  const labels: Record<string, string> = {
    urgent: "Cấp bách",
    high: "Cao",
    medium: "Trung bình",
    low: "Thấp",
  };
  const normalizedSeverity = severity ? String(severity).toLowerCase() : "low";
  return labels[normalizedSeverity] || "Thấp";
};

export function NotificationDropdown() {
  // State for real-time notifications from WebSocket
  const [realtimeAlerts, setRealtimeAlerts] = useState<WaterAlertResponse[]>(
    [],
  );
  // Track if dropdown is open
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Track if alerts have been viewed (to reset badge count)
  const [hasViewedAlerts, setHasViewedAlerts] = useState(false);
  const [totalAlerts, setTotalAlerts] = useState(0);
  // Track recently processed alert IDs to prevent duplicates from multiple WebSocket messages in the same burst
  // Clear this set after a short timeout to allow the same alert to be added again later
  const recentlyProcessedIds = useRef<Set<number>>(new Set());
  const clearTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch unresolved water alerts
  const { data: waterAlertsData } = useGetWaterAlerts({
    pageIndex: 1,
    pageSize: 5,
    isResolved: false,
  });

  const apiAlerts = waterAlertsData?.data || [];

  // Merge: real-time alerts first, then API alerts (avoid duplicates)
  // Start with 5 API alerts, add new real-time alerts on top (can grow beyond 5)
  const existingIds = new Set(realtimeAlerts.map((a) => a.id));
  const displayApiAlerts = apiAlerts
    .filter((a) => !existingIds.has(a.id))
    .slice(0, 5); // Fetch up to 5 from API
  const alerts = [...realtimeAlerts, ...displayApiAlerts]; // Real-time on top, then API

  // Total count: Only show new alerts that haven't been viewed yet
  // Once dropdown is opened, badge resets to 0
  const displayCount = totalAlerts > 99 ? "99+" : totalAlerts;

  // Mark alerts as viewed when dropdown is opened
  useEffect(() => {
    if (isDropdownOpen) {
      setHasViewedAlerts(true);
    }
  }, [isDropdownOpen]);

  // Reset the viewed flag when new alerts arrive
  useEffect(() => {
    if (realtimeAlerts.length > 0 && hasViewedAlerts) {
      setHasViewedAlerts(false);
    }
  }, [realtimeAlerts.length, hasViewedAlerts]);

  useEffect(() => {
    if (hasViewedAlerts) setTotalAlerts(0);
  }, [hasViewedAlerts]);

  // Memoize onMessage callback to prevent unnecessary WebSocket re-setup
  const handleNotificationMessage = useCallback(
    (notification: NotificationMessage) => {
      // Extract water alert from either notification.data or direct properties
      // Backend sends PascalCase (Id, PondId, PondName) wrapped in notification or directly
      const alertData = notification.data || notification;

      // Check for both camelCase and PascalCase property names
      const hasId = "id" in alertData || "Id" in alertData;
      const hasPondName = "pondName" in alertData || "PondName" in alertData;

      // If it's a water alert, add to real-time list
      if (alertData && typeof alertData === "object" && hasId && hasPondName) {
        // Handle both camelCase and PascalCase properties
        const id = (alertData.id || alertData.Id) as number;
        const pondId = (alertData.pondId || alertData.PondId) as number;
        const pondName = (alertData.pondName || alertData.PondName) as string;
        const parameterName = (alertData.parameterName ||
          alertData.ParameterName) as string;
        const measuredValue = (alertData.measuredValue ||
          alertData.MeasuredValue) as number;
        const severity = (alertData.severity || alertData.Severity) as Severity;

        const newAlert: WaterAlertResponse = {
          id: id || Date.now(),
          pondId: pondId || 0,
          pondName: pondName || "",
          parameterName: parameterName || "",
          measuredValue: measuredValue || 0,
          alertType: AlertTypeEnum.HIGH,
          severity: severity || "Medium",
          message: notification.message || "",
          // Use the timestamp from backend if available, otherwise use current time
          // The timestamp should be in ISO format (UTC) and will be interpreted correctly by formatDistanceToNow
          createdAt:
            notification.timestamp ||
            (alertData.CreatedAt as string) ||
            new Date().toISOString(),
          isResolved: false,
          resolvedByUserId: null,
          resolvedByUserName: null,
        };

        // Check if we've already processed this alert ID recently (to prevent duplicates from burst of messages)
        if (recentlyProcessedIds.current.has(id)) {
          return;
        }

        // Mark this backend alert ID as recently processed
        recentlyProcessedIds.current.add(id);

        // Clear the recently processed IDs after 1 second to allow the same alert to come through again later
        if (clearTimeoutRef.current) {
          clearTimeout(clearTimeoutRef.current);
        }
        clearTimeoutRef.current = setTimeout(() => {
          recentlyProcessedIds.current.clear();
        }, 1000);

        // Thêm vào đầu danh sách
        setRealtimeAlerts((prev) => [newAlert, ...prev]);
        setTotalAlerts((prev) => prev + 1);
      }
    },
    [],
  );

  // Connect to WebSocket for real-time alerts
  useNotification({
    autoConnect: true,
    onMessage: handleNotificationMessage,
  });

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
      }
    };
  }, []);

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-accent transition-colors"
        >
          <Bell className="h-5 w-5" />
          {totalAlerts > 0 && (
            <Badge className="absolute -top-3 -right-3 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold bg-red-500 text-white border-0 animate-pulse shadow-lg ring-2 ring-white">
              {displayCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-96 max-h-[600px] overflow-hidden p-0 rounded-lg shadow-lg"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 border-b border-blue-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-white" />
              <h2 className="text-base font-semibold text-white">
                Cảnh báo nước
              </h2>
            </div>
            {displayCount != 0 && (
              <Badge className="bg-red-500 text-white border-0 font-bold">
                {displayCount}
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[480px] divide-y">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="rounded-full bg-slate-100 p-3 mb-3">
                <Bell className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Không có cảnh báo nào
              </p>
              <p className="text-center text-xs text-muted-foreground mt-1">
                Hệ thống đang ổn định
              </p>
            </div>
          ) : (
            alerts.map((alert) => {
              const styles = getSeverityStyles(alert.severity);
              const severityLabel = getSeverityLabel(alert.severity);

              return (
                <div
                  key={alert.id}
                  className={`${styles.bg} ${styles.border} px-4 py-3 transition-all hover:shadow-sm cursor-pointer ${styles.hoverBg}`}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900 truncate">
                            {alert.parameterName}
                          </h4>
                          <Badge
                            className={`${styles.badge} text-xs font-medium flex-shrink-0`}
                          >
                            {severityLabel}
                          </Badge>
                        </div>
                      </div>

                      {/* Pond Info */}
                      <div className="flex items-center gap-1 text-xs text-slate-600 mb-2">
                        <span className="font-medium">🏞️ {alert.pondName}</span>
                        <span className="text-slate-400">•</span>
                        <span>Giá trị: {alert.measuredValue}</span>
                      </div>

                      {/* Message */}
                      <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                        {alert.message}
                      </p>

                      {/* Timestamp */}
                      <p className="text-xs text-slate-500">
                        {alert.createdAt &&
                          formatDistanceToNow(
                            parseTimestampWithTimezone(alert.createdAt),
                            {
                              locale: vi,
                              addSuffix: true,
                            },
                          )}
                      </p>
                    </div>

                    {/* Status Dot */}
                    <div
                      className={`flex-shrink-0 w-2 h-2 rounded-full ${styles.dot} mt-1`}
                    ></div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {alerts.length > 0 && (
          <Link
            href="/manager/notifications"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-sm font-medium text-slate-700 border-t"
          >
            <Eye className="h-4 w-4" />
            Xem tất cả thông báo
          </Link>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
