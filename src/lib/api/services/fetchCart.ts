import apiService, { BaseResponse } from "../apiClient";
import { KoiFishResponse } from "./fetchKoiFish";
import { OrderResponse } from "./fetchOrder";
import { PacketFishResponse } from "./fetchPacketFish";

const baseUrl = "/api/Cart";

export interface CartItemRequest {
  koiFishId?: number;
  packetFishId?: number;
  quantity: number;
}

export interface CartItemUpdateRequest {
  quantity: number;
}

export interface ConvertCartToOrderRequest {
  customerAddressId?: number;
  shippingFee?: number;
}

export interface CartItemResponse {
  id: number;
  cartId: number;
  koiFishId?: number;
  packetFishId?: number;
  koiFish?: KoiFishResponse;
  packetFish?: PacketFishResponse;
  quantity: number;
  itemTotalPrice: number;
  addedAt: string;
  updatedAt: string;
}

export interface CartResponse {
  id: number;
  customerId: number;
  customerName: string;
  createdAt: string;
  updatedAt: string;
  cartItems: CartItemResponse[];
  totalPrice: number;
}

export const cartService = {
  getCart: async (): Promise<BaseResponse<CartResponse>> => {
    const response = await apiService.get<BaseResponse<CartResponse>>(
      `${baseUrl}`,
    );
    return response.data;
  },
  addItemToCart: async (
    request: Partial<CartItemRequest>,
  ): Promise<BaseResponse<CartItemResponse>> => {
    const response = await apiService.post<
      BaseResponse<CartItemResponse>,
      Partial<CartItemRequest>
    >(`${baseUrl}/items`, request);
    return response.data;
  },
  updateItem: async (
    id: number,
    request: Partial<CartItemUpdateRequest>,
  ): Promise<BaseResponse<CartItemResponse>> => {
    const response = await apiService.put<
      BaseResponse<CartItemResponse>,
      Partial<CartItemUpdateRequest>
    >(`${baseUrl}/items/${id}`, request);
    return response.data;
  },
  deleteItem: async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await apiService.delete<BaseResponse<boolean>>(
      `${baseUrl}/items/${id}`,
    );
    return response.data;
  },
  converCartToOrder: async (
    request: Partial<ConvertCartToOrderRequest>,
  ): Promise<BaseResponse<OrderResponse>> => {
    const response = await apiService.post<
      BaseResponse<OrderResponse>,
      Partial<ConvertCartToOrderRequest>
    >(`${baseUrl}/convert-to-order`, request);
    return response.data;
  },
};

export default cartService;
