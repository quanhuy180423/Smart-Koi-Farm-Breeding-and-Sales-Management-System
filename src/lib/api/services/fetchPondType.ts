import toRequestParams from "@/lib/utils/params";
import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";

const baseUrl = "/api/PondType";

export interface PondTypeResponse {
  id: number;
  typeName: string;
  description: string;
  recommendedCapacity: number;
}

export interface PondTypeSearchParams extends PagingRequest {
  search?: string;
  minRecommendedCapacity?: number;
  maxRecommendedCapacity?: number;
}

export interface PondTypeRequest {
  typeName: string;
  description: string;
  recommendedCapacity: number;
}

export const pondTypeService = {
  getPondTypes: async (
    request: PondTypeSearchParams,
  ): Promise<BaseResponse<PagedResponse<PondTypeResponse>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<
      BaseResponse<PagedResponse<PondTypeResponse>>
    >(`${baseUrl}`, { ...filter });
    return response.data;
  },
  addPondType: async (
    request: Partial<PondTypeRequest>,
  ): Promise<BaseResponse<PondTypeResponse>> => {
    const response = await apiService.post<
      BaseResponse<PondTypeResponse>,
      Partial<PondTypeRequest>
    >(`${baseUrl}`, request);
    return response.data;
  },
  updatePondType: async (
    id: number,
    request: Partial<PondTypeRequest>,
  ): Promise<BaseResponse<boolean>> => {
    const response = await apiService.put<
      BaseResponse<boolean>,
      Partial<PondTypeRequest>
    >(`${baseUrl}/${id}`, request);
    return response.data;
  },
  deletePondType: async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await apiService.delete<BaseResponse<boolean>>(
      `${baseUrl}/${id}`,
    );
    return response.data;
  },
};
