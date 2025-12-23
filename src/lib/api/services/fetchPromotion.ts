import toRequestParams from "@/lib/utils/params";
import apiService, { BaseResponse, PagedResponse } from "../apiClient";

export enum DiscountType {
  FixedAmount = "FixedAmount",
  Percentage = "Percentage",
}

export interface PromotionResponse {
  id: number;
  code: string;
  description: string;
  validFrom: string;
  validTo: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderAmount: number;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  images: string[];
}

export interface PromotionSearchParams {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  discountType?: DiscountType;
  availableOnDate?: string;
}

export interface PromotionRequest {
  code: string;
  description: string;
  validFrom: string;
  validTo: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderAmount: number;
  maxDiscountAmount: number;
  usageLimit: number;
  isActive: boolean;
  images: string[];
}

const baseUrl = "/api/Promotions";

export const promotionService = {
  getPromotions: async (
    params: PromotionSearchParams,
  ): Promise<BaseResponse<PagedResponse<PromotionResponse>>> => {
    const filter = toRequestParams({
      pageIndex: params.pageIndex || 1,
      pageSize: params.pageSize || 10,
      search: params.search,
      isActive: params.isActive,
      discountType: params.discountType,
      availableOnDate: params.availableOnDate,
    });
    const response = await apiService.get<
      BaseResponse<PagedResponse<PromotionResponse>>
    >(baseUrl, filter);
    return response.data;
  },
  createPromotion: async (
    request: PromotionRequest,
  ): Promise<BaseResponse<PromotionResponse>> => {
    const response = await apiService.post<
      BaseResponse<PromotionResponse>,
      PromotionRequest
    >(baseUrl, request);
    return response.data;
  },
  updatePromotion: async (
    id: number,
    request: PromotionRequest,
  ): Promise<BaseResponse<PromotionResponse>> => {
    const response = await apiService.put<
      BaseResponse<PromotionResponse>,
      PromotionRequest
    >(`${baseUrl}/${id}`, request);
    return response.data;
  },
  deletePromotion: async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await apiService.delete<BaseResponse<boolean>>(
      `${baseUrl}/${id}`,
    );
    return response.data;
  },
  getCurrentPromotion: async (): Promise<BaseResponse<PromotionResponse>> => {
    const response = await apiService.get<BaseResponse<PromotionResponse>>(
      `${baseUrl}/current`,
    );
    return response.data;
  },
  toggleActivePromotion: async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await apiService.patch<BaseResponse<boolean>>(
      `${baseUrl}/${id}/toggle-active`,
    );
    return response.data;
  },
};

export default promotionService;
