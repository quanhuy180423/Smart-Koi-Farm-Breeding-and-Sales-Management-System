import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ApiError, BaseResponse } from "@/lib/api/apiClient";
import { classificationStageService } from "@/lib/api/services/fetchClassificationStage";

export function useCompleteClassification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (breedingId: number) =>
      classificationStageService.completeClassification(breedingId),
    onSuccess: (data: BaseResponse<boolean>) => {
      if (data.isSuccess) {
        toast.success(data.message || "Hoàn thành phân loại thành công");
        // Invalidate breeding processes query to refetch data
        queryClient.invalidateQueries({ queryKey: ["breeding-processes"] });
      } else {
        toast.error(data.message || "Không thể hoàn thành phân loại");
      }
    },
    onError: (error: ApiError) => {
      toast.error(
        error.error?.result ||
          error.message ||
          "Có lỗi xảy ra khi hoàn thành phân loại",
      );
    },
  });
}
