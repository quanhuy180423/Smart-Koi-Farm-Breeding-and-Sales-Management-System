"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { usePathname } from "next/navigation";
import { useGetCart, useUpdateItem, useDeleteItem } from "@/hooks/useCart";
import { useState } from "react"; // 👈 1. Import useState
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CartItemResponse } from "@/lib/api/services/fetchCart";

interface CartSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function CartSheet({ isOpen, onOpenChange }: CartSheetProps) {
  const { data: cartData, isLoading, isError, refetch } = useGetCart();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateItem();
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteItem();

  const [itemToDelete, setItemToDelete] = useState<CartItemResponse | null>(null);

  const pathname = usePathname();
  const isProfilePage = pathname?.includes("/profile");

  const items = cartData?.cartItems || [];
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartData?.totalPrice || 0;

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    updateItem({ id: itemId, item: { quantity: newQuantity } });
  };

  const handleConfirmRemove = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete.id, {
        onSuccess: () => {
          setItemToDelete(null);
        },
      });
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button
            variant={isProfilePage ? "ghost" : "outline"}
            size="icon"
            className={
              isProfilePage
                ? "relative rounded-full"
                : "relative bg-transparent cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 group"
            }
          >
            <ShoppingCart
              className={
                isProfilePage
                  ? "h-5 w-5"
                  : "h-4 w-4 text-foreground group-hover:text-primary transition-colors duration-200"
              }
            />
            {totalItems > 0 && !isLoading && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                {totalItems}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg rounded-l-lg flex flex-col">
          <SheetHeader className="py-2">
            <SheetTitle>
              Giỏ hàng ({isLoading ? 0 : totalItems} sản phẩm)
            </SheetTitle>
          </SheetHeader>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Lỗi khi tải giỏ hàng. Vui lòng thử lại.</p>
              <Button onClick={() => refetch()}>Tải lại</Button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Giỏ hàng trống</p>
              <Button asChild className="mt-4">
                <Link href="/catalog" onClick={() => onOpenChange(false)}>
                  Xem danh mục cá
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto py-4 -mx-6 px-6">
                <div className="space-y-4">
                  {items.map((item) => {
                    const isMutating = isUpdating || isDeleting;

                    return (
                      <div
                        key={item.id}
                        className={`flex gap-4 p-4 border rounded-lg transition-opacity ${isMutating ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={item.koiFishImage || item.packetFishImage || "/placeholder.svg"}
                            alt={item.koiFishName || item.packetFishName || "Sản phẩm"}
                            className="object-cover"
                            fill
                            sizes="80px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{item.koiFishName || item.packetFishName}</h4>
                          <p className="font-semibold text-primary mt-1">
                            {formatCurrency(item.itemTotalPrice || 0)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end justify-between ml-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:bg-red-100 disabled:opacity-50"
                            onClick={() => setItemToDelete(item)}
                            disabled={isUpdating || isDeleting}
                            aria-label="Xóa sản phẩm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          <div className="flex items-center gap-1 mt-auto">
                            {item.packetFishId != null && (
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 bg-transparent disabled:opacity-50"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={isUpdating || isDeleting || item.quantity <= 1}
                                aria-label="Giảm số lượng"
                              >
                                {isMutating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Minus className="h-4 w-4" />}
                              </Button>
                            )}
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            {item.packetFishId != null && (
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 bg-transparent disabled:opacity-50"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                disabled={isUpdating || isDeleting}
                                aria-label="Tăng số lượng"
                              >
                                {isMutating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <SheetFooter className="flex-col pt-4 border-t mt-auto">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Tổng cộng:</span>
                  <span className="font-bold text-lg text-primary">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="space-y-2">
                  <Button asChild className="w-full" size="lg" disabled={items.length === 0}>
                    <Link href="/checkout" onClick={() => onOpenChange(false)}>
                      Thanh toán
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => onOpenChange(false)}
                  >
                    Tiếp tục mua sắm
                  </Button>
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <p>
            Bạn có chắc chắn muốn xóa sản phẩm{" "}
            <span className="font-semibold text-destructive">
              {itemToDelete?.koiFishName || itemToDelete?.packetFishName}
            </span>{" "}
            khỏi giỏ hàng?
          </p>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setItemToDelete(null)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRemove}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Xác nhận xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}