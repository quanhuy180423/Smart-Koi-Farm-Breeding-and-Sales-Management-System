import { BaseResponse, PagedResponse } from "@/lib/api/apiClient";
import {
  PondTypeResponse,
  PondTypeSearchParams,
  pondTypeService,
} from "@/lib/api/services/fetchPondType";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";

// interface PondTypeUpdatePayload {
//   id: number;
//   pond: Partial<PondRequest>;
// }

export function useGetPondTypes(request: PondTypeSearchParams) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["pond-types", request],
    queryFn: () => pondTypeService.getPondTypes(request),
    enabled: isAuthenticated,
    select: (
      data: BaseResponse<PagedResponse<PondTypeResponse>>
    ): PagedResponse<PondTypeResponse> => data?.result,
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
