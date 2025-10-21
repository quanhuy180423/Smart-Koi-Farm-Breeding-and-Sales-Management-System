import {
  ApiError,
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "@/lib/api/apiClient";
import breedingProcessService, {
  BreedingProcessCreateRequest,
  BreedingProcessResponse,
} from "@/lib/api/services/fetchBreedingProcess";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useGetBreedingProcesses(request: PagingRequest) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["breeding-processes", request],
    queryFn: () => breedingProcessService.getBreedingProcesses(request),
    enabled: isAuthenticated,
    select: (
      data: BaseResponse<PagedResponse<BreedingProcessResponse>>,
    ): BaseResponse<PagedResponse<BreedingProcessResponse>> => ({
      statusCode: data.statusCode,
      isSuccess: data.isSuccess,
      message: data.message,
      result: data.result,
    }),
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
