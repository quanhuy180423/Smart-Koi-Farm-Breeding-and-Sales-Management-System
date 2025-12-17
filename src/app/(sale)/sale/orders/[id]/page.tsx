"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useGetOrderById,
  useUpdateOrderStatus,
  useRestockPacketFish,
} from "@/hooks/useOrder";
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
  User,
  Fish,
  Truck,
  Ban,
  PackageX,
  MapPin,
  Phone,
  PackagePlus,
} from "lucide-react";
import Image from "next/image";
import { OrderStatus } from "@/lib/api/services/fetchOrder";
import {
  getOrderStatusColor,
  getOrderStatusText,
  getOrderStatusLabel,
} from "@/lib/utils/enum/formatEnum";
import { formatDate, DATE_FORMATS } from "@/lib/utils/dates";
import Link from "next/link";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id ? Number(params.id) : undefined;

  const { data: order, isLoading } = useGetOrderById(orderId);

  // Confirm order dialog state
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmNote, setConfirmNote] = useState<string>("");

  // UnShip order dialog state
  const [isUnShipDialogOpen, setIsUnShipDialogOpen] = useState(false);
  const [unShipReason, setUnShipReason] = useState<string>("");

  // Deliver order dialog state
  const [isDeliverDialogOpen, setIsDeliverDialogOpen] = useState(false);
  const [deliverNote, setDeliverNote] = useState<string>("");

  // Reject order dialog state
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState<string>("");

  // Restock packet fish dialog state
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);

  // Update order status mutation
  const updateStatusMutation = useUpdateOrderStatus();

  // Restock packet fish mutation
  const restockMutation = useRestockPacketFish();

  // Handler for confirming order (PROCESSING -> SHIPPED)
  const handleConfirmOrder = () => {
    if (!orderId) {
      toast.error("Không tìm thấy đơn hàng");
      return;
    }

    updateStatusMutation.mutate(
      {
        orderId: orderId,
        request: {
          status: OrderStatus.SHIPPED,
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
              : "Không thể xác nhận đơn hàng"
          );
        },
      }
    );
  };

  // Handler for unshipping order (PROCESSING/SHIPPED -> UNSHIPPING)
  const handleUnShipOrder = () => {
    if (!orderId) {
      toast.error("Không tìm thấy đơn hàng");
      return;
    }

    if (!unShipReason.trim()) {
      toast.error("Vui lòng nhập lý do hoàn trả");
      return;
    }

    updateStatusMutation.mutate(
      {
        orderId: orderId,
        request: {
          status: OrderStatus.UNSHIPPING,
          note: unShipReason,
        },
      },
      {
        onSuccess: () => {
          toast.success("Đơn hàng đã chuyển sang trạng thái hoàn trả");
          setIsUnShipDialogOpen(false);
          setUnShipReason("");
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Không thể chuyển trạng thái hoàn trả"
          );
        },
      }
    );
  };

  // Handler for delivering order (SHIPPED -> DELIVERED)
  const handleDeliverOrder = () => {
    if (!orderId) {
      toast.error("Không tìm thấy đơn hàng");
      return;
    }

    updateStatusMutation.mutate(
      {
        orderId: orderId,
        request: {
          status: OrderStatus.DELIVERED,
          note: deliverNote || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Đơn hàng đã được giao thành công");
          setIsDeliverDialogOpen(false);
          setDeliverNote("");
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Không thể xác nhận giao hàng"
          );
        },
      }
    );
  };

  // Handler for rejecting order (SHIPPED -> REJECTED)
  const handleRejectOrder = () => {
    if (!orderId) {
      toast.error("Không tìm thấy đơn hàng");
      return;
    }

    if (!rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    updateStatusMutation.mutate(
      {
        orderId: orderId,
        request: {
          status: OrderStatus.REJECTED,
          note: rejectReason,
        },
      },
      {
        onSuccess: () => {
          toast.success("Đơn hàng đã bị từ chối");
          setIsRejectDialogOpen(false);
          setRejectReason("");
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Không thể từ chối đơn hàng"
          );
        },
      }
    );
  };

  // Handler for restocking packet fish
  const handleRestockPacketFish = () => {
    if (!orderId) {
      toast.error("Không tìm thấy đơn hàng");
      return;
    }

    restockMutation.mutate(orderId, {
      onSuccess: () => {
        setIsRestockDialogOpen(false);
      },
      onError: () => {
        setIsRestockDialogOpen(false);
      },
    });
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
            {order.customerAddress && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Địa chỉ giao hàng
                  </p>
                  <p className="font-medium">
                    {order.customerAddress.fullAddress}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.customerAddress.ward}, {order.customerAddress.city}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Số điện thoại người nhận
                  </p>
                  <p className="font-medium">
                    {order.customerAddress.recipientPhone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Khoảng cách từ trại
                  </p>
                  <p className="font-medium text-primary">
                    {order.customerAddress.distanceFromFarmKm?.toFixed(2)} km
                  </p>
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
              <Link
                key={index}
                href={`${item.koiFish ? `/koi/${item.koiFish?.id}` : `/packet-fish/${item.packetFish?.id}`}`}
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
              </Link>
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
                <Badge className="text-xl bg-red-400">{order.promotion?.code}</Badge>
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
        {/* Show action buttons for PROCESSING status */}
        {order && order.status === OrderStatus.PROCESSING && (
          <>
            <Button
              onClick={() => setIsConfirmDialogOpen(true)}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Xác nhận đơn
            </Button>
            <Button
              onClick={() => setIsUnShipDialogOpen(true)}
              variant="outline"
              className="flex-1"
            >
              <PackageX className="h-4 w-4 mr-2" />
              Không giao
            </Button>
          </>
        )}

        {/* Show action buttons for SHIPPED status */}
        {order && order.status === OrderStatus.SHIPPED && (
          <>
            <Button
              onClick={() => setIsDeliverDialogOpen(true)}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Truck className="h-4 w-4 mr-2" />
              Đã giao hàng
            </Button>
            <Button
              onClick={() => setIsRejectDialogOpen(true)}
              variant="destructive"
              className="flex-1"
            >
              <Ban className="h-4 w-4 mr-2" />
              Khách hàng từ chối
            </Button>
          </>
        )}

        {/* Show restock button for UNSHIPPING and REJECTED status */}
        {order &&
          (order.status === OrderStatus.UNSHIPPING ||
            order.status === OrderStatus.REJECTED) &&
          !order.isRestocked &&
          order.orderDetails.some((detail) => detail.packetFish) && (
            <Button
              onClick={() => setIsRestockDialogOpen(true)}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <PackagePlus className="h-4 w-4 mr-2" />
              Khôi phục gói cá
            </Button>
          )}
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

      {/* UnShip Order Dialog */}
      {order && (
        <Dialog open={isUnShipDialogOpen} onOpenChange={setIsUnShipDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Hoàn trả đơn hàng</DialogTitle>
              <DialogDescription>
                Chuyển đơn hàng sang trạng thái &quot;Đang hoàn trả&quot;
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-900">
                  Đơn hàng sẽ được chuyển sang trạng thái hoàn trả. Vui lòng
                  nhập lý do hoàn trả.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-orange-600">
                  Lý do hoàn trả *
                </label>
                <Textarea
                  placeholder="Nhập lý do hoàn trả đơn hàng (bắt buộc)..."
                  value={unShipReason}
                  onChange={(e) => setUnShipReason(e.target.value)}
                  rows={4}
                  className="border-orange-300 focus:border-orange-500"
                />
                {!unShipReason.trim() && (
                  <p className="text-xs text-orange-600 mt-1">
                    Lý do hoàn trả là bắt buộc
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsUnShipDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleUnShipOrder}
                disabled={
                  updateStatusMutation.isPending || !unShipReason.trim()
                }
                className="bg-orange-600 hover:bg-orange-700"
              >
                {updateStatusMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Xác nhận hoàn trả"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Deliver Order Dialog */}
      {order && (
        <Dialog
          open={isDeliverDialogOpen}
          onOpenChange={setIsDeliverDialogOpen}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Xác nhận giao hàng</DialogTitle>
              <DialogDescription>
                Xác nhận đơn hàng đã được giao thành công
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-900">
                  Sau khi xác nhận, đơn hàng sẽ chuyển sang trạng thái &quot;Đã
                  giao hàng&quot;.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Ghi chú (tùy chọn)
                </label>
                <Textarea
                  placeholder="Thêm ghi chú khi giao hàng..."
                  value={deliverNote}
                  onChange={(e) => setDeliverNote(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDeliverDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleDeliverOrder}
                disabled={updateStatusMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {updateStatusMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xác nhận...
                  </>
                ) : (
                  "Xác nhận giao hàng"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Order Dialog */}
      {order && (
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Từ chối đơn hàng</DialogTitle>
              <DialogDescription>
                Từ chối đơn hàng và chuyển sang trạng thái &quot;Đã từ
                chối&quot;
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-900">
                  ⚠️ Sau khi từ chối, không thể hoàn tác. Vui lòng chắc chắn
                  trước khi tiếp tục.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-red-600">
                  Lý do từ chối *
                </label>
                <Textarea
                  placeholder="Nhập lý do từ chối đơn hàng (bắt buộc)..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                  className="border-red-300 focus:border-red-500"
                />
                {!rejectReason.trim() && (
                  <p className="text-xs text-red-600 mt-1">
                    Lý do từ chối là bắt buộc
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsRejectDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleRejectOrder}
                disabled={
                  updateStatusMutation.isPending || !rejectReason.trim()
                }
                className="bg-red-600 hover:bg-red-700"
              >
                {updateStatusMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Xác nhận từ chối"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Restock Packet Fish Dialog */}
      {order && (
        <Dialog
          open={isRestockDialogOpen}
          onOpenChange={setIsRestockDialogOpen}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Khôi phục gói cá</DialogTitle>
              <DialogDescription>
                Khôi phục gói cá từ đơn hàng bị từ chối hoặc không giao
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  ℹ️ Gói cá trong đơn hàng này sẽ được khôi phục lại trạng thái
                  có sẵn để bán.
                </p>
              </div>

              {/* Display packet fish information */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">
                  Danh sách gói cá sẽ được khôi phục:
                </h4>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {order.orderDetails
                    .filter((detail) => detail.packetFish)
                    .map((detail) => (
                      <div
                        key={detail.id}
                        className="flex items-center gap-3 p-3 bg-white border rounded-lg"
                      >
                        {detail.packetFish?.images?.[0] && (
                          <Image
                            src={detail.packetFish.images[0]}
                            alt={detail.packetFish.name}
                            width={60}
                            height={60}
                            className="rounded object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {detail.packetFish?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Số lượng: {detail.quantity} gói
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm text-primary">
                            {formatCurrency(detail.unitPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
                {order.orderDetails.filter((detail) => detail.packetFish)
                  .length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Đơn hàng này không có gói cá
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsRestockDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleRestockPacketFish}
                disabled={restockMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {restockMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang khôi phục...
                  </>
                ) : (
                  <>
                    <PackagePlus className="mr-2 h-4 w-4" />
                    Xác nhận khôi phục
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
