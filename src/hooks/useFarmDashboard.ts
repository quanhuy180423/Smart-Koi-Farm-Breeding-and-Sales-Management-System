import { useQuery } from "@tanstack/react-query";
import farmDashboardService, {
  FarmDashboardStatistics,
  FarmDashboardQuickStats,
  ActivityFeed,
} from "@/lib/api/services/fetchFarmDashboard";

export const useGetFarmDashboardStatistics = () => {
  return useQuery<FarmDashboardStatistics>({
    queryKey: ["farm-dashboard-statistics"],
    queryFn: async () => {
      const response = await farmDashboardService.getStatistics();
      if (!response.isSuccess) {
        throw new Error(
          response.message || "Không thể tải thống kê trang trại",
        );
      }
      return response.result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useGetFarmDashboardQuickStats = () => {
  return useQuery<FarmDashboardQuickStats>({
    queryKey: ["farm-dashboard-quick-stats"],
    queryFn: async () => {
      const response = await farmDashboardService.getQuickStats();
      if (!response.isSuccess) {
        throw new Error(
          response.message || "Không thể tải thống kê nhanh trang trại",
        );
      }
      return response.result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useGetActivityFeed = (limit: number = 5) => {
  return useQuery<ActivityFeed>({
    queryKey: ["activity-feed", limit],
    queryFn: async () => {
      const response = await farmDashboardService.getActivityFeed(limit);
      if (!response.isSuccess) {
        throw new Error(response.message || "Không thể tải hoạt động gần đây");
      }
      return response.result;
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    retry: 3,
  });
};
