import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";
import { KoiFishResponse } from "./fetchKoiFish";

const baseUrl = "/api/BreedingProcess";

export enum BreedingStatus {
  PAIRING = "Pairing",
  SPAWNED = "Spawned",
  EGG_BATCH = "EggBatch",
  FRY_FISH = "FryFish",
  CLASSIFICATION = "Classification",
  COMPLETE = "Complete",
  FAILED = "Failed",
}

export enum BreedingResult {
  UNKNOWN = "Unknown",
  SUCCESS = "Success",
  FAILED = "Failed",
  PARTIAL_SUCCESS = "PartialSuccess",
}

export interface BreedingProcessResponse {
  id: number;
  maleKoiId: number;
  maleKoiName: string;
  femaleKoiId: number;
  femaleKoiName: string;
  pondId: number;
  pondName: string;
  startDate: string;
  status: BreedingStatus;
  result: BreedingResult;
  koiFishes: KoiFishResponse[];
}

export interface BreedingProcessBasicResponse {
  id: number;
  processName: string;
}

export interface BreedingProcessCreateRequest {
  maleKoiId: number;
  femaleKoiId: number;
  pondId: number;
}

export const breedingProcessService = {
  getBreedingProcesses: async (
    request: PagingRequest,
  ): Promise<BaseResponse<PagedResponse<BreedingProcessResponse>>> => {
    const response = await apiService.get<
      BaseResponse<PagedResponse<BreedingProcessResponse>>
    >(`${baseUrl}`, { ...request });
    return response.data;
  },
  addBreedingProcess: async (
    request: Partial<BreedingProcessCreateRequest>,
  ): Promise<BaseResponse<BreedingProcessResponse>> => {
    const response = await apiService.post<
      BaseResponse<BreedingProcessResponse>,
      Partial<BreedingProcessCreateRequest>
    >(`${baseUrl}`, request);
    return response.data;
  },
};

export default breedingProcessService;
