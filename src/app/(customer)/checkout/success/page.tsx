"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, Phone, Mail } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-green-600 mb-2">
              Đặt hàng thành công!
            </h1>
            <p className="text-muted-foreground">
              Cảm ơn bạn đã tin tưởng và đặt hàng tại KoiFarm. Chúng tôi sẽ liên
              hệ với bạn sớm nhất.
            </p>
          </div>

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
                  <p className="font-medium">
                    #KOI{Date.now().toString().slice(-6)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Thời gian đặt:</p>
                  <p className="font-medium">
                    {new Date().toLocaleString("vi-VN")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Trạng thái:</p>
                  <p className="font-medium text-orange-600">Đang xử lý</p>
                </div>
                <div>
                  <p className="text-muted-foreground">
                    Phương thức thanh toán:
                  </p>
                  <p className="font-medium">Thanh toán khi nhận hàng</p>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Quy trình xử lý đơn hàng:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                  <li>Xác nhận đơn hàng (trong 2 giờ)</li>
                  <li>Chuẩn bị cá và đóng gói chuyên nghiệp</li>
                  <li>Vận chuyển đến địa chỉ của bạn</li>
                  <li>Giao hàng và hướng dẫn chăm sóc</li>
                </ol>
              </div>
            </CardContent>
          </Card>

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
                <Link href="/catalog">Tiếp tục mua sắm</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/profile/orders">Xem đơn hàng</Link>
              </Button>
            </div>
            <Button asChild variant="ghost">
              <Link href="/">Về trang chủ</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
