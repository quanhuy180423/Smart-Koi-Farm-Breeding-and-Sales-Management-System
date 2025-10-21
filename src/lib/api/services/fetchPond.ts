import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";

export interface PondBasicResponse {
  id: number;
  pondName: string;
}

export interface PondResponse {
  id: number;
  pondName: string;
  location: string;
  pondStatus: string;
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

export const pondService = {
  getPonds: async (
    request: PagingRequest,
  ): Promise<BaseResponse<PagedResponse<PondResponse>>> => {
    const response = await apiService.get<
      BaseResponse<PagedResponse<PondResponse>>
    >(`${baseUrl}`, { ...request });
    return response.data;
  },
};
