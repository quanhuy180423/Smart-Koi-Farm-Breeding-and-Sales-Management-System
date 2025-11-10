import toRequestParams from "@/lib/utils/params";
import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";
import { BreedingProcessBasicResponse } from "./fetchBreedingProcess";
import { PondBasicResponse } from "./fetchPond";
import { VarietyResponse } from "./fetchVariety";

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  UNKNOWN = "Unknown",
}

export enum HealthStatus {
  HEALTHY = "Healthy",
  SICK = "Sick",
  WARNING = "Warning",
  DEAD = "Dead",
}

export enum KoiType {
  HIGH = "High",
  SHOW = "Show ",
}

export enum FishSize {
  UNDER_10CM = "Under10cm",
  FROM_10_TO_20CM = "From10To20cm",
  FROM_21_TO_25CM = "From21To25cm",
  FROM_26_TO_30CM = "From26To30cm",
  FROM_31_TO_40CM = "From31To40cm",
  FROM_41_TO_45CM = "From41To45cm",
  FROM_46_TO_50CM = "From46To50cm",
  OVER_50CM = "Over50cm",
}

export enum MutationType {
  NONE = "None",
  DOITSU = "Doitsu",
  GIN_RIN = "GinRin",
  HIRENAGA = "Hirenaga",
  METALLIC = "Metallic",
}

export interface KoiFishResponse {
  id: number;
  rfid: string;
  size?: string;
  type: KoiType;
  birthDate?: string;
  gender: Gender;
  healthStatus: HealthStatus;
  patternType?: string;
  saleStatus: SaleStatus;
  images: string[];
  videos: string[];
  sellingPrice?: number;
  description: string;
  origin?: string;
  bodyShape?: string;
  isMutated: boolean;
  mutationType: MutationType;
  mutationRate: number;
  createdAt: string;
  updatedAt: string | null;
  pond: PondBasicResponse;
  variety: VarietyResponse;
  breedingProcess: BreedingProcessBasicResponse | null;
}

export enum SaleStatus {
  NOT_FOR_SALE = "NotForSale",
  AVAILABLE = "Available",
  RESERVED = "Reserved",
  SOLD = "Sold",
}

export interface KoiFishSearchParams extends PagingRequest {
  search?: string;
  gender?: Gender;
  health?: HealthStatus;
  varietyId?: number;
  fishSize?: FishSize;
  pondId?: number;
  origin?: string;
  minPrice?: number;
  maxPrice?: number;
  saleStatus?: SaleStatus;
}

export interface KoiFishFamilyResponse {
  id: number;
  rfid: string;
  varietyName: string;
  gender: Gender;
  father?: KoiFishFamilyResponse;
  mother?: KoiFishFamilyResponse;
}

export interface KoiFishUpdateRequest {
  pondId: number;
  varietyId: number;
  rfid: string;
  size: string;
  type: string;
  birthDate: string;
  gender?: Gender;
  healthStatus: HealthStatus;
  saleStatus: SaleStatus;
  origin: string;
  images: string[];
  videos: string[];
  sellingPrice: number;
  bodyShape: string;
  colorPattern: string;
  description: string;
}

const baseUrl = "/api/KoiFish";

export const koiFishService = {
  getKoiFishes: async (
    request: KoiFishSearchParams,
  ): Promise<BaseResponse<PagedResponse<KoiFishResponse>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<
      BaseResponse<PagedResponse<KoiFishResponse>>
    >(`${baseUrl}`, { ...filter });
    return response.data;
  },
  getKoiFishFamily: async (
    id?: number,
  ): Promise<BaseResponse<KoiFishFamilyResponse>> => {
    const response = await apiService.get<BaseResponse<KoiFishFamilyResponse>>(
      `${baseUrl}/family/${id}`,
    );
    return response.data;
  },
  getKoiFishById: async (
    id?: number,
  ): Promise<BaseResponse<KoiFishResponse>> => {
    const response = await apiService.get<BaseResponse<KoiFishResponse>>(
      `${baseUrl}/${id}`,
    );
    return response.data;
  },
  updateKoiFish: async (
    id: number,
    request: Partial<KoiFishUpdateRequest>,
  ): Promise<BaseResponse<string>> => {
    const response = await apiService.put<
      BaseResponse<string>,
      Partial<KoiFishUpdateRequest>
    >(`${baseUrl}/${id}`, request);
    return response.data;
  },
};

export default koiFishService;
