import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ApiError, BaseResponse } from "@/lib/api/apiClient";
import { classificationStageService } from "@/lib/api/services/fetchClassificationStage";

export function useCompleteClassification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (breedingId: number) => {
      // First, fetch the classification stage to get its ID
      const stageResponse =
        await classificationStageService.getClassificationStageByBreedingId(
          breedingId,
        );

      if (!stageResponse.isSuccess || !stageResponse.result) {
        throw new Error("Không thể lấy dữ liệu giai đoạn phân loại");
      }

      // Then, complete the classification using the stage ID
      return classificationStageService.completeClassification(
        stageResponse.result.id,
      );
    },
    onSuccess: (data: BaseResponse<boolean>) => {
      if (data.isSuccess) {
        toast.success(data.message || "Hoàn thành phân loại thành công");
        // Invalidate breeding processes query to refetch data
        queryClient.invalidateQueries({ queryKey: ["breeding-processes"] });
        queryClient.invalidateQueries({ queryKey: ["activity-feed"] });
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
