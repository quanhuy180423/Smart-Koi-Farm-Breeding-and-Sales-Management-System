import { BaseResponse } from "@/lib/api/apiClient";
import {
  UserSearchParams,
  UserPagedResponse,
  CreateStaffAccountRequest,
  CreateStaffAccountResponse,
  ImportAccountsResponse,
} from "@/lib/api/services/fetchUsers";
import usersService from "@/lib/api/services/fetchUsers";
import { useAuthStore } from "@/store/auth-store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import toast from "react-hot-toast";

/**
 * Hook to fetch users by role with pagination and search
 */
export function useGetUserByRole(params: UserSearchParams) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<BaseResponse<UserPagedResponse>, ApiError, UserPagedResponse>(
    {
      queryKey: [
        "users-by-role",
        params.role,
        params.pageIndex,
        params.pageSize,
        params.search,
      ],
      queryFn: () => usersService.getUserByRole(params),
      enabled: isAuthenticated,
      select: (data: BaseResponse<UserPagedResponse>) =>
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
    },
  );
}

/**
 * Hook to create a new staff account
 */
export function useCreateStaffAccount() {
  const queryClient = useQueryClient();

  return useMutation<
    BaseResponse<CreateStaffAccountResponse>,
    ApiError,
    CreateStaffAccountRequest
  >({
    mutationFn: (data) => usersService.createStaffAccount(data),
    onSuccess: () => {
      // Invalidate users query to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["users-by-role"],
      });
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Có lỗi xảy ra khi tạo tài khoản.");
    },
  });
}

/**
 * Hook to toggle block/unblock a user account
 */
export function useToggleAccountBlock() {
  const queryClient = useQueryClient();

  return useMutation<BaseResponse<boolean>, ApiError, number>({
    mutationFn: (userId) => usersService.toggleBlockAccount(userId),
    onSuccess: () => {
      // Invalidate users query to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["users-by-role"],
      });
    },
  });
}

/**
 * Hook to import staff accounts from Excel file
 */
export function useImportStaffAccounts() {
  const queryClient = useQueryClient();

  return useMutation<BaseResponse<ImportAccountsResponse>, ApiError, File>({
    mutationFn: (file) => usersService.importStaffAccounts(file),
    onSuccess: () => {
      // Invalidate users query to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["users-by-role"],
      });
    },
  });
}
