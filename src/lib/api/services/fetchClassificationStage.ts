import apiService, { BaseResponse } from "../apiClient";
import { ClassificationRecordResponse } from "./fetchClassificationRecord";

const baseUrl = "/api/ClassificationStage";

export interface ClassificationStageResponse {
  id: number;
  breedingProcessId: number;
  totalCount: number;
  status: string;
  notes: string;
  highQualifiedCount: number;
  showQualifiedCount: number;
  pondQualifiedCount: number;
  cullQualifiedCount: number;
  startDate: string;
  endDate: string;
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

  completeClassification: async (
    classificationStageId: number,
  ): Promise<BaseResponse<boolean>> => {
    const response = await apiService.put<
      BaseResponse<boolean>,
      Record<string, never>
    >(`${baseUrl}/complete/${classificationStageId}`, {});
    return response.data;
  },
};

export default classificationStageService;
