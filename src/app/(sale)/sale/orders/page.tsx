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
import { InputNumber } from "@/components/ui/input-number";
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
  CheckCircle,
  XCircle,
  User,
  Fish,
  DollarSign,
  Loader2,
  X,
  Truck,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { useGetAllOrders, useUpdateOrderStatus } from "@/hooks/useOrder";
import { OrderStatus, OrderSearchParams } from "@/lib/api/services/fetchOrder";
import { Textarea } from "@/components/ui/textarea";
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
import { DatePickerFilter } from "@/components/ui/DatePickerFilter";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  // Confirm order dialog state
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmNote, setConfirmNote] = useState<string>("");

  // UnShip order dialog state
  const [isUnShipDialogOpen, setIsUnShipDialogOpen] = useState(false);
  const [unShipNote, setUnShipNote] = useState<string>("");

  // Deliver order dialog state
  const [isDeliverDialogOpen, setIsDeliverDialogOpen] = useState(false);
  const [deliverNote, setDeliverNote] = useState<string>("");

  // Reject order dialog state
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState<string>("");

  // Selected order for actions
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Update order status mutation
  const updateStatusMutation = useUpdateOrderStatus();

  // Check if order can be updated
  const canUpdateOrder = (status: string): boolean => {
    return (
      status === OrderStatus.PROCESSING ||
      status === OrderStatus.SHIPPED ||
      status === OrderStatus.REJECTED ||
      status === OrderStatus.UNSHIPPING
    );
  };

  // Get available actions for order status (refund removed - manager only)
  const getAvailableActions = (
    status: string,
  ): {
    canConfirm: boolean;
    canUnShip: boolean;
    canDeliver: boolean;
    canReject: boolean;
  } => {
    return {
      canConfirm: status === OrderStatus.PROCESSING,
      canUnShip: status === OrderStatus.PROCESSING,
      canDeliver: status === OrderStatus.SHIPPED,
      canReject: status === OrderStatus.SHIPPED,
    };
  };

  // Handler for opening confirm dialog
  const handleOpenConfirmDialog = (orderId: number) => {
    setSelectedOrderId(orderId);
    setConfirmNote("");
    setIsConfirmDialogOpen(true);
  };

  // Handler for confirming order (PROCESSING -> SHIPPED)
  const handleConfirmOrder = () => {
    if (!selectedOrderId) {
      toast.error("Không tìm thấy đơn hàng");
      return;
    }

    updateStatusMutation.mutate(
      {
        orderId: selectedOrderId,
        request: {
          status: OrderStatus.SHIPPED,
          note: confirmNote || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Đơn hàng đã được xác nhận");
          setIsConfirmDialogOpen(false);
          setSelectedOrderId(null);
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

  // Handler for opening UnShip dialog
  const handleOpenUnShipDialog = (orderId: number) => {
    setSelectedOrderId(orderId);
    setUnShipNote("");
    setIsUnShipDialogOpen(true);
  };

  // Handler for unshipping order (PROCESSING -> UNSHIPPING or SHIPPED -> UNSHIPPING)
  const handleUnShipOrder = () => {
    if (!selectedOrderId) {
      toast.error("Không tìm thấy đơn hàng");
      return;
    }

    updateStatusMutation.mutate(
      {
        orderId: selectedOrderId,
        request: {
          status: OrderStatus.UNSHIPPING,
          note: unShipNote || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Đơn hàng đã được chuyển sang không giao");
          setIsUnShipDialogOpen(false);
          setSelectedOrderId(null);
          setUnShipNote("");
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Không thể cập nhật đơn hàng",
          );
        },
      },
    );
  };

  // Handler for opening deliver dialog
  const handleOpenDeliverDialog = (orderId: number) => {
    setSelectedOrderId(orderId);
    setDeliverNote("");
    setIsDeliverDialogOpen(true);
  };

  // Handler for delivering order (SHIPPED -> DELIVERED)
  const handleDeliverOrder = () => {
    if (!selectedOrderId) {
      toast.error("Không tìm thấy đơn hàng");
      return;
    }

    updateStatusMutation.mutate(
      {
        orderId: selectedOrderId,
        request: {
          status: OrderStatus.DELIVERED,
          note: deliverNote || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Đơn hàng đã được giao thành công");
          setIsDeliverDialogOpen(false);
          setSelectedOrderId(null);
          setDeliverNote("");
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Không thể giao đơn hàng",
          );
        },
      },
    );
  };

  // Handler for opening reject dialog
  const handleOpenRejectDialog = (orderId: number) => {
    setSelectedOrderId(orderId);
    setRejectReason("");
    setIsRejectDialogOpen(true);
  };

  // Handler for rejecting order (SHIPPED -> REJECTED)
  const handleRejectOrder = () => {
    if (!selectedOrderId) {
      toast.error("Không tìm thấy đơn hàng");
      return;
    }

    if (!rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    updateStatusMutation.mutate(
      {
        orderId: selectedOrderId,
        request: {
          status: OrderStatus.REJECTED,
          note: rejectReason,
        },
      },
      {
        onSuccess: () => {
          toast.success("Đơn hàng đã được từ chối");
          setIsRejectDialogOpen(false);
          setSelectedOrderId(null);
          setRejectReason("");
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Không thể từ chối đơn hàng",
          );
        },
      },
    );
  };

  // Debounce search term
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
      createdFrom: startDate
        ? Math.floor(startDate.getTime() / 1000)
        : undefined,
      createdTo: endDate ? Math.floor(endDate.getTime() / 1000) : undefined,
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
    startDate,
    endDate,
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Quản lý đơn hàng
          </h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý các đơn hàng từ khách hàng
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

            {/* Filters Row 2 - Date and Price Range */}
            <div className="flex flex-row lg:flex-row gap-4 items-center justify-between">
              <DatePickerFilter
                label="Từ ngày"
                value={startDate ? startDate.toISOString() : ""}
                onChange={(value) =>
                  setStartDate(value ? new Date(value) : undefined)
                }
              />

              <DatePickerFilter
                label="Đến ngày"
                value={endDate ? endDate.toISOString() : ""}
                onChange={(value) =>
                  setEndDate(value ? new Date(value) : undefined)
                }
              />

              <div className="relative flex-1 sm:flex-none">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <InputNumber
                  value={minPrice ? Number(minPrice) : undefined}
                  onChange={(value) => setMinPrice(value ? String(value) : "")}
                  placeholder="Từ giá"
                  className="pl-10 w-full"
                />
              </div>

              <div className="relative flex-1 sm:flex-none">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <InputNumber
                  value={maxPrice ? Number(maxPrice) : undefined}
                  onChange={(value) => setMaxPrice(value ? String(value) : "")}
                  placeholder="Đến giá"
                  className="pl-10 w-full"
                />
              </div>

              {/* Clear Filters Button */}
              {(startDate || endDate || minPrice || maxPrice) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStartDate(undefined);
                    setEndDate(undefined);
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                  className="border border-gray-300"
                >
                  <X className="h-4 w-4 mr-1" />
                  Xóa bộ lọc
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
                  className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Package className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-bold text-base sm:text-lg">
                          {order.orderNumber}
                        </h3>
                        <Badge
                          className={getOrderStatusColor(order.status)}
                          variant="secondary"
                        >
                          <div className="flex items-center gap-1">
                            {(() => {
                              const Icon = getOrderStatusLabel(
                                order.status,
                              ).icon;
                              return <Icon className="h-4 w-4" />;
                            })()}
                            <span className="hidden sm:inline">
                              {getOrderStatusText(order.status)}
                            </span>
                          </div>
                        </Badge>
                      </div>

                      <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 flex-shrink-0" />
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

                      <div className="text-xs sm:text-sm mb-2">
                        <div className="flex items-center gap-1 mb-2">
                          <Fish className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {order?.orderDetails?.length || 0} sản phẩm
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {order?.orderDetails?.slice(0, 4).map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg border"
                            >
                              <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
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
                                <span className="font-medium text-xs truncate max-w-[100px]">
                                  {item.koiFish?.rfid || item.packetFish?.name}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  x{item.quantity}
                                </span>
                              </div>
                            </div>
                          ))}
                          {order?.orderDetails?.length > 4 && (
                            <div className="flex items-center justify-center p-2 bg-muted/50 rounded-lg border min-w-[60px]">
                              <span className="text-xs text-muted-foreground">
                                +{order.orderDetails.length - 4} khác
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
                          className="h-8 w-8 p-0 flex-shrink-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/sale/orders/${order.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </Link>
                        </DropdownMenuItem>

                        {/* Show action buttons based on status */}
                        {canUpdateOrder(order.status) && (
                          <>
                            <DropdownMenuSeparator />
                            {getAvailableActions(order.status).canConfirm && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleOpenConfirmDialog(order.id)
                                }
                                className="text-green-600 hover:text-green-700 hover:bg-green-50 cursor-pointer transition-colors duration-150"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Xác nhận đơn
                              </DropdownMenuItem>
                            )}
                            {getAvailableActions(order.status).canUnShip && (
                              <DropdownMenuItem
                                onClick={() => handleOpenUnShipDialog(order.id)}
                                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 cursor-pointer transition-colors duration-150"
                              >
                                <Truck className="mr-2 h-4 w-4" />
                                Không giao
                              </DropdownMenuItem>
                            )}
                            {getAvailableActions(order.status).canDeliver && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleOpenDeliverDialog(order.id)
                                }
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer transition-colors duration-150"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Đã giao hàng
                              </DropdownMenuItem>
                            )}
                            {getAvailableActions(order.status).canReject && (
                              <DropdownMenuItem
                                onClick={() => handleOpenRejectDialog(order.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer transition-colors duration-150"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Khách hàng từ chối
                              </DropdownMenuItem>
                            )}
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

      {/* Confirm Order Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
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

      {/* UnShip Order Dialog */}
      <Dialog open={isUnShipDialogOpen} onOpenChange={setIsUnShipDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Không giao đơn hàng</DialogTitle>
            <DialogDescription>
              Chuyển đơn hàng sang trạng thái &quot;Không giao&quot;
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-900">
                Đơn hàng sẽ chuyển sang trạng thái &quot;Không giao&quot; và sẽ
                được xử lý hoàn trả.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Ghi chú (tùy chọn)
              </label>
              <Textarea
                placeholder="Thêm ghi chú khi không giao đơn hàng..."
                value={unShipNote}
                onChange={(e) => setUnShipNote(e.target.value)}
                rows={3}
              />
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
              disabled={updateStatusMutation.isPending}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Không giao"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Deliver Order Dialog */}
      <Dialog open={isDeliverDialogOpen} onOpenChange={setIsDeliverDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Giao hàng thành công</DialogTitle>
            <DialogDescription>
              Xác nhận rằng đơn hàng đã được giao thành công
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-900">
                Sau khi xác nhận, đơn hàng sẽ chuyển sang trạng thái &quot;Đã
                giao&quot; và khách hàng có thể đánh giá sản phẩm.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Ghi chú (tùy chọn)
              </label>
              <Textarea
                placeholder="Thêm ghi chú khi giao hàng thành công..."
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
                  Đang cập nhật...
                </>
              ) : (
                "Xác nhận giao hàng"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Order Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Từ chối đơn hàng</DialogTitle>
            <DialogDescription>
              Từ chối giao hàng và chuyển sang trạng thái &quot;Từ chối&quot;
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-900">
                ⚠️ Sau khi từ chối, đơn hàng sẽ chuyển sang trạng thái từ chối
                và được xử lý hoàn trả.
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
              disabled={updateStatusMutation.isPending || !rejectReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Xác nhận từ chối"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
