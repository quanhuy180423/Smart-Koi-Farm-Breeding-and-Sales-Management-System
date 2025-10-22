import { IncubationDailyRecordResponse } from "./../lib/api/services/fetchIncubationDailyRecord";
import {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "@/lib/api/apiClient";
import eggBatchService, {
  EggBatchResponse,
} from "@/lib/api/services/fetchEggBatch";
import incubationDailyRecordService from "@/lib/api/services/fetchIncubationDailyRecord";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";

export function useGetIncubationDailyRecordByEggBatchId(
  eggBatchId: number | undefined,
  request: PagingRequest
) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["incubation-daily-record", "egg-batch", eggBatchId, request],
    queryFn: () =>
      incubationDailyRecordService.getIncubationDailyRecordByEggBatchId(
        eggBatchId,
        request
      ),
    enabled: isAuthenticated && eggBatchId !== undefined,
    select: (
      data: BaseResponse<PagedResponse<IncubationDailyRecordResponse>>
    ): PagedResponse<IncubationDailyRecordResponse> => data.result,
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
