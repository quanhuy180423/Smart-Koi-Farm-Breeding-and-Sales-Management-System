import { BaseResponse } from "@/lib/api/apiClient";
import {
  WorkSchedule,
  WorkScheduleRequest,
  UpdateWorkScheduleRequest,
  MyWorkScheduleParams,
} from "@/lib/api/services/fetchWorkSchedule";
import workScheduleService from "@/lib/api/services/fetchWorkSchedule";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import toast from "react-hot-toast";

/**
 * Hook to fetch my work schedules (for current staff)
 */
export function useGetMyWorkSchedules(params: MyWorkScheduleParams) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<BaseResponse<WorkSchedule[]>, ApiError, WorkSchedule[]>({
    queryKey: [
      "my-work-schedules",
      params.search,
      params.status,
      params.scheduledDateFrom,
      params.scheduledDateTo,
    ],
    queryFn: () => workScheduleService.getMyWorkSchedules(params),
    enabled: isAuthenticated,
    select: (data: BaseResponse<WorkSchedule[]>) => data?.result || [],
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
 * Hook to fetch work schedules within a date range
 */
export function useGetWorkSchedules(request: WorkScheduleRequest) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<BaseResponse<WorkSchedule[]>, ApiError, WorkSchedule[]>({
    queryKey: [
      "work-schedules",
      request.scheduledDateFrom,
      request.scheduledDateTo,
      request.pondId,
    ],
    queryFn: () => workScheduleService.getWorkSchedules(request),
    enabled:
      isAuthenticated &&
      !!request.scheduledDateFrom &&
      !!request.scheduledDateTo,
    select: (data: BaseResponse<WorkSchedule[]>) => data?.result || [],
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
 * Hook to create work schedule
 */
export function useCreateWorkSchedule() {
  const queryClient = useQueryClient();

  return useMutation<WorkSchedule, ApiError, UpdateWorkScheduleRequest>({
    mutationFn: (request: UpdateWorkScheduleRequest) =>
      workScheduleService
        .createWorkSchedule(request)
        .then((res) => res.result!),
    onSuccess: () => {
      toast.success("Tạo công việc thành công");
      queryClient.invalidateQueries({ queryKey: ["work-schedules"] });
    },
    onError: (error) => {
      toast.error(error?.message || "Có lỗi xảy ra khi tạo công việc");
    },
  });
}

/**
 * Hook to update work schedule
 */
export function useUpdateWorkSchedule() {
  const queryClient = useQueryClient();

  return useMutation<
    WorkSchedule,
    ApiError,
    { id: number; request: UpdateWorkScheduleRequest }
  >({
    mutationFn: ({ id, request }) =>
      workScheduleService
        .updateWorkSchedule(id, request)
        .then((res) => res.result!),
    onSuccess: () => {
      toast.success("Cập nhật công việc thành công");
      queryClient.invalidateQueries({ queryKey: ["work-schedules"] });
    },
    onError: (error) => {
      toast.error(error?.message || "Có lỗi xảy ra khi cập nhật công việc");
    },
  });
}

/**
 * Hook to delete work schedule
 */
export function useDeleteWorkSchedule() {
  const queryClient = useQueryClient();

  return useMutation<boolean, ApiError, number>({
    mutationFn: (id: number) =>
      workScheduleService
        .deleteWorkSchedule(id)
        .then((res) => res.result || false),
    onSuccess: () => {
      toast.success("Xóa công việc thành công");
      queryClient.invalidateQueries({ queryKey: ["work-schedules"] });
    },
    onError: (error) => {
      toast.error(error?.message || "Có lỗi xảy ra khi xóa công việc");
    },
  });
}
