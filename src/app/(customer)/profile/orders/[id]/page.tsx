"use client";

import { useState } from "react";
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
  Clock,
  CreditCard,
  XCircle,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import CustomerLayout from "@/components/customer/CustomerLayout";
import { OrderStatus } from "@/lib/api/services/fetchOrder";
import { PaymentMethod } from "@/lib/api/services/fetchOrderPayment";
import {
  getOrderStatusColor,
  getOrderStatusText,
  getOrderStatusLabel,
  getOrderStatusTimeline,
} from "@/lib/utils/enum/formatEnum";
import { formatDate, DATE_FORMATS } from "@/lib/utils/dates";
import Link from "next/link";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id ? Number(params.id) : undefined;

  const { data: order, isLoading } = useGetOrderById(orderId);
  const updateStatusMutation = useUpdateOrderStatus();
  const paymentMutation = useCreatePayment();

  // Cancel order dialog state
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState<string>("");

  // Payment method selection dialog state
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);

  const handlePayOrder = () => {
    setIsPaymentDialogOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!orderId) {
      toast.error("Không tìm thấy đơn hàng");
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    paymentMutation.mutate(
      {
        orderId,
        method: selectedPaymentMethod,
      },
      {
        onSuccess: () => {
          setIsPaymentDialogOpen(false);
          setSelectedPaymentMethod(null);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Không thể tạo thanh toán"
          );
        },
      }
    );
  };

  const handleCancelOrder = () => {
    if (!orderId) {
      toast.error("Không tìm thấy đơn hàng");
      return;
    }

    updateStatusMutation.mutate(
      {
        orderId,
        request: {
          status: OrderStatus.CANCELLED,
          note: cancelReason || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Đơn hàng đã được hủy");
          setIsCancelDialogOpen(false);
          setCancelReason("");
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Không thể hủy đơn hàng"
          );
        },
      }
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
                  {formatDate(order.createdAt, DATE_FORMATS.DATETIME_24H)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số sản phẩm</p>
                <p className="font-medium">
                  {order.orderDetails.length} sản phẩm
                </p>
              </div>
              {order.note && (
                <div>
                  <p className="text-sm text-muted-foreground">Ghi chú</p>
                  <p className="font-medium text-amber-700 italic">
                    {order.note}
                  </p>
                </div>
              )}
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
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
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
                            ? "text-secondary-foreground"
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
                <Link
                  href={`/koi/${item.koiFish?.id}`}
                  key={index}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* Product Image */}
                  <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-muted border">
                    <Image
                      src={
                        item.koiFish?.images?.[0] ||
                        item.packetFish?.images?.[0] ||
                        "/placeholder.svg"
                      }
                      alt={
                        item.koiFish?.rfid ||
                        item.packetFish?.name ||
                        "Sản phẩm"
                      }
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      {item.koiFish?.rfid ||
                        item.packetFish?.name ||
                        "Sản phẩm"}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.koiFish?.variety?.varietyName ||
                        item.packetFish?.varietyPacketFishes?.[0]?.varietyName}
                    </p>
                    <div className="flex flex-col gap-1 mt-2 text-sm text-muted-foreground">
                      <p>Số lượng: {item.quantity}</p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="text-right shrink-0">
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
                </Link>
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
              {order.promotion?.code && (
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-muted-foreground">Mã khuyến mãi:</span>
                  <Badge variant="secondary">{order.promotion?.code}</Badge>
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
          {order?.status === OrderStatus.PENDING && (
            <>
              <Button
                onClick={() => handlePayOrder()}
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
              <Button
                onClick={() => setIsCancelDialogOpen(true)}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Hủy đơn hàng
              </Button>
            </>
          )}
          <Button className="flex-1">
            <Package className="h-4 w-4 mr-2" />
            Liên hệ hỗ trợ
          </Button>
        </div>

        {/* Payment Method Dialog */}
        <Dialog
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Chọn phương thức thanh toán</DialogTitle>
              <DialogDescription>
                Vui lòng chọn một phương thức thanh toán để hoàn tất đơn hàng
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <button
                onClick={() => setSelectedPaymentMethod(PaymentMethod.VNPAY)}
                className={`w-full p-4 border-2 rounded-lg transition-colors text-left ${
                  selectedPaymentMethod === PaymentMethod.VNPAY
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPaymentMethod === PaymentMethod.VNPAY
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {selectedPaymentMethod === PaymentMethod.VNPAY && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">VNPay</p>
                    <p className="text-sm text-muted-foreground">
                      Thanh toán qua cổng VNPay
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedPaymentMethod(PaymentMethod.PAYOS)}
                className={`w-full p-4 border-2 rounded-lg transition-colors text-left ${
                  selectedPaymentMethod === PaymentMethod.PAYOS
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPaymentMethod === PaymentMethod.PAYOS
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {selectedPaymentMethod === PaymentMethod.PAYOS && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">PayOS</p>
                    <p className="text-sm text-muted-foreground">
                      Thanh toán qua cổng PayOS
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsPaymentDialogOpen(false);
                  setSelectedPaymentMethod(null);
                }}
              >
                Huỷ
              </Button>
              <Button
                onClick={handleConfirmPayment}
                disabled={paymentMutation.isPending || !selectedPaymentMethod}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {paymentMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Tiếp tục thanh toán
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Cancel Order Dialog */}
        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Hủy đơn hàng</DialogTitle>
              <DialogDescription>
                Hủy đơn hàng và chuyển sang trạng thái &quot;Đã hủy&quot;
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-900">
                  ⚠️ Sau khi hủy, không thể hoàn tác. Vui lòng chắc chắn trước
                  khi tiếp tục.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Lý do hủy đơn (tùy chọn)
                </label>
                <Textarea
                  placeholder="Nhập lý do hủy đơn hàng (tùy chọn)..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsCancelDialogOpen(false)}
              >
                Không hủy
              </Button>
              <Button
                onClick={handleCancelOrder}
                disabled={updateStatusMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {updateStatusMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang hủy...
                  </>
                ) : (
                  "Xác nhận hủy đơn"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </CustomerLayout>
  );
}
