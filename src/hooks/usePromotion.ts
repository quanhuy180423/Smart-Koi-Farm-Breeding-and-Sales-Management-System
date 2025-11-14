import { BaseResponse, PagedResponse } from "@/lib/api/apiClient";
import {
  PromotionResponse,
  PromotionSearchParams,
  PromotionRequest,
} from "@/lib/api/services/fetchPromotion";
import promotionService from "@/lib/api/services/fetchPromotion";
import { useAuthStore } from "@/store/auth-store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import toast from "react-hot-toast";

/**
 * Hook to fetch promotions with pagination and filtering
 */
export function useGetPromotions(params: PromotionSearchParams) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<
    BaseResponse<PagedResponse<PromotionResponse>>,
    ApiError,
    PagedResponse<PromotionResponse>
  >({
    queryKey: [
      "promotions",
      params.pageIndex,
      params.pageSize,
      params.search,
      params.isActive,
      params.discountType,
      params.availableOnDate,
    ],
    queryFn: () => promotionService.getPromotions(params),
    enabled: isAuthenticated,
    select: (data: BaseResponse<PagedResponse<PromotionResponse>>) =>
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

interface UseCreatePromotionOptions {
  onSuccess?: (data: PromotionResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to create a new promotion
 */
export function useCreatePromotion(options?: UseCreatePromotionOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: PromotionRequest) => {
      const response = await promotionService.createPromotion(request);
      return response;
    },
    onSuccess: (data: BaseResponse<PromotionResponse>) => {
      if (data.isSuccess) {
        toast.success(data.message || "Tạo khuyến mãi thành công!");
        queryClient.invalidateQueries({ queryKey: ["promotions"] });
        options?.onSuccess?.(data.result);
      } else {
        toast.error(data.message || "Tạo khuyến mãi thất bại");
      }
    },
    onError: (error: Error) => {
      const message = error.message || "Có lỗi xảy ra khi tạo khuyến mãi";
      toast.error(message);
      options?.onError?.(error);
    },
  });
}

interface UseUpdatePromotionOptions {
  onSuccess?: (data: PromotionResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to update an existing promotion
 */
export function useUpdatePromotion(options?: UseUpdatePromotionOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      request,
    }: {
      id: number;
      request: PromotionRequest;
    }) => {
      const response = await promotionService.updatePromotion(id, request);
      return response;
    },
    onSuccess: (data: BaseResponse<PromotionResponse>) => {
      if (data.isSuccess) {
        toast.success(data.message || "Cập nhật khuyến mãi thành công!");
        queryClient.invalidateQueries({ queryKey: ["promotions"] });
        options?.onSuccess?.(data.result);
      } else {
        toast.error(data.message || "Cập nhật khuyến mãi thất bại");
      }
    },
    onError: (error: Error) => {
      const message = error.message || "Có lỗi xảy ra khi cập nhật khuyến mãi";
      toast.error(message);
      options?.onError?.(error);
    },
  });
}

interface UseDeletePromotionOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to delete a promotion
 */
export function useDeletePromotion(options?: UseDeletePromotionOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await promotionService.deletePromotion(id);
      return response;
    },
    onSuccess: (data: BaseResponse<boolean>) => {
      if (data.isSuccess) {
        toast.success(data.message || "Xóa khuyến mãi thành công!");
        queryClient.invalidateQueries({ queryKey: ["promotions"] });
        options?.onSuccess?.();
      } else {
        toast.error(data.message || "Xóa khuyến mãi thất bại");
      }
    },
    onError: (error: Error) => {
      const message = error.message || "Có lỗi xảy ra khi xóa khuyến mãi";
      toast.error(message);
      options?.onError?.(error);
    },
  });
}
