import { BaseResponse, PagedResponse } from "@/lib/api/apiClient";
import {
  PondRequest,
  PondResponse,
  PondSearchParams,
  pondService,
} from "@/lib/api/services/fetchPond";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import toast from "react-hot-toast";

interface PondUpdatePayload {
  id: number;
  pond: Partial<PondRequest>;
}

export function useGetPonds(request: PondSearchParams) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["ponds", request],
    queryFn: () => pondService.getPonds(request),
    enabled: isAuthenticated,
    select: (
      data: BaseResponse<PagedResponse<PondResponse>>
    ): PagedResponse<PondResponse> => data?.result,
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

export function useAddPond() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pond: Partial<PondRequest>) => pondService.addPond(pond),
    onSuccess: (data: BaseResponse<PondResponse>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["ponds"] });
      }
      toast.success(data.message || "Tạo hồ thành công");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật thông tin");
    },
  });
}

export function useUpdatePond() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PondUpdatePayload) =>
      pondService.updatePond(payload.id, payload.pond),
    onSuccess: (data: BaseResponse<boolean>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["ponds"] });
      }
      toast.success(data.message || "Chỉnh sửa hồ thành công");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật thông tin");
    },
  });
}

export function useDeletePond() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => pondService.deletePond(id),
    onSuccess: (data: BaseResponse<string>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["ponds"] });
      }
      toast.success(data.message || "Xóa sửa hồ thành công");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật thông tin");
    },
  });
}
