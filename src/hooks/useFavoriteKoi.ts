import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError, BaseResponse } from "@/lib/api/apiClient";
import favoriteKoiService from "@/lib/api/services/fetchFavoriteKoi";
import { useAuthStore } from "@/store/auth-store";
import toast from "react-hot-toast";

/**
 * Hook kiểm tra cá có trong danh sách yêu thích không
 */
export function useCheckFavorite(koiFishId: number) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["favorite-koi", "check", koiFishId],
    queryFn: () => favoriteKoiService.checkFavorite(koiFishId),
    enabled: isAuthenticated && koiFishId !== undefined && koiFishId !== 0,
    select: (data: BaseResponse<{ isFavorite: boolean }>): boolean =>
      data.result.isFavorite,
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
 * Hook thêm cá vào danh sách yêu thích
 */
export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (koiFishId: number) =>
      favoriteKoiService.addFavorite(koiFishId),
    onSuccess: (
      data: BaseResponse<{ isFavorite: boolean }>,
      koiFishId: number,
    ) => {
      queryClient.invalidateQueries({ queryKey: ["favorite-koi"] });
      queryClient.setQueryData(["favorite-koi", "check", koiFishId], {
        ...data,
        result: true,
      });
      toast.success(data.message || "Đã thêm cá vào danh sách yêu thích");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.error?.result ||
          error.message ||
          "Có lỗi xảy ra khi thêm vào yêu thích",
      );
    },
  });
}

/**
 * Hook xóa cá khỏi danh sách yêu thích
 */
export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (koiFishId: number) =>
      favoriteKoiService.removeFavorite(koiFishId),
    onSuccess: (
      data: BaseResponse<{ isFavorite: boolean }>,
      koiFishId: number,
    ) => {
      queryClient.invalidateQueries({ queryKey: ["favorite-koi"] });
      queryClient.setQueryData(["favorite-koi", "check", koiFishId], {
        ...data,
        result: false,
      });
      toast.success(data.message || "Đã xóa cá khỏi danh sách yêu thích");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.error?.result ||
          error.message ||
          "Có lỗi xảy ra khi xóa khỏi yêu thích",
      );
    },
  });
}

/**
 * Hook toggle yêu thích (thêm/xóa)
 */
export function useToggleFavorite() {
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const toggleFavorite = (koiFishId: number, isFavorite: boolean) => {
    if (isFavorite) {
      removeFavorite.mutate(koiFishId);
    } else {
      addFavorite.mutate(koiFishId);
    }
  };

  return {
    toggleFavorite,
    isLoading: addFavorite.isPending || removeFavorite.isPending,
  };
}
