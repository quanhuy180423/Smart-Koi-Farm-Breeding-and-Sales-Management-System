import apiService, { BaseResponse } from "../apiClient";

export interface DataWithChange {
  current: number;
  changePercent: number;
}

export interface FarmDashboardStatistics {
  totalKoi: DataWithChange;
  activeAccounts: DataWithChange;
  pondsInUse: DataWithChange;
  farmMonthlyRevenue: DataWithChange;
}

export interface CountData {
  current: number;
  total: number;
}

export interface FarmDashboardQuickStats {
  healthyKoiPercent: number;
  activePonds: CountData;
  activeStaff: CountData;
  activeBreedingProcesses: number;
}

export enum ActivityType {
  BREEDING = "BREEDING",
  NEW_KOI = "NEW_KOI",
  SCHEDULE = "SCHEDULE",
  SHIPPING = "SHIPPING",
  INCIDENT = "INCIDENT",
  FEED = "FEED",
}

export interface ActivityFeedItem {
  type: ActivityType;
  message: string;
  timestamp: string;
}

export type ActivityFeed = ActivityFeedItem[];

const baseUrl = "/api/FarmDashboard";

export const farmDashboardService = {
  getStatistics: async (): Promise<BaseResponse<FarmDashboardStatistics>> => {
    const response = await apiService.get<
      BaseResponse<FarmDashboardStatistics>
    >(`${baseUrl}/statistics`);
    return response.data;
  },

  getQuickStats: async (): Promise<BaseResponse<FarmDashboardQuickStats>> => {
    const response = await apiService.get<
      BaseResponse<FarmDashboardQuickStats>
    >(`${baseUrl}/quick-stats`);
    return response.data;
  },

  getActivityFeed: async (
    limit: number = 5,
  ): Promise<BaseResponse<ActivityFeed>> => {
    const response = await apiService.get<BaseResponse<ActivityFeed>>(
      `${baseUrl}/activity-feed`,
      { limit },
    );
    return response.data;
  },
};

export default farmDashboardService;
