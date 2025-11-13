import apiService, { BaseResponse, PagedResponse } from "../apiClient";
import toRequestParams from "@/lib/utils/params";

export enum WaterParameterName {
  PHLevel = "PHLevel",
  TemperatureCelsius = "TemperatureCelsius",
  OxygenLevel = "OxygenLevel",
  AmmoniaLevel = "AmmoniaLevel",
  NitriteLevel = "NitriteLevel",
  NitrateLevel = "NitrateLevel",
  CarbonHardness = "CarbonHardness",
  WaterLevelMeters = "WaterLevelMeters",
}

export interface WaterParameterThreshold {
  id: number;
  parameterName: WaterParameterName;
  unit: string;
  minValue: number;
  maxValue: number;
  pondTypeId: number;
  pondTypeName: string;
}

export interface WaterParameterThresholdSearchParams {
  parameterName?: WaterParameterName | string;
  pondTypeId?: number;
  pageIndex?: number;
  pageSize?: number;
}

export interface CreateWaterParameterThresholdRequest {
  parameterName: WaterParameterName | string;
  unit: string;
  minValue: number;
  maxValue: number;
  pondTypeId: number;
}

export interface CreateWaterParameterThresholdResponse {
  id: number;
  parameterName: WaterParameterName;
  unit: string;
  minValue: number;
  maxValue: number;
  pondTypeId: number;
  pondTypeName: string;
}

export interface UpdateWaterParameterThresholdRequest {
  parameterName: WaterParameterName | string;
  unit: string;
  minValue: number;
  maxValue: number;
  pondTypeId: number;
}

export interface UpdateWaterParameterThresholdResponse {
  id: number;
  parameterName: WaterParameterName;
  unit: string;
  minValue: number;
  maxValue: number;
  pondTypeId: number;
  pondTypeName: string;
}

const baseUrl = "/api/WaterParameterThreshold";

export const waterParameterThresholdService = {
  getWaterParameterThresholds: async (
    params: WaterParameterThresholdSearchParams,
  ): Promise<BaseResponse<PagedResponse<WaterParameterThreshold>>> => {
    const filter = toRequestParams({
      parameterName: params.parameterName,
      pondTypeId: params.pondTypeId,
      pageIndex: params.pageIndex || 1,
      pageSize: params.pageSize || 10,
    });
    const response = await apiService.get<
      BaseResponse<PagedResponse<WaterParameterThreshold>>
    >(baseUrl, filter);
    return response.data;
  },

  createWaterParameterThreshold: async (
    data: CreateWaterParameterThresholdRequest,
  ): Promise<BaseResponse<CreateWaterParameterThresholdResponse>> => {
    const response = await apiService.post<
      BaseResponse<CreateWaterParameterThresholdResponse>,
      CreateWaterParameterThresholdRequest
    >(baseUrl, data);
    return response.data;
  },

  updateWaterParameterThreshold: async (
    id: number,
    data: UpdateWaterParameterThresholdRequest,
  ): Promise<BaseResponse<UpdateWaterParameterThresholdResponse>> => {
    const response = await apiService.put<
      BaseResponse<UpdateWaterParameterThresholdResponse>,
      UpdateWaterParameterThresholdRequest
    >(`${baseUrl}/${id}`, data);
    return response.data;
  },

  deleteWaterParameterThreshold: async (
    id: number,
  ): Promise<BaseResponse<boolean>> => {
    const response = await apiService.delete<BaseResponse<boolean>>(
      `${baseUrl}/${id}`,
    );
    return response.data;
  },
};

export default waterParameterThresholdService;
