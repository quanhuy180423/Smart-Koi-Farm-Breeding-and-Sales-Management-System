import toRequestParams from "@/lib/utils/params";
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
  code: string;
  maleKoiId: number;
  maleKoiRFID: string;
  maleKoiVariety: string;
  femaleKoiId: number;
  femaleKoiRFID: string;
  femaleKoiVariety: string;
  pondId: number;
  pondName: string;
  startDate: string;
  endDate: string;
  status: BreedingStatus;
  result: BreedingResult;
  note: string;
  totalFishQualified: number;
  totalPackage: number;
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

export interface BreedingProcessSearchParams extends PagingRequest {
  search?: string;
  maleKoiId?: number;
  femaleKoiId?: number;
  pondId?: number;
  status?: BreedingStatus;
  result?: BreedingResult;
  minTotalFishQualified?: number;
  maxTotalFishQualified?: number;
  minTotalPackage?: number;
  maxTotalPackage?: number;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
}

export const breedingProcessService = {
  getBreedingProcesses: async (
    request: BreedingProcessSearchParams,
  ): Promise<BaseResponse<PagedResponse<BreedingProcessResponse>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<
      BaseResponse<PagedResponse<BreedingProcessResponse>>
    >(`${baseUrl}`, { ...filter });
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
