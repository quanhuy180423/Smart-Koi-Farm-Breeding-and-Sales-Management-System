import { BaseResponse, PagedResponse } from "@/lib/api/apiClient";
import frySurvivalRecordService, {
  FrySurvivalRecordResponse,
  FrySurvivalRecordSearchParams,
} from "@/lib/api/services/fetchFrySurvivalRecord";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";

export function useGetFrySurvivalRecords(
  request: FrySurvivalRecordSearchParams,
) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["fry-survival-records", request],
    queryFn: () => frySurvivalRecordService.getFrySurvivalRecords(request),
    enabled: isAuthenticated,
    select: (
      data: BaseResponse<PagedResponse<FrySurvivalRecordResponse>>,
    ): PagedResponse<FrySurvivalRecordResponse> => data.result,
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
