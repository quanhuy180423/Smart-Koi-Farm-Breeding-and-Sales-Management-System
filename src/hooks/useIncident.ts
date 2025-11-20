import { BaseResponse, PagedResponse } from "@/lib/api/apiClient";
import incidentService, {
  IncidentResponse,
  IncidentSearchParams,
  KoiIncidentHistory,
} from "@/lib/api/services/fetchIncident";
import { useQuery } from "@tanstack/react-query";

export function useGetIncidents(request: IncidentSearchParams) {
  return useQuery({
    queryKey: ["incidents", request],
    queryFn: () => incidentService.getIncidents(request),
    select: (
      data: BaseResponse<PagedResponse<IncidentResponse>>,
    ): PagedResponse<IncidentResponse> => data.result,
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

export const useKoiIncident = (koiFishId: number, enabled: boolean = true) => {
  return useQuery<KoiIncidentHistory[]>({
    queryKey: ["koiIncidentHistory", koiFishId],
    queryFn: async () => {
      const response = await incidentService.getKoiIncidentHistory(koiFishId);
      return response.result || [];
    },
    enabled: enabled && !!koiFishId,
  });
};

export default useGetIncidents;
