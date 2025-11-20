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

export enum Pattern {
  NONE = "None",
  TANCHO = "Tancho",
  MARUTEN = "Maruten",
  NIDAN = "Nidan",
  SANDAN = "Sandan",
  INAZUMA = "Inazuma",
  STRAIGHT_HI = "StraightHi",
  MENKABURI = "Menkaburi",
  BOZU = "Bozu",
}

export interface KoiFishResponse {
  id: number;
  rfid: string;
  size: string;
  type: KoiType;
  birthDate: string;
  gender: Gender;
  healthStatus: HealthStatus;
  pattern: Pattern;
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
}

export enum SaleStatus {
  NOT_FOR_SALE = "NotForSale",
  AVAILABLE = "Available",
  SOLD = "Sold",
}

export interface KoiFishSearchParams extends PagingRequest {
  Search?: string;
  Gender?: Gender;
  Health?: HealthStatus;
  VarietyId?: number;
  MinSize?: number;
  MaxSize?: number;
  PondId?: number;
  Origin?: string;
  MinPrice?: number;
  MaxPrice?: number;
  SaleStatus?: SaleStatus;
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
  breedingProcessId?: number;
  rfid: string;
  size: number;
  type: KoiType;
  pattern: Pattern;
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
