import { BaseResponse } from "@/lib/api/apiClient";
import classificationStageService, {
  ClassificationStageResponse,
} from "@/lib/api/services/fetchClassificationStage";
import eggBatchService, {
  EggBatchResponse,
} from "@/lib/api/services/fetchEggBatch";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";

export function useGetClassificationStageByBreedingProcessId(
  breedingId: number | undefined,
) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["classification-stage", "breeding-process", breedingId],
    queryFn: () =>
      classificationStageService.getClassificationStageByBreedingId(breedingId),
    enabled: isAuthenticated && breedingId !== undefined,
    select: (
      data: BaseResponse<ClassificationStageResponse>,
    ): ClassificationStageResponse => data.result,
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
