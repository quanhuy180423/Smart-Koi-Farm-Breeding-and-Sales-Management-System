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
};
