import apiService, { BaseResponse, PagedResponse, PagingRequest } from "../apiClient";
import { EggBatchResponse } from "./fetchEggBatch";

const baseUrl = "/api/IncubationDailyRecord";

export interface IncubationDailyRecordResponse {
  id: number;
  eggBatchId: number;
  dayNumber: number;
  healthyEggs: number;
  rottenEggs: number;
  hatchedEggs: number;
  success: boolean;
  eggBatch: EggBatchResponse;
}

export const incubationDailyRecordService = {
  getIncubationDailyRecordByEggBatchId: async (
    eggBatchId: number | undefined,
    request: PagingRequest
  ): Promise<BaseResponse<PagedResponse<IncubationDailyRecordResponse>>> => {
    const response = await apiService.get<
      BaseResponse<PagedResponse<IncubationDailyRecordResponse>>
    >(`${baseUrl}/by-breeding/${eggBatchId}`, { ...request });
    return response.data;
  },
};

export default incubationDailyRecordService;
