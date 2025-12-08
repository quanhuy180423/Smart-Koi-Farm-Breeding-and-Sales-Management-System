import apiService, { BaseResponse } from "../apiClient";

const baseUrl = "/api/ShippingBox";

export interface ShippingBoxRule {
  id: number;
  shippingBoxId: number;
  ruleType: string;
  maxCount: number | null;
  maxLengthCm: number | null;
  minLengthCm: number | null;
  maxWeightLb: number | null;
  extraInfo: string;
  priority: number;
  createdAt: string;
}

export interface ShippingBoxResponse {
  id: number;
  name: string;
  weightCapacityLb: number;
  fee: number;
  maxKoiCount: number | null;
  maxKoiSizeInch: number | null;
  notes: string;
  createdAt: string;
  updatedAt: string | null;
  rules: ShippingBoxRule[];
}

export interface CreateShippingBoxRequest {
  name: string;
  weightCapacityLb: number;
  fee: number;
  maxKoiCount: number | null;
  maxKoiSizeInch: number | null;
  notes: string;
}

export interface UpdateShippingBoxRequest {
  name: string;
  weightCapacityLb: number;
  fee: number;
  maxKoiCount: number | null;
  maxKoiSizeInch: number | null;
  notes: string;
}

export enum RuleType {
  ByAge = "ByAge",
  ByMaxLength = "ByMaxLength",
  ByCount = "ByCount",
  ByWeight = "ByWeight",
}

export interface CreateShippingBoxRuleRequest {
  shippingBoxId: number;
  ruleType: RuleType;
  maxCount: number | null;
  maxLengthCm: number | null;
  minLengthCm: number | null;
  maxWeightLb: number | null;
  extraInfo: string;
  priority: number;
}

export interface UpdateShippingBoxRuleRequest {
  shippingBoxId: number;
  ruleType: RuleType;
  maxCount: number | null;
  maxLengthCm: number | null;
  minLengthCm: number | null;
  maxWeightLb: number | null;
  extraInfo: string;
  priority: number;
}

export interface KoiInput {
  size: string;
  quantity: number;
}

export interface KoiListItem {
  sizeCm: number;
  sizeInch: number;
}

export interface BoxCalculation {
  boxId: number;
  boxName: string;
  quantity: number;
  feePerBox: number;
  subtotal: number;
  koiList: KoiListItem[];
}

export interface ShippingCalculationResponse {
  boxes: BoxCalculation[];
  totalFee: number;
  totalKoiCount: number;
  warnings: string[];
  suggestions: string[];
}

export interface CalculateShippingRequest {
  koiInputs: KoiInput[];
}

export const shippingBoxService = {
  getAllShippingBoxes: async (): Promise<
    BaseResponse<ShippingBoxResponse[]>
  > => {
    const response =
      await apiService.get<BaseResponse<ShippingBoxResponse[]>>(baseUrl);
    return response.data;
  },

  getShippingBoxById: async (
    id: number,
  ): Promise<BaseResponse<ShippingBoxResponse>> => {
    const response = await apiService.get<BaseResponse<ShippingBoxResponse>>(
      `${baseUrl}/${id}`,
    );
    return response.data;
  },

  createShippingBox: async (
    request: CreateShippingBoxRequest,
  ): Promise<BaseResponse<ShippingBoxResponse>> => {
    const response = await apiService.post<
      BaseResponse<ShippingBoxResponse>,
      CreateShippingBoxRequest
    >(baseUrl, request);
    return response.data;
  },

  updateShippingBox: async (
    id: number,
    request: UpdateShippingBoxRequest,
  ): Promise<BaseResponse<boolean>> => {
    const response = await apiService.put<
      BaseResponse<boolean>,
      UpdateShippingBoxRequest
    >(`${baseUrl}/${id}`, request);
    return response.data;
  },

  deleteShippingBox: async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await apiService.delete<BaseResponse<boolean>>(
      `${baseUrl}/${id}`,
    );
    return response.data;
  },

  getShippingBoxRules: async (
    boxId: number,
  ): Promise<BaseResponse<ShippingBoxRule[]>> => {
    const response = await apiService.get<BaseResponse<ShippingBoxRule[]>>(
      `${baseUrl}/${boxId}/rules`,
    );
    return response.data;
  },

  createShippingBoxRule: async (
    request: CreateShippingBoxRuleRequest,
  ): Promise<BaseResponse<ShippingBoxRule>> => {
    const response = await apiService.post<
      BaseResponse<ShippingBoxRule>,
      CreateShippingBoxRuleRequest
    >(`${baseUrl}/rules`, request);
    return response.data;
  },

  updateShippingBoxRule: async (
    ruleId: number,
    request: UpdateShippingBoxRuleRequest,
  ): Promise<BaseResponse<boolean>> => {
    const response = await apiService.put<
      BaseResponse<boolean>,
      UpdateShippingBoxRuleRequest
    >(`${baseUrl}/rules/${ruleId}`, request);
    return response.data;
  },

  deleteShippingBoxRule: async (
    ruleId: number,
  ): Promise<BaseResponse<boolean>> => {
    const response = await apiService.delete<BaseResponse<boolean>>(
      `${baseUrl}/rules/${ruleId}`,
    );
    return response.data;
  },

  calculateShippingBox: async (
    request: CalculateShippingRequest,
  ): Promise<BaseResponse<ShippingCalculationResponse>> => {
    const response = await apiService.post<
      BaseResponse<ShippingCalculationResponse>,
      CalculateShippingRequest
    >(`${baseUrl}/calculate`, request);
    return response.data;
  },
};

export default shippingBoxService;
