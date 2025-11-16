import apiService, { BaseResponse } from "../apiClient";

export interface MontlyRevenueData {
  current: number;
  changePercent: number;
}

export interface TotalOrdersData {
  current: number;
  changePercent: number;
}

export interface CustomerCountData {
  current: number;
  newCustomerPercent: number;
}

export interface FishInStockData {
  current: number;
  lowStockCount: number;
}

export interface SalesDashboardStatistics {
  monthlyRevenue: MontlyRevenueData;
  totalOrders: TotalOrdersData;
  customerCount: CustomerCountData;
  fishInStock: FishInStockData;
}

export interface QuickInfo {
  pendingOrders: number;
  completedOrders: number;
  bestSellingItemsCount: number;
  alerts: string[];
}

export interface BestSeller {
  id: number;
  name: string;
  soldCount: number;
  totalRevenue: number;
}

export enum SalesAnalysisRange {
  LAST_30_DAYS = "Last30Days",
  LAST_12_MONTHS = "Last12Months",
}

export interface SalesAnalysis {
  labels: string[];
  revenueData: number[];
  ordersData: number[];
}

const baseUrl = "/api/SalesDashboard";

export const salesDashboardService = {
  getStatistics: async (): Promise<BaseResponse<SalesDashboardStatistics>> => {
    const response = await apiService.get<
      BaseResponse<SalesDashboardStatistics>
    >(`${baseUrl}/statistics`);
    return response.data;
  },

  getQuickInfo: async (): Promise<BaseResponse<QuickInfo>> => {
    const response = await apiService.get<BaseResponse<QuickInfo>>(
      `${baseUrl}/quick-info`,
    );
    return response.data;
  },

  getBestSellers: async (
    top: number = 5,
  ): Promise<BaseResponse<BestSeller[]>> => {
    const response = await apiService.get<BaseResponse<BestSeller[]>>(
      `${baseUrl}/best-sellers`,
      { top },
    );
    return response.data;
  },

  getSalesAnalysis: async (
    range: SalesAnalysisRange = SalesAnalysisRange.LAST_30_DAYS,
  ): Promise<BaseResponse<SalesAnalysis>> => {
    const response = await apiService.get<BaseResponse<SalesAnalysis>>(
      `${baseUrl}/sales-analysis`,
      { range },
    );
    return response.data;
  },
};

export default salesDashboardService;
