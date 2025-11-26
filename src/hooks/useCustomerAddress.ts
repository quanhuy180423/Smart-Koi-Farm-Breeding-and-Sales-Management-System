import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, BaseResponse } from "@/lib/api/apiClient";
import customerAddressService, {
  CustomerAddressResponse,
  CreateAddressRequest,
  UpdateAddressRequest,
} from "@/lib/api/services/fetchCustomerAddress";
import toast from "react-hot-toast";

export function useGetCustomerAddresses() {
  return useQuery({
    queryKey: ["customer-addresses"],
    queryFn: () => customerAddressService.getMyAddresses(),
    select: (data: BaseResponse<CustomerAddressResponse[]>) => data.result,
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

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAddressRequest) =>
      customerAddressService.createAddress(data),
    onSuccess: (data: BaseResponse<CustomerAddressResponse>) => {
      queryClient.invalidateQueries({ queryKey: ["customer-addresses"] });
      toast.success(data.message || "Thêm địa chỉ thành công");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.error?.result ||
          error.message ||
          "Có lỗi xảy ra khi thêm địa chỉ",
      );
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      addressId,
      data,
    }: {
      addressId: number;
      data: UpdateAddressRequest;
    }) => customerAddressService.updateAddress(addressId, data),
    onSuccess: (data: BaseResponse<CustomerAddressResponse>) => {
      queryClient.invalidateQueries({ queryKey: ["customer-addresses"] });
      toast.success(data.message || "Cập nhật địa chỉ thành công");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.error?.result ||
          error.message ||
          "Có lỗi xảy ra khi cập nhật địa chỉ",
      );
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: number) =>
      customerAddressService.deleteAddress(addressId),
    onSuccess: (data: BaseResponse<boolean>) => {
      queryClient.invalidateQueries({ queryKey: ["customer-addresses"] });
      toast.success(data.message || "Xóa địa chỉ thành công");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.error?.result || error.message || "Có lỗi xảy ra khi xóa địa chỉ",
      );
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: number) =>
      customerAddressService.setDefaultAddress(addressId),
    onSuccess: (data: BaseResponse<CustomerAddressResponse>) => {
      queryClient.invalidateQueries({ queryKey: ["customer-addresses"] });
      toast.success(data.message || "Đặt địa chỉ mặc định thành công");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.error?.result ||
          error.message ||
          "Có lỗi xảy ra khi đặt địa chỉ mặc định",
      );
    },
  });
}
