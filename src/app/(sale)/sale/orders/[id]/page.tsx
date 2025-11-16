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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  DollarSign,
  Package,
  CheckCircle,
  XCircle,
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

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id ? Number(params.id) : undefined;

  const { data: order, isLoading } = useGetOrderById(orderId);

  // Confirm order dialog state
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmNote, setConfirmNote] = useState<string>("");

  // Cancel order dialog state
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState<string>("");

  // Update order status mutation
  const updateStatusMutation = useUpdateOrderStatus();

  // Check if order can be updated
  const canUpdateOrder = (status: string): boolean => {
    return status === OrderStatus.PAID;
  };

  // Handler for confirming order (PAID -> CONFIRMED)
  const handleConfirmOrder = () => {
    if (!orderId) {
      toast.error("Không tìm thấy đơn hàng");
      return;
    }

    updateStatusMutation.mutate(
      {
        orderId: orderId,
        request: {
          status: OrderStatus.CONFIRMED,
          note: confirmNote || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Đơn hàng đã được xác nhận");
          setIsConfirmDialogOpen(false);
          setConfirmNote("");
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Không thể xác nhận đơn hàng",
          );
        },
      },
    );
  };

  // Handler for cancelling order (PAID -> CANCELLED)
  const handleCancelOrder = () => {
    if (!orderId) {
      toast.error("Không tìm thấy đơn hàng");
      return;
    }

    if (!cancelReason.trim()) {
      toast.error("Vui lòng nhập lý do hủy đơn");
      return;
    }

    updateStatusMutation.mutate(
      {
        orderId: orderId,
        request: {
          status: OrderStatus.CANCELLED,
          note: cancelReason,
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
            error instanceof Error ? error.message : "Không thể hủy đơn hàng",
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Chi tiết đơn hàng {order.orderNumber}
          </h1>
          <p className="text-muted-foreground">
            Xem thông tin chi tiết về đơn hàng
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
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted border">
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
                <div className="text-right flex-shrink-0">
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

        {/* Show action buttons only for PAID status */}
        {order && canUpdateOrder(order.status) && (
          <>
            <Button
              onClick={() => setIsConfirmDialogOpen(true)}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Xác nhận đơn
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

        {/*
        <Button variant="outline" className="flex-1">
          <Mail className="h-4 w-4 mr-2" />
          Gửi thông báo khách hàng
        </Button>
        */}
      </div>

      {/* Confirm Order Dialog */}
      {order && (
        <Dialog
          open={isConfirmDialogOpen}
          onOpenChange={setIsConfirmDialogOpen}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Xác nhận đơn hàng</DialogTitle>
              <DialogDescription>
                Xác nhận đơn hàng và chuyển sang trạng thái &quot;Đã xác
                nhận&quot;
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  Sau khi xác nhận, đơn hàng sẽ chuyển sang trạng thái &quot;Đã
                  xác nhận&quot; và sẵn sàng để giao hàng.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Ghi chú (tùy chọn)
                </label>
                <Textarea
                  placeholder="Thêm ghi chú khi xác nhận đơn hàng..."
                  value={confirmNote}
                  onChange={(e) => setConfirmNote(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsConfirmDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleConfirmOrder}
                disabled={updateStatusMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {updateStatusMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xác nhận...
                  </>
                ) : (
                  "Xác nhận đơn hàng"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Cancel Order Dialog */}
      {order && (
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
                <label className="text-sm font-medium mb-2 block text-red-600">
                  Lý do hủy đơn *
                </label>
                <Textarea
                  placeholder="Nhập lý do hủy đơn hàng (bắt buộc)..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={4}
                  className="border-red-300 focus:border-red-500"
                />
                {!cancelReason.trim() && (
                  <p className="text-xs text-red-600 mt-1">
                    Lý do hủy là bắt buộc
                  </p>
                )}
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
                disabled={
                  updateStatusMutation.isPending || !cancelReason.trim()
                }
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
      )}
    </div>
  );
}
