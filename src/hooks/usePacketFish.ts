import { BaseResponse, PagedResponse } from "@/lib/api/apiClient";
import packetFishService, {
  PacketFishResponse,
  PacketFishSearchParams,
  CreatePacketFishRequest,
} from "@/lib/api/services/fetchPacketFish";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import toast from "react-hot-toast";

export function useGetPacketFishes(request: PacketFishSearchParams) {
  return useQuery({
    queryKey: ["packet-fishes", request],
    queryFn: () => packetFishService.getPacketFishes(request),
    select: (
      data: BaseResponse<PagedResponse<PacketFishResponse>>,
    ): PagedResponse<PacketFishResponse> => data.result,
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

export function useGetPacketFishById(id?: number) {
  return useQuery({
    queryKey: ["packet-fishes", id],
    queryFn: () => packetFishService.getPacketFishById(id),
    enabled: id !== undefined && id !== 0,
    select: (data: BaseResponse<PacketFishResponse>): PacketFishResponse =>
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

export function useCreatePacketFish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePacketFishRequest) =>
      packetFishService.createPacketFish(payload),
    onSuccess: (data: BaseResponse<PacketFishResponse>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["packet-fishes"] });
        toast.success(data.message || "Thêm gói bán thành công");
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi thêm gói bán");
    },
  });
}
