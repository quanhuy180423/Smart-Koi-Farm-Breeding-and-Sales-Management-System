"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CartItemResponse } from "@/lib/api/services/fetchCart";
import { useUpdateItem, useDeleteItem } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { getFishSizeLabel } from "@/lib/utils/enum";
import getAge from "@/lib/utils/dates/age";
import { cn } from "@/lib/utils";

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
          className="object-cover transition-transform group-hover:scale-105"
          fill
          sizes="80px"
        />
      </div>

      {/* 2. Info Section */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h4
              className="font-semibold text-sm truncate pr-4"
              title={item?.koiFish?.rfid || item?.packetFish?.name}
            >
              {item?.koiFish?.rfid
                ? `Koi RFID: ${item.koiFish.rfid}`
                : item?.packetFish?.name}
            </h4>
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
              <span>
                Size: {getFishSizeLabel(item.koiFish?.size)} •{" "}
                {getAge(item.koiFish?.birthDate)}
              </span>
            ) : (
              <span>
                {item.packetFish?.fishPerPacket} con/gói • Size{" "}
                {item.packetFish?.size}
              </span>
            )}
          </div>
        </div>

        {/* 3. Footer: Price & Quantity Controls */}
        <div className="flex items-end justify-between mt-2">
          <p className="font-bold text-primary text-sm">
            {formatCurrency(item.itemTotalPrice)}
          </p>

          {/* Quantity Controls */}
          {isKoi ? (
            <div className="bg-muted/50 px-2 py-1 rounded text-[10px] font-medium text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Số lượng: 1
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-secondary/30 rounded-md border p-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded hover:bg-background hover:text-primary"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={isMutating || item.quantity <= 1}
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
                disabled={isMutating}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
