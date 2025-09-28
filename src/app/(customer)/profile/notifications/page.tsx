"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Package, 
  Star, 
  Gift, 
  AlertCircle, 
  CheckCircle2,
  Trash2,
  Check
} from "lucide-react";
import CustomerLayout from "@/components/customer/CustomerLayout";

interface Notification {
  id: string;
  type: "order" | "promotion" | "system" | "feedback";
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  action?: {
    label: string;
    href: string;
  };
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "Đơn hàng đã được giao",
    message: "Đơn hàng #ORD-001 đã được giao thành công. Cảm ơn bạn đã mua hàng!",
    date: "2024-12-15T10:30:00Z",
    isRead: false,
    action: {
      label: "Xem đơn hàng",
      href: "/profile/orders"
    }
  },
  {
    id: "2",
    type: "promotion",
    title: "Khuyến mãi đặc biệt",
    message: "Giảm 20% cho tất cả cá Koi Kohaku trong tuần này!",
    date: "2024-12-14T09:00:00Z",
    isRead: false,
    action: {
      label: "Mua ngay",
      href: "/catalog"
    }
  },
  {
    id: "3",
    type: "system",
    title: "Cập nhật thông tin tài khoản",
    message: "Vui lòng cập nhật số điện thoại để nhận thông báo đơn hàng.",
    date: "2024-12-13T14:15:00Z",
    isRead: true,
    action: {
      label: "Cập nhật",
      href: "/profile"
    }
  },
  {
    id: "4",
    type: "feedback",
    title: "Đánh giá sản phẩm",
    message: "Hãy đánh giá về cá Koi Sanke bạn đã mua để giúp khách hàng khác.",
    date: "2024-12-12T16:45:00Z",
    isRead: true,
    action: {
      label: "Đánh giá",
      href: "/profile/orders"
    }
  },
];

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "order":
      return Package;
    case "promotion":
      return Gift;
    case "system":
      return AlertCircle;
    case "feedback":
      return Star;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: Notification["type"]) => {
  switch (type) {
    case "order":
      return "text-blue-600 bg-blue-100";
    case "promotion":
      return "text-green-600 bg-green-100";
    case "system":
      return "text-orange-600 bg-orange-100";
    case "feedback":
      return "text-purple-600 bg-purple-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export default function NotificationsPage() {
  const [notificationList, setNotificationList] = useState(notifications);

  const markAsRead = (id: string) => {
    setNotificationList(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationList(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotificationList(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notificationList.filter(n => !n.isRead).length;
  const allNotifications = notificationList;
  const unreadNotifications = notificationList.filter(n => !n.isRead);
  const readNotifications = notificationList.filter(n => n.isRead);

  const NotificationCard = ({ notification }: { notification: Notification }) => {
    const Icon = getNotificationIcon(notification.type);
    const colorClass = getNotificationColor(notification.type);

    return (
      <Card className={`transition-all ${!notification.isRead ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}>
        <CardContent className="p-3 md:p-4">
          <div className="flex items-start gap-3 md:gap-4">
            <div className={`p-1.5 md:p-2 rounded-full ${colorClass} flex-shrink-0`}>
              <Icon className="h-3 w-3 md:h-4 md:w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className={`font-medium text-sm md:text-base leading-tight ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {notification.title}
                </h3>
                <div className="flex items-center gap-1 md:gap-2 ml-2 flex-shrink-0">
                  {!notification.isRead && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">Mới</Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNotification(notification.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-white hover:bg-red-500 transition-colors duration-200"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mb-3 leading-relaxed">
                {notification.message}
              </p>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(notification.date).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <div className="flex gap-2">
                  {!notification.isRead && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="h-7 text-xs flex-1 md:flex-none md:w-auto"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      <span className="md:hidden">Đã đọc</span>
                      <span className="hidden md:inline">Đánh dấu đã đọc</span>
                    </Button>
                  )}
                  {notification.action && (
                    <Button size="sm" className="h-7 text-xs flex-1 md:flex-none md:w-auto">
                      {notification.action.label}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Thông báo</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Theo dõi các thông báo và cập nhật mới nhất
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" className="w-full md:w-auto">
              <Check className="h-4 w-4 mr-2" />
              <span className="md:hidden">Đánh dấu tất cả ({unreadCount})</span>
              <span className="hidden md:inline">Đánh dấu tất cả đã đọc ({unreadCount})</span>
            </Button>
          )}
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:block">
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                Tất cả 
                {allNotifications.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {allNotifications.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread">
                Chưa đọc 
                {unreadCount > 0 && (
                  <Badge variant="default" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="read">
                Đã đọc 
                {readNotifications.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {readNotifications.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {allNotifications.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Không có thông báo</h3>
                    <p className="text-muted-foreground">
                      Bạn sẽ nhận được thông báo về đơn hàng và khuyến mãi tại đây
                    </p>
                  </CardContent>
                </Card>
              ) : (
                allNotifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))
              )}
            </TabsContent>

            <TabsContent value="unread" className="space-y-4">
              {unreadNotifications.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Bạn đã đọc hết thông báo</h3>
                    <p className="text-muted-foreground">
                      Tất cả thông báo đều đã được đọc
                    </p>
                  </CardContent>
                </Card>
              ) : (
                unreadNotifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))
              )}
            </TabsContent>

            <TabsContent value="read" className="space-y-4">
              {readNotifications.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Chưa có thông báo đã đọc</h3>
                    <p className="text-muted-foreground">
                      Các thông báo đã đọc sẽ hiển thị tại đây
                    </p>
                  </CardContent>
                </Card>
              ) : (
                readNotifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {allNotifications.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Không có thông báo</h3>
                <p className="text-muted-foreground">
                  Bạn sẽ nhận được thông báo về đơn hàng và khuyến mãi tại đây
                </p>
              </CardContent>
            </Card>
          ) : (
            allNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}