import apiService, { BaseResponse } from "../apiClient";

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
