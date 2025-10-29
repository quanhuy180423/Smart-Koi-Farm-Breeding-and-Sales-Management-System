"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { CartItemResponse } from "@/lib/api/services/fetchCart";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUpdateItem, useDeleteItem } from "@/hooks/useCart"; // 👈 Import hook trực tiếp

interface CartItemProps {
  item: CartItemResponse;
}

export function CartItem({ item }: CartItemProps) {
  const { mutate: updateItem, isPending: isUpdating } = useUpdateItem();
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteItem();

  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const debouncedQuantity = useDebounce(localQuantity, 600);
  const isInitialMount = useRef(true);

  useEffect(() => {
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (debouncedQuantity !== item.quantity) {
      if (debouncedQuantity <= 0) {
        deleteItem(item.id);
      } else {
        updateItem({ id: item.id, item: { quantity: debouncedQuantity } });
      }
    }
  }, [debouncedQuantity, deleteItem, item, updateItem]);

  const isMutating = isUpdating || isDeleting;

  return (
    <div
      className={`flex gap-4 p-4 border rounded-lg transition-opacity ${isMutating ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={item.koiFishImage || item.packetFishImage || ""}
          alt={item.koiFishName || item.packetFishName || "Sản phẩm"}
          className="object-cover"
          fill
          sizes="80px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">
          {item.koiFishName || item.packetFishName}
        </h4>
        <p className="font-semibold text-primary mt-1">
          {formatCurrency(item.itemTotalPrice || 0)}
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
                {item.koiFishName || item.packetFishName}
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

        {item.packetFishId != null && (
          <div className="flex items-center gap-1 mt-auto">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 bg-transparent"
              onClick={() => setLocalQuantity(Math.max(0, localQuantity - 1))}
              disabled={isMutating}
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
              onClick={() => setLocalQuantity(localQuantity + 1)}
              disabled={isMutating}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
