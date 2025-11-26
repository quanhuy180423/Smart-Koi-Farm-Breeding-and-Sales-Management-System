import { useMutation } from "@tanstack/react-query";
import {
  shippingFeeService,
  ShippingFeeCalculateRequest,
} from "@/lib/api/services/fetchShippingFee";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api/apiClient";

export function useCalculateShippingFee() {
  return useMutation({
    mutationFn: async (request: ShippingFeeCalculateRequest) => {
      try {
        const result = await shippingFeeService.calculateShippingFee(request);
        return result;
      } catch (error) {
        throw error;
      }
    },
    onError: (error: ApiError) => {
      toast.error(
        error.error?.result ||
          error.message ||
          "Có lỗi xảy ra khi tính phí vận chuyển",
      );
    },
  });
}
