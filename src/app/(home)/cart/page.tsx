"use client";

import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  ArrowLeft,
  Shield,
  Truck,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-muted/50 rounded-full w-24 h-24 md:w-32 md:h-32 flex items-center justify-center mx-auto mb-4 md:mb-6">
            <ShoppingCart className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Giỏ hàng trống</h1>
          <p className="text-muted-foreground mb-6 md:mb-8 text-base md:text-lg px-4">
            Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá bộ sưu tập cá
            Koi tuyệt đẹp của chúng tôi.
          </p>
          <div className="space-y-3 md:space-y-4 px-4">
            <Button asChild size="lg" className="w-full md:w-auto md:px-8">
              <Link href="/catalog">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Xem danh mục cá Koi
              </Link>
            </Button>
            <div>
              <Button asChild variant="outline" size="lg" className="w-full md:w-auto md:px-11">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Về trang chủ
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Quay lại</span>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Giỏ hàng</h1>
            <p className="text-sm md:text-base text-muted-foreground">{getTotalItems()} sản phẩm</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="py-0">
                <CardContent className="p-4 md:p-4">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="relative w-full h-48 sm:w-24 sm:h-24 md:w-40 md:h-40 rounded-lg overflow-hidden flex-shrink-0 border">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="object-cover"
                        fill
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-3 sm:space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-2">
                          <h3 className="font-semibold text-lg sm:text-base md:text-lg line-clamp-2">{item.name}</h3>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {item.variety}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-white hover:bg-destructive flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground">
                        <span>Kích thước: {item.size}</span>
                        <span>Tuổi: {item.age}</span>
                      </div>
                      <div className="flex items-center justify-between sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-medium bg-muted px-2 py-1 rounded text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.min(10, item.quantity + 1)
                              )
                            }
                            disabled={item.quantity >= 10}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {formatCurrency(item.price)} x {item.quantity}
                          </p>
                          <p className="font-bold text-lg sm:text-base md:text-lg text-primary">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-center sm:justify-end mt-4">
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-destructive bg-transparent hover:bg-destructive hover:text-destructive-foreground w-full sm:w-auto"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa tất cả
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1 mt-6 lg:mt-0">
            <Card className="lg:sticky lg:top-4">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="text-lg md:text-xl">Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-5">
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between text-sm md:text-base">
                    <span>Tạm tính ({getTotalItems()} sản phẩm)</span>
                    <span className="font-medium">{formatCurrency(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base">
                    <span>Phí vận chuyển</span>
                    <span className="text-green-600 font-medium">Miễn phí</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg md:text-xl">
                    <span>Tổng cộng</span>
                    <span className="text-primary">
                      {formatCurrency(getTotalPrice())}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button asChild className="w-full" size="lg">
                    <Link href="/checkout">Tiến hành thanh toán</Link>
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
                    <Truck className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Miễn phí vận chuyển toàn quốc</span>
                  </div>
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
    </div>
  );
}
