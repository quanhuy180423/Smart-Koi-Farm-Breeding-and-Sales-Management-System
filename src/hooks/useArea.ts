import { BaseResponse } from "@/lib/api/apiClient";
import areaService, { Area, AreaRequest, SuccessResponse } from "@/lib/api/services/fetchArea";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import toast from "react-hot-toast";

interface AreaUpdatePayload {
  id: number;
  area: Partial<AreaRequest>;
}

// Get area hooks
export function useArea() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["area"],
    queryFn: () => areaService.getAreas(),
    enabled: isAuthenticated,
    select: (data: BaseResponse<Area[]>): BaseResponse<Area[]> => ({
      statusCode: data.statusCode,
      isSuccess: data.isSuccess,
      message: data.message,
      result: data.result || [],
    }),
    retry: (failureCount, error: unknown) => {
      // Don't retry on 401 errors
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 401
      ) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
  });
}
// Get area by id hook

// Add area hook
export function useAddArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (areaData: Partial<AreaRequest>) =>
      areaService.addArea(areaData),
    onSuccess: (data: BaseResponse<SuccessResponse<Area>>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["area"] });
      }
      toast.success(data.result.message || "Tạo khu vực thành công");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật thông tin");
    },
  });
}

// Edit area hook
export function useUpdateArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AreaUpdatePayload) =>
      areaService.updateArea(payload.id, payload.area),
    onSuccess: (data: BaseResponse<string>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["area"] });
      }
      toast.success(data.result || "Chỉnh sửa khu vực thành công");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật thông tin");
    },
  });
}

// Delete area hook
export function useDeleteArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      areaService.deleteArea(id),
    onSuccess: (data: BaseResponse<string>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["area"] });
      }
      toast.success(data.result || "Xóa sửa khu vực thành công");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật thông tin");
    },
  });
}
