import { BaseResponse, PagedResponse } from "@/lib/api/apiClient";
import koiFishService, {
  KoiFishFamilyResponse,
  KoiFishResponse,
  KoiFishSearchParams,
  KoiFishUpdateRequest,
} from "@/lib/api/services/fetchKoiFish";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import toast from "react-hot-toast";

export interface KoiFishUpdatePayloads {
  request: Partial<KoiFishUpdateRequest>;
  id: number;
}

export function useGetKoiFishes(request: KoiFishSearchParams) {
  return useQuery({
    queryKey: ["koi-fishes", request],
    queryFn: () => koiFishService.getKoiFishes(request),
    select: (
      data: BaseResponse<PagedResponse<KoiFishResponse>>,
    ): PagedResponse<KoiFishResponse> => data.result,
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

export function useGetKoiFishFamily(id: number | undefined) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["koi-fishes-family", id],
    queryFn: () => koiFishService.getKoiFishFamily(id),
    enabled: isAuthenticated && id !== undefined && id !== 0,
    select: (
      data: BaseResponse<KoiFishFamilyResponse>,
    ): KoiFishFamilyResponse => data.result,
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

export function useGetKoiFishById(id?: number) {
  return useQuery({
    queryKey: ["koi-fishes", id],
    queryFn: () => koiFishService.getKoiFishById(id),
    enabled: id !== undefined && id !== 0,
    select: (data: BaseResponse<KoiFishResponse>): KoiFishResponse =>
      data.result,
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

export function useUpdateKoiFish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: KoiFishUpdatePayloads) =>
      koiFishService.updateKoiFish(payload.id, payload.request),
    onSuccess: (data: BaseResponse<string>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["koi-fishes"] });
      }
      toast.success(data.message || "Chỉnh sửa cá Koi thành công");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật thông tin");
    },
  });
}

export function useDeleteKoiFish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => koiFishService.deleteKoiFish(id),
    onSuccess: (data: BaseResponse<string>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["koi-fishes"] });
      }
      toast.success(data.message || "Xóa cá Koi thành công");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi xóa cá Koi");
    },
  });
}
