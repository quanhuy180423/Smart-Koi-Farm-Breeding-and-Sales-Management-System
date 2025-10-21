import apiService, { BaseResponse } from "../apiClient";

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

export interface SuccessResponse<T> {
  message: string;
  data: T;
}

const baseUrl = "/api/Area";

export const areaService = {
  getAreas: async (): Promise<BaseResponse<AreaResponse[]>> => {
    const response = await apiService.get<BaseResponse<AreaResponse[]>>(`${baseUrl}`);
    return response.data;
  },
  addArea: async (
    area: Partial<AreaRequest>,
  ): Promise<BaseResponse<SuccessResponse<AreaResponse>>> => {
    const response = await apiService.post<
      BaseResponse<SuccessResponse<AreaResponse>>,
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
