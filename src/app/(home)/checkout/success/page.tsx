"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useGetOrderById } from "@/hooks/useOrder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Package,
  Phone,
  Mail,
  ShoppingBag,
  ShoppingCart,
  Home,
  Loader2,
  User,
  Fish,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { DATE_FORMATS, formatDate } from "@/lib/utils/dates";
import { getOrderStatusText } from "@/lib/utils/enum";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    const paramOrderId = searchParams.get("orderId");
    if (paramOrderId) {
      setOrderId(Number(paramOrderId));
    }
  }, [searchParams]);

  const { data: order, isLoading } = useGetOrderById(orderId ?? undefined);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-primary mb-2">
              Đặt hàng thành công!
            </h1>
            <p className="text-muted-foreground">
              Cảm ơn bạn đã tin tưởng và đặt hàng tại Zenkoi. Chúng tôi sẽ liên
              hệ với bạn sớm nhất.
            </p>
          </div>

          {order && (
            <>
              {/* Customer Information */}
              <Card className="text-left mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Thông tin khách hàng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-1">
                    Tên khách hàng
                  </p>
                  <p className="font-medium text-lg">{order.customerName}</p>
                </CardContent>
              </Card>

              {/* Order Information */}
              <Card className="text-left mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Thông tin đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Mã đơn hàng:</p>
                      <p className="font-mono font-bold text-lg">
                        {order.orderNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Thời gian đặt:</p>
                      <p className="font-medium">
                        {formatDate(order.createdAt, DATE_FORMATS.DATETIME_12H)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Trạng thái:</p>
                      <Badge className="mt-1">
                        {getOrderStatusText(order.status)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Số sản phẩm:</p>
                      <p className="font-medium">{order.orderDetails.length}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <p className="text-muted-foreground">Tổng tiền:</p>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">
                      Quy trình xử lý đơn hàng:
                    </h4>
                    <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                      <li>Xác nhận đơn hàng (trong 2 giờ)</li>
                      <li>Chuẩn bị cá và đóng gói chuyên nghiệp</li>
                      <li>Vận chuyển đến địa chỉ của bạn</li>
                      <li>Giao hàng và hướng dẫn chăm sóc</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="text-left mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fish className="h-5 w-5" />
                    Sản phẩm đã đặt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.orderDetails.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        {/* Product Image */}
                        <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                          <Image
                            src={
                              item.koiFish?.images?.[0] ||
                              item.packetFish?.images?.[0] ||
                              ""
                            }
                            alt={
                              item.koiFish?.rfid ||
                              item.packetFish?.name ||
                              "Sản phẩm"
                            }
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {item.koiFish?.rfid ||
                              item.packetFish?.name ||
                              "Sản phẩm"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Số lượng: {item.quantity}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatCurrency(item.unitPrice)} / cái
                          </p>
                        </div>

                        {/* Price */}
                        <div className="flex flex-col items-end justify-center min-w-0">
                          <p className="font-semibold">
                            {formatCurrency(item.totalPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <Card className="text-left mb-8">
            <CardHeader>
              <CardTitle>Liên hệ hỗ trợ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Hotline</p>
                    <p className="text-sm text-muted-foreground">1900 1234</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      support@koifarm.vn
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/catalog">
                  <ShoppingCart className="h-4 w-4" />
                  Tiếp tục mua sắm
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/profile/orders">
                  <ShoppingBag className="h-4 w-4" />
                  Xem đơn hàng
                </Link>
              </Button>
            </div>
            <Button asChild variant="outline" className="w-full sm:w-48">
              <Link href="/">
                <Home className="h-4 w-4" /> Về trang chủ
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
