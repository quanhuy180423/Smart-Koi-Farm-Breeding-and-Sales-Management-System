import apiService, { BaseResponse } from "../apiClient";

// Enums
export enum PaymentMethod {
  VNPAY = "VnPay",
  PAYOS = "PayOS",
}

// Interfaces
export interface CreatePaymentRequest {
  orderId: number;
  method: PaymentMethod;
}

export interface OrderPaymentResponse {
  paymentUrl: string;
  orderId: number;
}

const baseUrl = "/api/OrderPayment";

export const orderPaymentService = {
  createPayment: async (
    orderId: number,
    method: PaymentMethod,
  ): Promise<BaseResponse<OrderPaymentResponse>> => {
    const response = await apiService.post<
      BaseResponse<OrderPaymentResponse>,
      Record<string, never>
    >(`${baseUrl}/create-payment/${orderId}?method=${method}`, {});
    return response.data;
  },
};

export default orderPaymentService;
