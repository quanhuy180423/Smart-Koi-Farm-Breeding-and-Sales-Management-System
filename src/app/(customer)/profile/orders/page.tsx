"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Search,
  Eye,
  AlertCircle,
  Star,
  Loader2,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import CustomerLayout from "@/components/customer/CustomerLayout";
import { useGetCustomerOrders, useUpdateOrderStatus } from "@/hooks/useOrder";
import { OrderStatus, OrderSearchParams } from "@/lib/api/services/fetchOrder";
import { useDebounce } from "@/hooks/useDebounce";
import { useCreatePayment } from "@/hooks/useOrderPayment";
import { PaymentMethod } from "@/lib/api/services/fetchOrderPayment";
import { PaginationSection } from "@/components/common/PaginationSection";
import {
  getOrderStatusLabel,
  getOrderStatusText,
  getOrderStatusColor,
} from "@/lib/utils/enum/formatEnum";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Complete order dialog state
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Update order status mutation
  const updateStatusMutation = useUpdateOrderStatus();

  // Payment mutation
  const paymentMutation = useCreatePayment();

  // Handler for completing order (SHIPPED -> COMPLETED)
  const handleCompleteOrder = () => {
    if (!selectedOrderId) {
      toast.error("Không tìm thấy đơn hàng");
      return;
    }

    updateStatusMutation.mutate(
      {
        orderId: selectedOrderId,
        request: {
          status: OrderStatus.COMPLETED,
          note: "đã nhận được hàng",
        },
      },
      {
        onSuccess: () => {
          toast.success("Đơn hàng đã hoàn thành");
          setIsCompleteDialogOpen(false);
          setSelectedOrderId(null);
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

  // Handler for paying order (CREATED -> PENDING_PAYMENT)
  const handlePayOrder = (orderId: number) => {
    paymentMutation.mutate({
      orderId,
      method: PaymentMethod.VNPAY,
    });
  };

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Build search params
  const searchParams = useMemo<OrderSearchParams>(() => {
    return {
      search: debouncedSearchTerm || undefined,
      status:
        statusFilter && statusFilter !== "all"
          ? (statusFilter as OrderStatus)
          : undefined,
      pageIndex: currentPage,
      pageSize: pageSize,
    };
  }, [debouncedSearchTerm, statusFilter, currentPage, pageSize]);

  // Fetch orders
  const { data: ordersData, isLoading } = useGetCustomerOrders(searchParams);

  const OrderDetailsModal = ({ orderId }: { orderId: number }) => {
    // Find the specific order from the current data
    const specificOrder = ordersData?.data?.find((o) => o.id === orderId);

    if (!specificOrder) return null;

    return (
      <div className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-muted-foreground text-xs">Mã đơn hàng</p>
            <p className="font-medium">{specificOrder.orderNumber}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-muted-foreground text-xs">Trạng thái</p>
            <Badge
              className={`${getOrderStatusColor(specificOrder.status)} mt-1`}
            >
              {getOrderStatusText(specificOrder.status)}
            </Badge>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-muted-foreground text-xs">Ngày đặt hàng</p>
            <p className="font-medium">
              {new Date(specificOrder.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-muted-foreground text-xs">Số sản phẩm</p>
            <p className="font-medium">{specificOrder.orderDetails.length}</p>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold mb-3 text-base">Sản phẩm đã đặt</h4>
          <div className="space-y-3">
            {specificOrder.orderDetails.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row gap-3 p-3 border rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm md:text-base truncate">
                    {item?.koiFish?.rfid || item.packetFish?.name || "Sản phẩm"}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Số lượng: {item.quantity}
                  </p>
                </div>
                <div className="flex justify-between items-center md:flex-col md:items-end md:justify-center md:min-w-0">
                  <span className="text-xs md:text-sm text-muted-foreground">
                    Đơn giá
                  </span>
                  <span className="font-semibold text-sm md:text-base text-primary">
                    {formatCurrency(item.unitPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg">
          <span className="font-bold text-base md:text-lg">Tổng cộng:</span>
          <span className="font-bold text-lg md:text-xl text-primary">
            {formatCurrency(specificOrder.totalAmount)}
          </span>
        </div>
      </div>
    );
  };

  const OrderCard = ({ orderId }: { orderId: number }) => {
    const order = ordersData?.data?.find((o) => o.id === orderId);

    if (!order) return null;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg">
                Đơn hàng #{order.orderNumber}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <Badge className={getOrderStatusColor(order.status)}>
              <div className="flex items-center gap-1">
                {(() => {
                  const Icon = getOrderStatusLabel(order.status).icon;
                  return <Icon className="h-4 w-4" />;
                })()}
                <span className="hidden sm:inline">
                  {getOrderStatusText(order.status)}
                </span>
              </div>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Package className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {order.orderDetails[0]?.koiFish?.rfid ||
                  order.orderDetails[0]?.packetFish?.name ||
                  "Sản phẩm"}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.orderDetails.length > 1
                  ? `và ${order.orderDetails.length - 1} sản phẩm khác`
                  : `${order.orderDetails.length} sản phẩm`}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Tổng tiền</p>
              <p className="font-bold text-lg md:text-base text-primary">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full md:w-auto"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Chi tiết
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-[95vw] md:w-3xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
                  <DialogHeader>
                    <DialogTitle className="text-lg md:text-xl">
                      Chi tiết đơn hàng #{order.orderNumber}
                    </DialogTitle>
                  </DialogHeader>
                  <OrderDetailsModal orderId={order.id} />
                </DialogContent>
              </Dialog>
              {order.status === OrderStatus.CREATED && (
                <Button
                  size="sm"
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
                  onClick={() => handlePayOrder(order.id)}
                  disabled={paymentMutation.isPending}
                >
                  {paymentMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-1" />
                      Thanh toán
                    </>
                  )}
                </Button>
              )}
              {order.status === OrderStatus.SHIPPED && (
                <Button
                  size="sm"
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setSelectedOrderId(order.id);
                    setIsCompleteDialogOpen(true);
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Xác nhận đã nhận hàng
                </Button>
              )}
              {[OrderStatus.COMPLETED].includes(
                order.status as OrderStatus,
              ) && (
                <Button size="sm" className="w-full md:w-auto">
                  <Star className="w-4 h-4 mr-1" />
                  Đánh giá
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold">Đơn hàng của tôi</h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý các đơn hàng
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Tìm kiếm theo mã đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full rounded-xl border-2 border-border hover:border-primary/50 focus:border-primary transition-colors">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              {Object.values(OrderStatus).map((r) => (
                <SelectItem key={r} value={r}>
                  {getOrderStatusLabel(r).label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && ordersData?.data && ordersData.data.length > 0 && (
            <>
              <div className="space-y-4">
                {ordersData.data.map((order) => (
                  <OrderCard key={order.id} orderId={order.id} />
                ))}
              </div>

              {/* Pagination */}
              {ordersData.totalPages > 1 && (
                <div className="mt-6">
                  <PaginationSection
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={ordersData.totalPages || 1}
                    totalItems={ordersData.totalItems || 0}
                    postsPerPage={pageSize}
                    setPageSize={(size) => {
                      setPageSize(size);
                      setCurrentPage(1);
                    }}
                    hasNextPage={ordersData.hasNextPage}
                    hasPreviousPage={ordersData.hasPreviousPage}
                  />
                </div>
              )}
            </>
          )}

          {!isLoading &&
            (!ordersData?.data || ordersData.data.length === 0) && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Không tìm thấy đơn hàng nào
                </p>
              </div>
            )}

          {!isLoading && !ordersData && (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Lỗi tải dữ liệu</h3>
              <p className="text-muted-foreground">
                Không thể tải danh sách đơn hàng. Vui lòng thử lại.
              </p>
            </div>
          )}
        </div>

        {/* Complete Order Dialog */}
        <Dialog
          open={isCompleteDialogOpen}
          onOpenChange={setIsCompleteDialogOpen}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Xác nhận hoàn thành đơn hàng</DialogTitle>
              <DialogDescription>
                Xác nhận rằng bạn đã nhận được hàng và đơn hàng sẽ chuyển sang
                trạng thái &quot;Hoàn thành&quot;
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  Sau khi xác nhận, đơn hàng sẽ chuyển sang trạng thái
                  &quot;Hoàn thành&quot; và bạn có thể đánh giá sản phẩm.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsCompleteDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleCompleteOrder}
                disabled={updateStatusMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {updateStatusMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xác nhận...
                  </>
                ) : (
                  "Xác nhận hoàn thành"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </CustomerLayout>
  );
}
