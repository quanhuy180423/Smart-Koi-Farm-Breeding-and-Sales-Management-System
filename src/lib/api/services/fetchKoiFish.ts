import toRequestParams from "@/lib/utils/params";
import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";
import { BreedingProcessBasicResponse } from "./fetchBreedingProcess";
import { PondBasicResponse } from "./fetchPond";
import { VarietyBasicResponse } from "./fetchVariety";

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  UNKNOWN = "Unknown",
}

export enum HealthStatus {
  HEALTHY = "Healthy",
  SICK = "Sick",
  CRITICAL = "Critical",
  DEAD = "Dead",
}

export interface KoiFishResponse {
  id: number;
  rfid: string;
  size?: number;
  birthDate?: string;
  gender: Gender;
  healthStatus: HealthStatus;
  imagesVideos: string;
  sellingPrice?: number;
  bodyShape: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  origin?: string;
  pond: PondBasicResponse;
  variety: VarietyBasicResponse;
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
