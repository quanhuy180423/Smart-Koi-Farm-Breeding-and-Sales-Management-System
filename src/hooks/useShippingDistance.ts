import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BaseResponse } from "@/lib/api/apiClient";
import {
  shippingDistanceService,
  ShippingDistance,
  CreateShippingDistanceRequest,
  UpdateShippingDistanceRequest,
} from "@/lib/api/services/fetchShippingDistance";
import toast from "react-hot-toast";

export function useGetAllShippingDistances() {
  return useQuery({
    queryKey: ["shipping-distances"],
    queryFn: () => shippingDistanceService.getAllShippingDistances(),
    select: (data: BaseResponse<ShippingDistance[]>): ShippingDistance[] =>
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

export function useGetShippingDistanceById(id?: number) {
  return useQuery({
    queryKey: ["shipping-distances", id],
    queryFn: () => shippingDistanceService.getShippingDistanceById(id!),
    enabled: id !== undefined && id !== 0,
    select: (data: BaseResponse<ShippingDistance>) => data.result,
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

export function useCreateShippingDistance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateShippingDistanceRequest) =>
      shippingDistanceService.createShippingDistance(request),
    onSuccess: (data: BaseResponse<ShippingDistance>) => {
      if (data.isSuccess) {
        toast.success(data.message || "Tạo khoảng cách vận chuyển thành công");
        queryClient.invalidateQueries({ queryKey: ["shipping-distances"] });
      } else {
        toast.error(data.message || "Không thể tạo khoảng cách vận chuyển");
      }
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Có lỗi xảy ra khi tạo khoảng cách vận chuyển",
      );
    },
  });
}

export function useUpdateShippingDistance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: number;
      request: UpdateShippingDistanceRequest;
    }) => shippingDistanceService.updateShippingDistance(id, request),
    onSuccess: (data: BaseResponse<boolean>) => {
      if (data.isSuccess) {
        toast.success(
          data.message || "Cập nhật khoảng cách vận chuyển thành công",
        );
        queryClient.invalidateQueries({ queryKey: ["shipping-distances"] });
      } else {
        toast.error(
          data.message || "Không thể cập nhật khoảng cách vận chuyển",
        );
      }
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Có lỗi xảy ra khi cập nhật khoảng cách vận chuyển",
      );
    },
  });
}

export function useDeleteShippingDistance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      shippingDistanceService.deleteShippingDistance(id),
    onSuccess: (data: BaseResponse<boolean>) => {
      if (data.isSuccess) {
        toast.success(data.message || "Xóa khoảng cách vận chuyển thành công");
        queryClient.invalidateQueries({ queryKey: ["shipping-distances"] });
      } else {
        toast.error(data.message || "Không thể xóa khoảng cách vận chuyển");
      }
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Có lỗi xảy ra khi xóa khoảng cách vận chuyển",
      );
    },
  });
}
