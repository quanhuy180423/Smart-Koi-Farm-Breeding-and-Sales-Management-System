"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ShoppingCart, Loader2, Fish } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PacketFishResponse } from "@/lib/api/services/fetchPacketFish";
import { getFishSizeLabel } from "@/lib/utils/enum";
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
  return (
    <Card className="group p-0 overflow-hidden border-gray-200 hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col h-full bg-white">
      {/* Image Section */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <Link href={`/packet-fish/${packet.id}`}>
          <Image
            src={packet.images[0] || "/placeholder.svg"}
            alt={packet.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay Gradient on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </Link>

        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-white/90 text-primary hover:bg-white shadow-sm backdrop-blur-sm font-semibold">
            {getFishSizeLabel(packet.size)}
          </Badge>
          {packet.stockQuantity <= 5 && packet.stockQuantity > 0 && (
            <Badge variant="destructive" className="shadow-sm">
              Sắp hết hàng
            </Badge>
          )}
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="flex flex-col flex-1 p-5 space-y-4">
        <div>
          <Link
            href={`/packet-fish/${packet.id}`}
            className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight"
            title={packet.name}
          >
            {packet.name}
          </Link>
          {/* Hiển thị tên giống cá (Variety) nếu có */}
          {packet.varietyPacketFishes &&
            packet.varietyPacketFishes.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                Giống:{" "}
                {packet.varietyPacketFishes
                  .map((v) => v.varietyName)
                  .join(", ")}
              </p>
            )}
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 py-3 border-y border-dashed">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="p-1.5 rounded-full bg-blue-50 text-blue-600">
              <Users className="h-3.5 w-3.5" />
            </div>
            <span className="font-medium">{packet.fishPerPacket} con</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="p-1.5 rounded-full bg-orange-50 text-orange-600">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <span>{packet.ageMonths} tháng</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 col-span-2">
            <div className="p-1.5 rounded-full bg-green-50 text-green-600">
              <Fish className="h-3.5 w-3.5" />
            </div>
            <span>
              Kho:{" "}
              <span className="font-semibold text-gray-900">
                {packet.stockQuantity}
              </span>{" "}
              gói
            </span>
          </div>
        </div>
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="p-5 pt-0 flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Giá gói</span>
          <span className="text-xl font-bold text-primary">
            {formatCurrency(packet.pricePerPacket)}
          </span>
        </div>

        <Button
          onClick={() => onAddToCart(packet.id)}
          disabled={isAddPending || packet.stockQuantity === 0}
          className="flex-1 bg-[#0A3D62] hover:bg-[#0A3D62]/90 text-white shadow-md transition-all active:scale-95 rounded-xl h-11"
        >
          {isAddPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : packet.stockQuantity === 0 ? (
            "Hết hàng"
          ) : (
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Mua ngay</span>
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PacketFishCard;
