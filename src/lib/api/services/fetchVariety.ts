import toRequestParams from "@/lib/utils/params";
import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";

export interface VarietyResponse {
  id: number;
  varietyName: string;
  characteristic: string;
  originCountry: string;
}

export interface VarietyRequest {
  varietyName: string;
  characteristic: string;
  originCountry: string;
}

export interface VarietySearchParams extends PagingRequest {
  search?: string;
  originCountry?: string;
}

const baseUrl = "/api/Variety";

const varietyService = {
  getVarieties: async (
    request: VarietySearchParams
  ): Promise<BaseResponse<PagedResponse<VarietyResponse>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<
      BaseResponse<PagedResponse<VarietyResponse>>
    >(`${baseUrl}`, { ...filter });
    return response.data;
  },
  addVariety: async (
    request: Partial<VarietyRequest>
  ): Promise<BaseResponse<VarietyResponse>> => {
    const response = await apiService.post<
      BaseResponse<VarietyResponse>,
      Partial<VarietyRequest>
    >(`${baseUrl}`, request);
    return response.data;
  },
  updateVariety: async (
    id: number,
    request: Partial<VarietyRequest>
  ): Promise<BaseResponse<boolean>> => {
    const response = await apiService.put<
      BaseResponse<boolean>,
      Partial<VarietyRequest>
    >(`${baseUrl}/${id}`, request);
    return response.data;
  },
  deleteVariety: async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await apiService.delete<BaseResponse<boolean>>(
      `${baseUrl}/${id}`
    );
    return response.data;
  },
};

export default varietyService;
