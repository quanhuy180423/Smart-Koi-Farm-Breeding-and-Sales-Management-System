"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Shield, Clock, Calculator } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { useGetCart } from "@/hooks/useCart";
import { CartPageItem } from "./CartPageItem";
import CustomerLayout from "@/components/customer/CustomerLayout";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";

export default function CartPage() {
  const { data: cart, isLoading: isCartLoading } = useGetCart();

  // Loading state
  if (isCartLoading) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8 flex items-center justify-center min-h-[60vh]">
        <LoadingState message="Đang tải giỏ hàng..." />
      </div>
    );
  }

  // Empty cart state
  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-2xl mx-auto">
          <EmptyState
            icon={ShoppingCart}
            title="Giỏ hàng trống"
            description="Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá bộ sưu tập cá Koi tuyệt đẹp của chúng tôi."
            action={{
              label: "Xem danh mục sản phẩm",
              onClick: () => (window.location.href = "/catalog"),
            }}
          />
        </div>
      </div>
    );
  }

  // Cart content
  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Giỏ hàng</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {cart.cartItems.length || 0} sản phẩm
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            {cart.cartItems.map((item) => (
              <CartPageItem key={item.id} item={item} />
            ))}
          </div>

          <div className="lg:col-span-1 mt-6 lg:mt-0">
            <Card className="sticky top-24">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="text-lg md:text-xl">
                  Tóm tắt đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-5">
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between text-sm md:text-base">
                    <span>
                      Tạm tính ({cart.cartItems.length || 0} sản phẩm)
                    </span>
                    <span className="font-medium">
                      {formatCurrency(cart.totalPrice || 0)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg md:text-xl">
                    <span>Tổng cộng</span>
                    <span className="text-primary">
                      {formatCurrency(cart.totalPrice || 0)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full"
                    size="lg"
                    disabled={cart.cartItems.length === 0}
                  >
                    <Link href="/checkout">Tiến hành thanh toán</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full bg-transparent"
                    size="lg"
                  >
                    <Link href="/profile/shipping-calculator">
                      <Calculator className="mr-2 h-4 w-4" />
                      Tính thử giá hộp
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full bg-transparent"
                    size="lg"
                  >
                    <Link href="/catalog">Tiếp tục mua sắm</Link>
                  </Button>
                </div>

                <div className="text-xs md:text-sm text-muted-foreground space-y-2 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span>Bảo hành sức khỏe cá 30 ngày</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-600 flex-shrink-0" />
                    <span>Hỗ trợ kỹ thuật 24/7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
