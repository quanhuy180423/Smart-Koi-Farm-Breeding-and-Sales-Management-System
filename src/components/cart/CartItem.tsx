"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CartItemResponse } from "@/lib/api/services/fetchCart";
import { useUpdateItem, useDeleteItem } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { getFishSizeLabel } from "@/lib/utils/enum";
import { cn } from "@/lib/utils";
import { SaleStatus } from "@/lib/api/services/fetchKoiFish";

interface CartItemProps {
  item: CartItemResponse;
}

export function CartItem({ item }: CartItemProps) {
  // Optimistic UI: Cập nhật giao diện ngay lập tức khi user bấm
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { mutate: updateItem, isPending: isUpdating } = useUpdateItem();
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteItem();

  const isMutating = isUpdating || isDeleting;
  const isKoi = !!item.koiFish; // Kiểm tra xem có phải cá Koi đơn lẻ không

  // Kiểm tra trạng thái stock
  const isOutOfStock =
    (isKoi && item.koiFish?.saleStatus === SaleStatus.SOLD) ||
    (!isKoi && item.packetFish?.stockQuantity === 0);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItem({ id: item.id, item: { quantity: newQuantity } });
  };

  return (
    <div
      className={cn(
        "flex gap-4 p-4 border border-border/60 rounded-xl bg-card hover:border-primary/20 transition-colors group",
        isMutating && "opacity-60 pointer-events-none",
      )}
    >
      {/* 1. Image Section */}
      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted border">
        <Image
          src={
            item?.koiFish?.images[0] ||
            item?.packetFish?.images[0] ||
            "/placeholder.svg"
          }
          alt={item?.koiFish?.rfid || item?.packetFish?.name || "Sản phẩm"}
          className={cn(
            "object-cover transition-transform group-hover:scale-105",
            isOutOfStock && "grayscale opacity-50",
          )}
          fill
          sizes="80px"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <AlertTriangle className="h-6 w-6 text-white drop-shadow-md" />
          </div>
        )}
      </div>

      {/* 2. Info Section */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <h4
                className="font-semibold text-sm truncate pr-4 max-w-[180px]"
                title={item?.koiFish?.rfid || item?.packetFish?.name}
              >
                {item?.koiFish?.rfid
                  ? `Koi RFID: ${item.koiFish.rfid}`
                  : item?.packetFish?.name}
              </h4>
              {isOutOfStock && (
                <Badge
                  variant="destructive"
                  className="mt-1 text-[10px] font-medium"
                >
                  {isKoi ? "Đã bán" : "Hết hàng"}
                </Badge>
              )}
            </div>
            {/* Xóa bằng Popover: Nhẹ hơn Dialog */}
            <Popover open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-red-500 -mt-1 -mr-2"
                >
                  {isDeleting ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-3" align="end">
                <div className="text-center space-y-3">
                  <p className="text-xs font-medium">Xóa sản phẩm này?</p>
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setIsDeleteOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => deleteItem(item.id)}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {item.koiFish?.variety?.varietyName ||
              item.packetFish?.varietyPacketFishes
                .map((v) => v?.varietyName)
                .join(", ")}
          </p>

          <div className="text-xs text-muted-foreground mt-1">
            {item.koiFish ? (
              <span>Size: {getFishSizeLabel(item.koiFish?.size)} cm</span>
            ) : (
              <span>{item.packetFish?.fishPerPacket} con/gói</span>
            )}
          </div>
        </div>

        {/* 3. Footer: Price & Quantity Controls */}
        <div className="space-y-1 mt-2">
          <div className="flex items-end justify-between">
            <div className="text-xs text-muted-foreground">
              {formatCurrency(item.unitPrice)}/sp
            </div>
            <p className="font-bold text-primary text-sm">
              {formatCurrency(item.itemTotalPrice)}
            </p>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-end justify-between">
            {isKoi ? (
              <div
                className={cn(
                  "px-2 py-1 rounded text-[10px] font-medium flex items-center gap-1",
                  isOutOfStock
                    ? "bg-destructive/20 text-destructive"
                    : "bg-muted/50 text-muted-foreground",
                )}
              >
                <AlertCircle className="h-3 w-3" /> Số lượng: 1
              </div>
            ) : (
              <div
                className={cn(
                  "flex items-center gap-1 rounded-md border p-0.5",
                  isOutOfStock
                    ? "bg-destructive/10 border-destructive/30"
                    : "bg-secondary/30",
                )}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded hover:bg-background hover:text-primary"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={isMutating || item.quantity <= 1 || isOutOfStock}
                >
                  <Minus className="h-3 w-3" />
                </Button>

                <span className="w-8 text-center text-xs font-medium tabular-nums">
                  {/* Giữ nguyên số khi loading, chỉ mờ đi (do parent opacity) để tránh layout shift */}
                  {item.quantity}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded hover:bg-background hover:text-primary"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={isMutating || isOutOfStock}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
