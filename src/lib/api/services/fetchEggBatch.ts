import apiService, { BaseResponse } from "../apiClient";
import { IncubationDailyRecordResponse } from "./fetchIncubationDailyRecord";

const baseUrl = "/api/EggBatch";

export enum EggBatchStatus {
  COLLECTED = "Collected",
  INCUBATING = "Incubating",
  PARTIALLY_HATCHED = "PartiallyHatched",
  SUCCESS = "Success",
  FAILED = "Failed",
}

export interface EggBatchResponse {
  id: number;
  breedingProcessId: number;
  pondId: number;
  quantity: number;
  fertilizationRate: number;
  status: EggBatchStatus;
  hatchingTime: string;
  spawnDate: string;
  incubationDailyRecords: IncubationDailyRecordResponse[];
}

export const eggBatchService = {
  getEggBatchByBreedingId: async (
    breedId: number | undefined
  ): Promise<BaseResponse<EggBatchResponse>> => {
    const response = await apiService.get<BaseResponse<EggBatchResponse>>(
      `${baseUrl}/by-breeding/${breedId}`
    );
    return response.data;
  },
};

export default eggBatchService;
