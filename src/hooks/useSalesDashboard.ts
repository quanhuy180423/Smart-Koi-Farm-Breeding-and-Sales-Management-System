import { useQuery } from "@tanstack/react-query";
import salesDashboardService, {
  SalesDashboardStatistics,
  QuickInfo,
  BestSeller,
  SalesAnalysis,
  SalesAnalysisRange,
} from "@/lib/api/services/fetchSalesDashboard";

export const useGetSalesDashboardStatistics = () => {
  return useQuery<SalesDashboardStatistics>({
    queryKey: ["salesDashboardStatistics"],
    queryFn: async () => {
      const response = await salesDashboardService.getStatistics();
      if (!response.isSuccess) {
        throw new Error(
          response.message || "Failed to fetch sales dashboard statistics",
        );
      }
      return response.result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useGetSalesDashboardQuickInfo = () => {
  return useQuery<QuickInfo>({
    queryKey: ["salesDashboardQuickInfo"],
    queryFn: async () => {
      const response = await salesDashboardService.getQuickInfo();
      if (!response.isSuccess) {
        throw new Error(
          response.message || "Failed to fetch sales dashboard quick info",
        );
      }
      return response.result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useGetBestSellers = (top: number = 5) => {
  return useQuery<BestSeller[]>({
    queryKey: ["bestSellers", top],
    queryFn: async () => {
      const response = await salesDashboardService.getBestSellers(top);
      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to fetch best sellers");
      }
      return response.result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useGetSalesAnalysis = (
  range: SalesAnalysisRange = SalesAnalysisRange.LAST_30_DAYS,
) => {
  return useQuery<SalesAnalysis>({
    queryKey: ["salesAnalysis", range],
    queryFn: async () => {
      const response = await salesDashboardService.getSalesAnalysis(range);
      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to fetch sales analysis");
      }
      return response.result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};
