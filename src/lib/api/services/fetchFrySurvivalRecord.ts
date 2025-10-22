import toRequestParams from "@/lib/utils/params";
import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";

const baseUrl = "/api/FrySurvivalRecord";

export interface FrySurvivalRecordResponse {
  id: number;
  fryFishId: number;
  dayNumber: number;
  survivalRate: number;
  countAlive: number;
  note: string;
  createdAt: string;
}

export interface FrySurvivalRecordSearchParams extends PagingRequest {
  search?: string;
  fryFishId?: number;
  minDayNumber?: number;
  maxDayNumber?: number;
  minSurvivalRate?: number;
  maxSurvivalRate?: number;
  minCountAlive?: number;
  maxCountAlive?: number;
  success?: boolean;
  createdFrom?: string;
  createdTo?: string;
}

export const frySurvivalRecordService = {
  getFrySurvivalRecords: async (
    request: FrySurvivalRecordSearchParams,
  ): Promise<BaseResponse<PagedResponse<FrySurvivalRecordResponse>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<
      BaseResponse<PagedResponse<FrySurvivalRecordResponse>>
    >(`${baseUrl}`, { ...filter });
    return response.data;
  },
};

export default frySurvivalRecordService;
