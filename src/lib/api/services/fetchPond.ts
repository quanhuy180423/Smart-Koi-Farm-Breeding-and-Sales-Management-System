import toRequestParams from "@/lib/utils/params";
import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";

export enum PondStatus {
  EMPTY = "Empty",
  ACTIVE = "Active",
  MAINTENANCE = "Maintenance",
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
  capacityLiters: number;
  depthMeters: number;
  lengthMeters: number;
  widthMeters: number;
  createdAt: string;
  pondTypeId: number;
  pondTypeName: string;
  areaId: number;
  areaName: string;
}

const baseUrl = "/api/Pond";

export interface PondSearchParams extends PagingRequest {
  search?: string;
  status?: PondStatus;
  areaId?: number;
  pondTypeId?: number;
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
    request: PondSearchParams
  ): Promise<BaseResponse<PagedResponse<PondResponse>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<
      BaseResponse<PagedResponse<PondResponse>>
    >(`${baseUrl}`, { ...filter });
    return response.data;
  },
  addPond: async (
    pond: Partial<PondRequest>
  ): Promise<BaseResponse<PondResponse>> => {
    const response = await apiService.post<
      BaseResponse<PondResponse>,
      Partial<PondRequest>
    >(`${baseUrl}`, pond);
    return response.data;
  },
  updatePond: async (
    id: number,
    pond: Partial<PondRequest>
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
};
