"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteItem, useUpdateItem } from "@/hooks/useCart";
import { CartItemResponse } from "@/lib/api/services/fetchCart";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import getAge from "@/lib/utils/dates/age";
import {
  getFishSizeLabel,
  getHealthStatusLabel,
  getGenderLabel,
} from "@/lib/utils/enum/formatEnum";

interface CartPageItemProps {
  item: CartItemResponse;
}

export function CartPageItem({ item }: CartPageItemProps) {
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const debouncedQuantity = useDebounce(localQuantity, 1000);
  const lastSentQuantityRef = useRef(item.quantity);

  const handleUpdateErr = () => setLocalQuantity(item.quantity);

  const { mutate: updateItem, isPending: isUpdating } =
    useUpdateItem(handleUpdateErr);
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteItem();

  const handleConfirmRemove = () => {
    deleteItem(item.id);
  };

  // Sync localQuantity khi API update thành công (item.quantity từ server thay đổi)
  useEffect(() => {
    if (
      lastSentQuantityRef.current !== item.quantity &&
      !isUpdating &&
      !isDeleting
    ) {
      setLocalQuantity(item.quantity);
      lastSentQuantityRef.current = item.quantity;
    }
  }, [item.quantity, isUpdating, isDeleting]);

  useEffect(() => {
    // Chỉ gửi request nếu quantity thực sự thay đổi so với lần cuối gửi
    if (debouncedQuantity === lastSentQuantityRef.current) {
      return;
    }

    if (debouncedQuantity <= 0) {
      deleteItem(item.id);
    } else {
      lastSentQuantityRef.current = debouncedQuantity;
      updateItem({ id: item.id, item: { quantity: debouncedQuantity } });
    }
  }, [debouncedQuantity, deleteItem, item.id, updateItem]);

  const isMutating = isUpdating || isDeleting;

  return (
    <Card
      className={`py-0 transition-opacity ${isMutating ? "opacity-50 pointer-events-none" : ""}`}
    >
      <CardContent className="p-4 md:p-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="relative w-full h-48 sm:w-24 sm:h-24 md:w-40 md:h-40 rounded-lg overflow-hidden flex-shrink-0 border">
            <Image
              src={
                item?.koiFish?.images[0] ||
                item?.packetFish?.images[0] ||
                "/placeholder.svg"
              }
              alt={item?.koiFish?.rfid || item?.packetFish?.name || ""}
              className="object-cover"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 96px, 160px"
            />
          </div>
          <div className="flex-1 min-w-0 space-y-3 sm:space-y-2">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-2 space-y-2">
                <h3 className="font-semibold text-lg sm:text-base md:text-lg line-clamp-2">
                  {item?.koiFish?.rfid || item?.packetFish?.name || ""}
                </h3>
                {/* Variety */}
                <p className="text-xs sm:text-sm text-muted-foreground">
                  <span className="font-medium">Giống:</span>{" "}
                  {item.koiFish?.variety?.varietyName ||
                    item.packetFish?.varietyPacketFishes
                      .map((v) => v.varietyName)
                      .join(", ")}
                </p>
                {/* Koi Fish Info */}
                {item.koiFish && (
                  <div className="space-y-1">
                    <div className="flex gap-4 text-xs sm:text-sm text-muted-foreground">
                      <span>
                        <span className="font-medium">Kích thước:</span>{" "}
                        {getFishSizeLabel(item.koiFish.size)}
                      </span>
                      <span>
                        <span className="font-medium">Tuổi:</span>{" "}
                        {getAge(item.koiFish.birthDate)} tuổi
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs sm:text-sm text-muted-foreground">
                      <span>
                        <span className="font-medium">Giới tính:</span>{" "}
                        {getGenderLabel(item.koiFish.gender).label}
                      </span>
                      <span>
                        <span className="font-medium">Hoa văn:</span>{" "}
                        {item.koiFish.pattern || "Không xác định"}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs sm:text-sm text-muted-foreground">
                      <span>
                        <span className="font-medium">Sức khỏe:</span>{" "}
                        {getHealthStatusLabel(item.koiFish.healthStatus).label}
                      </span>
                    </div>
                  </div>
                )}
                {/* Packet Fish Info */}
                {item.packetFish && (
                  <div className="space-y-1">
                    <div className="flex gap-4 text-xs sm:text-sm text-muted-foreground">
                      <span>
                        <span className="font-medium">Kích thước:</span>{" "}
                        {item.packetFish.size}
                      </span>
                      <span>
                        <span className="font-medium">Tuổi:</span>{" "}
                        {item.packetFish.ageMonths} tháng
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isMutating}
                    className="text-destructive hover:text-white hover:bg-destructive flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
                    <DialogDescription>
                      Hành động này không thể hoàn tác.
                    </DialogDescription>
                  </DialogHeader>
                  <p>
                    Bạn có chắc muốn xóa{" "}
                    <span className="font-semibold text-destructive">
                      {item?.koiFish?.rfid || item?.packetFish?.name}
                    </span>
                    ?
                  </p>
                  <DialogFooter className="mt-4">
                    <Button variant="outline">Hủy</Button>
                    <Button
                      variant="destructive"
                      onClick={handleConfirmRemove}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Xác nhận xóa
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t">
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() =>
                    setLocalQuantity((prev) => Math.max(0, prev - 1))
                  }
                  disabled={
                    isMutating || localQuantity <= 1 || item.koiFishId != null
                  }
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-12 text-center font-medium bg-muted px-2 py-1 rounded text-sm">
                  {isUpdating ? (
                    <Loader2 className="h-3 w-3 mx-auto animate-spin" />
                  ) : (
                    localQuantity
                  )}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => setLocalQuantity((prev) => prev + 1)}
                  disabled={isMutating || item.koiFishId != null}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg sm:text-base md:text-lg text-primary">
                  {formatCurrency(item.itemTotalPrice || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
