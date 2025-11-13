import { BaseResponse, PagedResponse } from "@/lib/api/apiClient";
import {
  WaterParameterThreshold,
  WaterParameterThresholdSearchParams,
  CreateWaterParameterThresholdRequest,
  CreateWaterParameterThresholdResponse,
  UpdateWaterParameterThresholdRequest,
  UpdateWaterParameterThresholdResponse,
} from "@/lib/api/services/fetchWaterParameterThreshold";
import waterParameterThresholdService from "@/lib/api/services/fetchWaterParameterThreshold";
import { useAuthStore } from "@/store/auth-store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import toast from "react-hot-toast";

/**
 * Hook to fetch water parameter thresholds with pagination
 */
export function useGetWaterParameterThresholds(
  params: WaterParameterThresholdSearchParams,
) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<
    BaseResponse<PagedResponse<WaterParameterThreshold>>,
    ApiError,
    PagedResponse<WaterParameterThreshold>
  >({
    queryKey: [
      "water-parameter-thresholds",
      params.parameterName,
      params.pondTypeId,
      params.pageIndex,
      params.pageSize,
    ],
    queryFn: () =>
      waterParameterThresholdService.getWaterParameterThresholds(params),
    enabled: isAuthenticated,
    select: (data: BaseResponse<PagedResponse<WaterParameterThreshold>>) =>
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
 * Hook to create a new water parameter threshold
 */
export function useCreateWaterParameterThreshold() {
  const queryClient = useQueryClient();

  return useMutation<
    BaseResponse<CreateWaterParameterThresholdResponse>,
    ApiError,
    CreateWaterParameterThresholdRequest
  >({
    mutationFn: (data) =>
      waterParameterThresholdService.createWaterParameterThreshold(data),
    onSuccess: () => {
      // Invalidate water parameter thresholds query to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["water-parameter-thresholds"],
      });
      toast.success("Tạo ngưỡng thành công");
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Có lỗi xảy ra khi tạo ngưỡng");
    },
  });
}

/**
 * Hook to update a water parameter threshold
 */
export function useUpdateWaterParameterThreshold() {
  const queryClient = useQueryClient();

  return useMutation<
    BaseResponse<UpdateWaterParameterThresholdResponse>,
    ApiError,
    { id: number; data: UpdateWaterParameterThresholdRequest }
  >({
    mutationFn: ({ id, data }) =>
      waterParameterThresholdService.updateWaterParameterThreshold(id, data),
    onSuccess: () => {
      // Invalidate water parameter thresholds query to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["water-parameter-thresholds"],
      });
      toast.success("Cập nhật ngưỡng thành công");
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Có lỗi xảy ra khi cập nhật ngưỡng");
    },
  });
}

/**
 * Hook to delete a water parameter threshold
 */
export function useDeleteWaterParameterThreshold() {
  const queryClient = useQueryClient();

  return useMutation<BaseResponse<boolean>, ApiError, number>({
    mutationFn: (id) =>
      waterParameterThresholdService.deleteWaterParameterThreshold(id),
    onSuccess: () => {
      // Invalidate water parameter thresholds query to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["water-parameter-thresholds"],
      });
      toast.success("Xóa ngưỡng thành công");
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Có lỗi xảy ra khi xóa ngưỡng");
    },
  });
}
