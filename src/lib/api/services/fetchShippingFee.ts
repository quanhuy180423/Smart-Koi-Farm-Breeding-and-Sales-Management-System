import apiService, { BaseResponse } from "../apiClient";

const baseUrl = "/api/ShippingFee";

export interface ShippingFeeItem {
  koiFishId?: number | null;
  packetFishId?: number | null;
  quantity: number;
}

export interface ShippingFeeCalculateRequest {
  items: ShippingFeeItem[];
  customerAddressId: number;
}

export interface ShippingBox {
  boxId: number;
  boxName: string;
  quantity: number;
  feePerBox: number;
  subtotal: number;
  koiList: Array<{
    sizeCm: number;
    sizeInch: number;
  }>;
}

export interface ShippingFeeCalculateResponse {
  boxFee: number;
  shippingBoxId: number;
  shippingBoxName: string;
  boxes: ShippingBox[];
  distanceFee: number;
  shippingDistanceId: number;
  distanceKm: number;
  totalShippingFee: number;
  notes: string;
}

export const shippingFeeService = {
  calculateShippingFee: async (
    request: ShippingFeeCalculateRequest,
  ): Promise<BaseResponse<ShippingFeeCalculateResponse>> => {
    const response = await apiService.post<
      BaseResponse<ShippingFeeCalculateResponse>,
      ShippingFeeCalculateRequest
    >(`${baseUrl}/calculate`, request);
    return response.data;
  },
};

export default shippingFeeService;
