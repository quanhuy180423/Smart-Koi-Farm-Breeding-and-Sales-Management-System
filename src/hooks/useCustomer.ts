import { BaseResponse, PagedResponse } from "@/lib/api/apiClient";
import {
  Customer,
  CustomerSearchParams,
} from "@/lib/api/services/fetchCustomer";
import customerService from "@/lib/api/services/fetchCustomer";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";

/**
 * Hook to fetch customers with pagination and search
 */
export function useGetCustomers(params: CustomerSearchParams) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<
    BaseResponse<PagedResponse<Customer>>,
    ApiError,
    PagedResponse<Customer>
  >({
    queryKey: [
      "customers",
      params.pageIndex,
      params.pageSize,
      params.search,
      params.isActive,
      params.minTotalSpent,
      params.maxTotalSpent,
      params.minTotalOrders,
      params.maxTotalOrders,
      params.createdFrom,
      params.createdTo,
      params.contactNumber,
    ],
    queryFn: () => customerService.getCustomers(params),
    enabled: isAuthenticated,
    select: (data: BaseResponse<PagedResponse<Customer>>) =>
      data?.result || {
        pageIndex: 1,
        totalPages: 0,
        totalItems: 0,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [],
      },
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
