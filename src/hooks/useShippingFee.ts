import { useMutation } from "@tanstack/react-query";
import {
  shippingFeeService,
  ShippingFeeCalculateRequest,
} from "@/lib/api/services/fetchShippingFee";

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
  });
}
