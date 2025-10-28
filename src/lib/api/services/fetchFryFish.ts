import apiService, { BaseResponse } from "../apiClient";
import { FrySurvivalRecordResponse } from "./fetchFrySurvivalRecord";
import { PondBasicResponse } from "./fetchPond";

const baseUrl = "/api/FryFish";

export enum FryFishStatus {
  HATCHED = "Hatched",
  GROWING = "Growing",
  SELECTEING = "Selecteing",
  COMPLETED = "Completed",
  DEAD = "Dead",
}

export interface FryFishResponse {
  id: number;
  breedingProcessId: number;
  initialCount: number;
  status: FryFishStatus;
  currentSurvivalRate: number;
  pond: PondBasicResponse;
  startDate: string;
  endDate: string;
  frySurvivalRecords: FrySurvivalRecordResponse[];
}

export const fryFishService = {
  getFryFishByBreedingId: async (
    breedId: number | undefined,
  ): Promise<BaseResponse<FryFishResponse>> => {
    const response = await apiService.get<BaseResponse<FryFishResponse>>(
      `${baseUrl}/by-breeding/${breedId}`,
    );
    return response.data;
  },
};

export default fryFishService;
