import { useQuery } from "@tanstack/react-query";
import paymentTransactionService, {
  PaymentTransactionSearchParams,
} from "@/lib/api/services/fetchPaymentTransaction";

export const useGetPaymentTransactions = (
  params: PaymentTransactionSearchParams,
) => {
  return useQuery({
    queryKey: ["payment-transactions", params],
    queryFn: async () => {
      const response =
        await paymentTransactionService.getPaymentTransactions(params);

      if (!response.isSuccess) {
        throw new Error(
          response.message || "Failed to fetch payment transactions",
        );
      }

      return response.result;
    },
    retry: 1,
    enabled: true,
  });
};
