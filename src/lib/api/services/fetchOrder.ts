import toRequestParams from "@/lib/utils/params";
import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";
import { KoiFishResponse } from "./fetchKoiFish";
import { PacketFishResponse } from "./fetchPacketFish";

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
  PENDING_PAYMENT = "PendingPayment",
  PAID = "Paid",
  CONFIRMED = "Confirmed",
  SHIPPED = "Shipped",
  CANCELLED = "Cancelled",
  COMPLETED = "Completed",
}

export interface OrderRespponse {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
  createdAt: string;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  promotionId?: number;
  promotionName?: string;
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
    request: OrderSearchParams,
  ): Promise<BaseResponse<PagedResponse<OrderRespponse>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<
      BaseResponse<PagedResponse<OrderRespponse>>
    >(`${baseUrl}/all`, { ...filter });
    return response.data;
  },

  getCustomerOrders: async (
    request: OrderSearchParams,
  ): Promise<BaseResponse<PagedResponse<OrderRespponse>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<
      BaseResponse<PagedResponse<OrderRespponse>>
    >(`${baseUrl}/customer/me`, { ...filter });
    return response.data;
  },

  getOrderById: async (id: number): Promise<BaseResponse<OrderRespponse>> => {
    const response = await apiService.get<BaseResponse<OrderRespponse>>(
      `${baseUrl}/${id}`,
    );
    return response.data;
  },

  updateOrderStatus: async (
    orderId: number,
    request: UpdateOrderStatusRequest,
  ): Promise<BaseResponse<OrderRespponse>> => {
    const response = await apiService.put<
      BaseResponse<OrderRespponse>,
      Record<string, unknown>
    >(
      `${baseUrl}/${orderId}/status`,
      request as unknown as Record<string, unknown>,
    );
    return response.data;
  },
};

export default orderService;
