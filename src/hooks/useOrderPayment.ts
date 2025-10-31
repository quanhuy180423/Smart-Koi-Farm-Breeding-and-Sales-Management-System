import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ApiError, BaseResponse } from "@/lib/api/apiClient";
import {
  PaymentMethod,
  OrderPaymentResponse,
  orderPaymentService,
} from "@/lib/api/services/fetchOrderPayment";

export function useCreatePayment() {
  return useMutation({
    mutationFn: (payload: { orderId: number; method: PaymentMethod }) =>
      orderPaymentService.createPayment(payload.orderId, payload.method),
    onSuccess: (data: BaseResponse<OrderPaymentResponse>) => {
      if (data.isSuccess && data.result?.paymentUrl) {
        console.log("Payment URL from API:", data.result.paymentUrl);
        // Chuyển hướng tới trang thanh toán VNPay
        window.location.href = data.result.paymentUrl;
      } else {
        console.error("Payment creation failed:", data);
        toast.error(data.message || "Không thể tạo liên kết thanh toán");
      }
    },
    onError: (error: ApiError) => {
      console.error("Payment error:", error);
      toast.error(
        error.error?.result ||
          error.message ||
          "Có lỗi xảy ra khi tạo thanh toán",
      );
    },
  });
}
