import { BaseResponse, PagedResponse } from "@/lib/api/apiClient";
import koiFishService, {
  KoiFishFamilyResponse,
  KoiFishResponse,
  KoiFishSearchParams,
} from "@/lib/api/services/fetchKoiFish";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";

export function useGetKoiFishes(request: KoiFishSearchParams) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["koi-fishes", request],
    queryFn: () => koiFishService.getKoiFishes(request),
    enabled: isAuthenticated,
    select: (
      data: BaseResponse<PagedResponse<KoiFishResponse>>,
    ): PagedResponse<KoiFishResponse> => data.result,
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

export function useGetKoiFishFamily(id: number | undefined) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["koi-fishes-family", id],
    queryFn: () => koiFishService.getKoiFishFamily(id),
    enabled: isAuthenticated && id !== undefined && id !== 0,
    select: (
      data: BaseResponse<KoiFishFamilyResponse>,
    ): KoiFishFamilyResponse => data.result,
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
