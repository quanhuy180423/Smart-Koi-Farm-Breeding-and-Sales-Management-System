"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Fish, 
  Users, 
  Building2, 
  TrendingUp, 
  Calendar,
  Heart,
  Truck,
  DollarSign
} from "lucide-react";

const stats = [
  {
    title: "Tổng số cá Koi",
    value: "1,247",
    change: "+12%",
    changeType: "positive" as const,
    icon: Fish,
  },
  {
    title: "Tài khoản hoạt động",
    value: "856",
    change: "+5%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Số hồ đang sử dụng",
    value: "24",
    change: "+2",
    changeType: "positive" as const,
    icon: Building2,
  },
  {
    title: "Doanh thu tháng này",
    value: "₫125.6M",
    change: "+18%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
];

const recentActivities = [
  {
    title: "Cá Koi Kohaku mới được thêm",
    description: "Thêm 5 con cá Koi Kohaku vào hồ số 3",
    time: "2 giờ trước",
    icon: Fish,
  },
  {
    title: "Lịch làm việc được cập nhật",
    description: "Nhân viên Nguyễn Văn A có lịch làm việc mới",
    time: "4 giờ trước",
    icon: Calendar,
  },
  {
    title: "Quy trình sinh sản hoàn thành",
    description: "Hoàn thành quy trình sinh sản cho cặp Sanke #001",
    time: "1 ngày trước",
    icon: Heart,
  },
  {
    title: "Đơn hàng được vận chuyển",
    description: "Đơn hàng #KOI-001234 đã được giao cho đơn vị vận chuyển",
    time: "2 ngày trước",
    icon: Truck,
  },
];

export default function ManagerDashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${
                  stat.changeType === "positive" 
                    ? "text-green-600" 
                    : "text-red-600"
                } flex items-center gap-1`}>
                  <TrendingUp className="h-3 w-3" />
                  {stat.change} so với tháng trước
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              Các hoạt động và thông báo mới nhất trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="rounded-full bg-muted p-2">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê nhanh</CardTitle>
            <CardDescription>
              Tổng quan về tình trạng hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fish className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Cá Koi khỏe mạnh</span>
              </div>
              <span className="text-sm font-medium text-green-600">98.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">Hồ hoạt động</span>
              </div>
              <span className="text-sm font-medium text-green-600">22/24</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Nhân viên đang làm</span>
              </div>
              <span className="text-sm font-medium text-blue-600">18/20</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-600" />
                <span className="text-sm">Quy trình sinh sản</span>
              </div>
              <span className="text-sm font-medium text-yellow-600">3 đang thực hiện</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}