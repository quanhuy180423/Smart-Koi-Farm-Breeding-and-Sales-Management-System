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

/**
 * Hook to batch create or update water parameter thresholds
 * Shows a single toast notification for the entire batch operation
 */
export function useBatchWaterParameterThreshold() {
  const queryClient = useQueryClient();
  const createThreshold = useCreateWaterParameterThreshold();
  const updateThreshold = useUpdateWaterParameterThreshold();

  const batchProcess = async (
    requests: Array<{
      paramName: string;
      config: {
        name: string;
        label: string;
        unit: string;
        placeholder: string;
      };
      minValue: number;
      maxValue: number;
      id?: number;
    }>,
    pondTypeId: number,
    mode: "create" | "update",
  ): Promise<void> => {
    let successCount = 0;
    let errorCount = 0;

    if (mode === "create") {
      const createPromises = requests.map((req) => {
        return new Promise<void>((resolve) => {
          createThreshold.mutate(
            {
              parameterName: req.paramName,
              unit: req.config.unit,
              minValue: req.minValue,
              maxValue: req.maxValue,
              pondTypeId,
            },
            {
              onSuccess: () => {
                successCount++;
                resolve();
              },
              onError: () => {
                errorCount++;
                resolve(); // Still resolve to continue with other creates
              },
            },
          );
        });
      });

      await Promise.all(createPromises);
      if (successCount > 0) {
        toast.success(`Tạo ${successCount} thông số nước thành công`, {
          duration: 3000,
        });
      }

      if (errorCount > 0) {
        toast.success(`Có ${successCount} lỗi khi tạo thông số nước`, {
          duration: 3000,
        });
      }
    } else {
      // Update mode
      const updateRequests = requests.filter((req) => req.id);
      const updatePromises = updateRequests.map((req) => {
        return new Promise<void>((resolve) => {
          updateThreshold.mutate(
            {
              id: req.id!,
              data: {
                parameterName: req.paramName,
                unit: req.config.unit,
                minValue: req.minValue,
                maxValue: req.maxValue,
                pondTypeId,
              },
            },
            {
              onSuccess: () => {
                successCount++;
                resolve();
              },
              onError: () => {
                errorCount++;
                resolve(); // Still resolve to continue with other updates
              },
            },
          );
        });
      });

      await Promise.all(updatePromises);
      if (successCount > 0) {
        toast.success(`Cập nhật ${successCount} thông số nước thành công`, {
          duration: 3000,
        });
      }

      if (errorCount > 0) {
        toast.success(`Có ${successCount} lỗi khi cập nhật thông số nước`, {
          duration: 3000,
        });
      }
    }

    // Invalidate queries after all operations complete
    queryClient.invalidateQueries({
      queryKey: ["water-parameter-thresholds"],
    });
  };

  return {
    batchProcess,
    isPending: createThreshold.isPending || updateThreshold.isPending,
  };
}
