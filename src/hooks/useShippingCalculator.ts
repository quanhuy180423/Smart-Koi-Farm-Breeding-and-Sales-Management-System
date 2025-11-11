import { useMutation } from "@tanstack/react-query";
import {
  shippingBoxService,
  CalculateShippingRequest,
} from "@/lib/api/services/fetchShippingBox";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api/apiClient";

export function useCalculateShippingBox() {
  return useMutation({
    mutationFn: (request: CalculateShippingRequest) =>
      shippingBoxService.calculateShippingBox(request),
    onError: (error: ApiError) => {
      toast.error(
        error.error?.result || "Có lỗi xảy ra khi tính toán phí vận chuyển",
      );
    },
  });
}
