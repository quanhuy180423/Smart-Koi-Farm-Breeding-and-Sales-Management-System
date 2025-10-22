import { BaseResponse } from "@/lib/api/apiClient";
import eggBatchService, {
  EggBatchResponse,
} from "@/lib/api/services/fetchEggBatch";
import fryFishService, {
  FryFishResponse,
} from "@/lib/api/services/fetchFryFish";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";

export function useGetFryFishByBreedingProcessId(
  breedingId: number | undefined,
) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["fry-fish", "breeding-process", breedingId],
    queryFn: () => fryFishService.getFryFishByBreedingId(breedingId),
    enabled: isAuthenticated && breedingId !== undefined,
    select: (data: BaseResponse<FryFishResponse>): FryFishResponse =>
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
