"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Fish,
  Users,
  Building2,
  TrendingUp,
  Calendar,
  Heart,
  Truck,
  DollarSign,
  TrendingDown,
} from "lucide-react";
import {
  useGetFarmDashboardStatistics,
  useGetFarmDashboardQuickStats,
  useGetActivityFeed,
} from "@/hooks/useFarmDashboard";
import { ActivityType } from "@/lib/api/services/fetchFarmDashboard";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { convertUtcToLocalTimezone } from "@/lib/utils/dates";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case ActivityType.BREEDING:
      return Heart;
    case ActivityType.NEW_KOI:
      return Fish;
    case ActivityType.SCHEDULE:
      return Calendar;
    case ActivityType.SHIPPING:
      return Truck;
    case ActivityType.INCIDENT:
      return Building2;
    case ActivityType.FEED:
      return Users;
    default:
      return Fish;
  }
}

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  // Convert UTC timestamp to local timezone
  const activityTime = convertUtcToLocalTimezone(timestamp);
  const diffMs = now.getTime() - activityTime.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  return `${diffDays} ngày trước`;
}

interface StatCardData {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative";
  icon: typeof Fish;
}

export default function ManagerDashboard() {
  const {
    data: statistics,
    isLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useGetFarmDashboardStatistics();
  const {
    data: quickStats,
    isLoading: isQuickStatsLoading,
    isError: quickStatsError,
    refetch: refetchQuickStats,
  } = useGetFarmDashboardQuickStats();
  const {
    data: activityFeed,
    isLoading: isActivityLoading,
    isError: activityError,
    refetch: refetchActivity,
  } = useGetActivityFeed(5);

  const stats: StatCardData[] = statistics
    ? [
        {
          title: "Tổng số cá Koi",
          value: new Intl.NumberFormat("vi-VN").format(
            statistics.totalKoi.current
          ),
          change: `${statistics.totalKoi.changePercent > 0 ? "+" : ""}${statistics.totalKoi.changePercent}%`,
          changeType:
            statistics.totalKoi.changePercent >= 0 ? "positive" : "negative",
          icon: Fish,
        },
        {
          title: "Tài khoản hoạt động",
          value: new Intl.NumberFormat("vi-VN").format(
            statistics.activeAccounts.current
          ),
          change: `${statistics.activeAccounts.changePercent > 0 ? "+" : ""}${statistics.activeAccounts.changePercent}%`,
          changeType:
            statistics.activeAccounts.changePercent >= 0
              ? "positive"
              : "negative",
          icon: Users,
        },
        {
          title: "Số hồ đang sử dụng",
          value: new Intl.NumberFormat("vi-VN").format(
            statistics.pondsInUse.current
          ),
          change: `${statistics.pondsInUse.changePercent > 0 ? "+" : ""}${statistics.pondsInUse.changePercent}%`,
          changeType:
            statistics.pondsInUse.changePercent >= 0 ? "positive" : "negative",
          icon: Building2,
        },
        {
          title: "Doanh thu tháng này",
          value: formatCurrency(statistics.farmMonthlyRevenue.current),
          change: `${statistics.farmMonthlyRevenue.changePercent > 0 ? "+" : ""}${statistics.farmMonthlyRevenue.changePercent}%`,
          changeType:
            statistics.farmMonthlyRevenue.changePercent >= 0
              ? "positive"
              : "negative",
          icon: DollarSign,
        },
      ]
    : [];

  // Show LoadingState if any of the main sections are loading
  const isAnyLoading = isLoading || isQuickStatsLoading || isActivityLoading;

  if (isAnyLoading) {
    return <LoadingState message="Đang tải bảng điều khiển..." />;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {statsError ? (
          <ErrorState
            title="Không thể tải thống kê"
            message="Có lỗi khi tải dữ liệu thống kê. Vui lòng thử lại."
            onRetry={() => refetchStats()}
          />
        ) : (
          stats.map((stat) => {
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
                  {stat.title !== "Tài khoản hoạt động" && (
                    <p
                      className={`text-xs ${
                        stat.changeType === "positive"
                          ? "text-green-600"
                          : "text-red-600"
                      } flex items-center gap-1`}
                    >
                      {stat.changeType === "positive" ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {stat.change} so với tháng trước
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
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
            {isActivityLoading ? (
              <LoadingState message="Đang tải hoạt động..." />
            ) : activityError ? (
              <ErrorState
                title="Không thể tải hoạt động"
                message="Có lỗi khi tải danh sách hoạt động. Vui lòng thử lại."
                onRetry={() => refetchActivity()}
              />
            ) : activityFeed && activityFeed.length > 0 ? (
              <div className="space-y-6">
                {activityFeed.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="rounded-full bg-muted p-2">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title="Không có hoạt động"
                description="Hiện tại không có hoạt động mới nào"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê nhanh</CardTitle>
            <CardDescription>Tổng quan về tình trạng hệ thống</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isQuickStatsLoading ? (
              <>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </>
            ) : quickStatsError ? (
              <ErrorState
                title="Không thể tải thống kê nhanh"
                message="Có lỗi khi tải dữ liệu. Vui lòng thử lại."
                onRetry={() => refetchQuickStats()}
              />
            ) : quickStats ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Fish className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Cá Koi khỏe mạnh</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {quickStats.healthyKoiPercent}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Hồ hoạt động</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {quickStats.activePonds.current}/
                    {quickStats.activePonds.total}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Nhân viên đang làm</span>
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {quickStats.activeStaff.current}/
                    {quickStats.activeStaff.total}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Quy trình sinh sản</span>
                  </div>
                  <span className="text-sm font-medium text-yellow-600">
                    {quickStats.activeBreedingProcesses}
                  </span>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
