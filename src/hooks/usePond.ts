import {
  BaseResponse,
  PagedResponse,
} from "@/lib/api/apiClient";
import { PondResponse, PondSearchParams, pondService } from "@/lib/api/services/fetchPond";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";

export function useGetPonds(request: PondSearchParams) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["ponds", request],
    queryFn: () => pondService.getPonds(request),
    enabled: isAuthenticated,
    select: (
      data: BaseResponse<PagedResponse<PondResponse>>,
    ): PagedResponse<PondResponse> => data?.result,
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
