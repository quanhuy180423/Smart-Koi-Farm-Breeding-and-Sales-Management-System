"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ShoppingCart, Loader2, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PacketFishResponse } from "@/lib/api/services/fetchPacketFish";
import { formatSizeRange } from "@/lib/utils/enum";
import formatCurrency from "@/lib/utils/numbers";

interface PacketFishCardProps {
  packet: PacketFishResponse;
  onAddToCart: (id: number) => void;
  isAddPending?: boolean;
}

export const PacketFishCard = ({
  packet,
  onAddToCart,
  isAddPending = false,
}: PacketFishCardProps) => {
  const isLowStock = packet.stockQuantity <= 5 && packet.stockQuantity > 0;
  const isOutOfStock = packet.stockQuantity === 0;

  return (
    <Card className="group py-0 relative overflow-hidden border-2 border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white rounded-2xl">
      {/* Image Section */}
      <div className="relative overflow-hidden aspect-4/3 bg-linear-to-br from-slate-50 to-slate-100">
        <Link href={`/packet-fish/${packet.id}`}>
          <Image
            src={packet.images[0] || "/placeholder.svg"}
            alt={packet.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Subtle Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
        </Link>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <Badge className="bg-gray-900 text-white border-0 shadow-md font-bold px-3 py-1.5">
              Hết hàng
            </Badge>
          ) : isLowStock ? (
            <Badge className="bg-orange-500 text-white border-0 shadow-md font-bold px-3 py-1.5">
              Còn {packet.stockQuantity}
            </Badge>
          ) : (
            <Badge className="bg-green-500 text-white border-0 shadow-md font-bold px-3 py-1.5">
              Còn hàng
            </Badge>
          )}
        </div>

        {/* Size Badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/95 text-primary border-0 shadow-md font-bold px-3 py-1.5">
            {formatSizeRange(packet.size)}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="flex flex-col flex-1 px-5 space-y-4">
        {/* Title */}
        <Link
          href={`/packet-fish/${packet.id}`}
          className="block font-bold text-xl text-gray-900 hover:text-primary transition-colors truncate line-clamp-2 leading-tight"
          title={packet.name}
        >
          {packet.name}
        </Link>

        {/* Variety */}
        {packet.varietyPacketFishes &&
          packet.varietyPacketFishes.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-500">Giống:</span>
              <span className="font-semibold text-gray-700 truncate">
                {packet.varietyPacketFishes
                  .map((v) => v.varietyName)
                  .join(", ")}
              </span>
            </div>
          )}

        {/* Info Grid - Simplified */}
        <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
          {/* Quantity */}
          <div className="flex items-center gap-2 flex-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium">
                Số lượng
              </span>
              <span className="text-sm font-bold text-gray-900">
                {packet.fishPerPacket} con
              </span>
            </div>
          </div>

          {/* Age */}
          <div className="flex items-center gap-2 flex-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium">Tuổi</span>
              <span className="text-sm font-bold text-gray-900">
                {packet.ageMonths} tháng
              </span>
            </div>
          </div>
        </div>

        {/* Stock Info */}
        <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Tồn kho</span>
          </div>
          <span className="text-sm font-bold text-gray-900">
            {packet.stockQuantity} gói
          </span>
        </div>
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="p-5 pt-0 flex flex-col gap-3">
        {/* Price - Simplified */}
        <div className="w-full flex items-baseline justify-between">
          <span className="text-sm font-medium text-gray-600">Giá:</span>
          <span className="text-3xl font-black text-primary">
            {formatCurrency(packet.pricePerPacket)}
          </span>
        </div>

        {/* Add to Cart Button - Simplified */}
        <Button
          onClick={() => onAddToCart(packet.id)}
          disabled={isAddPending || isOutOfStock}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-base"
        >
          {isAddPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isOutOfStock ? (
            "Hết hàng"
          ) : (
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Thêm vào giỏ</span>
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PacketFishCard;
