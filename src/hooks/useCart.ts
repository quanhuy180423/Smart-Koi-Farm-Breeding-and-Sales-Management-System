import { OrderRespponse } from "@/lib/api/services/fetchOrder";
import {
  CartItemRequest,
  CartItemResponse,
  CartItemUpdateRequest,
  CartResponse,
  cartService,
  ConverCartToOrderRequest,
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
      toast.error(
        error.error?.result || "Có lỗi xảy ra khi cập nhật thông tin"
      );
    },
  });
}

export interface UpdateItemPayload {
  id: number;
  item: Partial<CartItemUpdateRequest>;
}

export function useUpdateItem() {
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
        error.error?.result || "Có lỗi xảy ra khi cập nhật thông tin"
      );
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
        error.error?.result || "Có lỗi xảy ra khi cập nhật thông tin"
      );
    },
  });
}

export function useConverCartToOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: Partial<ConverCartToOrderRequest>) =>
      cartService.converCartToOrder(request),
    onSuccess: (data: BaseResponse<OrderRespponse>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
    onError: (error: ApiError) => {
      toast.error(
        error.error?.result || "Có lỗi xảy ra khi cập nhật thông tin"
      );
    },
  });
}
