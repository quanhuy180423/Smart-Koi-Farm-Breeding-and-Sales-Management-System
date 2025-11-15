import toRequestParams from "@/lib/utils/params";
import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";

export enum AlertType {
  HIGH = "High",
  LOW = "Low",
  RAPID_CHANGE = "RapidChange",
}

export enum Severity {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  URGENT = "Urgent",
}

export interface WaterAlertResponse {
  id: number;
  pondId: number;
  pondName: string;
  parameterName: string;
  measuredValue: number;
  alertType: AlertType;
  severity: Severity;
  message: string;
  createdAt: string;
  isResolved: boolean;
  resolvedByUserId: number | null;
  resolvedByUserName: string | null;
}

export interface WaterAlertSearchParams extends PagingRequest {
  pondId?: number;
  isResolved?: boolean;
  alertType?: AlertType;
  severity?: Severity;
}

const baseUrl = "/api/WaterAlert";

export const waterAlertService = {
  getWaterAlerts: async (
    request: WaterAlertSearchParams,
  ): Promise<BaseResponse<PagedResponse<WaterAlertResponse>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<
      BaseResponse<PagedResponse<WaterAlertResponse>>
    >(`${baseUrl}`, { ...filter });
    return response.data;
  },

  resolveWaterAlert: async (alertId: number): Promise<BaseResponse<string>> => {
    const response = await apiService.put<
      BaseResponse<string>,
      Record<string, never>
    >(`${baseUrl}/${alertId}/resolve`, {});
    return response.data;
  },
};

export default waterAlertService;
