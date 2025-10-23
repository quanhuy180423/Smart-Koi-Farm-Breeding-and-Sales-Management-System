import { ApiError, BaseResponse, PagedResponse } from "@/lib/api/apiClient";
import {
  PondTypeRequest,
  PondTypeResponse,
  PondTypeSearchParams,
  pondTypeService,
} from "@/lib/api/services/fetchPondType";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface PondTypeUpdatePayload {
  id: number;
  pondType: Partial<PondTypeRequest>;
}

export function useGetPondTypes(request: PondTypeSearchParams) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["pond-types", request],
    queryFn: () => pondTypeService.getPondTypes(request),
    enabled: isAuthenticated,
    select: (
      data: BaseResponse<PagedResponse<PondTypeResponse>>
    ): PagedResponse<PondTypeResponse> => data?.result,
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

export function useAddPondType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pondType: Partial<PondTypeRequest>) =>
      pondTypeService.addPondType(pondType),
    onSuccess: (data: BaseResponse<PondTypeRequest>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["pond-types"] });
      }
      toast.success(data.message || "Tạo loại hồ thành công");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật thông tin");
    },
  });
}

export function useUpdatePondType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PondTypeUpdatePayload) =>
      pondTypeService.updatePondType(payload.id, payload.pondType),
    onSuccess: (data: BaseResponse<boolean>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["pond-types"] });
      }
      toast.success(data.message || "Chỉnh sửa loại hồ thành công");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật thông tin");
    },
  });
}

export function useDeletePondType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => pondTypeService.deletePondType(id),
    onSuccess: (data: BaseResponse<boolean>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["pond-types"] });
      }
      toast.success(data.message || "Xóa lại hồ thành công");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật thông tin");
    },
  });
}
