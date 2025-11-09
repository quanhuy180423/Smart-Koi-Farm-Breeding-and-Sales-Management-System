import { BaseResponse } from "@/lib/api/apiClient";
import {
  StaffSearchParams,
  StaffPagedResponse,
} from "@/lib/api/services/fetchUsers";
import usersService from "@/lib/api/services/fetchUsers";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";

/**
 * Hook to fetch staff users by role with pagination and search
 */
export function useGetStaffByRole(params: StaffSearchParams) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<
    BaseResponse<StaffPagedResponse>,
    ApiError,
    StaffPagedResponse
  >({
    queryKey: [
      "staff-by-role",
      params.role,
      params.pageIndex,
      params.pageSize,
      params.search,
    ],
    queryFn: () => usersService.getStaffByRole(params),
    enabled: isAuthenticated && !!params.role,
    select: (data: BaseResponse<StaffPagedResponse>) =>
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
