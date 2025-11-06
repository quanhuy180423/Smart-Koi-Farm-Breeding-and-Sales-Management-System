import { BaseResponse, PagedResponse } from "@/lib/api/apiClient";
import orderService, {
  OrderRespponse,
  OrderSearchParams,
  UpdateOrderStatusRequest,
} from "@/lib/api/services/fetchOrder";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useGetAllOrders(request: OrderSearchParams) {
  return useQuery({
    queryKey: ["orders", request],
    queryFn: () => orderService.getAllOrders(request),
    select: (data: BaseResponse<PagedResponse<OrderRespponse>>) => data.result,
    retry: (failureCount, error: unknown) => {
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 401
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function useGetCustomerOrders(request: OrderSearchParams) {
  return useQuery({
    queryKey: ["customer-orders", request],
    queryFn: () => orderService.getCustomerOrders(request),
    select: (data: BaseResponse<PagedResponse<OrderRespponse>>) => data.result,
    retry: (failureCount, error: unknown) => {
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 401
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function useGetOrderById(id?: number) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => orderService.getOrderById(id!),
    enabled: id !== undefined && id !== 0,
    select: (data: BaseResponse<OrderRespponse>) => data.result,
    retry: (failureCount, error: unknown) => {
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 401
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      request,
    }: {
      orderId: number;
      request: UpdateOrderStatusRequest;
    }) => orderService.updateOrderStatus(orderId, request),
    onSuccess: (data, variables) => {
      // Invalidate all order-related queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
      queryClient.invalidateQueries({
        queryKey: ["orders", variables.orderId],
      });
    },
  });
}
