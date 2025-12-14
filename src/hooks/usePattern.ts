import { BaseResponse, PagedResponse } from "@/lib/api/apiClient";
import {
  Pattern,
  PatternSearchParams,
  PatternRequest,
  AssignVarietyRequest,
  PatternVariety,
  PatternVarietySearchParams,
} from "@/lib/api/services/fetchPattern";
import patternService from "@/lib/api/services/fetchPattern";
import { useAuthStore } from "@/store/auth-store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import toast from "react-hot-toast";

export function useGetPatterns(params: PatternSearchParams) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<
    BaseResponse<PagedResponse<Pattern>>,
    ApiError,
    PagedResponse<Pattern>
  >({
    queryKey: ["patterns", params.search, params.pageIndex, params.pageSize],
    queryFn: () => patternService.getPatterns(params),
    enabled: isAuthenticated,
    select: (data: BaseResponse<PagedResponse<Pattern>>) =>
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

export function useCreatePattern() {
  const queryClient = useQueryClient();

  return useMutation<BaseResponse<Pattern>, ApiError, PatternRequest>({
    mutationFn: (data) => patternService.createPattern(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patterns"],
      });
      toast.success("Tạo hoa văn thành công");
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Có lỗi xảy ra khi tạo hoa văn");
    },
  });
}

export function useUpdatePattern() {
  const queryClient = useQueryClient();

  return useMutation<
    BaseResponse<Pattern>,
    ApiError,
    { id: number; data: PatternRequest }
  >({
    mutationFn: ({ id, data }) => patternService.updatePattern(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patterns"],
      });
      toast.success("Cập nhật hoa văn thành công");
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Có lỗi xảy ra khi cập nhật hoa văn");
    },
  });
}

export function useDeletePattern() {
  const queryClient = useQueryClient();

  return useMutation<BaseResponse<boolean>, ApiError, number>({
    mutationFn: (id) => patternService.deletePattern(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patterns"],
      });
      toast.success("Xóa hoa văn thành công");
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Có lỗi xảy ra khi xóa hoa văn");
    },
  });
}

export function useAssignVarietyToPattern() {
  const queryClient = useQueryClient();

  return useMutation<BaseResponse<boolean>, ApiError, AssignVarietyRequest>({
    mutationFn: (data) => patternService.assignVarietyToPattern(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pattern-varieties", variables.patternId],
      });
      toast.success("Gán giống cá cho hoa văn thành công");
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Có lỗi xảy ra khi gán giống cá");
    },
  });
}

export function useRemoveVarietyFromPattern() {
  const queryClient = useQueryClient();

  return useMutation<BaseResponse<boolean>, ApiError, AssignVarietyRequest>({
    mutationFn: (data) => patternService.removeVarietyFromPattern(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pattern-varieties", variables.patternId],
      });
      toast.success("Xóa giống cá khỏi hoa văn thành công");
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Có lỗi xảy ra khi xóa giống cá");
    },
  });
}

export function useGetPatternVarieties(
  patternId: number | null,
  params: PatternVarietySearchParams
) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<
    BaseResponse<PagedResponse<PatternVariety>>,
    ApiError,
    PagedResponse<PatternVariety>
  >({
    queryKey: [
      "pattern-varieties",
      patternId,
      params.search,
      params.pageIndex,
      params.pageSize,
    ],
    queryFn: () => patternService.getPatternVarieties(patternId!, params),
    enabled: isAuthenticated && patternId !== null,
    select: (data: BaseResponse<PagedResponse<PatternVariety>>) =>
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

export function useGetPatternsByVariety(varietyId: number | null) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<BaseResponse<Pattern[]>, ApiError, Pattern[]>({
    queryKey: ["patterns-by-variety", varietyId],
    queryFn: () => patternService.getPatternsByVariety(varietyId!),
    enabled: isAuthenticated && varietyId !== null,
    select: (data: BaseResponse<Pattern[]>) => data?.result || [],
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
