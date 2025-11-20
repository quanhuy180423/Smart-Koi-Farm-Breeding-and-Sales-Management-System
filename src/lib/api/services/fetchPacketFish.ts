import toRequestParams from "@/lib/utils/params";
import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";
import { VarietyResponse } from "./fetchVariety";

export interface PacketFishResponse {
  id: number;
  name: string;
  description: string;
  fishPerPacket: number;
  pricePerPacket: number;
  stockQuantity: number;
  size: string;
  ageMonths: number;
  images: string[];
  videos: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string | null;
  varietyPacketFishes: VarietyResponse[];
}

export interface PacketFishSearchParams extends PagingRequest {
  search?: string;
  isAvailable?: boolean;
  minSize?: number;
  maxSize?: number;
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
  fishPerPacket: number;
  pricePerPacket: number;
  size: string;
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
