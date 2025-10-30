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
  isAvailable: true;
  createdAt: string;
  updatedAt: string;
  varietyPacketFishes: VarietyResponse[];
}
