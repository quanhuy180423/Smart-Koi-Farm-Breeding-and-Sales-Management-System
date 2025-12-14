import toRequestParams from "@/lib/utils/params";
import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";

export interface Pattern {
  id: number;
  patternName: string;
  description: string;
}

export interface PatternSearchParams extends PagingRequest {
  search?: string;
}

export interface PatternRequest {
  patternName: string;
  description: string;
}

export interface AssignVarietyRequest {
  varietyId: number;
  patternId: number;
}

export interface PatternVariety {
  id: number;
  varietyName: string;
  characteristic: string;
  originCountry: string;
}

export interface PatternVarietySearchParams extends PagingRequest {
  search?: string;
}

const baseUrl = "/api/Pattern";

const patternService = {
  getPatterns: async (
    request: PatternSearchParams,
  ): Promise<BaseResponse<PagedResponse<Pattern>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<BaseResponse<PagedResponse<Pattern>>>(
      `${baseUrl}`,
      { ...filter },
    );
    return response.data;
  },

  createPattern: async (
    data: PatternRequest,
  ): Promise<BaseResponse<Pattern>> => {
    const response = await apiService.post<
      BaseResponse<Pattern>,
      PatternRequest
    >(`${baseUrl}`, data);
    return response.data;
  },

  updatePattern: async (
    id: number,
    data: PatternRequest,
  ): Promise<BaseResponse<Pattern>> => {
    const response = await apiService.put<
      BaseResponse<Pattern>,
      PatternRequest
    >(`${baseUrl}/${id}`, data);
    return response.data;
  },

  deletePattern: async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await apiService.delete<BaseResponse<boolean>>(
      `${baseUrl}/${id}`,
    );
    return response.data;
  },

  assignVarietyToPattern: async (
    data: AssignVarietyRequest,
  ): Promise<BaseResponse<boolean>> => {
    const response = await apiService.post<
      BaseResponse<boolean>,
      AssignVarietyRequest
    >(`${baseUrl}/assign`, data);
    return response.data;
  },

  removeVarietyFromPattern: async (
    data: AssignVarietyRequest,
  ): Promise<BaseResponse<boolean>> => {
    const params = toRequestParams(data);
    const response = await apiService.delete<BaseResponse<boolean>>(
      `${baseUrl}/remove`,
      { ...params },
    );
    return response.data;
  },

  getPatternVarieties: async (
    patternId: number,
    request: PatternVarietySearchParams,
  ): Promise<BaseResponse<PagedResponse<PatternVariety>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<
      BaseResponse<PagedResponse<PatternVariety>>
    >(`${baseUrl}/${patternId}/varieties`, { ...filter });
    return response.data;
  },

  getPatternsByVariety: async (
    varietyId: number,
  ): Promise<BaseResponse<Pattern[]>> => {
    const response = await apiService.get<BaseResponse<Pattern[]>>(
      `${baseUrl}/by-variety/${varietyId}`,
    );
    return response.data;
  },
};

export default patternService;
