"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  Trash2,
  Mail,
  BellRing,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const notificationData = [
  {
    id: "NOT001",
    title: "Hệ thống cảnh báo nhiệt độ hồ A1",
    message:
      "Nhiệt độ nước hồ A1 đã vượt quá ngưỡng an toàn (28°C). Cần kiểm tra hệ thống làm mát ngay lập tức.",
    type: "warning",
    isRead: false,
    createdAt: "2024-03-20 14:30",
    priority: "Cao",
    category: "Hệ thống",
  },
  {
    id: "NOT002",
    title: "Đơn hàng mới từ khách hàng VIP",
    message:
      "Khách hàng Nguyễn Văn A đã đặt đơn hàng 5 con cá Koi Kohaku với tổng giá trị 150 triệu VNĐ.",
    type: "info",
    isRead: true,
    createdAt: "2024-03-20 10:15",
    priority: "Trung bình",
    category: "Đơn hàng",
  },
  {
    id: "NOT003",
    title: "Báo cáo sinh sản thành công",
    message:
      "Chu kỳ sinh sản BR002 đã hoàn thành với tỷ lệ nở 85%. Có 2,720 cá con khỏe mạnh.",
    type: "success",
    isRead: false,
    createdAt: "2024-03-20 08:45",
    priority: "Thấp",
    category: "Sinh sản",
  },
  {
    id: "NOT004",
    title: "Lịch bảo trì thiết bị hồ B1",
    message:
      "Đã đến thời gian bảo trì định kỳ máy lọc nước và hệ thống sục khí cho hồ B1.",
    type: "info",
    isRead: true,
    createdAt: "2024-03-19 16:20",
    priority: "Trung bình",
    category: "Bảo trì",
  },
  {
    id: "NOT005",
    title: "Cảnh báo sức khỏe cá hồ C1",
    message:
      "Phát hiện một số cá có dấu hiệu bất thường ở hồ C1. Cần kiểm tra và điều trị kịp thời.",
    type: "warning",
    isRead: false,
    createdAt: "2024-03-19 12:30",
    priority: "Cao",
    category: "Sức khỏe",
  },
  {
    id: "NOT006",
    title: "Nhân viên nghỉ phép",
    message:
      "Nhân viên Trần Văn B đã gửi đơn xin nghỉ phép từ ngày 25/03 đến 27/03. Cần sắp xếp người thay thế.",
    type: "info",
    isRead: true,
    createdAt: "2024-03-19 09:15",
    priority: "Thấp",
    category: "Nhân sự",
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case "info":
      return <Info className="h-5 w-5 text-blue-600" />;
    default:
      return <Bell className="h-5 w-5 text-gray-600" />;
  }
};

const getTypeBadge = (type: string) => {
  switch (type) {
    case "warning":
      return <Badge variant="destructive">Cảnh báo</Badge>;
    case "success":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Thành công
        </Badge>
      );
    case "info":
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800">
          Thông tin
        </Badge>
      );
    default:
      return <Badge variant="outline">Khác</Badge>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "Cao":
      return <Badge variant="destructive">Cao</Badge>;
    case "Trung bình":
      return (
        <Badge variant="default" className="bg-yellow-100 text-yellow-800">
          Trung bình
        </Badge>
      );
    case "Thấp":
      return <Badge variant="secondary">Thấp</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notifications, setNotifications] = useState(notificationData);

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      typeFilter === "all" || notification.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "read" && notification.isRead) ||
      (statusFilter === "unread" && !notification.isRead);
    return matchesSearch && matchesType && matchesStatus;
  });

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: false } : n)),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Thông báo
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Theo dõi các thông báo và cảnh báo hệ thống
          </p>
        </div>
        <Button
          variant="outline"
          onClick={markAllAsRead}
          className="w-full sm:w-auto"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          <span className="sm:hidden">Đánh dấu tất cả</span>
          <span className="hidden sm:inline">Đánh dấu tất cả đã đọc</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="lg:hover:shadow-lg lg:transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm lg:text-base font-medium">
              Tổng thông báo
            </CardTitle>
            <Bell className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl lg:text-3xl font-bold">
              {notifications.length}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:hover:shadow-lg lg:transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 lg:pb-3">
            <CardTitle className="text-xs sm:text-sm lg:text-base font-medium">
              Chưa đọc
            </CardTitle>
            <BellRing className="h-4 w-4 lg:h-5 lg:w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-red-600">
              {unreadCount}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:hover:shadow-lg lg:transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 lg:pb-3">
            <CardTitle className="text-xs sm:text-sm lg:text-base font-medium">
              Cảnh báo
            </CardTitle>
            <AlertTriangle className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl lg:text-3xl font-bold">
              {notifications.filter((n) => n.type === "warning").length}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:hover:shadow-lg lg:transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 lg:pb-3">
            <CardTitle className="text-xs sm:text-sm lg:text-base font-medium">
              Hôm nay
            </CardTitle>
            <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl lg:text-3xl font-bold">
              {
                notifications.filter((n) => n.createdAt.includes("2024-03-20"))
                  .length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card className="lg:shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            Danh sách thông báo
          </CardTitle>
          <CardDescription className="text-sm lg:text-base">
            Quản lý và theo dõi tất cả thông báo hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="lg:px-8">
          <div className="border rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 bg-muted/10">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between sm:gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm thông báo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-2 border-gray-400 pl-10"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
                {/* Type Filter */}
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="border-2 w-full sm:w-40 border-gray-400">
                    <SelectValue placeholder="Lọc theo loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="warning">Cảnh báo</SelectItem>
                    <SelectItem value="success">Thành công</SelectItem>
                    <SelectItem value="info">Thông tin</SelectItem>
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-2 w-full sm:w-40 border-gray-400">
                    <SelectValue placeholder="Lọc theo trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="unread">Chưa đọc</SelectItem>
                    <SelectItem value="read">Đã đọc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 sm:p-4 rounded-lg border transition-all duration-200 ${
                  notification.isRead
                    ? "bg-background border-border"
                    : "bg-blue-50/50 border-blue-200 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3
                            className={`text-sm sm:text-base lg:text-lg font-semibold ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mb-3 lg:mb-4">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
                          {getTypeBadge(notification.type)}
                          {getPriorityBadge(notification.priority)}
                          <Badge
                            variant="outline"
                            className="text-xs lg:text-sm"
                          >
                            {notification.category}
                          </Badge>
                          <span className="text-xs lg:text-sm text-muted-foreground">
                            {notification.createdAt}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 lg:gap-3">
                        {notification.isRead ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsUnread(notification.id)}
                            title="Đánh dấu chưa đọc"
                            className="h-8 w-8 lg:h-10 lg:w-10"
                          >
                            <Mail className="h-4 w-4 lg:h-5 lg:w-5" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(notification.id)}
                            title="Đánh dấu đã đọc"
                            className="h-8 w-8 lg:h-10 lg:w-10"
                          >
                            <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 lg:h-10 lg:w-10"
                          title="Xóa thông báo"
                        >
                          <Trash2 className="h-4 w-4 lg:h-5 lg:w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <Bell className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-muted-foreground mb-2">
                Không có thông báo
              </h3>
              <p className="text-sm text-muted-foreground px-4">
                Không tìm thấy thông báo nào phù hợp với bộ lọc hiện tại.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
