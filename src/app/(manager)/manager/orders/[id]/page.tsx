"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGetOrderById, useUpdateOrderStatus } from "@/hooks/useOrder";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  DollarSign,
  Package,
  User,
  Fish,
} from "lucide-react";
import Image from "next/image";
import { OrderStatus } from "@/lib/api/services/fetchOrder";
import {
  getOrderStatusColor,
  getOrderStatusText,
  getOrderStatusLabel,
} from "@/lib/utils/enum/formatEnum";
import { formatDate, DATE_FORMATS } from "@/lib/utils/dates";

export default function ManagerOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id ? Number(params.id) : undefined;

  const { data: order, isLoading } = useGetOrderById(orderId);

  // Refund order dialog state
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);

  // Update order status mutation
  const updateStatusMutation = useUpdateOrderStatus();

  // Check if order can have refund action
  const canRefund = (status: string): boolean => {
    return status === OrderStatus.REJECTED || status === OrderStatus.UNSHIPPING;
  };

  // Handler for refunding order (REJECTED/CANCELLED/UNSHIPPING -> REFUND)
  // Auto-use existing note from order
  const handleRefundOrder = () => {
    if (!orderId) {
      toast.error("Không tìm thấy đơn hàng");
      return;
    }

    updateStatusMutation.mutate(
      {
        orderId: orderId,
        request: {
          status: OrderStatus.REFUND,
          note: order?.note || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Đơn hàng đã được hoàn tiền");
          setIsRefundDialogOpen(false);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Không thể hoàn tiền đơn hàng",
          );
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col gap-6 p-6">
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
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            Chi tiết đơn hàng {order.orderNumber}
          </h1>
          <p className="text-muted-foreground">
            Xem thông tin chi tiết về đơn hàng
          </p>
        </div>
        <div className="flex items-center gap-2">
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
          {canRefund(order.status) && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 text-lg px-4 py-2"
            >
              Có thể hoàn tiền
            </Badge>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin khách hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Tên khách hàng</p>
              <p className="font-medium text-lg">{order.customerName}</p>
            </div>
            {order.customerAddress && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Địa chỉ giao hàng</p>
                  <p className="font-medium">{order.customerAddress.fullAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số điện thoại người nhận</p>
                  <p className="font-medium">{order.customerAddress.recipientPhone}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

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
              <p className="font-mono font-bold text-lg">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ngày đặt hàng</p>
              <p className="font-medium">
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
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fish className="h-5 w-5" />
            Chi tiết sản phẩm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.orderDetails.map((item, index) => (
              <div
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
                      item.koiFish?.rfid || item.packetFish?.name || "Sản phẩm"
                    }
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h4 className="font-semibold">
                    {item.koiFish?.rfid || item.packetFish?.name || "Sản phẩm"}
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary & Pricing */}
      <Card>
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

      {/* Action Buttons - Only Refund for Manager */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Show refund button for REJECTED status */}
        {order && order.status === OrderStatus.REJECTED && (
          <Button
            onClick={() => setIsRefundDialogOpen(true)}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Hoàn tiền
          </Button>
        )}

        {/* Show refund button for UNSHIPPING status */}
        {order && order.status === OrderStatus.UNSHIPPING && (
          <Button
            onClick={() => setIsRefundDialogOpen(true)}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Hoàn tiền
          </Button>
        )}
      </div>

      {/* Refund Order Dialog */}
      {order && (
        <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Xác nhận hoàn tiền</DialogTitle>
              <DialogDescription>
                Xác nhận hoàn tiền và chuyển sang trạng thái &quot;Đã hoàn
                tiền&quot;
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  Đơn hàng sẽ chuyển sang trạng thái &quot;Đã hoàn tiền&quot; và
                  khách hàng sẽ được hoàn lại số tiền.
                </p>
              </div>

              {order.note && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm font-medium text-amber-900 mb-1">
                    Ghi chú hiện tại:
                  </p>
                  <p className="text-sm text-amber-800 italic">
                    &quot;{order.note}&quot;
                  </p>
                  <p className="text-xs text-amber-700 mt-2">
                    Ghi chú này sẽ được giữ nguyên khi hoàn tiền.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsRefundDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleRefundOrder}
                disabled={updateStatusMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {updateStatusMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Xác nhận hoàn tiền"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
