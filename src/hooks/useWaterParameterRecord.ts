import { BaseResponse, PagedResponse } from "@/lib/api/apiClient";
import {
  WaterParameterRecord,
  WaterParameterRecordSearchParams,
} from "@/lib/api/services/fetchWaterParameterRecord";
import waterParameterRecordService from "@/lib/api/services/fetchWaterParameterRecord";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";

/**
 * Hook to fetch water parameter records with pagination
 */
export function useGetWaterParameterRecords(
  params: WaterParameterRecordSearchParams,
) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<
    BaseResponse<PagedResponse<WaterParameterRecord>>,
    ApiError,
    PagedResponse<WaterParameterRecord>
  >({
    queryKey: [
      "water-parameter-records",
      params.pondId,
      params.fromDate,
      params.toDate,
      params.notesContains,
      params.pageIndex,
      params.pageSize,
    ],
    queryFn: () => waterParameterRecordService.getWaterParameterRecords(params),
    enabled: isAuthenticated && !!params.pondId,
    select: (data: BaseResponse<PagedResponse<WaterParameterRecord>>) =>
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
