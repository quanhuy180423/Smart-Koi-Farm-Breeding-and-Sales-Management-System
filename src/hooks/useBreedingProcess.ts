import { ApiError, BaseResponse, PagedResponse } from "@/lib/api/apiClient";
import breedingProcessService, {
  BreedingDetailResponse,
  BreedingParentHistoryResponse,
  BreedingProcessCreateRequest,
  BreedingProcessResponse,
  BreedingProcessSearchParams,
  BreedingRecommendRequest,
  AnalyzePairRequest,
} from "@/lib/api/services/fetchBreedingProcess";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useGetBreedingProcesses(request: BreedingProcessSearchParams) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["breeding-processes", request],
    queryFn: () => breedingProcessService.getBreedingProcesses(request),
    enabled: isAuthenticated,
    select: (
      data: BaseResponse<PagedResponse<BreedingProcessResponse>>,
    ): PagedResponse<BreedingProcessResponse> => data.result,
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

export function useAddBreedingProcess() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (breedingProcess: Partial<BreedingProcessCreateRequest>) =>
      breedingProcessService.addBreedingProcess(breedingProcess),
    onSuccess: (data: BaseResponse<BreedingProcessResponse>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["breeding-processes"] });
        queryClient.invalidateQueries({ queryKey: ["ponds"] });
      }
      toast.success(data.message || "Tạo quy trình thành công");
      router.push("/manager/breeding");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.error?.result || "Có lỗi xảy ra khi cập nhật thông tin",
      );
    },
  });
}

export function useGetBreedingParentHistory(id: number) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["breeding-processes", "breeding-parent-history", id],
    queryFn: () => breedingProcessService.getBreedingParentHistory(id),
    enabled: isAuthenticated,
    select: (
      data: BaseResponse<BreedingParentHistoryResponse>,
    ): BreedingParentHistoryResponse => data.result,
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

export function useGetBreedingDetail(id?: number) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["breeding-processes", "detail", id],
    queryFn: () => breedingProcessService.getBreedingDetail(id),
    enabled: isAuthenticated && id !== undefined,
    select: (
      data: BaseResponse<BreedingDetailResponse>,
    ): BreedingDetailResponse => data.result,
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

export function useCancelBreeding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => breedingProcessService.cancelBreeding(id),
    onSuccess: (data: BaseResponse<boolean>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["breeding-processes"] });
      }
      toast.success(data.message || "Hủy quy trình thành công");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.error?.result || "Có lỗi xảy ra khi cập nhật thông tin",
      );
    },
  });
}

export function useGetBreedingRecommend() {
  return useMutation({
    mutationFn: (request: Partial<BreedingRecommendRequest>) =>
      breedingProcessService.getRecommends(request),
    onError: (error: ApiError) => {
      toast.error(error.error?.result || "Có lỗi xảy ra khi lấy thông tin");
    },
  });
}

export function useAnalyzePair() {
  return useMutation({
    mutationFn: (request: AnalyzePairRequest) =>
      breedingProcessService.analyzePair(request),
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi phân tích cặp cá");
    },
  });
}
