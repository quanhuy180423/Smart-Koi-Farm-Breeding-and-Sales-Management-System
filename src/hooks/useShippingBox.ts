import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BaseResponse } from "@/lib/api/apiClient";
import {
  shippingBoxService,
  ShippingBoxResponse,
  ShippingBoxRule,
  CreateShippingBoxRequest,
  UpdateShippingBoxRequest,
  CreateShippingBoxRuleRequest,
  UpdateShippingBoxRuleRequest,
} from "@/lib/api/services/fetchShippingBox";
import toast from "react-hot-toast";

export function useGetAllShippingBoxes() {
  return useQuery({
    queryKey: ["shipping-boxes"],
    queryFn: () => shippingBoxService.getAllShippingBoxes(),
    select: (
      data: BaseResponse<ShippingBoxResponse[]>,
    ): ShippingBoxResponse[] => data.result,
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

export function useGetShippingBoxById(id?: number) {
  return useQuery({
    queryKey: ["shipping-boxes", id],
    queryFn: () => shippingBoxService.getShippingBoxById(id!),
    enabled: id !== undefined && id !== 0,
    select: (data: BaseResponse<ShippingBoxResponse>) => data.result,
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

export function useCreateShippingBox() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateShippingBoxRequest) =>
      shippingBoxService.createShippingBox(request),
    onSuccess: (data: BaseResponse<ShippingBoxResponse>) => {
      if (data.isSuccess) {
        toast.success(data.message || "Tạo hộp vận chuyển thành công");
        queryClient.invalidateQueries({ queryKey: ["shipping-boxes"] });
      } else {
        toast.error(data.message || "Không thể tạo hộp vận chuyển");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi tạo hộp vận chuyển");
    },
  });
}

export function useUpdateShippingBox() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: number;
      request: UpdateShippingBoxRequest;
    }) => shippingBoxService.updateShippingBox(id, request),
    onSuccess: (data: BaseResponse<boolean>) => {
      if (data.isSuccess) {
        toast.success(data.message || "Cập nhật hộp vận chuyển thành công");
        queryClient.invalidateQueries({ queryKey: ["shipping-boxes"] });
      } else {
        toast.error(data.message || "Không thể cập nhật hộp vận chuyển");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật hộp vận chuyển");
    },
  });
}

export function useDeleteShippingBox() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => shippingBoxService.deleteShippingBox(id),
    onSuccess: (data: BaseResponse<boolean>) => {
      if (data.isSuccess) {
        toast.success(data.message || "Xóa hộp vận chuyển thành công");
        queryClient.invalidateQueries({ queryKey: ["shipping-boxes"] });
      } else {
        toast.error(data.message || "Không thể xóa hộp vận chuyển");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi xóa hộp vận chuyển");
    },
  });
}

export function useGetShippingBoxRules(boxId?: number) {
  return useQuery({
    queryKey: ["shipping-box-rules", boxId],
    queryFn: () => shippingBoxService.getShippingBoxRules(boxId!),
    enabled: boxId !== undefined && boxId !== 0,
    select: (data: BaseResponse<ShippingBoxRule[]>) => data.result,
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

export function useCreateShippingBoxRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateShippingBoxRuleRequest) =>
      shippingBoxService.createShippingBoxRule(request),
    onSuccess: (data: BaseResponse<ShippingBoxRule>) => {
      if (data.isSuccess) {
        toast.success(data.message || "Tạo quy tắc vận chuyển thành công");
        queryClient.invalidateQueries({ queryKey: ["shipping-box-rules"] });
        queryClient.invalidateQueries({ queryKey: ["shipping-boxes"] });
      } else {
        toast.error(data.message || "Không thể tạo quy tắc vận chuyển");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi tạo quy tắc vận chuyển");
    },
  });
}

export function useUpdateShippingBoxRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ruleId,
      request,
    }: {
      ruleId: number;
      request: UpdateShippingBoxRuleRequest;
    }) => shippingBoxService.updateShippingBoxRule(ruleId, request),
    onSuccess: (data: BaseResponse<boolean>) => {
      if (data.isSuccess) {
        toast.success(data.message || "Cập nhật quy tắc vận chuyển thành công");
        queryClient.invalidateQueries({ queryKey: ["shipping-box-rules"] });
        queryClient.invalidateQueries({ queryKey: ["shipping-boxes"] });
      } else {
        toast.error(data.message || "Không thể cập nhật quy tắc vận chuyển");
      }
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Có lỗi xảy ra khi cập nhật quy tắc vận chuyển",
      );
    },
  });
}

export function useDeleteShippingBoxRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ruleId: number) =>
      shippingBoxService.deleteShippingBoxRule(ruleId),
    onSuccess: (data: BaseResponse<boolean>) => {
      if (data.isSuccess) {
        toast.success(data.message || "Xóa quy tắc vận chuyển thành công");
        queryClient.invalidateQueries({ queryKey: ["shipping-box-rules"] });
        queryClient.invalidateQueries({ queryKey: ["shipping-boxes"] });
      } else {
        toast.error(data.message || "Không thể xóa quy tắc vận chuyển");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi xóa quy tắc vận chuyển");
    },
  });
}
