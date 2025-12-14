import toRequestParams from "@/lib/utils/params";
import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";
import { KoiFishResponse } from "./fetchKoiFish";
import { PacketFishResponse } from "./fetchPacketFish";
import { PromotionResponse } from "./fetchPromotion";

export interface OrderDetailResponse {
  id: number;
  orderId: number;
  koiFishId?: number;
  koiFish?: KoiFishResponse;
  packetFishId?: number;
  packetFish?: PacketFishResponse;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export enum OrderStatus {
  PENDING = "Pending",
  PROCESSING = "Processing",
  UNSHIPPING = "UnShiping",
  SHIPPED = "Shipped",
  CANCELLED = "Cancelled",
  REJECTED = "Rejected",
  DELIVERED = "Delivered",
  REFUND = "Refund",
}

export interface CustomerAddress {
  id: number;
  customerId: number;
  customerName: string;
  fullAddress: string;
  city: string;
  ward: string;
  streetAddress: string;
  latitude: number;
  longitude: number;
  distanceFromFarmKm: number;
  distanceCalculatedAt: string;
  recipientPhone: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
  customerAddressId: number;
  customerAddress: CustomerAddress;
  createdAt: string;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  note?: string | null;
  promotionId?: number | null;
  promotion?: PromotionResponse | null;
  orderDetails: OrderDetailResponse[];
}

export interface OrderSearchParams extends PagingRequest {
  search?: string;
  status?: OrderStatus | string;
  customerId?: number;
  createdFrom?: number;
  createdTo?: number;
  minTotalAmount?: number;
  maxTotalAmount?: number;
  hasPromotion?: boolean;
  orderNumber?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus | string;
  note?: string;
}

const baseUrl = "/api/Order";

export const orderService = {
  getAllOrders: async (
    request: OrderSearchParams
  ): Promise<BaseResponse<PagedResponse<OrderResponse>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<
      BaseResponse<PagedResponse<OrderResponse>>
    >(`${baseUrl}/all`, { ...filter });
    return response.data;
  },

  getCustomerOrders: async (
    request: OrderSearchParams
  ): Promise<BaseResponse<PagedResponse<OrderResponse>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<
      BaseResponse<PagedResponse<OrderResponse>>
    >(`${baseUrl}/customer/me`, { ...filter });
    return response.data;
  },

  getOrderById: async (id: number): Promise<BaseResponse<OrderResponse>> => {
    const response = await apiService.get<BaseResponse<OrderResponse>>(
      `${baseUrl}/${id}`
    );
    return response.data;
  },

  updateOrderStatus: async (
    orderId: number,
    request: UpdateOrderStatusRequest
  ): Promise<BaseResponse<OrderResponse>> => {
    const response = await apiService.put<
      BaseResponse<OrderResponse>,
      Record<string, unknown>
    >(
      `${baseUrl}/${orderId}/status`,
      request as unknown as Record<string, unknown>
    );
    return response.data;
  },
};

export default orderService;
