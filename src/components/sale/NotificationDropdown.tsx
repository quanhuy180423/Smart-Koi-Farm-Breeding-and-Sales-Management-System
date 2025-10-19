"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Eye,
  Trash2,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

// Mock data - thay thế bằng dữ liệu thực từ API
const mockNotifications = [
  {
    id: "NOT001",
    title: "Đơn hàng mới #DH12345",
    message: "Khách hàng Nguyễn Văn A vừa đặt đơn hàng trị giá 15 triệu VNĐ.",
    type: "info",
    isRead: false,
    createdAt: "5 phút trước",
  },
  {
    id: "NOT002",
    title: "Thanh toán thành công",
    message: "Đơn hàng #DH12340 đã được thanh toán thành công.",
    type: "success",
    isRead: false,
    createdAt: "15 phút trước",
  },
  {
    id: "NOT003",
    title: "Hủy đơn hàng",
    message: "Khách hàng Trần Thị B đã hủy đơn hàng #DH12338.",
    type: "warning",
    isRead: true,
    createdAt: "1 giờ trước",
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case "success":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "info":
      return <Info className="h-4 w-4 text-blue-600" />;
    case "payment":
      return <DollarSign className="h-4 w-4 text-green-600" />;
    default:
      return <Bell className="h-4 w-4 text-gray-600" />;
  }
};

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white border-0">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 sm:w-96 max-h-[500px] overflow-y-auto"
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="text-base font-semibold">Thông báo</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} mới
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Không có thông báo mới</p>
          </div>
        ) : (
          <>
            {notifications.slice(0, 5).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex items-start gap-3 p-3 transition-colors group ${
                  !notification.isRead ? "bg-blue-50/50" : ""
                }`}
                onSelect={(e) => e.preventDefault()}
              >
                <div className="flex-shrink-0 mt-1 group-hover:text-white transition-colors">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4
                      className={`text-sm font-semibold line-clamp-1 group-hover:text-white transition-colors ${
                        !notification.isRead
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {notification.title}
                    </h4>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1 group-hover:bg-white transition-colors"></div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-1 group-hover:text-white transition-colors">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">
                      {notification.createdAt}
                    </span>
                    <div className="flex items-center gap-1">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 transition-colors"
                          onClick={() => markAsRead(notification.id)}
                          title="Đánh dấu đã đọc"
                        >
                          <CheckCircle className="h-3 w-3 group-hover:text-white transition-colors" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-600 hover:text-red-700 transition-colors"
                        onClick={() => deleteNotification(notification.id)}
                        title="Xóa"
                      >
                        <Trash2 className="h-3 w-3 group-hover:text-white transition-colors" />
                      </Button>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="justify-center">
              <Link
                href="/sale/notifications"
                className="text-sm text-primary hover:text-primary/80 font-medium cursor-pointer flex items-center justify-center gap-2"
              >
                <Eye className="h-4 w-4 group-hover:text-white transition-colors" />
                Xem tất cả thông báo
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
