import { BaseResponse, PagedResponse } from "@/lib/api/apiClient";
import {
  IncidentType,
  IncidentTypeSearchParams,
  IncidentTypeRequest,
} from "@/lib/api/services/fetchIncidentType";
import incidentTypeService from "@/lib/api/services/fetchIncidentType";
import { useAuthStore } from "@/store/auth-store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import toast from "react-hot-toast";

/**
 * Hook to fetch incident types with pagination
 */
export function useGetIncidentTypes(params: IncidentTypeSearchParams) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<
    BaseResponse<PagedResponse<IncidentType>>,
    ApiError,
    PagedResponse<IncidentType>
  >({
    queryKey: [
      "incident-types",
      params.search,
      params.requiresQuarantine,
      params.affectsBreeding,
      params.pageIndex,
      params.pageSize,
    ],
    queryFn: () => incidentTypeService.getIncidentTypes(params),
    enabled: isAuthenticated,
    select: (data: BaseResponse<PagedResponse<IncidentType>>) =>
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

/**
 * Hook to create a new incident type
 */
export function useCreateIncidentType() {
  const queryClient = useQueryClient();

  return useMutation<BaseResponse<IncidentType>, ApiError, IncidentTypeRequest>(
    {
      mutationFn: (data) => incidentTypeService.createIncidentType(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["incident-types"],
        });
        toast.success("Tạo loại sự cố thành công");
      },
      onError: (err: ApiError) => {
        toast.error(err.message || "Có lỗi xảy ra khi tạo loại sự cố");
      },
    },
  );
}

/**
 * Hook to update an incident type
 */
export function useUpdateIncidentType() {
  const queryClient = useQueryClient();

  return useMutation<
    BaseResponse<IncidentType>,
    ApiError,
    { id: number; data: IncidentTypeRequest }
  >({
    mutationFn: ({ id, data }) =>
      incidentTypeService.updateIncidentType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["incident-types"],
      });
      toast.success("Cập nhật loại sự cố thành công");
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Có lỗi xảy ra khi cập nhật loại sự cố");
    },
  });
}

/**
 * Hook to delete an incident type
 */
export function useDeleteIncidentType() {
  const queryClient = useQueryClient();

  return useMutation<BaseResponse<boolean>, ApiError, number>({
    mutationFn: (id) => incidentTypeService.deleteIncidentType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["incident-types"],
      });
      toast.success("Xóa loại sự cố thành công");
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Có lỗi xảy ra khi xóa loại sự cố");
    },
  });
}
