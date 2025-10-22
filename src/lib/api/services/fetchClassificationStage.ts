import apiService, { BaseResponse } from "../apiClient";
import { ClassificationRecordResponse } from "./fetchClassificationRecord";
import { PondBasicResponse } from "./fetchPond";

const baseUrl = "/api/ClassificationStage";

export interface ClassificationStageResponse {
  id: number;
  breedingProcessId: number;
  pondId: number;
  totalCount: number;
  status: string;
  notes: string;
  classificationRecords: ClassificationRecordResponse[];
}

export const classificationStageService = {
  getClassificationStageByBreedingId: async (
    breedId: number | undefined,
  ): Promise<BaseResponse<ClassificationStageResponse>> => {
    const response = await apiService.get<
      BaseResponse<ClassificationStageResponse>
    >(`${baseUrl}/by-breeding/${breedId}`);
    return response.data;
  },
};

export default classificationStageService;
