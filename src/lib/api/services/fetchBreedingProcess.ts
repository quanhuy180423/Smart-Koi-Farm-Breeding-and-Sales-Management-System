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
  hatchedTime: string | null;
  startDate: string;
  endDate: string | null;
  totalEggs: number;
  fertilizationRate: number;
  survivalRate: number;
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
  code?: string;
  maleKoiId?: number;
  femaleKoiId?: number;
  pondId?: number;
  status?: BreedingStatus;
  result?: BreedingResult;
  minTotalFishQualified?: number;
  maxTotalFishQualified?: number;
  minTotalPackage?: number;
  maxTotalPackage?: number;
  minTotalEggs?: number;
  maxTotalEggs?: number;
  minFertilizationRate?: number;
  maxFertilizationRate?: number;
  minCurrentSurvivalRate?: number;
  maxCurrentSurvivalRate?: number;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
}

export interface BreedingParentHistoryResponse {
  koiFishId: number;
  participationCount: number;
  failCount: number;
  fertilizationRate: number | null;
  mutationDescription: string | null;
  hatchRate: number | null;
  survivalRate: number | null;
  highQualifiedRate: number | null;
}

export interface BreedingRecommendRequest {
  targetVariety: string;
  priority: string;
  isMutation: boolean;
  minHatchRate: number;
  minSurvivalRate: number;
  minHighQualifiedRate: number;
}

export interface RecommendedPair {
  maleId: number;
  maleRFID: string;
  maleImage: string;
  maleIsMutated: boolean;
  maleMutationDescription: string;
  femaleId: number;
  femaleRFID: string;
  femaleImage: string;
  femaleIsMutated: boolean;
  femaleMutationDescription: string;
  reason: string;
  predictedFertilizationRate: number;
  predictedHatchRate: number;
  predictedMutationRate: number;
  predictedMutationDescription: string;
  predictedSurvivalRate: number;
  predictedHighQualifiedRate: number;
  percentInbreeding: number;
  rank: number;
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
  hatchedTime: string | null;
  startDate: string;
  endDate: string | null;
  status: BreedingStatus;
  result: BreedingResult;
  note: string;
  totalEggs: number;
  fertilizationRate: number;
  survivalRate: number;
  totalFishQualified: number;
  totalPackage: number;
  koiFishes: KoiFishResponse[];
  batch: EggBatchResponse;
  fryFish: FryFishResponse;
  classificationStage: ClassificationStageResponse;
}

export interface BreedingRecommendResponse {
  recommendedPairs: RecommendedPair[];
}

export interface AnalyzePairRequest {
  maleId: number;
  femaleId: number;
}

export interface BreedingInfo {
  summary: string;
  breedingSuccessRate: number;
}

export interface AnalyzePairResponse {
  maleId: number;
  femaleId: number;
  predictedFertilizationRate: number;
  predictedHatchRate: number;
  predictedSurvivalRate: number;
  predictedHighQualifiedRate: number;
  percentInbreeding: number;
  predictedMutationRate: number;
  mutationDescription: string;
  predictedMatchToDesiredMutationType: number;
  summary: string;
  maleBreedingInfo?: BreedingInfo;
  femaleBreedingInfo?: BreedingInfo;
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
  getBreedingParentHistory: async (
    id: number,
  ): Promise<BaseResponse<BreedingParentHistoryResponse>> => {
    const response = await apiService.get<
      BaseResponse<BreedingParentHistoryResponse>
    >(`${baseUrl}/${id}/breeding-parent-history`);
    return response.data;
  },
  getRecommends: async (
    request: Partial<BreedingRecommendRequest>,
  ): Promise<BaseResponse<BreedingRecommendResponse>> => {
    const response = await apiService.post<
      BaseResponse<BreedingRecommendResponse>,
      Partial<BreedingRecommendRequest>
    >(`${baseUrl}/recommend`, request);
    return response.data;
  },
  cancelBreeding: async (id: number) => {
    const response = await apiService.put<BaseResponse<boolean>>(
      `${baseUrl}/cancel/${id}`,
    );
    return response.data;
  },
  getBreedingDetail: async (
    id?: number,
  ): Promise<BaseResponse<BreedingDetailResponse>> => {
    const response = await apiService.get<BaseResponse<BreedingDetailResponse>>(
      `${baseUrl}/detail/${id}`,
    );
    return response.data;
  },
  analyzePair: async (
    request: AnalyzePairRequest,
  ): Promise<BaseResponse<AnalyzePairResponse>> => {
    const response = await apiService.post<
      BaseResponse<AnalyzePairResponse>,
      AnalyzePairRequest
    >(`${baseUrl}/analyze-pair`, request);
    return response.data;
  },
};

export default breedingProcessService;
