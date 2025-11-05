import apiService, { BaseResponse } from "../apiClient";

export interface CustomerAddressResponse {
  id: number;
  customerId: number;
  customerName: string;
  fullAddress: string;
  city: string;
  district: string;
  ward: string;
  streetAddress: string;
  latitude?: number;
  longitude?: number;
  distanceFromFarmKm?: number | null;
  distanceCalculatedAt?: string | null;
  recipientPhone: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

const baseUrl = "/api/CustomerAddress";

export interface CreateAddressRequest {
  fullAddress: string;
  city: string;
  district: string;
  ward: string;
  streetAddress: string;
  latitude: number;
  longitude: number;
  recipientPhone: string;
  isDefault: boolean;
}

export interface UpdateAddressRequest {
  fullAddress: string;
  city: string;
  district: string;
  ward: string;
  streetAddress: string;
  latitude: number;
  longitude: number;
  recipientPhone: string;
  isDefault: boolean;
  isActive: boolean;
}

export const customerAddressService = {
  getMyAddresses: async (): Promise<
    BaseResponse<CustomerAddressResponse[]>
  > => {
    const response = await apiService.get<
      BaseResponse<CustomerAddressResponse[]>
    >(`${baseUrl}/customer/me`);
    return response.data;
  },

  createAddress: async (
    data: CreateAddressRequest,
  ): Promise<BaseResponse<CustomerAddressResponse>> => {
    const response = await apiService.post<
      BaseResponse<CustomerAddressResponse>,
      CreateAddressRequest
    >(`${baseUrl}`, data);
    return response.data;
  },

  updateAddress: async (
    addressId: number,
    data: UpdateAddressRequest,
  ): Promise<BaseResponse<CustomerAddressResponse>> => {
    const response = await apiService.put<
      BaseResponse<CustomerAddressResponse>,
      UpdateAddressRequest
    >(`${baseUrl}/${addressId}`, data);
    return response.data;
  },

  deleteAddress: async (addressId: number): Promise<BaseResponse<boolean>> => {
    const response = await apiService.delete<BaseResponse<boolean>>(
      `${baseUrl}/${addressId}`,
    );
    return response.data;
  },

  setDefaultAddress: async (
    addressId: number,
  ): Promise<BaseResponse<CustomerAddressResponse>> => {
    const response = await apiService.put<
      BaseResponse<CustomerAddressResponse>
    >(`${baseUrl}/customer/me/set-default/${addressId}`);
    return response.data;
  },
};

export default customerAddressService;
