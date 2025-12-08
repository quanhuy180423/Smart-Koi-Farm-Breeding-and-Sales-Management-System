import { OrderResponse } from "@/lib/api/services/fetchOrder";
import {
  CartItemRequest,
  CartItemResponse,
  CartItemUpdateRequest,
  CartResponse,
  cartService,
  ConvertCartToOrderRequest,
} from "./../lib/api/services/fetchCart";
import { ApiError, BaseResponse } from "@/lib/api/apiClient";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useGetCart() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart(),
    enabled: isAuthenticated,
    select: (data: BaseResponse<CartResponse>): CartResponse => data.result,
    staleTime: 30 * 1000, // 30 giây - tránh refetch tự động
    gcTime: 5 * 60 * 1000, // 5 phút - cache data
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

export function useAddItemToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: Partial<CartItemRequest>) =>
      cartService.addItemToCart(request),
    onSuccess: (data: BaseResponse<CartItemResponse>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
      toast.success(data.message || "Thêm sản phẩm vào giỏ hàng thành công");
    },
    onError: (error: ApiError) => {
      if (error.status === 401)
        toast.error("Bạn cần đăng nhập để dùng tính năng này.");
      else
        toast.error(
          error.error?.result || "Có lỗi xảy ra khi cập nhật thông tin",
        );
    },
  });
}

export interface UpdateItemPayload {
  id: number;
  item: Partial<CartItemUpdateRequest>;
}

export function useUpdateItem(ononErrorCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateItemPayload) =>
      cartService.updateItem(request.id, request.item),
    onSuccess: (data: BaseResponse<CartItemResponse>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
      //   toast.success(data.message || "Chỉnh sửa sản phẩm thành công");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.error?.result || "Có lỗi xảy ra khi cập nhật thông tin",
      );
      ononErrorCallback?.();
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cartService.deleteItem(id),
    onSuccess: (data: BaseResponse<boolean>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
      //   toast.success(data.message || "Xóa sản phẩm thành công");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.error?.result || "Có lỗi xảy ra khi cập nhật thông tin",
      );
    },
  });
}

export function useConverCartToOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: Partial<ConvertCartToOrderRequest>) =>
      cartService.converCartToOrder(request),
    onSuccess: (data: BaseResponse<OrderResponse>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
    onError: () => {
      toast.error(
        "Hiện không thể thanh toán đơn hàng này do có sản phẩm đã hết hàng",
      );
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
