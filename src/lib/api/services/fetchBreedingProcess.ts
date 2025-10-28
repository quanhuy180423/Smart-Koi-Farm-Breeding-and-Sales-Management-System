import toRequestParams from "@/lib/utils/params";
import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";
import { KoiFishResponse } from "./fetchKoiFish";
import { EggBatchResponse } from "./fetchEggBatch";
import { FryFishResponse } from "./fetchFryFish";
import { ClassificationStageResponse } from "./fetchClassificationStage";

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

export interface BreedingParentHistoryResponse {
  koiFishId: number;
  participationCount: number;
  failCount: number;
  fertilizationRate: number;
  hatchRate: number;
  survivalRate: number;
  highQualifiedRate: number;
}

export interface BreeedingRecommendRequest {
  targetVariety: string;
  priority: string;
  desiredPattern: string;
  desiredBodyShape: string;
  minHatchRate: number;
  minSurvivalRate: number;
  minHighQualifiedRate: number;
}

export interface RecommendedPair {
  maleId: number;
  maleRFID: string;
  maleImage: string;
  femaleId: number;
  femaleRFID: string;
  femaleImage: string;
  reason: string;
  predictedFertilizationRate: number;
  predictedHatchRate: number;
  predictedSurvivalRate: number;
  predictedHighQualifiedRate: number;
  patternMatchScore: number;
  bodyShapeCompatibility: number;
  rank: number;
  // percentInbreeding: string;
  // percentInbreedingValue?: number;
}

export interface BreedingDetailResponse {
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
  endDate: null;
  status: BreedingStatus;
  result: BreedingResult;
  note: string;
  totalEggs: number;
  fertilizationRate: number;
  currentSurvivalRate: null;
  totalFishQualified: number;
  totalPackage: number;
  koiFishes: KoiFishResponse[];
  batch: EggBatchResponse;
  fryFish: FryFishResponse;
  classificationStage: ClassificationStageResponse;
}

export interface BreeedingRecommendResponse {
  recommendedPairs: RecommendedPair[];
}

export const breedingProcessService = {
  getBreedingProcesses: async (
    request: BreedingProcessSearchParams
  ): Promise<BaseResponse<PagedResponse<BreedingProcessResponse>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<
      BaseResponse<PagedResponse<BreedingProcessResponse>>
    >(`${baseUrl}`, { ...filter });
    return response.data;
  },
  addBreedingProcess: async (
    request: Partial<BreedingProcessCreateRequest>
  ): Promise<BaseResponse<BreedingProcessResponse>> => {
    const response = await apiService.post<
      BaseResponse<BreedingProcessResponse>,
      Partial<BreedingProcessCreateRequest>
    >(`${baseUrl}`, request);
    return response.data;
  },
  getBreedingParentHistory: async (
    id: number
  ): Promise<BaseResponse<BreedingParentHistoryResponse>> => {
    const response = await apiService.get<
      BaseResponse<BreedingParentHistoryResponse>
    >(`${baseUrl}/${id}/breeding-parent-history`);
    return response.data;
  },
  getRecommends: async (
    request: Partial<BreeedingRecommendRequest>
  ): Promise<BaseResponse<BreeedingRecommendResponse>> => {
    const response = await apiService.post<
      BaseResponse<BreeedingRecommendResponse>,
      Partial<BreeedingRecommendRequest>
    >(`${baseUrl}/recommend`, request);
    return response.data;
  },
  cancelBreeding: async (id: number) => {
    const response = await apiService.put<BaseResponse<boolean>>(
      `${baseUrl}/cancel/${id}`
    );
    return response.data;
  },
  getBreedingDetail: async (
    id?: number
  ): Promise<BaseResponse<BreedingDetailResponse>> => {
    const response = await apiService.get<BaseResponse<BreedingDetailResponse>>(
      `${baseUrl}/detail/${id}`
    );
    return response.data;
  },
};

export default breedingProcessService;
