import toRequestParams from "@/lib/utils/params";
import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";

export interface AreaResponse {
  id: number;
  areaName: string;
  totalAreaSQM: number;
  description: string;
}

export interface AreaRequest {
  areaName: string;
  totalAreaSQM: number;
  description?: string;
}

export interface AreaSearchParams extends PagingRequest {
  search?: string;
  minTotalAreaSQM?: number;
  maxTotalAreaSQM?: number;
}

const baseUrl = "/api/Area";

export const areaService = {
  getAreas: async (
    request: AreaSearchParams,
  ): Promise<BaseResponse<PagedResponse<AreaResponse>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<
      BaseResponse<PagedResponse<AreaResponse>>
    >(`${baseUrl}`, { ...filter });
    return response.data;
  },
  addArea: async (
    area: Partial<AreaRequest>,
  ): Promise<BaseResponse<AreaResponse>> => {
    const response = await apiService.post<
      BaseResponse<AreaResponse>,
      Partial<AreaRequest>
    >(`${baseUrl}`, area);
    return response.data;
  },
  updateArea: async (
    id: number,
    area: Partial<AreaRequest>,
  ): Promise<BaseResponse<string>> => {
    const response = await apiService.put<
      BaseResponse<string>,
      Partial<AreaRequest>
    >(`${baseUrl}/${id}`, area);
    return response.data;
  },
  deleteArea: async (id: number): Promise<BaseResponse<string>> => {
    const response = await apiService.delete<BaseResponse<string>>(
      `${baseUrl}/${id}`,
    );
    return response.data;
  },
};

export default areaService;
