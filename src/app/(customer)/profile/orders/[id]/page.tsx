"use client";

import { useRouter, useParams } from "next/navigation";
import { useGetOrderById, useUpdateOrderStatus } from "@/hooks/useOrder";
import { useCreatePayment } from "@/hooks/useOrderPayment";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Loader2,
  DollarSign,
  Package,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import CustomerLayout from "@/components/customer/CustomerLayout";
import { OrderStatus } from "@/lib/api/services/fetchOrder";
import { PaymentMethod } from "@/lib/api/services/fetchOrderPayment";
import {
  getOrderStatusColor,
  getOrderStatusText,
  getOrderStatusLabel,
  getOrderStatusTimeline,
} from "@/lib/utils/enum/formatEnum";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id ? Number(params.id) : undefined;

  const { data: order, isLoading } = useGetOrderById(orderId);
  const updateStatusMutation = useUpdateOrderStatus();
  const paymentMutation = useCreatePayment();

  const handlePayOrder = (orderId: number) => {
    paymentMutation.mutate({
      orderId,
      method: PaymentMethod.VNPAY,
    });
  };

  const handleCompleteOrder = () => {
    if (!orderId) {
      toast.error("Không tìm thấy đơn hàng");
      return;
    }

    updateStatusMutation.mutate(
      {
        orderId,
        request: {
          status: OrderStatus.COMPLETED,
          note: "đã nhận được hàng",
        },
      },
      {
        onSuccess: () => {
          toast.success("Đơn hàng đã hoàn thành");
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Không thể hoàn thành đơn hàng",
          );
        },
      },
    );
  };

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </CustomerLayout>
    );
  }

  if (!order) {
    return (
      <CustomerLayout>
        <div className="max-w-6xl mx-auto flex flex-col gap-6 py-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-fit"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Không tìm thấy đơn hàng</p>
            </CardContent>
          </Card>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <h1 className="text-3xl font-bold">
              Chi tiết đơn hàng {order.orderNumber}
            </h1>
            <p className="text-muted-foreground">
              Xem thông tin chi tiết về đơn hàng của bạn
            </p>
          </div>
          <Badge
            className={`${getOrderStatusColor(order.status)} text-lg px-4 py-2`}
          >
            <div className="flex items-center gap-2">
              {(() => {
                const Icon = getOrderStatusLabel(order.status).icon;
                return <Icon className="h-5 w-5" />;
              })()}
              <span>{getOrderStatusText(order.status)}</span>
            </div>
          </Badge>
        </div>

        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Thông tin đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                <p className="font-mono font-bold text-lg">
                  {order.orderNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ngày đặt hàng</p>
                <p className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số sản phẩm</p>
                <p className="font-medium">
                  {order.orderDetails.length} sản phẩm
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Trạng thái đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {getOrderStatusTimeline(order?.status).map((step) => (
                  <div key={step.status} className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.active ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <div className="w-2 h-2 bg-current rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          step.active
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Chi tiết sản phẩm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.orderDetails.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      {item.koiFish?.rfid ||
                        item.packetFish?.name ||
                        "Sản phẩm"}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Số lượng: {item.quantity}
                    </p>
                    {item.koiFishId && (
                      <p className="text-sm text-muted-foreground">
                        ID Cá Koi: {item.koiFishId}
                      </p>
                    )}
                    {item.packetFishId && (
                      <p className="text-sm text-muted-foreground">
                        ID Gói cá: {item.packetFishId}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Đơn giá</p>
                    <p className="font-semibold">
                      {formatCurrency(item.unitPrice)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Tổng cộng
                    </p>
                    <p className="font-bold text-lg text-primary">
                      {formatCurrency(item.totalPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Summary & Pricing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Tóm tắt thanh toán
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tạm tính:</span>
                <span className="font-medium">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Phí vận chuyển:</span>
                <span className="font-medium">
                  {formatCurrency(order.shippingFee)}
                </span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span className="text-muted-foreground">Khuyến mãi:</span>
                  <span className="font-medium">
                    -{formatCurrency(order.discountAmount)}
                  </span>
                </div>
              )}
              {order.promotionName && (
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-muted-foreground">Mã khuyến mãi:</span>
                  <Badge variant="secondary">{order.promotionName}</Badge>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t-2 text-lg font-bold">
                <span>Tổng thanh toán:</span>
                <span className="text-primary">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Button>
          {order?.status === OrderStatus.PENDING_PAYMENT && (
            <Button
              onClick={() => handlePayOrder(order.id)}
              disabled={paymentMutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {paymentMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Thanh toán
                </>
              )}
            </Button>
          )}
          {order?.status === OrderStatus.SHIPPED && (
            <Button
              onClick={handleCompleteOrder}
              disabled={updateStatusMutation.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xác nhận...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Xác nhận đã nhận hàng
                </>
              )}
            </Button>
          )}
          <Button className="flex-1">
            <Package className="h-4 w-4 mr-2" />
            Liên hệ hỗ trợ
          </Button>
        </div>
      </div>
    </CustomerLayout>
  );
}
