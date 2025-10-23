import { ApiError, BaseResponse, PagedResponse } from "@/lib/api/apiClient";
import varietyService, {
  VarietyRequest,
  VarietyResponse,
  VarietySearchParams,
} from "@/lib/api/services/fetchVariety";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface VarietyUpdatePayload {
  id: number;
  variety: Partial<VarietyRequest>;
}

export function useGetVarieties(request: VarietySearchParams) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["variety", request],
    queryFn: () => varietyService.getVarieties(request),
    enabled: isAuthenticated,
    select: (
      data: BaseResponse<PagedResponse<VarietyResponse>>
    ): PagedResponse<VarietyResponse> => data?.result,
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

export function useAddVariety() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variety: Partial<VarietyRequest>) =>
      varietyService.addVariety(variety),
    onSuccess: (data: BaseResponse<VarietyResponse>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["variety"] });
      }
      toast.success(data.message || "Tạo giống cá thành công");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật thông tin");
    },
  });
}

export function useUpdateVariety() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VarietyUpdatePayload) =>
      varietyService.updateVariety(payload.id, payload.variety),
    onSuccess: (data: BaseResponse<boolean>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["variety"] });
      }
      toast.success(data.message || "Chỉnh sửa giống cá thành công");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật thông tin");
    },
  });
}

export function useDeleteVariety() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => varietyService.deleteVariety(id),
    onSuccess: (data: BaseResponse<boolean>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["variety"] });
      }
      toast.success(data.message || "Xóa giống cá thành công");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật thông tin");
    },
  });
}
