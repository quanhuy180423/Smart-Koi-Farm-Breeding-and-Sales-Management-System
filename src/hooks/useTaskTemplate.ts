import { BaseResponse, PagedResponse } from "@/lib/api/apiClient";
import {
  TaskTemplateResponse,
  TaskTemplateRequest,
  TaskTemplatePagedRequest,
} from "@/lib/api/services/fetchTaskTemplate";
import taskTemplateService from "@/lib/api/services/fetchTaskTemplate";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import toast from "react-hot-toast";

interface TaskTemplateUpdatePayload {
  id: number;
  data: TaskTemplateRequest;
}

/**
 * Hook to fetch task templates with pagination and filters
 */
export function useGetTaskTemplates(request: TaskTemplatePagedRequest) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<
    BaseResponse<PagedResponse<TaskTemplateResponse>>,
    ApiError,
    PagedResponse<TaskTemplateResponse>
  >({
    queryKey: ["task-templates", request],
    queryFn: () => taskTemplateService.getTaskTemplates(request),
    enabled: isAuthenticated,
    select: (data: BaseResponse<PagedResponse<TaskTemplateResponse>>) =>
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
 * Hook to fetch a single task template by ID
 */
export function useGetTaskTemplateById(id?: number) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["task-template", id],
    queryFn: () => taskTemplateService.getTaskTemplateById(id!),
    enabled: isAuthenticated && id !== undefined && id !== 0,
    select: (data: BaseResponse<TaskTemplateResponse>): TaskTemplateResponse =>
      data?.result,
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
 * Hook to create a new task template
 */
export function useCreateTaskTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TaskTemplateRequest) =>
      taskTemplateService.addTaskTemplate(data),
    onSuccess: (data: BaseResponse<TaskTemplateResponse>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["task-templates"] });
      }
      toast.success(data.message || "Tạo công việc thành công");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi tạo công việc");
    },
  });
}

/**
 * Hook to update a task template
 */
export function useUpdateTaskTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TaskTemplateUpdatePayload) =>
      taskTemplateService.updateTaskTemplate(payload.id, payload.data),
    onSuccess: (data: BaseResponse<TaskTemplateResponse>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["task-templates"] });
      }
      toast.success(data.message || "Cập nhật công việc thành công");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật công việc");
    },
  });
}

/**
 * Hook to delete a task template
 */
export function useDeleteTaskTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => taskTemplateService.deleteTaskTemplate(id),
    onSuccess: (data: BaseResponse<boolean>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["task-templates"] });
      }
      toast.success(data.message || "Xóa công việc thành công");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi xóa công việc");
    },
  });
}
