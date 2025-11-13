import { BaseResponse, PagedResponse } from "@/lib/api/apiClient";
import {
  UserSearchParams,
  User,
  CreateStaffAccountRequest,
  CreateStaffAccountResponse,
  ImportAccountsResponse,
  UserDetails,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "@/lib/api/services/fetchUsers";
import usersService from "@/lib/api/services/fetchUsers";
import { useAuthStore } from "@/store/auth-store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import toast from "react-hot-toast";

/**
 * Hook to fetch current user details
 */
export function useGetUserDetails() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<BaseResponse<UserDetails>, ApiError, UserDetails>({
    queryKey: ["user-details"],
    queryFn: () => usersService.getUserDetails(),
    enabled: isAuthenticated,
    select: (data: BaseResponse<UserDetails>) => data?.result,
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

/**
 * Hook to fetch users by role with pagination and search
 */
export function useGetUserByRole(params: UserSearchParams) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<
    BaseResponse<PagedResponse<User>>,
    ApiError,
    PagedResponse<User>
  >({
    queryKey: [
      "users-by-role",
      params.role,
      params.pageIndex,
      params.pageSize,
      params.search,
    ],
    queryFn: () => usersService.getUserByRole(params),
    enabled: isAuthenticated,
    select: (data: BaseResponse<PagedResponse<User>>) =>
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

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<
    BaseResponse<UpdateProfileResponse>,
    ApiError,
    UpdateProfileRequest
  >({
    mutationFn: (data) => usersService.updateProfile(data),
    onSuccess: () => {
      // Invalidate user details query to refresh
      queryClient.invalidateQueries({
        queryKey: ["user-details"],
      });
      toast.success("Cập nhật thông tin cá nhân thành công");
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Có lỗi xảy ra khi cập nhật thông tin.");
    },
  });
}
