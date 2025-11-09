import { BaseResponse } from "@/lib/api/apiClient";
import {
  WeeklyScheduleTemplate,
  WeeklyScheduleTemplateRequest,
  GenerateWorkScheduleRequest,
} from "@/lib/api/services/fetchWeeklyScheduleTemplate";
import weeklyScheduleTemplateService from "@/lib/api/services/fetchWeeklyScheduleTemplate";
import { WorkSchedule } from "@/lib/api/services/fetchWorkSchedule";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import toast from "react-hot-toast";

/**
 * Hook to fetch all weekly schedule templates
 */
export function useGetWeeklyScheduleTemplates() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<
    BaseResponse<WeeklyScheduleTemplate[]>,
    ApiError,
    WeeklyScheduleTemplate[]
  >({
    queryKey: ["weekly-schedule-templates"],
    queryFn: () => weeklyScheduleTemplateService.getWeeklyScheduleTemplates(),
    enabled: isAuthenticated,
    select: (data: BaseResponse<WeeklyScheduleTemplate[]>) =>
      data?.result || [],
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
 * Hook to fetch a single weekly schedule template by ID
 */
export function useGetWeeklyScheduleTemplateById(id?: number) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["weekly-schedule-template", id],
    queryFn: () =>
      weeklyScheduleTemplateService.getWeeklyScheduleTemplateById(id!),
    enabled: isAuthenticated && id !== undefined && id !== 0,
    select: (
      data: BaseResponse<WeeklyScheduleTemplate>,
    ): WeeklyScheduleTemplate => data?.result,
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
 * Hook to create a new weekly schedule template
 */
export function useCreateWeeklyScheduleTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WeeklyScheduleTemplateRequest) =>
      weeklyScheduleTemplateService.addWeeklyScheduleTemplate(data),
    onSuccess: (data: BaseResponse<WeeklyScheduleTemplate>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({
          queryKey: ["weekly-schedule-templates"],
        });
      }
      toast.success(data.message || "Tạo mẫu lịch thành công");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi tạo mẫu lịch");
    },
  });
}

/**
 * Hook to update a weekly schedule template
 */
export function useUpdateWeeklyScheduleTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: WeeklyScheduleTemplateRequest;
    }) => weeklyScheduleTemplateService.updateWeeklyScheduleTemplate(id, data),
    onSuccess: (data: BaseResponse<WeeklyScheduleTemplate>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({
          queryKey: ["weekly-schedule-templates"],
        });
        queryClient.invalidateQueries({
          queryKey: ["weekly-schedule-template"],
        });
      }
      toast.success(data.message || "Cập nhật mẫu lịch thành công");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật mẫu lịch");
    },
  });
}

/**
 * Hook to delete a weekly schedule template
 */
export function useDeleteWeeklyScheduleTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      weeklyScheduleTemplateService.deleteWeeklyScheduleTemplate(id),
    onSuccess: (data: BaseResponse<string>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({
          queryKey: ["weekly-schedule-templates"],
        });
      }
      toast.success(data.message || "Xóa mẫu lịch thành công");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi xóa mẫu lịch");
    },
  });
}

/**
 * Hook to generate work schedules from a template
 */
export function useGenerateWorkSchedules() {
  const queryClient = useQueryClient();

  return useMutation<WorkSchedule[], ApiError, GenerateWorkScheduleRequest>({
    mutationFn: (request: GenerateWorkScheduleRequest) =>
      weeklyScheduleTemplateService
        .generateWorkSchedules(request)
        .then((res) => res.result || []),
    onSuccess: (data) => {
      toast.success(`${data.length} công việc được tạo thành công`);
      queryClient.invalidateQueries({ queryKey: ["work-schedules"] });
    },
    onError: (error) => {
      toast.error(error?.message || "Có lỗi xảy ra khi tạo công việc");
    },
  });
}
