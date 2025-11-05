import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";

const baseUrl = "/api/IncubationDailyRecord";

export interface IncubationDailyRecordResponse {
  id: number;
  eggBatchId: number;
  dayNumber: string;
  healthyEggs: number;
  rottenEggs: number | null;
  hatchedEggs: number;
  success: boolean;
}

export const incubationDailyRecordService = {
  getIncubationDailyRecordByEggBatchId: async (
    eggBatchId: number | undefined,
    request: PagingRequest,
  ): Promise<BaseResponse<PagedResponse<IncubationDailyRecordResponse>>> => {
    const response = await apiService.get<
      BaseResponse<PagedResponse<IncubationDailyRecordResponse>>
    >(`${baseUrl}/by-breeding/${eggBatchId}`, { ...request });
    return response.data;
  },
};

export default incubationDailyRecordService;
