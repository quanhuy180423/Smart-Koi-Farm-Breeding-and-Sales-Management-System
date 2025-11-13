import { BaseResponse } from "@/lib/api/apiClient";
import {
  CustomerPagedResponse,
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
    BaseResponse<CustomerPagedResponse>,
    ApiError,
    CustomerPagedResponse
  >({
    queryKey: ["customers", params.pageIndex, params.pageSize, params.search],
    queryFn: () => customerService.getCustomers(params),
    enabled: isAuthenticated,
    select: (data: BaseResponse<CustomerPagedResponse>) =>
      data?.result || {
        pageIndex: 1,
        totalPages: 0,
        totalItems: 0,
        hasPreviousPage: false,
        hasNextPage: false,
        datas: [],
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
