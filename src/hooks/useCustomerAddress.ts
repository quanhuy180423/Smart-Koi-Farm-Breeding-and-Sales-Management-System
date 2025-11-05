import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BaseResponse } from "@/lib/api/apiClient";
import customerAddressService, {
  CustomerAddressResponse,
  CreateAddressRequest,
  UpdateAddressRequest,
} from "@/lib/api/services/fetchCustomerAddress";

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
    onSuccess: () => {
      // Invalidate and refetch addresses list
      queryClient.invalidateQueries({ queryKey: ["customer-addresses"] });
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
    onSuccess: () => {
      // Invalidate and refetch addresses list
      queryClient.invalidateQueries({ queryKey: ["customer-addresses"] });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: number) =>
      customerAddressService.deleteAddress(addressId),
    onSuccess: () => {
      // Invalidate and refetch addresses list
      queryClient.invalidateQueries({ queryKey: ["customer-addresses"] });
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: number) =>
      customerAddressService.setDefaultAddress(addressId),
    onSuccess: () => {
      // Invalidate and refetch addresses list
      queryClient.invalidateQueries({ queryKey: ["customer-addresses"] });
    },
  });
}
