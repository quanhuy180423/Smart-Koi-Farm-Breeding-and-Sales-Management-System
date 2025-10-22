import { BaseResponse } from "@/lib/api/apiClient";
import eggBatchService, {
  EggBatchResponse,
} from "@/lib/api/services/fetchEggBatch";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";

export function useGetEggBatchByBreedingProcessId(
  breedingId: number | undefined
) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["egg-batch", "breeding-process", breedingId],
    queryFn: () => eggBatchService.getEggBatchByBreedingId(breedingId),
    enabled: isAuthenticated && breedingId !== undefined,
    select: (data: BaseResponse<EggBatchResponse>): EggBatchResponse =>
      data.result,
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
