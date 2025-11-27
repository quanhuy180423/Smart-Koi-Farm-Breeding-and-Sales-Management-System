import toRequestParams from "@/lib/utils/params";
import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";
import { KoiFishResponse } from "./fetchKoiFish";

export enum PondStatus {
  EMPTY = "Empty",
  ACTIVE = "Active",
  MAINTENANCE = "Maintenance",
}

export enum PondTypeEnum {
  PARING = "Paring",
  EGG_BATCH = "EggBatch",
  FRY_FISH = "FryFish",
  CLASSIFICATION = "Classification",
  MARKET_POND = "MarketPond",
  BROOD_STOCK = "BroodStock",
}

export interface PondBasicResponse {
  id: number;
  pondName: string;
}

export interface PondResponse {
  id: number;
  pondName: string;
  location: string;
  pondStatus: PondStatus;
  maxFishCount: number | null;
  currentCount: number | null;
  currentCapacity: number | null;
  capacityLiters: number;
  depthMeters: number;
  lengthMeters: number;
  widthMeters: number;
  createdAt: string;
  pondTypeId: number;
  pondTypeName: string;
  pondTypeEnum?: PondTypeEnum;
  areaId: number;
  areaName: string;
  available?: boolean;
}

const baseUrl = "/api/Pond";

export interface PondSearchParams extends PagingRequest {
  search?: string;
  status?: PondStatus;
  areaId?: number;
  pondTypeId?: number;
  pondTypeEnum?: PondTypeEnum;
  available?: boolean;
  minCapacityLiters?: number;
  maxCapacityLiters?: number;
  minDepthMeters?: number;
  maxDepthMeters?: number;
  createdFrom?: string;
  createdTo?: string;
}

export interface PondRequest {
  pondTypeId: number;
  areaId: number;
  pondName: string;
  location: string;
  pondStatus: PondStatus;
  capacityLiters: number;
  depthMeters: number;
  lengthMeters: number;
  widthMeters: number;
}

export const pondService = {
  getPonds: async (
    request: PondSearchParams,
  ): Promise<BaseResponse<PagedResponse<PondResponse>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<
      BaseResponse<PagedResponse<PondResponse>>
    >(`${baseUrl}`, { ...filter });
    return response.data;
  },
  addPond: async (
    pond: Partial<PondRequest>,
  ): Promise<BaseResponse<PondResponse>> => {
    const response = await apiService.post<
      BaseResponse<PondResponse>,
      Partial<PondRequest>
    >(`${baseUrl}`, pond);
    return response.data;
  },
  updatePond: async (
    id: number,
    pond: Partial<PondRequest>,
  ): Promise<BaseResponse<boolean>> => {
    const response = await apiService.put<
      BaseResponse<boolean>,
      Partial<PondRequest>
    >(`${baseUrl}/${id}`, pond);
    return response.data;
  },
  deletePond: async (id: number): Promise<BaseResponse<string>> => {
    const response = await apiService.delete<BaseResponse<string>>(
      `${baseUrl}/${id}`,
    );
    return response.data;
  },
  getPondKoiFishes: async (
    pondId: number,
  ): Promise<BaseResponse<KoiFishResponse[]>> => {
    const response = await apiService.get<BaseResponse<KoiFishResponse[]>>(
      `${baseUrl}/${pondId}/koifish`,
    );
    return response.data;
  },
};
