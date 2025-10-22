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
  Warning = "Warning",
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

export interface KoiFishResponse {
  id: number;
  rfid: string;
  size?: FishSize;
  type: KoiType;
  birthDate?: string;
  gender: Gender;
  healthStatus: HealthStatus;
  images: string[];
  videos: string[];
  sellingPrice?: number;
  bodyShape: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  origin?: string;
  pond: PondBasicResponse;
  variety: VarietyResponse;
  breedingProcess: BreedingProcessBasicResponse;
}

export interface KoiFishGetRequest extends PagingRequest {
  gender?: Gender;
  search?: string;
  health?: HealthStatus;
  varietyId?: number;
  pondId?: number;
  minPrice?: number;
  maxPrice?: number;
}

const baseUrl = "/api/KoiFish";

export const koiFishService = {
  getKoiFishes: async (
    request: KoiFishGetRequest,
  ): Promise<BaseResponse<PagedResponse<KoiFishResponse>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<
      BaseResponse<PagedResponse<KoiFishResponse>>
    >(`${baseUrl}`, { ...filter });
    return response.data;
  },
};

export default koiFishService;
