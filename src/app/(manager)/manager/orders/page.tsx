"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShoppingCart,
  Search,
  MoreHorizontal,
  Eye,
  Package,
  User,
  Fish,
  DollarSign,
  Loader2,
  X,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { useGetAllOrders, useUpdateOrderStatus } from "@/hooks/useOrder";
import { OrderStatus, OrderSearchParams } from "@/lib/api/services/fetchOrder";
import { toast } from "sonner";
import { PaginationWithLinks } from "@/components/pagination";
import {
  getOrderStatusLabel,
  getOrderStatusText,
  getOrderStatusColor,
} from "@/lib/utils/enum/formatEnum";
import { DATE_FORMATS, formatDate } from "@/lib/utils/dates";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";

export default function ManagerOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // Date filter removed — using no date range
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  // Refund order dialog state
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);

  // Selected order for actions
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Update order status mutation
  const updateStatusMutation = useUpdateOrderStatus();

  // Check if order can have refund action
  const canRefund = (status: string): boolean => {
    return status === OrderStatus.REJECTED || status === OrderStatus.UNSHIPPING;
  };

  // Handler for opening refund dialog
  const handleOpenRefundDialog = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsRefundDialogOpen(true);
  };

  // Handler for refunding order (REJECTED/UNSHIPPING -> REFUND)
  // Auto-use existing note from selected order
  const handleRefundOrder = () => {
    if (!selectedOrderId) {
      toast.error("Không tìm thấy đơn hàng");
      return;
    }

    // Find the selected order to get its note
    const selectedOrder = ordersData?.data?.find(
      (order) => order.id === selectedOrderId,
    );

    updateStatusMutation.mutate(
      {
        orderId: selectedOrderId,
        request: {
          status: OrderStatus.REFUND,
          note: selectedOrder?.note || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Đơn hàng đã được hoàn tiền");
          setIsRefundDialogOpen(false);
          setSelectedOrderId(null);
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

  // Debounce search term only
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Debounce price filters
  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

  // Build search params
  const searchParams = useMemo<OrderSearchParams>(() => {
    return {
      search: debouncedSearchTerm || undefined,
      status:
        statusFilter && statusFilter !== "all"
          ? (statusFilter as OrderStatus)
          : undefined,
      // Date filter removed
      minTotalAmount: debouncedMinPrice
        ? parseFloat(debouncedMinPrice)
        : undefined,
      maxTotalAmount: debouncedMaxPrice
        ? parseFloat(debouncedMaxPrice)
        : undefined,
      pageIndex: currentPage,
      pageSize: pageSize,
    };
  }, [
    debouncedSearchTerm,
    statusFilter,
    debouncedMinPrice,
    debouncedMaxPrice,
    currentPage,
    pageSize,
  ]);

  // Fetch orders
  const { data: ordersData, isLoading } = useGetAllOrders(searchParams);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            Quản lý đơn hàng
          </h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý các đơn hàng - Chỉ có quyền hoàn tiền
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Danh sách đơn hàng</CardTitle>
                <CardDescription>
                  Quản lý và theo dõi trạng thái đơn hàng
                </CardDescription>
              </div>
            </div>

            {/* Filters Row 1 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 border border-gray-300 rounded-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo mã đơn, tên KH..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 border border-gray-300">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {Object.values(OrderStatus).map((o) => (
                    <SelectItem key={o} value={o}>
                      {getOrderStatusText(o)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filters Row 2 - Price Range - FIX #1: Clean working filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-start">
              <div className="flex gap-2 flex-1">
                <div className="flex-col gap-2 w-full">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="Từ giá (VNĐ)"
                      className="pl-10 border-gray-300"
                      min="0"
                    />
                  </div>
                  {minPrice && parseFloat(minPrice) > 0 && (
                    <p className="text-xs text-primary font-medium mt-1.5 pl-1">
                      Từ: {formatCurrency(parseFloat(minPrice))}
                    </p>
                  )}
                </div>

                {/* <span className="flex items-center text-muted-foreground px-2 pt-2">
                  -
                </span> */}
                <div className="flex-col gap-2 w-full">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Đến giá (VNĐ)"
                      className="pl-10 border-gray-300"
                      min="0"
                    />
                  </div>
                  {maxPrice && parseFloat(maxPrice) > 0 && (
                    <p className="text-xs text-primary font-medium mt-1.5 pl-1">
                      Đến: {formatCurrency(parseFloat(maxPrice))}
                    </p>
                  )}
                </div>
              </div>

              {/* Clear Filters Button */}
              {(minPrice ||
                maxPrice ||
                searchTerm ||
                statusFilter !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="shrink-0 gap-2"
                >
                  <X className="h-4 w-4" />
                  Xóa tất cả bộ lọc
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading && (
              <LoadingState message="Đang tải danh sách đơn hàng..." />
            )}

            {!isLoading && !ordersData && (
              <ErrorState
                title="Lỗi khi tải dữ liệu"
                message="Không thể tải danh sách đơn hàng. Vui lòng thử lại."
              />
            )}

            {!isLoading &&
              ordersData?.data &&
              ordersData.data.length > 0 &&
              ordersData.data.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col lg:flex-row lg:items-start lg:justify-between p-5 border-2 rounded-xl hover:border-primary/30 hover:shadow-md transition-all gap-4 group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    {/* FIX #2 & #3: Larger icon, better visual hierarchy */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Package className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-3">
                      {/* Header with better spacing */}
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-lg">
                          {order.orderNumber}
                        </h3>
                        <Badge
                          className={`${getOrderStatusColor(order.status)} text-xs`}
                          variant="secondary"
                        >
                          <div className="flex items-center gap-1.5">
                            {(() => {
                              const Icon = getOrderStatusLabel(
                                order.status,
                              ).icon;
                              return <Icon className="h-3.5 w-3.5" />;
                            })()}
                            <span>{getOrderStatusText(order.status)}</span>
                          </div>
                        </Badge>
                        {/* FIX #10: Visual feedback for refundable */}
                        {canRefund(order.status) && (
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-300 animate-pulse"
                          >
                            <DollarSign className="h-3 w-3 mr-1" />
                            Cần hoàn tiền
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 shrink-0" />
                          <span className="truncate">{order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>
                            {formatDate(
                              order.createdAt,
                              DATE_FORMATS.DATETIME_24H,
                            )}
                          </span>
                        </div>
                      </div>

                      {/* FIX #3: Larger images with hover preview */}
                      <div className="text-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <Fish className="h-4 w-4 text-primary" />
                          <span className="font-medium">
                            {order?.orderDetails?.length || 0} sản phẩm
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {order?.orderDetails?.slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className="group/item relative flex items-center gap-2 p-2 bg-white rounded-lg border-2 hover:border-primary/50 hover:shadow-sm transition-all"
                            >
                              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0 group-hover/item:scale-110 transition-transform">
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
                              <div className="flex flex-col min-w-0">
                                <span className="font-semibold text-xs truncate max-w-[120px]">
                                  {item.koiFish?.rfid || item.packetFish?.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  SL: {item.quantity}
                                </span>
                                <span className="text-xs font-medium text-primary">
                                  {formatCurrency(item.totalPrice)}
                                </span>
                              </div>
                            </div>
                          ))}
                          {order?.orderDetails?.length > 3 && (
                            <div className="flex items-center justify-center p-3 bg-muted/30 rounded-lg border-2 border-dashed min-w-[80px] hover:bg-muted/50 transition-colors">
                              <span className="text-sm font-medium text-muted-foreground">
                                +{order.orderDetails.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-4">
                    <div className="text-left lg:text-right">
                      <div className="space-y-1 mb-2 text-xs sm:text-sm">
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">
                            Tạm tính:
                          </span>
                          <span className="font-medium">
                            {formatCurrency(order.subtotal)}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">
                            Khuyến mãi:
                          </span>
                          <span className="font-medium">
                            {formatCurrency(order.discountAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">
                            Vận chuyển:
                          </span>
                          <span className="font-medium">
                            {formatCurrency(order.shippingFee)}
                          </span>
                        </div>
                      </div>
                      <p className="font-bold text-base sm:text-lg">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.orderDetails.reduce(
                          (sum, item) => sum + item.quantity,
                          0,
                        )}{" "}
                        sản phẩm
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 shrink-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/manager/orders/${order.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </Link>
                        </DropdownMenuItem>

                        {/* Only show refund button for manager */}
                        {canRefund(order.status) && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleOpenRefundDialog(order.id)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                            >
                              <DollarSign className="mr-2 h-4 w-4" />
                              Hoàn tiền
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}

            {!isLoading &&
              (!ordersData?.data || ordersData.data.length === 0) && (
                <EmptyState
                  icon={ShoppingCart}
                  title="Không tìm thấy đơn hàng"
                  description="Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"
                />
              )}
          </div>

          {/* Pagination */}
          {!isLoading && ordersData && ordersData.data.length > 0 && (
            <div className="mt-6">
              <PaginationWithLinks
                totalCount={ordersData.totalItems || 0}
                pageSize={pageSize}
                page={currentPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* FIX #4: Enhanced Refund Dialog with Amount Breakdown */}
      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <DollarSign className="h-6 w-6 text-blue-600" />
              Xác nhận hoàn tiền
            </DialogTitle>
            <DialogDescription>
              Xem kỹ thông tin trước khi xác nhận hoàn tiền cho khách hàng
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Amount Breakdown */}
            {(() => {
              const selectedOrder = ordersData?.data?.find(
                (order) => order.id === selectedOrderId,
              );
              return selectedOrder ? (
                <>
                  <Card className="border-2 border-blue-200 bg-blue-50/50">
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tạm tính:</span>
                        <span className="font-semibold">
                          {formatCurrency(selectedOrder.subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Phí vận chuyển:
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(selectedOrder.shippingFee)}
                        </span>
                      </div>
                      {selectedOrder.discountAmount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Giảm giá:</span>
                          <span className="font-semibold">
                            -{formatCurrency(selectedOrder.discountAmount)}
                          </span>
                        </div>
                      )}
                      <div className="border-t-2 border-blue-300 pt-3 flex justify-between">
                        <span className="font-bold text-base">
                          Tổng hoàn tiền:
                        </span>
                        <span className="font-bold text-xl text-blue-600">
                          {formatCurrency(selectedOrder.totalAmount)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <div className="flex gap-2">
                      <Package className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 mb-1">
                          Khách hàng: {selectedOrder.customerName}
                        </p>
                        <p className="text-sm text-blue-800">
                          Đơn hàng sẽ chuyển sang trạng thái{" "}
                          <strong>&quot;Đã hoàn tiền&quot;</strong> và số tiền
                          sẽ được hoàn lại cho khách hàng.
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedOrder.note && (
                    <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
                      <p className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-2">
                        <span>📝</span> Ghi chú đơn hàng:
                      </p>
                      <p className="text-sm text-amber-800 italic pl-6">
                        &quot;{selectedOrder.note}&quot;
                      </p>
                    </div>
                  )}
                </>
              ) : null;
            })()}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsRefundDialogOpen(false)}
              disabled={updateStatusMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={handleRefundOrder}
              disabled={updateStatusMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 min-w-[160px]"
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Xác nhận hoàn tiền
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
