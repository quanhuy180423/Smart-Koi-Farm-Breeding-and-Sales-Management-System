"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { CartItemResponse } from "@/lib/api/services/fetchCart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUpdateItem, useDeleteItem } from "@/hooks/useCart";
import getAge from "@/lib/utils/dates/age";
import { getFishSizeLabel } from "@/lib/utils/enum";
import { useDebounce } from "@/hooks/useDebounce";

interface CartItemProps {
  item: CartItemResponse;
}

export function CartItem({ item }: CartItemProps) {
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const debouncedQuantity = useDebounce(localQuantity, 1000);
  const lastSentQuantityRef = useRef(item.quantity);

  const handleUpdateErr = () => setLocalQuantity(item.quantity);

  const { mutate: updateItem, isPending: isUpdating } =
    useUpdateItem(handleUpdateErr);
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteItem();

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
    <div
      className={`flex gap-4 p-4 border rounded-lg transition-opacity ${
        isMutating ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={item?.koiFish?.images[0] || item?.packetFish?.images[0] || ""}
          alt={item?.koiFish?.rfid || item?.packetFish?.name || "Sản phẩm"}
          className="object-cover"
          fill
          sizes="80px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">
          {item?.koiFish?.rfid || item?.packetFish?.name}
        </h4>
        <p className="text-sm text-muted-foreground">
          {item.koiFish?.variety?.varietyName ||
            item.packetFish?.varietyPacketFishes
              .map((variety) => variety?.varietyName)
              .join(", ")}
        </p>
        {item.koiFish ? (
          <p className="text-sm text-muted-foreground">
            {getFishSizeLabel(item.koiFish?.size)} cm •{" "}
            {getAge(item.koiFish?.birthDate)} tuổi
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {item.packetFish?.size} • {item.packetFish?.ageMonths} tuổi •{" "}
            {item?.packetFish?.fishPerPacket} con
          </p>
        )}
        <p className="font-semibold text-primary">
          {formatCurrency(item.itemTotalPrice)}
        </p>
      </div>
      <div className="flex flex-col items-end justify-between ml-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-500 hover:bg-red-100 disabled:opacity-50"
              disabled={isMutating}
              aria-label="Xóa sản phẩm"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
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
                onClick={() => deleteItem(item.id)}
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

        <div className="flex items-center gap-1 mt-auto">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 bg-transparent"
            onClick={() => setLocalQuantity((prev) => Math.max(0, prev - 1))}
            disabled={
              isMutating || localQuantity <= 1 || item.koiFishId != null
            }
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center text-sm font-medium">
            {isUpdating ? (
              <Loader2 className="h-4 w-4 mx-auto animate-spin" />
            ) : (
              localQuantity
            )}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 bg-transparent"
            onClick={() => setLocalQuantity((prev) => prev + 1)}
            disabled={isMutating || item.koiFishId != null}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
