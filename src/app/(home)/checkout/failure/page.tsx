"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useGetOrderById } from "@/hooks/useOrder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  XCircle,
  AlertTriangle,
  Phone,
  Mail,
  RefreshCw,
  CreditCard,
  Truck,
  ShoppingCart,
  Home,
  Loader2,
  User,
  Package,
  Fish,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { DATE_FORMATS, formatDate } from "@/lib/utils/dates";
import { getOrderStatusText } from "@/lib/utils/enum";

export default function CheckoutFailurePage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<number | null>(null);
  const [errorCode, setErrorCode] = useState("");

  useEffect(() => {
    const paramCode = searchParams.get("code");
    const paramOrderId = searchParams.get("orderId");

    if (paramOrderId) {
      setOrderId(Number(paramOrderId));
    }

    // Generate error code
    setErrorCode(
      paramCode ? `ERR_${paramCode}` : `ERR_${Date.now().toString().slice(-6)}`,
    );
  }, [searchParams]);

  const { data: order, isLoading } = useGetOrderById(orderId ?? undefined);

  const commonIssues = [
    {
      icon: CreditCard,
      title: "Thông tin thanh toán",
      description: "Kiểm tra lại thông tin thẻ hoặc phương thức thanh toán",
    },
    {
      icon: Truck,
      title: "Địa chỉ giao hàng",
      description: "Xác nhận địa chỉ giao hàng có chính xác không",
    },
    {
      icon: AlertTriangle,
      title: "Kết nối mạng",
      description: "Kiểm tra kết nối internet và thử lại",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-red-50/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="relative mx-auto mb-6 w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse" />
              <XCircle className="h-16 w-16 text-red-500 relative z-10" />
            </div>
            <h1 className="text-3xl font-bold text-red-600 mb-2">
              Đặt hàng thất bại!
            </h1>
            <p className="text-muted-foreground text-lg">
              Rất tiếc, đơn hàng của bạn không thể được xử lý. Vui lòng thử lại
              hoặc liên hệ với chúng tôi.
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
              <Card className="text-left mb-8 border-red-200 bg-red-50/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <Package className="h-5 w-5" />
                    Thông tin đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-red-100/50 p-4 rounded-lg border border-red-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Mã lỗi:</p>
                        <p className="font-mono text-red-600 font-medium">
                          {errorCode}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Mã đơn hàng:</p>
                        <p className="font-mono text-red-600 font-medium">
                          {order.orderNumber}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-muted-foreground text-sm">
                        Lý do có thể:
                      </p>
                      <p className="text-red-700 font-medium">
                        Lỗi kết nối hoặc thông tin thanh toán không hợp lệ
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Thời gian đặt:</p>
                      <p className="font-medium">
                        {formatDate(order.createdAt, DATE_FORMATS.DATETIME_24H)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Trạng thái:</p>
                      <Badge className="mt-1">
                        {getOrderStatusText(order.status)}
                      </Badge>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-muted-foreground text-sm">Tổng tiền:</p>
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="text-left mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fish className="h-5 w-5" />
                    Sản phẩm trong đơn hàng
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
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-blue-600" />
                Các bước khắc phục
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commonIssues.map((issue, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border/50"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <issue.icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{issue.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {issue.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-medium mb-2 text-amber-800">💡 Gợi ý:</h4>
                <ul className="text-sm space-y-1 text-amber-700">
                  <li>• Làm mới trang và thử đặt hàng lại</li>
                  <li>• Kiểm tra kết nối internet của bạn</li>
                  <li>• Sử dụng trình duyệt khác hoặc tắt chặn quảng cáo</li>
                  <li>• Liên hệ với chúng tôi nếu vấn đề vẫn tiếp tục</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="text-left mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
                Cần hỗ trợ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Đội ngũ hỗ trợ của chúng tôi sẵn sàng giúp bạn hoàn tất đơn hàng
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Hotline 24/7</p>
                    <p className="text-sm text-green-600 font-mono">
                      1900 1234
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">Email hỗ trợ</p>
                    <p className="text-sm text-blue-600">support@koifarm.vn</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 sm:w-48"
              >
                <Link href="/checkout">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Thử đặt hàng lại
                </Link>
              </Button>
              <Button asChild variant="outline" className="sm:w-48">
                <Link href="/profile/cart">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Quay lại giỏ hàng
                </Link>
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" className="sm:w-48">
                <Link href="/catalog">Tiếp tục mua sắm</Link>
              </Button>
              <Button asChild variant="outline" className="sm:w-48">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Về trang chủ
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-muted/50 rounded-lg border">
            <p className="text-xs text-muted-foreground">
              Nếu bạn tiếp tục gặp vấn đề, vui lòng cung cấp mã lỗi{" "}
              <span className="font-mono bg-red-100 px-1 rounded">
                {errorCode || "ERR_XXXXXX"}
              </span>{" "}
              khi liên hệ với bộ phận hỗ trợ để được xử lý nhanh chóng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
