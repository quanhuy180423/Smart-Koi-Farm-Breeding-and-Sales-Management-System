import apiService, { BaseResponse } from "../apiClient";

const baseUrl = "/api/ShippingDistance";

export interface ShippingDistance {
  id: number;
  name: string;
  minDistanceKm: number;
  maxDistanceKm: number;
  pricePerKm: number;
  baseFee: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShippingDistanceRequest {
  name: string;
  minDistanceKm: number;
  maxDistanceKm: number;
  pricePerKm: number;
  baseFee: number;
  description: string;
  isActive: boolean;
}

export interface UpdateShippingDistanceRequest {
  name: string;
  minDistanceKm: number;
  maxDistanceKm: number;
  pricePerKm: number;
  baseFee: number;
  description: string;
  isActive: boolean;
}

export const shippingDistanceService = {
  getAllShippingDistances: async (): Promise<
    BaseResponse<ShippingDistance[]>
  > => {
    const response =
      await apiService.get<BaseResponse<ShippingDistance[]>>(baseUrl);
    return response.data;
  },

  getShippingDistanceById: async (
    id: number,
  ): Promise<BaseResponse<ShippingDistance>> => {
    const response = await apiService.get<BaseResponse<ShippingDistance>>(
      `${baseUrl}/${id}`,
    );
    return response.data;
  },

  createShippingDistance: async (
    request: CreateShippingDistanceRequest,
  ): Promise<BaseResponse<ShippingDistance>> => {
    const response = await apiService.post<
      BaseResponse<ShippingDistance>,
      CreateShippingDistanceRequest
    >(baseUrl, request);
    return response.data;
  },

  updateShippingDistance: async (
    id: number,
    request: UpdateShippingDistanceRequest,
  ): Promise<BaseResponse<boolean>> => {
    const response = await apiService.put<
      BaseResponse<boolean>,
      UpdateShippingDistanceRequest
    >(`${baseUrl}/${id}`, request);
    return response.data;
  },

  deleteShippingDistance: async (
    id: number,
  ): Promise<BaseResponse<boolean>> => {
    const response = await apiService.delete<BaseResponse<boolean>>(
      `${baseUrl}/${id}`,
    );
    return response.data;
  },
};

export default shippingDistanceService;
