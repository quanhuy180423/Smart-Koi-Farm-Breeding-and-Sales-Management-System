// components/koi/KoiFishCard.tsx
"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  ShoppingCart,
  Ruler,
  Loader2,
  Mars,
  Venus,
  Heart,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { KoiFishResponse, Gender } from "@/lib/api/services/fetchKoiFish"; // Adjust path import
import {
  getFishSizeLabel,
  getUserGenderLabelForPerson,
} from "@/lib/utils/enum";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface KoiFishCardProps {
  koi: KoiFishResponse;
  onAddToCart?: (id: number, e?: React.MouseEvent) => void;
  addingId?: number | null;
  showAddToCartButton?: boolean;
  onRemoveFavorite?: (id: number, e?: React.MouseEvent) => void;
  removing?: boolean;
  showRemoveFavoriteButton?: boolean;
  isInCart?: boolean;
}

export const KoiFishCard = ({
  koi,
  onAddToCart,
  addingId,
  showAddToCartButton = true,
  onRemoveFavorite,
  removing = false,
  showRemoveFavoriteButton = false,
  isInCart = false,
}: KoiFishCardProps) => {
  const genderInfo = getUserGenderLabelForPerson(koi.gender);
  const isMale = koi.gender === Gender.MALE;
  const router = useRouter();
  return (
    <Card
      className="group overflow-hidden border-border/60 hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col h-full bg-white py-0"
      onClick={() => router.push(`/koi/${koi.id}`)}
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Link href={`/koi/${koi.id}`}>
          <Image
            src={koi.images[0] || "/placeholder.svg"}
            alt={koi.rfid}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <Badge
            variant="secondary"
            className="bg-white/90 backdrop-blur text-xs font-semibold shadow-sm"
          >
            {koi.variety.varietyName}
          </Badge>
        </div>

        {/* Quick Action on Image (Desktop) */}
        <div className="absolute bottom-3 right-3 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden lg:block">
          <Link href={`/koi/${koi.id}`}>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full shadow-lg h-10 w-10 bg-white text-primary hover:bg-primary hover:text-white"
            >
              <Eye className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <CardContent className="flex flex-col flex-1 p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="min-w-0 flex-1 pr-2">
            <Link
              href={`/koi/${koi.id}`}
              className="font-bold text-gray-800 hover:text-primary transition-colors block truncate"
              title={`RFID: ${koi.rfid}`}
            >
              RFID: {koi.rfid}
            </Link>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {koi.origin}
            </p>
          </div>
          {/* Gender Icon */}
          <div
            className={cn(
              "p-1.5 rounded-full",
              isMale ? "bg-blue-50 text-blue-500" : "bg-pink-50 text-pink-500"
            )}
          >
            {genderInfo.icon && typeof genderInfo.icon === "function" ? (
              React.createElement(genderInfo.icon, { className: "w-4 h-4" })
            ) : genderInfo.icon && React.isValidElement(genderInfo.icon) ? (
              genderInfo.icon
            ) : (
              <span className="w-4 h-4 flex items-center justify-center text-xs font-bold">
                {koi.gender === Gender.MALE ? (
                  <Mars className="w-4 h-4" />
                ) : koi.gender === Gender.FEMALE ? (
                  <Venus className="w-4 h-4" />
                ) : (
                  "?"
                )}
              </span>
            )}
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 py-2 border-y border-dashed border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Ruler className="w-4 h-4 text-gray-400" />
            <span>{getFishSizeLabel(koi.size)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 justify-end">
            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
              {/* Tính tuổi từ birthDate nếu cần, hoặc hiển thị field khác */}
              {new Date(koi.birthDate).getFullYear()}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-1">
          <span className="text-xs text-muted-foreground">Giá bán</span>
          <div className="text-xl font-bold text-primary">
            {formatCurrency(koi.sellingPrice)}
          </div>
        </div>
      </CardContent>

      {/* Footer Actions */}
      {(showAddToCartButton || showRemoveFavoriteButton) && (
        <CardFooter className="p-4 pt-0 gap-2">
          {showRemoveFavoriteButton ? (
            <Button
              className="flex-1 bg-red-500 hover:bg-red-600 shadow-md transition-all active:scale-[0.98]"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onRemoveFavorite) {
                  onRemoveFavorite(koi.id, e);
                }
              }}
              disabled={removing}
            >
              {removing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className="h-4 w-4 mr-2 fill-current" />
              )}
              {removing ? "Đang xử lý..." : "Xóa khỏi yêu thích"}
            </Button>
          ) : isInCart ? (
            <div className="w-full p-3 bg-green-50 border border-green-200 rounded-md text-center">
              <div className="flex items-center justify-center gap-2 text-green-700 text-sm font-medium">
                <ShoppingCart className="h-4 w-4" />
                <span>Đã thêm vào giỏ hàng</span>
              </div>
            </div>
          ) : (
            <Button
              className="flex-1 bg-[#0A3D62] hover:bg-[#0A3D62]/90 shadow-md transition-all active:scale-[0.98]"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onAddToCart) {
                  onAddToCart(koi.id, e);
                }
              }}
              disabled={addingId === koi.id}
            >
              {addingId === koi.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShoppingCart className="h-4 w-4 mr-2" />
              )}
              {addingId === koi.id ? "Đang xử lý..." : "Thêm vào giỏ hàng"}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
