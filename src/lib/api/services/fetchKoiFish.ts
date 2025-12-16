import toRequestParams from "@/lib/utils/params";
import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";
import {
  BreedingProcessBasicResponse,
  BreedingStatus,
} from "./fetchBreedingProcess";
import { PondBasicResponse } from "./fetchPond";
import { VarietyResponse } from "./fetchVariety";

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
}

export enum HealthStatus {
  HEALTHY = "Healthy",
  SICK = "Sick",
  WARNING = "Warning",
  DEAD = "Dead",
}

export enum KoiType {
  HIGH = "High",
  SHOW = "Show",
}

export enum FishSize {
  FROM_0_TO_19CM = "From0To19cm",
  FROM_20_TO_25CM = "From20To25cm",
  FROM_25_1_TO_30CM = "From25_1To30cm",
  FROM_30_1_TO_40CM = "From30_1To40cm",
  FROM_40_1_TO_44CM = "From40_1To44cm",
  FROM_44_1_TO_50CM = "From44_1To50cm",
  FROM_50_1_TO_55CM = "From50_1To55cm",
  FROM_50_1_TO_60CM_HIRENAGA = "From50_1To60cm_Hirenaga",
  FROM_55_1_TO_60CM = "From55_1To60cm",
  FROM_60_1_TO_65CM = "From60_1To65cm",
  FROM_60_1_TO_65CM_HIRENAGA = "From60_1To65cm_Hirenaga",
  FROM_65_1_TO_73CM = "From65_1To73cm",
  FROM_73_1_TO_83CM = "From73_1To83cm",
  OVER_83_1CM = "Over83_1cm",
}

export enum KoiBreedingStatus {
  READY = "Ready",
  SPAWNING = "Spawning",
  POST_SPAWNING = "PostSpawning",
  NOT_MATURE = "NotMature",
}

export interface KoiFishResponse {
  id: number;
  rfid: string;
  size: string;
  type: KoiType;
  birthDate: string;
  gender: Gender;
  healthStatus: HealthStatus;
  pattern: string;
  saleStatus: SaleStatus;
  images: string[];
  videos: string[];
  sellingPrice: number;
  description: string;
  origin: string;
  isMutated: boolean;
  mutationDescription: string | null;
  createdAt: string;
  updatedAt: string | null;
  pond: PondBasicResponse;
  variety: VarietyResponse;
  breedingProcess: BreedingProcessBasicResponse | null;
  koiBreedingStatus: KoiBreedingStatus;
}

export enum SaleStatus {
  NOT_FOR_SALE = "NotForSale",
  AVAILABLE = "Available",
  SOLD = "Sold",
  PENDING_SALE = "PendingSale",
}

export interface KoiFishSearchParams extends PagingRequest {
  search?: string;
  gender?: Gender;
  health?: HealthStatus;
  varietyId?: number;
  minSize?: number;
  maxSize?: number;
  pondId?: number;
  origin?: string;
  minPrice?: number;
  maxPrice?: number;
  saleStatus?: SaleStatus;
  isBreeding?: boolean;
  IsFavorited?: boolean;
  isPostSpawning?: boolean;
}

export interface KoiFishFamilyResponse {
  id: number;
  rfid: string;
  varietyName: string;
  gender: Gender;
  images: string[];
  father?: KoiFishFamilyResponse;
  mother?: KoiFishFamilyResponse;
}

export interface KoiFishUpdateRequest {
  pondId: number;
  varietyId: number;
  breedingProcessId?: number;
  rfid: string;
  size: number;
  type: KoiType;
  pattern: string;
  birthDate: string;
  gender: Gender;
  healthStatus: HealthStatus;
  saleStatus: SaleStatus;
  origin: string;
  images: string[];
  videos: string[];
  sellingPrice: number;
  description: string;
  isMutated: boolean;
  mutationDescription: string;
}

// Breeding History Types
export interface BreedingPartner {
  id: number;
  rfid: string;
  varietyName: string;
  isMutated: boolean;
  mutationDescription: string | null;
  images: string[];
}

export interface BreedingHistoryItem {
  breedingProcessId: number;
  code: string;
  partner: BreedingPartner;
  totalEggs: number;
  fertilizationRate: number;
  hatchingRate: number | null;
  survivalRate: number;
  totalFishQualified: number;
  mutationRate: number | null;
  totalPackage: number;
  status: BreedingStatus;
  startDate: string;
  endDate: string | null;
}

export interface KoiBreedingHistoryResponse {
  koiId: number;
  rfid: string;
  varietyName: string;
  gender: Gender;
  images: string[];
  breedingHistory: BreedingHistoryItem[];
}

const baseUrl = "/api/KoiFish";

export const koiFishService = {
  getKoiFishes: async (
    request: KoiFishSearchParams
  ): Promise<BaseResponse<PagedResponse<KoiFishResponse>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<
      BaseResponse<PagedResponse<KoiFishResponse>>
    >(`${baseUrl}`, { ...filter });
    return response.data;
  },
  getKoiFishFamily: async (
    id?: number
  ): Promise<BaseResponse<KoiFishFamilyResponse>> => {
    const response = await apiService.get<BaseResponse<KoiFishFamilyResponse>>(
      `${baseUrl}/family/${id}`
    );
    return response.data;
  },
  getKoiFishById: async (
    id?: number
  ): Promise<BaseResponse<KoiFishResponse>> => {
    const response = await apiService.get<BaseResponse<KoiFishResponse>>(
      `${baseUrl}/${id}`
    );
    return response.data;
  },
  updateKoiFish: async (
    id: number,
    request: Partial<KoiFishUpdateRequest>
  ): Promise<BaseResponse<string>> => {
    const response = await apiService.put<
      BaseResponse<string>,
      Partial<KoiFishUpdateRequest>
    >(`${baseUrl}/${id}`, request);
    return response.data;
  },
  deleteKoiFish: async (id: number): Promise<BaseResponse<string>> => {
    const response = await apiService.delete<BaseResponse<string>>(
      `${baseUrl}/${id}`
    );
    return response.data;
  },
  setKoiReadyToSpawn: async (koiId: number): Promise<BaseResponse<string>> => {
    const response = await apiService.put<BaseResponse<string>>(
      `${baseUrl}/koi-spawn/${koiId}`
    );
    return response.data;
  },
  getKoiBreedingHistory: async (
    koiId: number
  ): Promise<BaseResponse<KoiBreedingHistoryResponse>> => {
    const response = await apiService.get<
      BaseResponse<KoiBreedingHistoryResponse>
    >(`${baseUrl}/${koiId}/breeding-history`);
    return response.data;
  },
};

export default koiFishService;
