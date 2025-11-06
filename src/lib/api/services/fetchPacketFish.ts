import toRequestParams from "@/lib/utils/params";
import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";
import { FishSize } from "./fetchKoiFish";
import { VarietyResponse } from "./fetchVariety";

export interface PacketFishResponse {
  id: number;
  name: string;
  description: string;
  quantity: number;
  totalPrice: number;
  size: FishSize;
  ageMonths: number;
  images: string[];
  video: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  varietyPacketFishes: VarietyResponse[];
}

export interface PacketFishSearchParams extends PagingRequest {
  search?: string;
  isAvailable?: boolean;
  size?: FishSize;
  minPrice?: number;
  maxPrice?: number;
  minAgeMonths?: number;
  maxAgeMonths?: number;
  minQuantity?: number;
  maxQuantity?: number;
}

export interface CreatePacketFishRequest {
  name: string;
  description: string;
  quantity: number;
  totalPrice: number;
  size: FishSize;
  ageMonths: number;
  images: string[];
  videos: string[];
  isAvailable: boolean;
}

const baseUrl = "/api/PacketFish";

export const packetFishService = {
  getPacketFishes: async (
    request: PacketFishSearchParams,
  ): Promise<BaseResponse<PagedResponse<PacketFishResponse>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<
      BaseResponse<PagedResponse<PacketFishResponse>>
    >(`${baseUrl}`, { ...filter });
    return response.data;
  },
  getPacketFishById: async (
    id?: number,
  ): Promise<BaseResponse<PacketFishResponse>> => {
    const response = await apiService.get<BaseResponse<PacketFishResponse>>(
      `${baseUrl}/${id}`,
    );
    return response.data;
  },
  createPacketFish: async (
    request: CreatePacketFishRequest,
  ): Promise<BaseResponse<PacketFishResponse>> => {
    const response = await apiService.post<
      BaseResponse<PacketFishResponse>,
      CreatePacketFishRequest
    >(`${baseUrl}`, request);
    return response.data;
  },
};

export default packetFishService;
