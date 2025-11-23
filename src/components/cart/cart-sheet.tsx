"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

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
import { ScrollArea } from "@/components/ui/scroll-area"; // Cần thêm ScrollArea
import { Skeleton } from "@/components/ui/skeleton";

import { useGetCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { CartItem } from "./CartItem";
import { useAuthStore } from "@/store/auth-store";

// Component Skeleton cho lúc loading
const CartSkeleton = () => (
  <div className="space-y-4 p-1">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-4 p-4 border rounded-xl">
        <Skeleton className="w-20 h-20 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex justify-between mt-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

interface CartSheetProps {
  isOpen?: boolean; // Optional vì đôi khi chỉ dùng Trigger
  onOpenChange?: (isOpen: boolean) => void;
}

export function CartSheet({ isOpen, onOpenChange }: CartSheetProps) {
  const { data: cartData, isLoading, isError, refetch } = useGetCart();
  const { isAuthenticated } = useAuthStore();

  const items = cartData?.cartItems || [];
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartData?.totalPrice || 0;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant={"outline"}
          size="icon"
          className={
            "relative transition-all duration-200 hover:bg-primary/10 hover:border-primary/50 border-primary/20"
          }
        >
          <ShoppingCart
            className={"transition-colors h-4 w-4 text-secondary-foreground"}
          />
          {/* Chỉ hiện Badge khi đã load xong và có item */}
          {!isLoading && totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-red-500 hover:bg-red-600 animate-in zoom-in duration-300">
              {totalItems > 99 ? "99+" : totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-slate-50/50">
        <SheetHeader className="px-6 py-4 border-b bg-white">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Giỏ hàng{" "}
            <span className="text-muted-foreground font-normal text-sm">
              ({totalItems} sản phẩm)
            </span>
          </SheetTitle>
        </SheetHeader>

        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center flex-1 p-6 text-center space-y-4">
            <div className="bg-muted/50 p-6 rounded-full">
              <ShoppingCart className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <div>
              <p className="font-medium text-lg">Vui lòng đăng nhập</p>
              <p className="text-sm text-muted-foreground mt-1">
                Để xem giỏ hàng của bạn
              </p>
            </div>
            <Button asChild onClick={() => onOpenChange?.(false)}>
              <Link href="/login">Đăng nhập</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Content Area */}
            <ScrollArea className="flex-1 px-6 py-4">
              {isLoading ? (
                <CartSkeleton />
              ) : isError ? (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                  <p className="text-muted-foreground">
                    Không thể tải giỏ hàng
                  </p>
                  <Button onClick={() => refetch()} variant="outline">
                    Thử lại
                  </Button>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                  <div className="bg-muted/50 p-6 rounded-full">
                    <ShoppingCart className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <div>
                    <p className="font-medium text-lg">Giỏ hàng trống</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Hãy thêm vài chú cá vào đây nhé!
                    </p>
                  </div>
                  <Button
                    asChild
                    className="mt-4"
                    onClick={() => onOpenChange?.(false)}
                  >
                    <Link href="/catalog">Xem danh mục cá</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 pb-4">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Footer Area - Chỉ hiện khi có sản phẩm */}
            {!isLoading && items.length > 0 && (
              <SheetFooter className="p-6 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                <div className="w-full space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-muted-foreground text-sm">
                      Tạm tính:
                    </span>
                    <span className="font-bold text-2xl text-primary">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => onOpenChange?.(false)}
                    >
                      Chọn thêm
                    </Button>
                    <Button
                      asChild
                      className="bg-[#0A3D62] hover:bg-[#0A3D62]/90"
                    >
                      <Link
                        href="/checkout"
                        onClick={() => onOpenChange?.(false)}
                      >
                        Thanh toán
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetFooter>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
